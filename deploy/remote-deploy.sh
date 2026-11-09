#!/usr/bin/env bash
# =============================================================================
# Deploy de la web (lectorapp-web) en el servidor (se ejecuta EN el servidor).
#
# Lo invoca deploy/deploy.bat desde el PC, DESPUÉS de dejar este repo
# (~/[LECTORAPP]/web) en el commit a desplegar (git fetch + checkout).
#
# Pasos:
#   1. Construye la imagen nueva MIENTRAS la web anterior sigue atendiendo
#      (si el build falla, no se toca nada).
#   2. Recrea SOLO el contenedor de la web (--no-deps: la API y la BD no se reinician).
#   3. Espera a que el contenedor esté sano y comprueba que la portada responde con la CSP.
#   4. Borra las imágenes viejas de la web que quedaron sin uso.
# =============================================================================
set -euo pipefail

WEB_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PROJECT_DIR="$(dirname "$WEB_DIR")"   # carpeta que contiene docker-compose.yml y .env
SERVICE="web"
CONTAINER="lectorWeb"
HEALTH_TIMEOUT_S=60

cd "$PROJECT_DIR"

echo ">> Desplegando commit: $(git -C "$WEB_DIR" log -1 --format='%h %s')"

echo ">> Validando docker-compose.yml"
docker compose config -q
if ! docker compose config --services | grep -qx "$SERVICE"; then
    echo "!! docker-compose.yml no tiene el servicio '$SERVICE' (ver deploy/docker-compose.snippet.yml)."
    exit 1
fi

echo ">> Construyendo la imagen (la web actual sigue funcionando mientras tanto)"
docker compose build --pull "$SERVICE"

echo ">> Recreando SOLO el contenedor de la web"
# --no-deps: nunca tocar lectorAPI ni lectorDB. --no-build: la imagen ya se construyó arriba.
docker compose up -d --no-deps --no-build --force-recreate "$SERVICE"

echo ">> Esperando a que $CONTAINER esté sano (máx. ${HEALTH_TIMEOUT_S}s)"
elapsed=0
until [ "$(docker inspect --format '{{.State.Health.Status}}' "$CONTAINER" 2>/dev/null)" = "healthy" ]; do
    if [ "$elapsed" -ge "$HEALTH_TIMEOUT_S" ]; then
        echo "!! La web no quedó sana a tiempo. Últimos logs:"
        docker logs --tail 50 "$CONTAINER" 2>&1
        exit 1
    fi
    sleep 3
    elapsed=$((elapsed + 3))
done
echo ">> Contenedor sano tras ${elapsed}s"

echo ">> Comprobando la portada y sus cabeceras de seguridad"
headers="$(docker exec "$CONTAINER" wget -S -q -O /dev/null http://127.0.0.1:8080/ 2>&1)"
for expected in "200 OK" "Content-Security-Policy" "Strict-Transport-Security" "X-Content-Type-Options"; do
    if ! grep -q "$expected" <<<"$headers"; then
        echo "!! Falta '$expected' en la respuesta de la portada:"
        echo "$headers"
        exit 1
    fi
done

echo ">> Limpiando imágenes viejas de la web (solo las de lectorapp-web sin uso)"
docker image prune -f --filter "label=org.opencontainers.image.title=lectorapp-web" >/dev/null

echo ">> Deploy OK: $(git -C "$WEB_DIR" log -1 --format='%h %s')"
