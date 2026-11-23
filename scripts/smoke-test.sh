#!/usr/bin/env bash
# =============================================================================
# Prueba de humo del contenedor Nginx: estados, cabeceras de seguridad, caché y
# redirecciones (incluidos intentos de "open redirect").
#
# Uso:  bash scripts/smoke-test.sh [URL-base]      (por defecto http://127.0.0.1:8088)
#   Local:       docker run ... -p 127.0.0.1:8088:8080 lectorapp-web:local  y luego este script
#   Producción:  bash scripts/smoke-test.sh https://lector.nacholoz3d.cl
# Sale con código 1 si algo falla.
# =============================================================================
set -uo pipefail

BASE="${1:-http://127.0.0.1:8088}"
BASE="${BASE%/}"
failures=0

pass() { printf '  ok    %s\n' "$1"; }
fail() { printf '  FALLO %s\n' "$1"; failures=$((failures + 1)); }

# Cabeceras de respuesta (sin seguir redirecciones; --path-as-is: la ruta va tal cual, sin normalizar).
headers() { curl -s --path-as-is -o /dev/null -D - "$BASE$1" | tr -d '\r'; }
status_of() { headers "$1" | head -n1 | awk '{print $2}'; }
header_of() { headers "$1" | grep -i "^$2:" | head -n1 | cut -d' ' -f2-; }

expect_status() { # ruta estado
    local got; got="$(status_of "$1")"
    if [ "$got" = "$2" ]; then pass "$1 → $2"; else fail "$1 → esperaba $2, llegó ${got:-nada}"; fi
}

expect_redirect() { # ruta destino
    local st loc; st="$(status_of "$1")"; loc="$(header_of "$1" location)"
    if [ "$st" = "301" ] && [ "$loc" = "$2" ]; then pass "$1 → 301 $2"
    else fail "$1 → esperaba 301 $2, llegó ${st:-nada} ${loc:-(sin Location)}"; fi
}

echo "== Estados y páginas ($BASE)"
expect_status / 200
expect_status /no-existe 404
expect_status /404 404
expect_status /404.html 404
expect_status /admin/ 404
expect_status /.env 404
expect_status /.git/config 404
expect_status /healthz 200
# Páginas legales (Play Console enlaza a /privacidad: un 404 ahí bloquea la ficha).
expect_status /terminos 200
expect_status /privacidad 200
expect_status /contacto 200
# Enlace registrado en Play Console para pedir el borrado de la cuenta (tarea 2.3).
expect_status /eliminar-cuenta 200
home="$(curl -s "$BASE/")"
not_found="$(curl -s "$BASE/no-existe")"
if grep -q '<h1' <<<"$home"; then pass "/ trae el contenido pre-renderizado (<h1>)"; else fail "/ sin <h1>"; fi
if grep -qi '<script' <<<"$home"; then fail "/ contiene <script>"; else pass "/ sin <script>"; fi
if grep -q 'No encontramos' <<<"$not_found"; then pass "/no-existe muestra la 404 propia"; else fail "/no-existe sin 404 propia"; fi
# Solo /eliminar-cuenta lleva JavaScript, y únicamente un módulo propio desde /assets.
for path in /terminos /privacidad /contacto; do
    if grep -qi '<script' <<<"$(curl -s "$BASE$path")"; then fail "$path contiene <script>"; else pass "$path sin <script>"; fi
done
delete_page="$(curl -s "$BASE/eliminar-cuenta")"
scripts_found="$(grep -o '<script[^>]*>' <<<"$delete_page")"
js="$(grep -o 'src="/assets/[^"]*\.js"' <<<"$scripts_found" | cut -d'"' -f2)"
if [ "$(grep -c '<script' <<<"$scripts_found")" = "1" ] && [ -n "$js" ] && grep -q 'type="module"' <<<"$scripts_found"; then
    pass "/eliminar-cuenta carga un solo módulo propio ($js)"
else
    fail "/eliminar-cuenta: scripts inesperados: ${scripts_found:-ninguno}"
fi
if grep -q 'id="form-email"' <<<"$delete_page" && grep -q '<noscript>' <<<"$delete_page"; then
    pass "/eliminar-cuenta trae el formulario pre-renderizado y el aviso <noscript>"
else
    fail "/eliminar-cuenta sin formulario o sin <noscript>"
fi
js_type="$([ -n "$js" ] && header_of "$js" content-type)"
js_cache="$([ -n "$js" ] && header_of "$js" cache-control)"
if [[ "$js_type" == *javascript* ]]; then pass "$js es JavaScript ($js_type)"; else fail "JS con tipo ${js_type:-nada}"; fi
if [[ "$js_cache" == *immutable* ]]; then pass "$js immutable"; else fail "JS sin immutable (${js_cache})"; fi

echo "== Cabeceras de seguridad (en 200, 404 y 301)"
for path in / /no-existe /index.html /eliminar-cuenta; do
    h="$(headers "$path")"
    for name in Content-Security-Policy Strict-Transport-Security X-Content-Type-Options Referrer-Policy Permissions-Policy X-Frame-Options; do
        count="$(grep -ic "^$name:" <<<"$h")"
        if [ "$count" = "1" ]; then pass "$path $name"; else fail "$path $name aparece $count veces"; fi
    done
done
for csp_path in / /eliminar-cuenta; do
    csp="$(header_of "$csp_path" content-security-policy)"
    # connect-src: /eliminar-cuenta llama a la API con fetch; form-action: sus formularios.
    for directive in "script-src 'self'" "frame-ancestors 'none'" "object-src 'none'" "base-uri 'self'" "connect-src 'self' https://api.nacholoz3d.cl" "form-action 'self'"; do
        if grep -qF "$directive" <<<"$csp"; then pass "$csp_path CSP: $directive"; else fail "$csp_path CSP sin: $directive"; fi
    done
    if grep -qi "unsafe-inline\|unsafe-eval" <<<"$csp"; then fail "$csp_path CSP con unsafe-*"; else pass "$csp_path CSP sin unsafe-*"; fi
done
server_header="$(header_of / server)"
if [[ "$server_header" =~ [0-9] ]]; then fail "Server anuncia versión: $server_header"; else pass "Server sin versión"; fi

echo "== Caché"
[ "$(header_of / cache-control)" = "no-cache" ] && pass "HTML no-cache" || fail "HTML: $(header_of / cache-control)"
css="$(grep -o '/assets/[^"]*\.css' <<<"$home" | head -n1)"
# (Se guarda en una variable antes de buscar: con pipefail, `| grep -q` corta la tubería y daría falso fallo.)
css_cache="$([ -n "$css" ] && header_of "$css" cache-control)"
if [[ "$css_cache" == *immutable* ]]; then pass "$css immutable"; else fail "CSS sin immutable (${css:-no encontrado}: ${css_cache})"; fi

echo "== Redirecciones canónicas"
expect_redirect /index /
expect_redirect /index.html /
expect_redirect /terminos/ /terminos
expect_redirect /terminos.html /terminos
expect_redirect /eliminar-cuenta/ /eliminar-cuenta
expect_redirect /eliminar-cuenta.html /eliminar-cuenta
expect_redirect /a/b// /a/b
expect_redirect /admin /admin/
expect_redirect '/terminos/?x=1' '/terminos?x=1'

echo "== Open redirect: ningún Location puede salir del sitio"
# Un Location seguro es "/" o "/" + carácter de ruta seguro (nunca "//", "/\", espacios ni control).
safe_location='^/([A-Za-z0-9_-][A-Za-z0-9/_-]*)?(\?[^[:cntrl:]]*)?$'
for path in \
    '//evil.com/' '///evil.com/' '/%2F%2Fevil.com/' '/%2Fevil.com/' \
    '/%5Cevil.com/' '/%5C%5Cevil.com/' '/%5c/evil.com/' '/%2F%5Cevil.com/' \
    '/%09/evil.com/' '/%09evil.com/' '/%20/evil.com/' \
    '/%0d%0aSet-Cookie:%20x=1/' '/a%0d%0aX-Injected:%201/' '/%0aX-Injected:%201/' \
    '//evil.com.html' '/%5Cevil.com.html' '/%2F%2Fevil.com.html' '/%09evil.com.html' \
    '/a%0d%0aX-Injected:%201.html' '/%2e%2e/evil.com/' '/evil.com%2F/'; do
    h="$(headers "$path")"
    loc="$(grep -i '^location:' <<<"$h" | head -n1 | cut -d' ' -f2-)"
    if grep -qi '^x-injected:\|^set-cookie:' <<<"$h"; then
        fail "$path inyecta cabeceras"
    elif [ -z "$loc" ]; then
        pass "$path → $(head -n1 <<<"$h" | awk '{print $2}') sin redirección"
    elif [[ "$loc" =~ $safe_location ]]; then
        pass "$path → Location interna $loc"
    else
        fail "$path → Location peligrosa: $loc"
    fi
done

echo
if [ "$failures" -eq 0 ]; then echo "Todo OK"; exit 0; fi
echo "$failures comprobación(es) fallaron"; exit 1
