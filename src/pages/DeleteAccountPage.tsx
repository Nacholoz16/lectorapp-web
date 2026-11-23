import { MailLink } from '../components/MailLink';

/*
 * Eliminar la cuenta desde la web (tarea 2.3): Google Play exige un enlace web para pedir el
 * borrado que funcione sin la app instalada.
 *
 * Es la ÚNICA página con JavaScript: src/client/delete-account.ts (se declara en src/routes.tsx con
 * `clientScript`). El HTML pre-renderizado trae los tres pasos; los pasos 2 y 3 llegan con
 * `hidden` y el script los muestra. El formulario del paso 1 llega deshabilitado (fieldset
 * disabled) y el script lo habilita al cargar: sin JavaScript no se puede enviar nada a medias, y
 * el <noscript> y la sección "¿Problemas?" ofrecen el correo como alternativa.
 *
 * Los `id` de este archivo los usa el script: si cambias uno, cámbialo también allí.
 */
export function DeleteAccountPage() {
  return (
    <div className="stack delete-account">
      <section aria-labelledby="titulo-eliminar">
        <h1 id="titulo-eliminar">Eliminar tu cuenta</h1>
        <p className="lead">
          Borra tu cuenta de LectorApp y todo lo que guardaste en ella, para siempre. No necesitas
          tener la app instalada.
        </p>
      </section>

      <section aria-labelledby="titulo-que-se-borra">
        <h2 id="titulo-que-se-borra">Qué se borra</h2>
        <ul className="plain-list">
          <li>Tus lecturas, reseñas y notas, públicas y privadas.</li>
          <li>Tus sesiones de lectura, tu reto anual y tus estadísticas.</li>
          <li>Los «me gusta» que diste y los que recibieron tus reseñas.</li>
          <li>
            Tu perfil y tu sesión en todos tus dispositivos. Tu nombre de usuario y tu correo
            quedan libres.
          </li>
        </ul>
        <p>
          <strong>No se puede deshacer.</strong> Los libros del catálogo (títulos, autores y
          portadas) no se borran: los comparten todos y no contienen datos tuyos. Más detalles en
          la <a href="/privacidad#conservacion">Política de privacidad</a>.
        </p>
      </section>

      <section aria-labelledby="titulo-alternativas">
        <h2 id="titulo-alternativas">Antes de seguir</h2>
        <ul className="plain-list">
          <li>
            <strong>Si tienes la app</strong>, también puedes hacerlo en{' '}
            <strong>Perfil → Ajustes → Cuenta → Eliminar mi cuenta</strong>.
          </li>
          <li>
            <strong>¿Solo quieres un descanso?</strong> Desactiva tu cuenta en la app: tu perfil se
            oculta y tu biblioteca te espera hasta que vuelvas (ver los{' '}
            <a href="/terminos#desactivar">Términos</a>).
          </li>
        </ul>
      </section>

      <section aria-labelledby="titulo-paso" className="card delete-flow">
        <h2 id="titulo-paso" className="visually-hidden">
          Eliminar tu cuenta paso a paso
        </h2>

        <noscript>
          <p className="notice">
            Esta página necesita JavaScript para enviarte el código. Si no puedes activarlo,
            escríbenos a <MailLink /> desde el correo de tu cuenta e indica tu nombre de usuario.
          </p>
        </noscript>

        {/* Avisos de estado (p. ej. "Te enviamos un código nuevo"): los lee el lector de pantalla. */}
        <p id="estado" className="status-message" role="status" aria-live="polite"></p>

        {/* Paso 1: el correo de la cuenta. */}
        <div id="paso-email">
          <h3 id="titulo-paso-email" tabIndex={-1}>
            Paso 1 de 2 · Tu correo
          </h3>
          <form id="form-email" method="post" noValidate aria-labelledby="titulo-paso-email">
            <fieldset id="fieldset-email" disabled>
              <legend className="visually-hidden">Tu correo</legend>
              <div className="field">
                <label htmlFor="email">Correo de tu cuenta</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  spellCheck={false}
                  autoCapitalize="none"
                  maxLength={254}
                  required
                  aria-describedby="email-ayuda"
                />
                <p id="email-ayuda" className="field-help">
                  Te enviaremos un código de 6 dígitos para confirmar que eres tú.
                </p>
                <p id="email-error" className="field-error" hidden></p>
              </div>
              <button id="boton-email" type="submit" className="button">
                Enviarme el código
              </button>
            </fieldset>
          </form>
        </div>

        {/* Paso 2: el código y la confirmación explícita. */}
        <div id="paso-codigo" hidden>
          <h3 id="titulo-paso-codigo" tabIndex={-1}>
            Paso 2 de 2 · Confirma con el código
          </h3>
          <p>
            Si <strong id="email-enviado">tu correo</strong> tiene una cuenta en LectorApp, te
            enviamos un código de 6 dígitos. Vence en 15 minutos. Revisa también la carpeta de
            spam.
          </p>
          <form id="form-codigo" method="post" noValidate aria-labelledby="titulo-paso-codigo">
            <div className="field">
              <label htmlFor="codigo">Código de 6 dígitos</label>
              <input
                id="codigo"
                name="code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                maxLength={6}
                required
                aria-describedby="codigo-ayuda"
              />
              <p id="codigo-ayuda" className="field-help">
                Lo encuentras en el correo «Código para eliminar tu cuenta de LectorApp».
              </p>
              <p id="codigo-error" className="field-error" hidden></p>
            </div>
            <div className="field checkbox-field">
              <input id="entiendo" name="entiendo" type="checkbox" required />
              <label htmlFor="entiendo">
                Entiendo que se borrará todo y que no se puede deshacer.
              </label>
            </div>
            <p id="entiendo-error" className="field-error" hidden></p>
            <div className="actions">
              <button id="boton-codigo" type="submit" className="button button-danger">
                Eliminar mi cuenta para siempre
              </button>
            </div>
          </form>
          <div className="actions secondary-actions">
            <button id="boton-reenviar" type="button" className="button button-secondary">
              Enviarme otro código
            </button>
            <button id="boton-otro-email" type="button" className="button button-secondary">
              Usar otro correo
            </button>
          </div>
        </div>

        {/* Paso 3: hecho. */}
        <div id="paso-hecho" hidden>
          <h3 id="titulo-paso-hecho" tabIndex={-1}>
            Tu cuenta se eliminó
          </h3>
          <p>
            Borramos tu cuenta y todos tus datos. Si tenías la app abierta en algún teléfono, la
            próxima vez te llevará al inicio de sesión. Gracias por haber leído con nosotros.
          </p>
          <a className="button" href="/">
            Volver al inicio
          </a>
        </div>
      </section>

      <section aria-labelledby="titulo-problemas">
        <h2 id="titulo-problemas">¿Problemas?</h2>
        <p>
          Si no te llega el código o el formulario no funciona, escríbenos a <MailLink /> desde el
          correo de tu cuenta e indica tu nombre de usuario. Nunca te pediremos tu contraseña.
        </p>
      </section>
    </div>
  );
}
