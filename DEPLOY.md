# Despliegue de lectorapp-web

Producción: `https://lectorapp.nacholoz3d.cl`, servidor `ubuntu@155.181.180.178` (ARM64, Docker),
el mismo de la API. El HTTPS lo pone **Nginx Proxy Manager** (`nginx_proxy`), que reenvía al
contenedor `lectorWeb` por la red de Docker.

```
/home/ubuntu/[LECTORAPP]/
├── docker-compose.yml   # servicios: db (lectorDB), api (lectorAPI), web (lectorWeb)
├── .env                 # secretos de la API (la web no usa ninguno)
├── api/                 # clon del repo de la API
├── web/                 # clon de ESTE repo
└── backups/
```

> La web **no tiene secretos**: todo lo que hay en este repo termina siendo público en el navegador.

---

## Deploy normal (desde tu PC con Windows)

1. En local: `npm run lint` y `npm run build` sin errores.
2. Sube a GitHub: `git push origin main`.
3. Ejecuta **`deploy\deploy.bat`**.

El `.bat` entra por SSH (PuTTY/`plink` + la misma llave `.ppk` de la API, o la de
`LECTORAPP_SSH_KEY`), deja `web/` en `origin/main` y ejecuta `deploy/remote-deploy.sh`, que:

1. Construye la imagen nueva (la web actual sigue atendiendo; si el build falla, no se toca nada).
2. Recrea **solo** `lectorWeb` con `--no-deps` → **la API y la BD no se reinician**.
3. Espera a que el contenedor esté `healthy` y comprueba que `/` responde 200 con CSP y HSTS.
4. Borra las imágenes viejas de la web que quedaron sin uso.

Al final el `.bat` muestra las cabeceras públicas de `https://lectorapp.nacholoz3d.cl/`.

## Rollback

```bat
deploy\deploy.bat <commit-anterior>
```

(`git log --oneline` muestra los commits.) La web no tiene base de datos ni migraciones: volver a un
commit anterior es reconstruir esa versión.

---

## Primera instalación (plan — se hace una sola vez, con confirmación del usuario)

Hoy `lectorapp.nacholoz3d.cl` lo sirve el front viejo `lectorFront` (servicio `frontend`). El orden
de los pasos busca que la web no quede caída: primero se levanta la nueva, después se cambia el proxy
y al final se elimina la vieja.

### 1. Respaldar el front viejo y la configuración

```bash
cd "/home/ubuntu/[LECTORAPP]"
FECHA=$(date +%F)
cp docker-compose.yml "backups/docker-compose-$FECHA.yml"
tar czf "backups/frontend-$FECHA.tgz" frontend
docker inspect lectorFront > "backups/lectorFront-inspect-$FECHA.json"
# Anotar las redes del front viejo: la web nueva debe estar en las mismas (para que NPM la alcance)
docker inspect lectorFront --format '{{json .NetworkSettings.Networks}}'
```

En Nginx Proxy Manager, anotar (o hacer captura) de la configuración actual del proxy host
`lectorapp.nacholoz3d.cl` (destino, certificado, opciones).

### 2. Clonar este repo

```bash
cd "/home/ubuntu/[LECTORAPP]"
git clone https://github.com/<usuario>/lectorapp-web.git web
```

### 3. Añadir el servicio `web` al `docker-compose.yml`

Copiar el servicio de [`deploy/docker-compose.snippet.yml`](deploy/docker-compose.snippet.yml) bajo
`services:`. Si `frontend` tenía un bloque `networks:`, copiarlo igual en `web`. Comprobar:

```bash
docker compose config -q && docker compose config --services   # debe listar db, api, frontend, web
```

### 4. Levantar la web nueva (sin tocar la API ni la BD)

```bash
docker compose build web
docker compose up -d --no-deps web
docker inspect --format '{{.State.Health.Status}}' lectorWeb        # → healthy
docker exec lectorWeb wget -S -q -O /dev/null http://127.0.0.1:8080/  # → 200 + cabeceras
```

Si `nginx_proxy` no comparte red con `lectorWeb`: `docker network connect <red> nginx_proxy`.

### 5. Apuntar Nginx Proxy Manager a la web nueva

Proxy host `lectorapp.nacholoz3d.cl`:

| Campo | Valor |
|---|---|
| Scheme / Forward Hostname / Port | `http` / `lectorWeb` / `8080` |
| Block Common Exploits | Sí |
| SSL | Certificado Let's Encrypt de `lectorapp.nacholoz3d.cl` (el actual o uno nuevo) |
| Force SSL · HTTP/2 | Sí · Sí |
| **HSTS Enabled** | **No**: el contenedor ya envía `Strict-Transport-Security`; activarlo aquí la duplicaría |
| Advanced / Custom headers | Nada: todas las cabeceras las pone el contenedor |

**No cambiar el DNS**: el subdominio también tiene los registros de correo de ZeptoMail
(`noreply@lectorapp.nacholoz3d.cl`, usado por "Olvidé mi contraseña").

### 6. Eliminar el front viejo

Cuando la web nueva responda bien por HTTPS:

```bash
docker stop lectorFront && docker rm lectorFront
# Quitar el servicio `frontend` del docker-compose.yml y validar:
docker compose config -q
```

La carpeta `frontend/` puede borrarse más adelante (queda el `.tgz` en `backups/`).

### 7. Verificar

```bash
curl -I https://lectorapp.nacholoz3d.cl/            # 200 + cabeceras de seguridad
curl -I https://lectorapp.nacholoz3d.cl/no-existe   # 404
curl -I http://lectorapp.nacholoz3d.cl/             # 301 → https
curl -I 'https://lectorapp.nacholoz3d.cl/%5Cevil.com/'  # 404, sin Location hacia otro sitio
curl https://api.nacholoz3d.cl/api/health           # la API sigue OK (no se reinició)
bash scripts/smoke-test.sh https://lectorapp.nacholoz3d.cl   # desde el PC, en Git Bash → "Todo OK"
```

- Cabeceras: <https://securityheaders.com/?q=lectorapp.nacholoz3d.cl> → nota **A** o mejor.
- TLS: <https://www.ssllabs.com/ssltest/analyze.html?d=lectorapp.nacholoz3d.cl>.
- `docker ps` → `lectorAPI` y `lectorDB` con el mismo "Up …" de antes.

### Volver atrás (si algo sale mal)

1. En NPM, devolver el proxy host a su destino anterior.
2. `cp "backups/docker-compose-<FECHA>.yml" docker-compose.yml && docker compose up -d --no-deps frontend`
   (si ya se había borrado `frontend/`, restaurarla antes con `tar xzf backups/frontend-<FECHA>.tgz`).
3. `docker stop lectorWeb && docker rm lectorWeb`.

---

## Verificar en local las cabeceras (sin servidor)

```bash
docker build -t lectorapp-web:local .
docker run --rm -p 8088:8080 --read-only --tmpfs /tmp --cap-drop ALL lectorapp-web:local
bash scripts/smoke-test.sh http://localhost:8088
```
