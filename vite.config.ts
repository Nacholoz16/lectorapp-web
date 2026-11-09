/**
 * Configuración de Vite (servidor de desarrollo + build).
 *
 * La web no es una SPA: cada página se pre-renderiza a HTML con React (src/entry-server.tsx).
 * En desarrollo, el plugin `devPrerender` hace lo mismo al vuelo en cada petición, así
 * `npm run dev` muestra exactamente el HTML que generará el build.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

interface ServerEntry {
  render: (url: string) => { status: number; head: string; html: string };
}

function devPrerender(): Plugin {
  return {
    name: 'lectorapp:dev-prerender',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.originalUrl ?? '/';
        const pathname = url.split('?', 1)[0] ?? '/';
        // Solo páginas: los archivos (con extensión) y las rutas internas de Vite siguen su curso.
        if (req.method !== 'GET' || path.extname(pathname) !== '' || pathname.startsWith('/@')) {
          next();
          return;
        }
        void (async () => {
          try {
            const raw = await readFile(path.resolve(server.config.root, 'index.html'), 'utf-8');
            const template = await server.transformIndexHtml(url, raw);
            const entry = (await server.ssrLoadModule('/src/entry-server.tsx')) as ServerEntry;
            const page = entry.render(pathname);
            res.statusCode = page.status;
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.end(template.replace('<!--app-head-->', page.head).replace('<!--app-html-->', page.html));
          } catch (error) {
            server.ssrFixStacktrace(error as Error);
            next(error);
          }
        })();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), devPrerender()],
  // "custom": Vite no sirve index.html por su cuenta; lo hace devPrerender.
  appType: 'custom',
  build: {
    // Nunca convertir archivos (fuentes, imágenes) en data: URIs; todo va como archivo
    // en /assets con hash, así la CSP no necesita permitir `data:`.
    assetsInlineLimit: 0,
    outDir: 'dist',
    emptyOutDir: true,
  },
});
