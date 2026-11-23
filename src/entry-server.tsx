/**
 * Punto de entrada del pre-renderizado. Se ejecuta en Node (nunca en el navegador):
 *  - en desarrollo, lo carga el middleware de vite.config.ts en cada petición;
 *  - en el build, lo compila `vite build --ssr` y lo usa scripts/prerender.ts.
 *
 * React se usa aquí como motor de plantillas: renderToStaticMarkup produce HTML final,
 * sin JavaScript en el navegador. Las páginas públicas no necesitan JS y así la CSP
 * puede ser estricta (script-src 'self' sin nada inline). La excepción es la página que declare
 * `clientScript` (hoy solo /eliminar-cuenta): se devuelve aparte y quien arma el HTML (el plugin
 * de desarrollo o scripts/prerender.ts) añade su <script type="module" src="…">.
 */
import { renderToStaticMarkup } from 'react-dom/server';
import { Layout } from './components/Layout';
import { NOT_FOUND_PAGE, PAGES, type PageDefinition } from './routes';
import { SITE } from './site';

export interface RenderResult {
  status: 200 | 404;
  /** Etiquetas para <head> (título, descripción, URL canónica). */
  head: string;
  /** Contenido de <body>. */
  html: string;
  /** Módulo de navegador de la página (ruta del código fuente), si lo tiene. */
  clientScript: string | null;
}

/** Páginas a generar en el build (incluida la 404). */
export const OUTPUT_PAGES: readonly Pick<PageDefinition, 'path' | 'file' | 'clientScript'>[] = [
  ...PAGES,
  NOT_FOUND_PAGE,
];

function normalizePath(path: string): string {
  const withoutQuery = path.split(/[?#]/, 1)[0] ?? '/';
  const trimmed = withoutQuery.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

function renderHead(page: PageDefinition, isNotFound: boolean): string {
  // React escapa el texto y los atributos: un título con "<" o comillas no rompe el HTML.
  return renderToStaticMarkup(
    <>
      <title>{`${page.title} · ${SITE.name}`}</title>
      <meta name="description" content={page.description} />
      {isNotFound ? (
        <meta name="robots" content="noindex" />
      ) : (
        <link rel="canonical" href={`${SITE.origin}${page.path === '/' ? '/' : page.path}`} />
      )}
    </>,
  );
}

export function render(path: string): RenderResult {
  const normalized = normalizePath(path);
  const page = PAGES.find((p) => p.path === normalized);
  const target = page ?? NOT_FOUND_PAGE;
  const isNotFound = page === undefined;

  return {
    status: isNotFound ? 404 : 200,
    head: renderHead(target, isNotFound),
    html: renderToStaticMarkup(<Layout>{target.render()}</Layout>),
    clientScript: target.clientScript ?? null,
  };
}
