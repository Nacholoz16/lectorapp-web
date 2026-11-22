import { MailLink } from '../components/MailLink';
import { SITE } from '../site';

/** Contacto: un único correo para todo (no hay formulario: la web no tiene JavaScript ni backend). */
export function ContactPage() {
  return (
    <div className="stack">
      <section aria-labelledby="titulo-contacto">
        <h1 id="titulo-contacto">Contacto</h1>
        <p className="lead">
          ¿Tienes una duda, quieres avisarnos de algo o hacer una solicitud sobre tu cuenta?
          Escríbenos: lo lee una persona.
        </p>
        <p>
          <MailLink className="button">{`Escribir a ${SITE.contactEmail}`}</MailLink>
        </p>
      </section>

      <section aria-labelledby="titulo-para-que">
        <h2 id="titulo-para-que">Para qué puedes escribirnos</h2>
        <ul className="plain-list">
          <li>
            <strong>Dudas o problemas</strong> con la app o con tu cuenta.
          </li>
          <li>
            <strong>Denunciar</strong> una reseña o a una persona que no respeta las{' '}
            <a href="/terminos#contenido-prohibido">reglas de LectorApp</a>.
          </li>
          <li>
            <strong>Apelar una suspensión</strong> de tu cuenta (una vez por suspensión).
          </li>
          <li>
            <strong>Tus datos:</strong> pedir una copia, corregirlos o que dejemos de usarlos (ver{' '}
            <a href="/privacidad#derechos">tus derechos</a>).
          </li>
          <li>
            <strong>Eliminar tu cuenta</strong> y todos sus datos, de forma definitiva, si no
            puedes hacerlo tú en la app (<strong>Perfil → Ajustes → Cuenta → Eliminar mi
            cuenta</strong>).
          </li>
        </ul>
      </section>

      <section aria-labelledby="titulo-consejos">
        <h2 id="titulo-consejos">Para ayudarte más rápido</h2>
        <ul className="plain-list">
          <li>
            Si escribes por tu cuenta (tus datos, eliminarla, una apelación), hazlo{' '}
            <strong>desde el correo con el que te registraste</strong> e indica tu nombre de
            usuario. Así comprobamos que eres tú.
          </li>
          <li>
            Si denuncias algo, indica el nombre de usuario y, si es una reseña, el libro.
          </li>
          <li>Nunca te pediremos tu contraseña. No la incluyas en el correo.</li>
        </ul>
      </section>

      <section aria-labelledby="titulo-respuesta">
        <h2 id="titulo-respuesta">Cuándo te respondemos</h2>
        <p>
          Respondemos lo antes posible. Las solicitudes sobre tus datos personales las atendemos
          dentro de los plazos que fija la ley chilena.
        </p>
        <p>
          También puedes escribirnos directamente a <MailLink />.
        </p>
      </section>
    </div>
  );
}
