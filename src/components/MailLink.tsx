import { SITE } from '../site';

interface MailLinkProps {
  /** Clase opcional (p. ej. "button" para mostrarlo como botón). */
  className?: string;
  /** Texto del enlace; por defecto, la propia dirección (así se puede copiar a mano). */
  children?: string;
}

/** Enlace `mailto:` al correo de contacto. Un solo lugar donde vive la dirección. */
export function MailLink({ className, children }: MailLinkProps) {
  return (
    <a className={className} href={`mailto:${SITE.contactEmail}`}>
      {children ?? SITE.contactEmail}
    </a>
  );
}
