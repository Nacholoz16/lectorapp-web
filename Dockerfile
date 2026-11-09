# syntax=docker/dockerfile:1
#
# Imagen de la web de LectorApp, en dos etapas ("multi-stage"):
#   1. build: Node instala dependencias y genera los HTML/CSS/fuentes en dist/.
#   2. final: solo Nginx + dist/. Node, node_modules y el código fuente NO llegan a la imagen final.

# ---------- Etapa 1: compilar ----------
FROM node:22-alpine AS build
WORKDIR /app

# Primero solo los manifiestos: si no cambian, Docker reutiliza la capa de `npm ci` (build más rápido).
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build

# ---------- Etapa 2: servir ----------
# Versión FIJADA de Nginx (no "latest"): un deploy nunca cambia de versión por sorpresa.
# Variante "unprivileged": Nginx corre como usuario sin privilegios (uid 101) en el puerto 8080.
FROM nginxinc/nginx-unprivileged:1.30.6-alpine

# Etiqueta para identificar (y limpiar) las imágenes viejas de esta web en el servidor.
LABEL org.opencontainers.image.title="lectorapp-web"

COPY nginx/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/lectorapp

EXPOSE 8080

# Docker marca el contenedor como "unhealthy" si Nginx deja de responder.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
