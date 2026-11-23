/**
 * Pre-renderizado: genera un HTML estático por página dentro de dist/.
 *
 * Se ejecuta después de los dos builds de Vite (lo llama `npm run build`):
 *   1. `vite build`        → dist/index.html (plantilla con el CSS ya enlazado con hash) + dist/assets/
 *   2. `vite build --ssr`  → dist-ssr/entry-server.js (el render de React, para Node)
 *   3. este script         → para cada página: plantilla + HTML de React → dist/<archivo>.html
 *
 * Node 22.18+ ejecuta este .ts directamente (type stripping), sin compilarlo.
 */
import { readFile, rm, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

/** Lo que exporta src/entry-server.tsx (se repite aquí porque este script no compila JSX). */
interface ServerEntry {
  OUTPUT_PAGES: readonly { path: string; file: string; clientScript?: string }[];
  render: (url: string) => { status: number; head: string; html: string; clientScript: string | null };
}

/** dist/.vite/manifest.json (solo lo que se usa): código fuente → archivo con hash. */
type Manifest = Record<string, { file: string; isEntry?: boolean }>;

const root = path.resolve(import.meta.dirname, '..');
const distDir = path.join(root, 'dist');
const entryFile = path.join(root, 'dist-ssr', 'entry-server.js');
const manifestDir = path.join(distDir, '.vite');

const HEAD_MARK = '<!--app-head-->';
const BODY_MARK = '<!--app-html-->';

/**
 * Comprobaciones que hacen fallar el build en vez de publicar algo roto o que la CSP
 * bloquearía en producción (scripts o estilos inline).
 */
function assertSafeHtml(file: string, html: string): void {
  const problems: string[] = [];
  if (/<script(?![^>]*\ssrc=)[^>]*>/i.test(html)) problems.push('<script> inline');
  if (/<style[\s>]/i.test(html)) problems.push('<style> inline');
  if (/\sstyle=/i.test(html)) problems.push('atributo style=');
  if (/\son[a-z]+=/i.test(html)) problems.push('manejador de eventos inline (on...=)');
  if (html.includes(HEAD_MARK) || html.includes(BODY_MARK)) problems.push('marcador sin reemplazar');
  if (problems.length > 0) {
    throw new Error(`${file}: ${problems.join(', ')} (la CSP del servidor lo bloquearía)`);
  }
}

const template = await readFile(path.join(distDir, 'index.html'), 'utf-8');
for (const mark of [HEAD_MARK, BODY_MARK]) {
  if (template.split(mark).length !== 2) {
    throw new Error(`La plantilla dist/index.html debe contener ${mark} exactamente una vez`);
  }
}

const entry = (await import(pathToFileURL(entryFile).href)) as ServerEntry;
const manifest = JSON.parse(await readFile(path.join(manifestDir, 'manifest.json'), 'utf-8')) as Manifest;

/** `<script type="module">` con el archivo final (con hash) del módulo de la página, o ''. */
function scriptTagFor(page: string, clientScript: string | null): string {
  if (clientScript === null) return '';
  const chunk = manifest[clientScript];
  if (!chunk?.isEntry || !/^assets\/[\w.-]+\.js$/.test(chunk.file)) {
    throw new Error(`${page}: ${clientScript} no está en el build (añádelo a CLIENT_SCRIPTS en vite.config.ts)`);
  }
  return `<script type="module" src="/${chunk.file}"></script>`;
}

for (const page of entry.OUTPUT_PAGES) {
  const { head, html, clientScript } = entry.render(page.path);
  if (html.trim() === '') throw new Error(`${page.path}: el render quedó vacío`);

  // Funciones de reemplazo: así un "$" en el contenido no se interpreta como patrón.
  const headWithScript = head + scriptTagFor(page.path, clientScript);
  const output = template.replace(HEAD_MARK, () => headWithScript).replace(BODY_MARK, () => html);
  assertSafeHtml(page.file, output);
  // Solo las páginas que declaran clientScript pueden llevar JavaScript.
  if (clientScript === null && /<script/i.test(output)) {
    throw new Error(`${page.file}: lleva <script> sin declarar clientScript en src/routes.tsx`);
  }

  await writeFile(path.join(distDir, page.file), output, 'utf-8');
  console.log(`  ✓ ${page.path.padEnd(16)} → dist/${page.file}`);
}

// El manifiesto solo sirve para este paso: no se publica.
await rm(manifestDir, { recursive: true, force: true });

console.log(`Pre-renderizadas ${String(entry.OUTPUT_PAGES.length)} páginas.`);
