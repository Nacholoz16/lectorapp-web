import type { ReactElement } from 'react';
import { ContactPage } from './pages/ContactPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';

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
 * Tabla de páginas públicas. Para publicar una página nueva basta con crear el componente en
 * src/pages/ y añadirlo aquí: el build genera su HTML y Nginx la sirve en `path`.
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
  {
    path: '/terminos',
    file: 'terminos.html',
    title: 'Términos y condiciones',
    description:
      'Las reglas para usar LectorApp: requisitos, contenido permitido, moderación, desactivar y eliminar tu cuenta.',
    render: () => <TermsPage />,
  },
  {
    path: '/privacidad',
    file: 'privacidad.html',
    title: 'Política de privacidad',
    description:
      'Qué datos recoge LectorApp, para qué, con quién se comparten, cuánto se guardan y cómo ejercer tus derechos.',
    render: () => <PrivacyPage />,
  },
  {
    path: '/contacto',
    file: 'contacto.html',
    title: 'Contacto',
    description:
      'Escríbenos para dudas, denuncias, apelaciones, solicitudes sobre tus datos o para eliminar tu cuenta.',
    render: () => <ContactPage />,
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
