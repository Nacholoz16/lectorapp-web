import type { ReactNode } from 'react';
import { FOOTER_LINKS, SITE } from '../site';

interface LayoutProps {
  children: ReactNode;
}

/** Estructura común de todas las páginas públicas: cabecera, contenido y pie. */
export function Layout({ children }: LayoutProps) {
  const year = new Date().getFullYear();

  return (
    <>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>

      <header className="site-header">
        <div className="container">
          <a className="brand" href="/">
            {/* Decorativa: el nombre ya está en el texto del enlace. fetchPriority="low" evita
                que React 19 añada un <link rel="preload"> innecesario para este logo de 36 px. */}
            <img src="/favicon.png" alt="" width={36} height={36} fetchPriority="low" />
            {SITE.name}
          </a>
        </div>
      </header>

      <main id="contenido" tabIndex={-1}>
        <div className="container">{children}</div>
      </main>

      <footer className="site-footer">
        <div className="container">
          <nav aria-label="Información legal">
            <ul className="footer-links">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <p>
            © {year} {SITE.name}
          </p>
        </div>
      </footer>
    </>
  );
}
