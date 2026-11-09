/** Portada provisional (el contenido definitivo de la web pública llega en la tarea 5.2). */
export function HomePage() {
  return (
    <>
      <section aria-labelledby="titulo-portada">
        <span className="eyebrow">Muy pronto en Android</span>
        <h1 id="titulo-portada">Tu rincón de lectura acogedor</h1>
        <p className="lead">
          LectorApp es un lugar tranquilo para guardar lo que lees y lo que piensas de cada libro.
          Sin ruido, sin presión y con tu privacidad primero.
        </p>
      </section>

      <section aria-labelledby="titulo-que-puedes-hacer">
        <h2 id="titulo-que-puedes-hacer" className="visually-hidden">
          Qué puedes hacer
        </h2>
        <ul className="features">
          <li className="card">
            <h3>Tu biblioteca</h3>
            <p>Anota lo que estás leyendo, lo que terminaste y lo que dejaste, con tu progreso.</p>
          </li>
          <li className="card">
            <h3>Tus reseñas</h3>
            <p>Escribe lo que quieras recordar. Son solo para ti, salvo que decidas compartirlas.</p>
          </li>
          <li className="card">
            <h3>Tu ritmo</h3>
            <p>Cronometra tus sesiones y sigue tu reto del año, sin culpas.</p>
          </li>
        </ul>
      </section>
    </>
  );
}
