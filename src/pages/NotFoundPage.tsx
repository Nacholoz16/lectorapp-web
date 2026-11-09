/** Página 404: Nginx la sirve para cualquier ruta que no exista. */
export function NotFoundPage() {
  return (
    <section aria-labelledby="titulo-404">
      <h1 id="titulo-404">No encontramos esta página</h1>
      <p className="lead">Puede que el enlace esté incompleto o que la página ya no exista.</p>
      <a className="button" href="/">
        Volver al inicio
      </a>
    </section>
  );
}
