/** Datos generales del sitio, compartidos por el layout y las cabeceras <head>. */
export const SITE = {
  name: 'LectorApp',
  /** Dominio público (se usa en la URL canónica de cada página). */
  origin: 'https://lector.nacholoz3d.cl',
  /** Único correo de contacto: dudas, denuncias, solicitudes sobre datos y eliminación de cuentas. */
  contactEmail: 'contacto@nacholoz3d.cl',
} as const;

/** Enlaces del pie (páginas de la tarea 5.2). */
export const FOOTER_LINKS = [
  { href: '/terminos', label: 'Términos' },
  { href: '/privacidad', label: 'Privacidad' },
  { href: '/contacto', label: 'Contacto' },
] as const;
