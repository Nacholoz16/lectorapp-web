# lectorapp-web

Web de **LectorApp** en `https://lector.nacholoz3d.cl`: páginas públicas (portada, términos,
privacidad, contacto) y, más adelante, el panel de administración en `/admin`.

Reemplaza al front viejo (`lectorFront`, Ionic/Angular). Usa el mismo diseño que la app: colores
"Crema & Salvia" (modo claro) y "Café de Medianoche" (modo oscuro), títulos en **Lora** y texto en
**Nunito**.

---

## Correrla en tu PC

Necesitas **Node 22.18 o más nuevo** (`node -v`).

```bash
npm install        # una vez (o cuando cambie package.json)
npm run dev        # abre http://localhost:5173 con recarga automática al guardar
```

Otros comandos:

| Comando | Qué hace |
|---|---|
| `npm run build` | Revisa los tipos y genera la web final en `dist/` (un `.html` por página) |
| `npm run preview` | Sirve `dist/` en http://localhost:4173 para mirarla antes de publicar (sin las cabeceras de Nginx) |
| `npm run lint` | ESLint: busca errores y problemas de accesibilidad en el código |
| `npm run typecheck` | Solo la revisión de tipos de TypeScript (`tsc --noEmit`) |

Probar la imagen de Docker exactamente como en producción (necesitas Docker Desktop abierto):

```bash
docker build -t lectorapp-web:local .
docker run --rm -p 8088:8080 --read-only --tmpfs /tmp --cap-drop ALL lectorapp-web:local
# En otra terminal:
curl -I http://localhost:8088/          # 200 + cabeceras de seguridad
curl -I http://localhost:8088/no-existe # 404 con la página propia
curl -I 'http://localhost:8088/%5Cevil.com/'  # 404, NUNCA un Location hacia otro sitio
bash scripts/smoke-test.sh http://localhost:8088   # todas las comprobaciones → "Todo OK"
```

`scripts/smoke-test.sh` revisa estados, cabeceras (sin duplicados), caché, redirecciones y una lista
de intentos de *open redirect* (`//evil.com/`, `/%5Cevil.com/`, `/%09/evil.com/`, `%0d%0a`…). Sirve
también contra producción: `bash scripts/smoke-test.sh https://lector.nacholoz3d.cl`.

> En Git Bash, antepón `MSYS_NO_PATHCONV=1` al `docker run` (si no, convierte `/tmp` en una ruta de Windows).

---

## Las piezas, una por una

### Vite (`vite.config.ts`)
La herramienta que **compila** el proyecto. En desarrollo (`npm run dev`) levanta un servidor que
recarga la página al guardar. En el build junta el CSS, copia las fuentes y les pone un **hash** en
el nombre (`index-BMrDtiFT.css`): si el archivo cambia, cambia el nombre, y así el navegador puede
guardarlo en caché un año sin riesgo de mostrar una versión vieja.

### React (`src/`)
La librería con la que se escriben las páginas como **componentes**: funciones que devuelven algo
parecido a HTML (JSX). `Layout` es la cabecera + el pie que comparten todas las páginas, y cada
página vive en `src/pages/`.

Ojo: aquí React se usa **solo al compilar**, como motor de plantillas. El navegador recibe HTML y CSS
puros, **sin JavaScript**. Las páginas legales no lo necesitan, cargan más rápido y la política de
seguridad (CSP) puede ser muy estricta.

### TypeScript (`tsconfig*.json`)
JavaScript con **tipos**: el editor y `tsc` avisan de errores (una propiedad mal escrita, un valor
que puede ser `undefined`) antes de ejecutar nada. Está en modo **estricto** y `any` está prohibido.
Hay dos configuraciones: `tsconfig.app.json` para la web (`src/`) y `tsconfig.node.json` para lo que
corre en Node al compilar (`vite.config.ts`, `scripts/`).

### ESLint (`eslint.config.js`)
Revisa el código: errores típicos de TypeScript, reglas de React y **accesibilidad** del JSX
(`jsx-a11y`: imágenes con `alt`, enlaces con texto, etc.).

### El pre-renderizado (`src/entry-server.tsx` + `scripts/prerender.ts`)
Es lo que convierte los componentes de React en **un archivo HTML por página**, con el contenido
dentro (bueno para buscadores, lectores de pantalla y para que se vea sin JavaScript).

`npm run build` hace tres pasos:

1. `vite build` → `dist/index.html` (la **plantilla**, con el CSS ya enlazado) y `dist/assets/`.
2. `vite build --ssr src/entry-server.tsx` → `dist-ssr/entry-server.js`: el código que "dibuja" las
   páginas, preparado para correr en Node.
3. `node scripts/prerender.ts` → para cada página de `src/routes.tsx`, pide su HTML a React
   (`renderToStaticMarkup`), lo mete en la plantilla (donde dicen `<!--app-head-->` y
   `<!--app-html-->`) y guarda `dist/<página>.html`. También genera `dist/404.html`.

`index.html` no lleva comentarios HTML (salvo los dos marcadores, que se reemplazan): se publicarían
tal cual. El script **hace fallar el build** si un HTML quedara con `<script>` o estilos inline, que la CSP de
producción bloquearía.

En desarrollo pasa lo mismo, pero al vuelo: un pequeño plugin en `vite.config.ts` usa el mismo
`entry-server.tsx` en cada petición. Lo que ves en `npm run dev` es lo que genera el build.

**Añadir una página** (p. ej. `/terminos` en la tarea 5.2):

1. Crear `src/pages/TermsPage.tsx` (usa `HomePage.tsx` de ejemplo).
2. Añadirla en `src/routes.tsx`:
   ```tsx
   { path: '/terminos', file: 'terminos.html', title: 'Términos y condiciones',
     description: '…', render: () => <TermsPage /> },
   ```
3. `npm run dev` para verla; `npm run build` genera `dist/terminos.html` y Nginx la sirve en `/terminos`.

### Estilos (`src/styles/`)
- `tokens.css`: los **colores, espacios y radios** del sistema de diseño como variables CSS
  (`--ink`, `--bg`…). El modo oscuro cambia solo con `@media (prefers-color-scheme: dark)`, según el
  ajuste del sistema. Regla de la app: el pastel (`--accent`) es solo para fondos; texto, enlaces y
  botones usan `--ink` (contraste AA).
- `global.css`: estilos de la página. Importa las fuentes desde los paquetes `@fontsource/*`: los
  archivos de fuente se sirven **desde nuestro propio dominio**, sin pedir nada a Google (más
  privacidad y una CSP más simple).

### El `Dockerfile`
Receta para construir la **imagen** del contenedor, en dos etapas:
1. **build**: una imagen con Node (`node:22-alpine`) instala dependencias (`npm ci`) y ejecuta
   `npm run build`.
2. **final**: Nginx (`nginxinc/nginx-unprivileged`, versión fijada) + solo la carpeta `dist/`.
   Node, `node_modules` y el código fuente **no** llegan a la imagen final. Nginx corre con un usuario
   sin privilegios en el puerto 8080, y un `HEALTHCHECK` le pregunta a `/healthz` cada 30 s si sigue vivo.

### `nginx/default.conf` y `nginx/security-headers.conf`
La configuración del servidor web dentro del contenedor:
- `/terminos` → sirve `terminos.html`; `/terminos/` y `/terminos.html` redirigen a `/terminos` (una
  sola URL por página); lo que no exista → `404.html` con estado 404.
- **Redirecciones seguras:** solo se redirigen rutas hechas de letras, números, `-`, `_` y `/`. Así una
  URL trampa como `/%5Cevil.com/` no puede convertirse en `Location: /\evil.com`, que el navegador
  interpretaría como otro sitio (*open redirect*); esas rutas reciben la 404.
- **Caché:** `/assets/*` (con hash) un año e `immutable`; el HTML `no-cache` (siempre se revalida, así
  un deploy se ve al instante).
- `/admin/*` preparado para el futuro panel (SPA): cualquier ruta devolverá `/admin/index.html`.
- Bloquea archivos ocultos (`.git`, `.env`), no anuncia la versión de Nginx y el log **no guarda IPs**
  ni navegadores.
- **Cabeceras de seguridad** (en todas las respuestas, también las de error): CSP estricta (solo
  recursos propios, nada inline, sin iframes), HSTS, `X-Content-Type-Options`, `Referrer-Policy`,
  `Permissions-Policy`, `X-Frame-Options`, `Cross-Origin-Opener/Resource-Policy`. Cada una está
  explicada en el archivo.

### `docker-compose.yml` (stack de Portainer)
La web se despliega como un **stack de Portainer separado** del de la API y la BD: Portainer clona
este repo, construye la imagen con el `Dockerfile` (`pull_policy: build` obliga a reconstruirla en
cada despliegue) y levanta `lectorWeb` en la red `red-global-proxy`, la misma de Nginx Proxy Manager.
Si la web falla o se borra, la API y la base de datos no se enteran.

Cómo desplegar, hacer rollback y la primera instalación: ver **[DEPLOY.md](DEPLOY.md)**.

---

## Estructura

```text
lectorapp-web/
├── index.html                 # Plantilla HTML (marcadores <!--app-head--> y <!--app-html-->)
├── public/                    # Se copia tal cual a dist/ (favicon)
├── src/
│   ├── entry-server.tsx       # render(ruta) → { status, head, html }
│   ├── routes.tsx             # Tabla de páginas: ruta, archivo, título, descripción
│   ├── site.ts                # Nombre, dominio y enlaces del pie
│   ├── components/Layout.tsx  # Cabecera, "saltar al contenido" y pie
│   ├── pages/                 # Una página por archivo (HomePage, NotFoundPage)
│   └── styles/                # tokens.css (colores/espacios) y global.css
├── scripts/prerender.ts       # Genera dist/<página>.html
├── scripts/smoke-test.sh      # Prueba con curl: cabeceras, caché, redirecciones, open redirect
├── nginx/                     # default.conf + security-headers.conf
├── Dockerfile
├── docker-compose.yml         # Stack de Portainer (solo la web)
├── vite.config.ts, eslint.config.js, tsconfig*.json
└── DEPLOY.md
```
