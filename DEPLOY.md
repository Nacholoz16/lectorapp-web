# Despliegue de lectorapp-web

Producción: `https://lector.nacholoz3d.cl`, servidor `ubuntu@155.181.180.178` (ARM64, Docker),
el mismo de la API. La web es un **stack de Portainer propio** (`lectorapp-web`), separado del proyecto
`lectorapp` de la API y la BD: desplegarla, romperla o borrarla **nunca toca `lectorAPI` ni `lectorDB`**.

El HTTPS lo pone **Nginx Proxy Manager** (`nginx_proxy`), que reenvía a `http://lectorWeb:8080` por la
red de Docker `red-global-proxy` (ya existe; el stack la usa como `external`).

> La web **no tiene secretos**: todo lo que hay en este repo termina siendo público en el navegador.

---

## Deploy normal

1. En local: `npm run lint` y `npm run build` sin errores.
2. Sube a GitHub: `git push origin main`.
3. Portainer → **Stacks → lectorapp-web → Pull and redeploy** (o espera a la actualización
   automática, si está activada).

Portainer descarga `main`, **reconstruye la imagen** (`pull_policy: build` en `docker-compose.yml`) y
recrea solo `lectorWeb`. Mientras se construye, la web anterior sigue atendiendo.

Después: `bash scripts/smoke-test.sh https://lector.nacholoz3d.cl` desde el PC (Git Bash) → "Todo OK".
De vez en cuando, Portainer → **Images** → borrar las imágenes `lectorapp-web` sin uso.

> **`/eliminar-cuenta` depende de la API** (`POST /api/account/deletion-request` y
> `/deletion-confirm`, migración paso 11 de la API). Despliega primero la API con su migración y
> después la web; si no, la página carga pero el formulario responde "No pudimos conectar…" o 404.
> Es la URL que se registra en Play Console ("Eliminar la cuenta").

## Rollback

La web no tiene base de datos ni migraciones: volver atrás es desplegar el código anterior.

```bash
git revert <commit-malo>      # crea un commit que deshace el cambio
git push origin main          # y luego "Pull and redeploy" en Portainer
```

---

## Primera instalación (se hace una sola vez, con confirmación del usuario)

Hoy `lector.nacholoz3d.cl` lo sirve el front viejo `lectorFront` (servicio `frontend` del proyecto
`lectorapp`). El orden busca que la web no quede caída: primero se levanta la nueva, después se cambia
el proxy y al final se elimina la vieja.

### 1. Respaldar el front viejo (por SSH)

```bash
cd "/home/ubuntu/[LECTORAPP]"
FECHA=$(date +%F)
cp docker-compose.yml "backups/docker-compose-$FECHA.yml"
tar czf "backups/frontend-$FECHA.tgz" frontend
docker inspect lectorFront > "backups/lectorFront-inspect-$FECHA.json"
```

En Nginx Proxy Manager, anotar (o hacer captura) de la configuración actual del proxy host
`lector.nacholoz3d.cl` (destino, certificado, opciones).

### 2. Crear el stack en Portainer

**Stacks → Add stack**:

| Campo | Valor |
|---|---|
| Name | `lectorapp-web` |
| Build method | **Repository** |
| Repository URL | `https://github.com/Nacholoz16/lectorapp-web` (público: sin autenticación) |
| Repository reference | `refs/heads/main` |
| Compose path | `docker-compose.yml` |
| GitOps updates | Opcional: *Polling* cada 5 min (despliega solo tras cada push) o *Webhook* |
| Environment variables | Ninguna |

**Deploy the stack**. Comprobar en **Containers** que `lectorWeb` queda `healthy`, o por SSH:

```bash
docker inspect --format '{{.State.Health.Status}}' lectorWeb        # → healthy
docker exec lectorWeb wget -S -q -O /dev/null http://127.0.0.1:8080/  # → 200 + cabeceras
```

### 3. Apuntar Nginx Proxy Manager a la web nueva

Proxy host `lector.nacholoz3d.cl`:

| Campo | Valor |
|---|---|
| Scheme / Forward Hostname / Port | `http` / `lectorWeb` / `8080` |
| Block Common Exploits | Sí |
| SSL | Certificado Let's Encrypt de `lector.nacholoz3d.cl` (el actual o uno nuevo) |
| Force SSL · HTTP/2 | Sí · Sí |
| **HSTS Enabled** | **No**: el contenedor ya envía `Strict-Transport-Security`; activarlo aquí la duplicaría |
| Advanced / Custom headers | Nada: todas las cabeceras las pone el contenedor |

**No tocar `lectorapp.nacholoz3d.cl`**: no es la web; solo existe para el correo de ZeptoMail
(`noreply@lectorapp.nacholoz3d.cl`, usado por "Olvidé mi contraseña").

### 4. Eliminar el front viejo (por SSH)

Cuando la web nueva responda bien por HTTPS:

```bash
cd "/home/ubuntu/[LECTORAPP]"
docker stop lectorFront && docker rm lectorFront
# Quitar el servicio `frontend` del docker-compose.yml y validar:
docker compose config -q
```

La carpeta `frontend/` puede borrarse más adelante (queda el `.tgz` en `backups/`).

### 5. Verificar

```bash
curl -I https://lector.nacholoz3d.cl/            # 200 + cabeceras de seguridad
curl -I https://lector.nacholoz3d.cl/no-existe   # 404
curl -I http://lector.nacholoz3d.cl/             # 301 → https
curl -I 'https://lector.nacholoz3d.cl/%5Cevil.com/'  # 404, sin Location hacia otro sitio
curl https://api.nacholoz3d.cl/api/health           # la API sigue OK (no se reinició)
bash scripts/smoke-test.sh https://lector.nacholoz3d.cl   # desde el PC, en Git Bash → "Todo OK"
```

- Cabeceras: <https://securityheaders.com/?q=lector.nacholoz3d.cl> → nota **A** o mejor.
- TLS: <https://www.ssllabs.com/ssltest/analyze.html?d=lector.nacholoz3d.cl>.
- `docker ps` → `lectorAPI` y `lectorDB` con el mismo "Up …" de antes.

### Volver atrás (si algo sale mal)

1. En NPM, devolver el proxy host a su destino anterior.
2. Si ya se había borrado `lectorFront`:
   `cp "backups/docker-compose-<FECHA>.yml" docker-compose.yml && docker compose up -d --no-deps frontend`
   (si también se borró `frontend/`, restaurarla antes con `tar xzf backups/frontend-<FECHA>.tgz`).
3. Portainer → Stacks → `lectorapp-web` → **Delete** (no afecta a la API ni a la BD).

---

## Verificar en local las cabeceras (sin servidor)

```bash
docker build -t lectorapp-web:local .
docker run --rm -p 8088:8080 --read-only --tmpfs /tmp --cap-drop ALL lectorapp-web:local
bash scripts/smoke-test.sh http://localhost:8088
```
