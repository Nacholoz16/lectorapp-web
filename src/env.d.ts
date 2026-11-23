/// <reference types="vite/client" />

/** Variables de Vite que usa la web (todas opcionales; ver src/site.ts). */
interface ImportMetaEnv {
  /** URL base de la API para el navegador, solo para desarrollo local. */
  readonly VITE_API_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
