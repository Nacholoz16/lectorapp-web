/** Datos generales del sitio, compartidos por el layout y las cabeceras <head>. */
export const SITE = {
  name: 'LectorApp',
  /** Dominio público (se usa en la URL canónica de cada página). */
  origin: 'https://lector.nacholoz3d.cl',
  /** Único correo de contacto: dudas, denuncias, solicitudes sobre datos y eliminación de cuentas. */
  contactEmail: 'contacto@nacholoz3d.cl',
  /**
   * API pública que llama el navegador (solo /eliminar-cuenta, tarea 2.3). Debe coincidir con el
   * `connect-src` de la CSP (nginx/security-headers.conf). En desarrollo se puede apuntar a la API
   * local al arrancar Vite: `VITE_API_BASE=http://localhost:3001/api npm run dev -- --port 4200`
   * (4200: origen permitido por el CORS de la API). El build de producción no la define.
   */
  apiBase: import.meta.env.VITE_API_BASE ?? 'https://api.nacholoz3d.cl/api',
} as const;

/** Enlaces del pie (páginas de la tarea 5.2 y la 2.3). */
export const FOOTER_LINKS = [
  { href: '/terminos', label: 'Términos' },
  { href: '/privacidad', label: 'Privacidad' },
  { href: '/contacto', label: 'Contacto' },
  { href: '/eliminar-cuenta', label: 'Eliminar mi cuenta' },
] as const;
