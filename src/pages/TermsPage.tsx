import { LegalPage, type LegalSection } from '../components/LegalPage';
import { MailLink } from '../components/MailLink';

/*
 * Términos y condiciones (tarea 1.1). Al cambiar el texto, actualizar LEGAL_VERSION y
 * LEGAL_UPDATED en src/legal.ts.
 *
 * Funciones descritas aquí que la app aún no tiene (denunciar, eliminar la cuenta, exportar,
 * apelar): el canal real mientras tanto es el correo de contacto. Desactivar y reactivar ya
 * están en la app (tarea 2.1). No enlazar a
 * /eliminar-cuenta ni /apelar hasta que existan (tareas 2.3 y 4.3–4.4).
 */
const SECTIONS: readonly LegalSection[] = [
  {
    id: 'que-es',
    title: 'Qué es LectorApp',
    content: (
      <>
        <p>
          LectorApp es una app para Android que te ayuda a llevar un registro personal de tus
          lecturas: lo que estás leyendo, lo que terminaste y lo que dejaste, tus calificaciones,
          tus reseñas, tu reto anual y tus sesiones de lectura cronometradas.
        </p>
        <p>
          Tiene una parte social mínima: un feed con las lecturas que cada persona decide
          compartir y la opción de dar «me gusta». No hay seguidores, comentarios ni mensajes
          privados. Todo lo que registras es privado salvo que tú decidas compartirlo.
        </p>
        <p>
          El servicio lo ofrece LectorApp, desde Chile («nosotros»). Estos términos se aplican a la
          app y a esta web.
        </p>
      </>
    ),
  },
  {
    id: 'requisitos',
    title: 'Quién puede usarla',
    content: (
      <ul>
        <li>
          Necesitas tener <strong>al menos 13 años</strong>. Si eres menor de edad, necesitas el
          permiso de tu madre, padre o tutor, y te recomendamos leer estos términos con ellos.
        </li>
        <li>
          Si suspendimos una cuenta tuya de forma definitiva, no puedes crear otra para seguir
          usando LectorApp.
        </li>
      </ul>
    ),
  },
  {
    id: 'cuenta',
    title: 'Tu cuenta y su seguridad',
    content: (
      <ul>
        <li>
          Usa un correo que sea tuyo: lo necesitas para recuperar tu contraseña y para que
          podamos comprobar que una solicitud viene de ti.
        </li>
        <li>
          Tu nombre de usuario es visible para otras personas. No puede hacerse pasar por otra
          persona, una marca o LectorApp, ni ser ofensivo.
        </li>
        <li>
          Cuida tu contraseña y no la compartas. Eres responsable de lo que se haga con tu cuenta.
        </li>
        <li>
          Si crees que alguien entró a tu cuenta, crea una contraseña nueva con «¿Olvidaste tu
          contraseña?» (eso cierra la sesión en todos tus dispositivos) y escríbenos a{' '}
          <MailLink />.
        </li>
      </ul>
    ),
  },
  {
    id: 'contenido-prohibido',
    title: 'Qué puedes publicar y qué no',
    content: (
      <>
        <p>
          Lo que haces público (tus reseñas, calificaciones y lecturas compartidas) y tu nombre de
          usuario deben respetar a las demás personas. <strong>No está permitido</strong>:
        </p>
        <ul>
          <li>
            <strong>Odio:</strong> contenido que ataque, humille o discrimine a personas o grupos
            por su origen, nacionalidad, religión, género, orientación sexual, discapacidad, edad u
            otra condición.
          </li>
          <li>
            <strong>Acoso:</strong> amenazas, intimidación, insultos dirigidos a alguien o publicar
            datos personales de otras personas.
          </li>
          <li>
            <strong>Spam:</strong> publicidad, enlaces repetidos, publicaciones masivas o
            automáticas y contenido engañoso.
          </li>
          <li>
            <strong>Contenido sexual:</strong> contenido sexual explícito y, en ningún caso,
            contenido que sexualice a menores (lo denunciamos a las autoridades).
          </li>
          <li>
            <strong>Contenido ilegal:</strong> promover delitos o la violencia, o publicar
            contenido que infrinja derechos de otros (por ejemplo, copiar capítulos enteros de un
            libro). Citar un fragmento breve en tu reseña está bien.
          </li>
          <li>
            <strong>Suplantación:</strong> hacerte pasar por otra persona, por un autor, una
            editorial o por LectorApp.
          </li>
        </ul>
        <p>Tampoco puedes:</p>
        <ul>
          <li>usar bots o programas para crear cuentas, publicar o copiar contenido de forma masiva;</li>
          <li>intentar entrar a cuentas ajenas o saltarte la seguridad o los límites del servicio;</li>
          <li>crear otra cuenta para evitar una sanción;</li>
          <li>hacer denuncias falsas o de mala fe.</li>
        </ul>
        <p>
          Un consejo, no una regla: si tu reseña cuenta el final del libro, avísalo al principio.
        </p>
      </>
    ),
  },
  {
    id: 'tu-contenido',
    title: 'Tu contenido es tuyo',
    content: (
      <>
        <p>
          Lo que escribes en LectorApp sigue siendo tuyo. Para que el servicio funcione, nos das
          un permiso (licencia) <strong>gratuito, no exclusivo y mundial</strong> para guardar tu
          contenido y mostrarlo dentro de LectorApp (la app, el feed, la página de cada libro y
          esta web), adaptando solo su formato, por ejemplo para que quepa en una tarjeta.
        </p>
        <ul>
          <li>
            Tus lecturas son <strong>privadas por defecto</strong>. A otras personas solo les
            mostramos las que tú marcas como públicas.
          </li>
          <li>
            Las lecturas públicas las puede ver cualquier persona con cuenta y también quien abra
            un enlace a la página del libro, aunque no tenga cuenta.
          </li>
          <li>
            El permiso termina cuando haces privada una lectura o la borras. Puede quedar una copia
            en respaldos puntuales guardados en nuestro servidor, que solo usamos para recuperar el
            servicio ante un fallo y que borramos cuando dejan de ser necesarios.
          </li>
          <li>
            Eres responsable de lo que publicas y de tener derecho a publicarlo.
          </li>
        </ul>
        <p>
          El nombre, el diseño y el código de LectorApp son nuestros. Los datos de los libros
          (títulos, autores y portadas) vienen de <a href="https://openlibrary.org">Open Library</a>{' '}
          y pertenecen a sus respectivos titulares.
        </p>
      </>
    ),
  },
  {
    id: 'moderacion',
    title: 'Moderación: denuncias, reseñas privadas y suspensión',
    content: (
      <>
        <h3>Denunciar</h3>
        <p>
          Si ves algo que rompe estas reglas, escríbenos a <MailLink /> indicando el nombre de
          usuario y, si es una reseña, el libro. Revisamos cada denuncia. Para que el sistema sea
          justo, cada persona cuenta una sola vez por cada reseña o cuenta denunciada.
        </p>

        <h3>Qué podemos hacer</h3>
        <p>
          Según la gravedad, podemos hacer privada una reseña, quitar contenido o suspender una
          cuenta. Ante contenido ilegal o que ponga en riesgo a alguien actuamos de inmediato y,
          si corresponde, avisamos a las autoridades.
        </p>

        <h3>Reseñas que pasan a privadas</h3>
        <p>
          Cuando <strong>3 personas distintas</strong> denuncian una misma reseña, esta pasa a ser{' '}
          <strong>privada de forma permanente</strong>: sale del feed y de la página del libro, y
          su autor ya no puede volver a hacerla pública. Sigue en su biblioteca, donde puede verla,
          editarla o borrarla. Le avisamos a quien la escribió. Solo un administrador puede
          revertirlo, si al revisar las denuncias decide descartarlas.
        </p>

        <h3>Suspensión de la cuenta</h3>
        <p>Una cuenta puede quedar suspendida de dos formas:</p>
        <ul>
          <li>
            <strong>Por decisión de un administrador</strong>, ante una falta grave o repetida de
            estas reglas.
          </li>
          <li>
            <strong>De forma automática</strong>, cuando acumula denuncias de{' '}
            <strong>10 personas distintas</strong> sobre la cuenta o su contenido (sin contar las
            denuncias que un administrador haya descartado).
          </li>
        </ul>
        <p>
          Mientras está suspendida, la cuenta no puede iniciar sesión, se cierran sus sesiones
          abiertas y su contenido deja de verse. Aun así, puedes:
        </p>
        <ul>
          <li>pedirnos una copia de tu biblioteca (tus lecturas, reseñas y sesiones);</li>
          <li>
            <strong>apelar una vez</strong>: escríbenos desde el correo de tu cuenta explicando
            por qué crees que es un error. Si aceptamos la apelación, reactivamos la cuenta; si la
            rechazamos, la decisión es definitiva;
          </li>
          <li>
            pedir que eliminemos tu cuenta (<a href="#eliminar">sección 8</a>).
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'desactivar',
    title: 'Desactivar tu cuenta (una pausa voluntaria)',
    content: (
      <>
        <p>
          Desactivar es algo que decides tú, cuando quieras tomarte un descanso. No es una sanción
          y se puede revertir. Siempre te explicaremos qué va a pasar antes de confirmar.
        </p>
        <ul>
          <li>
            Al desactivar, <strong>todas tus lecturas públicas pasan a privadas</strong> y tu
            perfil queda oculto para los demás.
          </li>
          <li>
            Mientras está desactivada puedes entrar y ver tu biblioteca, pero no crear, editar,
            dar «me gusta» ni usar el cronómetro.
          </li>
          <li>
            Al reactivarla, tus lecturas <strong>vuelven a la visibilidad que tenían</strong>,
            salvo las reseñas que pasaron a privadas por moderación, que siguen privadas.
          </li>
        </ul>
        <p>
          Puedes desactivarla en la app, en <strong>Perfil → Ajustes → Cuenta → Desactivar mi
          cuenta</strong> (te pediremos tu contraseña para confirmar). Para volver, entra a la app
          y toca <strong>Reactivar mi cuenta</strong>. Si no puedes hacerlo desde la app,
          escríbenos a <MailLink /> desde el correo de tu cuenta.
        </p>
      </>
    ),
  },
  {
    id: 'eliminar',
    title: 'Eliminar tu cuenta',
    content: (
      <>
        <p>
          Puedes pedir que eliminemos tu cuenta cuando quieras, también si está suspendida.
          Escríbenos a <MailLink /> <strong>desde el correo de tu cuenta</strong> indicando tu
          nombre de usuario.
        </p>
        <p>
          Eliminar es <strong>definitivo</strong>: borramos tu cuenta y todo lo asociado a ella
          (lecturas, reseñas, sesiones de lectura, metas, «me gusta» y sesiones abiertas). No se
          puede deshacer. El catálogo de libros (títulos, autores y portadas) se mantiene porque
          es compartido y no contiene datos tuyos. Los detalles están en la{' '}
          <a href="/privacidad#conservacion">Política de privacidad</a>.
        </p>
      </>
    ),
  },
  {
    id: 'disponibilidad',
    title: 'Cambios en el servicio',
    content: (
      <p>
        LectorApp es un proyecto en desarrollo: podemos añadir, cambiar o quitar funciones, y el
        servicio puede detenerse a veces por mantenimiento o fallos. Si un cambio te afecta de
        forma importante, o si algún día decidimos cerrar LectorApp, intentaremos avisarte con
        anticipación para que puedas pedir una copia de tu biblioteca.
      </p>
    ),
  },
  {
    id: 'responsabilidad',
    title: 'Limitación de responsabilidad',
    content: (
      <>
        <p>
          Trabajamos para que LectorApp funcione bien y sea segura, pero la ofrecemos «tal como
          está»: no podemos garantizar que funcione siempre ni que no tenga errores. En
          particular:
        </p>
        <ul>
          <li>
            Los datos de los libros vienen de fuentes externas y pueden tener errores u omisiones.
          </li>
          <li>
            Lo que publica cada persona es responsabilidad de quien lo publica. No revisamos todo
            antes de que se publique, pero actuamos cuando recibimos una denuncia o detectamos un
            problema.
          </li>
          <li>
            En la medida en que la ley lo permita, no respondemos por daños indirectos derivados
            del uso de LectorApp o de no poder usarla.
          </li>
        </ul>
        <p>
          Nada de esto limita los derechos que la ley chilena te reconoce y que no se pueden
          renunciar, incluidos los de la Ley 19.496 sobre protección de los derechos de los
          consumidores.
        </p>
      </>
    ),
  },
  {
    id: 'cambios',
    title: 'Cambios en estos términos',
    content: (
      <p>
        La versión y la fecha de arriba indican cuándo cambiaron estos términos por última vez.
        Si hacemos un cambio importante, te avisaremos en la app o por correo antes de que se
        aplique, y podremos pedirte que aceptes la nueva versión para seguir publicando. Si no
        estás de acuerdo, puedes dejar de usar LectorApp y pedir que eliminemos tu cuenta.
      </p>
    ),
  },
  {
    id: 'ley',
    title: 'Ley aplicable',
    content: (
      <p>
        Estos términos se rigen por las leyes de la República de Chile. Cualquier conflicto se
        resolverá ante los tribunales competentes de Chile, sin perjuicio de los derechos que te
        da la ley como consumidor.
      </p>
    ),
  },
  {
    id: 'contacto',
    title: 'Contacto',
    content: (
      <p>
        Para dudas, denuncias, apelaciones o solicitudes sobre tu cuenta, escríbenos a{' '}
        <MailLink />. Más detalles en la página de <a href="/contacto">contacto</a>.
      </p>
    ),
  },
];

export function TermsPage() {
  return (
    <LegalPage
      title="Términos y condiciones"
      intro={
        <>
          <p className="lead">
            Las reglas para usar LectorApp, escritas para que se entiendan. Para crear una cuenta
            tienes que aceptarlas, junto con la Política de privacidad, marcando la casilla del
            registro. Si tu cuenta es anterior, te pediremos aceptarlas la primera vez que quieras
            publicar algo; guardar tus lecturas en privado no lo requiere.
          </p>
          <p>
            Lo que hacemos con tus datos está en la{' '}
            <a href="/privacidad">Política de privacidad</a>, que es parte de estos términos.
          </p>
        </>
      }
      sections={SECTIONS}
    />
  );
}
