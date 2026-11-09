import type { ReactElement } from 'react';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';

export interface PageDefinition {
  /** Ruta pública (sin barra final, salvo la portada "/"). */
  path: string;
  /** Archivo que genera el pre-renderizado dentro de dist/. */
  file: string;
  /** Texto de <title> (se le añade " · LectorApp"). */
  title: string;
  /** <meta name="description">: lo que muestran los buscadores. */
  description: string;
  render: () => ReactElement;
}

/**
 * Tabla de páginas públicas. Para publicar una página nueva (tarea 5.2: /terminos,
 * /privacidad, /contacto) basta con crear el componente en src/pages/ y añadirlo aquí:
 * el build genera su HTML y Nginx la sirve en `path`.
 */
export const PAGES: readonly PageDefinition[] = [
  {
    path: '/',
    file: 'index.html',
    title: 'Tu rincón de lectura acogedor',
    description:
      'LectorApp: registra tus lecturas, escribe reseñas privadas y sigue tu reto anual, con tu privacidad primero.',
    render: () => <HomePage />,
  },
];

/** Página de error 404 (Nginx la devuelve con estado 404 para rutas inexistentes). */
export const NOT_FOUND_PAGE: PageDefinition = {
  path: '/404',
  file: '404.html',
  title: 'Página no encontrada',
  description: 'La página que buscas no existe.',
  render: () => <NotFoundPage />,
};
