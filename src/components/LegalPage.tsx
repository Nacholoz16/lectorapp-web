import type { ReactNode } from 'react';
import { LEGAL_UPDATED, LEGAL_VERSION } from '../legal';

export interface LegalSection {
  /** Ancla de la sección (/privacidad#derechos). No cambiarla: otros sitios pueden enlazarla. */
  id: string;
  title: string;
  content: ReactNode;
}

interface LegalPageProps {
  title: string;
  /** Párrafos de introducción, bajo la versión y la fecha. */
  intro: ReactNode;
  sections: readonly LegalSection[];
}

/**
 * Estructura común de los documentos legales: título, versión y fecha visibles arriba,
 * índice con anclas y secciones numeradas (h2) para poder citarlas ("ver la sección 7").
 */
export function LegalPage({ title, intro, sections }: LegalPageProps) {
  return (
    <article className="legal" aria-labelledby="titulo-documento">
      <header>
        <h1 id="titulo-documento">{title}</h1>
        <p className="legal-meta">
          Versión {LEGAL_VERSION} · Última actualización:{' '}
          <time dateTime={LEGAL_UPDATED.iso}>{LEGAL_UPDATED.label}</time>
        </p>
        {intro}
      </header>

      <nav className="toc card" aria-labelledby="titulo-indice">
        <h2 id="titulo-indice">En esta página</h2>
        <ol>
          {sections.map((section) => (
            <li key={section.id}>
              <a href={`#${section.id}`}>{section.title}</a>
            </li>
          ))}
        </ol>
      </nav>

      {sections.map((section, index) => (
        <section key={section.id} id={section.id} aria-labelledby={`${section.id}-titulo`}>
          <h2 id={`${section.id}-titulo`}>
            {index + 1}. {section.title}
          </h2>
          {section.content}
        </section>
      ))}
    </article>
  );
}
