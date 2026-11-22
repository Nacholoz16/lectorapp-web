/**
 * Versión vigente de los Términos y de la Política de privacidad.
 *
 * Al cambiar el texto de cualquiera de los dos documentos, actualizar ambos valores. La versión
 * es la que la app guardará como aceptada (tarea 1.3: `users.terms_version`), así que debe
 * coincidir con la que la API considere vigente.
 */
export const LEGAL_VERSION = '2026-11';

/** Fecha de la última actualización: `iso` para <time dateTime>, `label` para mostrar. */
export const LEGAL_UPDATED = {
  iso: '2026-11-22',
  label: '22 de noviembre de 2026',
} as const;
