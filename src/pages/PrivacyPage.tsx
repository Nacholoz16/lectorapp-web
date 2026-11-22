import { LegalPage, type LegalSection } from '../components/LegalPage';
import { MailLink } from '../components/MailLink';

/*
 * Política de privacidad (tarea 1.2). Cada dato, plazo y tercero que se menciona aquí está
 * comprobado en el código de la API y de la app (ver el informe de la tarea 1.2). Si cambia
 * lo que se recoge, se guarda o se comparte, actualizar este texto, src/legal.ts y el
 * formulario "Seguridad de los datos" de Play Console.
 */
const SECTIONS: readonly LegalSection[] = [
  {
    id: 'resumen',
    title: 'En pocas palabras',
    content: (
      <ul>
        <li>Tus lecturas y reseñas son privadas salvo que tú decidas compartirlas.</li>
        <li>No vendemos tus datos, no mostramos publicidad y no usamos herramientas de rastreo ni de analítica.</li>
        <li>Solo pedimos lo necesario para que la app funcione: un correo, un nombre de usuario y una contraseña.</li>
        <li>
          A otros servicios solo les llega lo mínimo para funcionar (por ejemplo, el texto que
          buscas para encontrar un libro).
        </li>
        <li>
          Puedes pedir una copia de tus datos o que borremos tu cuenta escribiendo a{' '}
          <MailLink />.
        </li>
      </ul>
    ),
  },
  {
    id: 'responsable',
    title: 'Quién es responsable de tus datos',
    content: (
      <p>
        LectorApp, desde Chile, es responsable del tratamiento de los datos que se recogen a
        través de la app y de esta web. Para cualquier tema de privacidad, escríbenos a{' '}
        <MailLink />. Tratamos tus datos según la Ley 19.628 sobre protección de la vida privada
        y, desde su entrada en vigencia, la Ley 21.719 sobre protección de datos personales.
      </p>
    ),
  },
  {
    id: 'datos',
    title: 'Qué datos recogemos',
    content: (
      <>
        <h3>Los que tú nos das</h3>
        <ul>
          <li>
            <strong>Cuenta:</strong> tu correo (lo guardamos en minúsculas), tu nombre de usuario y
            tu contraseña. La contraseña nunca se guarda tal cual: solo un resumen cifrado
            (hash con bcrypt) que no permite recuperarla.
          </li>
          <li>
            <strong>Perfil:</strong> tu cuenta tiene espacio para una biografía y una imagen de
            perfil. Hoy la app no permite editarlos: tu avatar es una ilustración generada a partir
            de tu nombre de usuario.
          </li>
          <li>
            <strong>Lecturas:</strong> cada libro que añades a tu biblioteca, con su estado
            (leyendo, terminado o lo dejé), la página en la que vas, tu calificación, las fechas de
            inicio y término, tu reseña y si es pública o privada.
          </li>
          <li>
            <strong>Sesiones de lectura:</strong> cuando usas el cronómetro, guardamos cuántos
            minutos leíste, cuántas páginas y cuándo.
          </li>
          <li>
            <strong>Reto anual:</strong> cuántos libros quieres leer este año.
          </li>
          <li>
            <strong>«Me gusta»:</strong> qué lecturas públicas te gustaron. Los demás solo ven
            cuántos «me gusta» tiene una lectura, no quién los dio.
          </li>
          <li>
            <strong>Ajustes de privacidad:</strong> si tu perfil y tus estadísticas son visibles
            para los demás.
          </li>
          <li>
            <strong>Mensajes que nos envías</strong> por correo (por ejemplo, una denuncia o una
            solicitud), con tu dirección de correo.
          </li>
        </ul>

        <h3>Los que se generan al usar el servicio</h3>
        <ul>
          <li>
            <strong>Datos de sesión:</strong> para que no tengas que iniciar sesión a cada rato
            usamos dos credenciales: una de acceso que dura 30 minutos y otra que la renueva sola
            y dura 60 días desde la última vez que se usó. En el servidor solo guardamos un
            resumen cifrado (hash) de la segunda, nunca la credencial en sí. Al cerrar sesión, la
            anotamos como revocada.
          </li>
          <li>
            <strong>Aceptación de los términos:</strong> la versión de los Términos y la Política
            de privacidad que aceptaste (por ejemplo, «2026-11») y la fecha en que lo hiciste, al
            crear tu cuenta o antes de publicar por primera vez. Nos sirve como constancia y para
            saber si tenemos que pedirte que aceptes una versión nueva.
          </li>
          <li>
            <strong>Códigos de recuperación:</strong> si pides crear una contraseña nueva, te
            enviamos un código de 6 dígitos. Guardamos solo un resumen cifrado del código, su
            vencimiento y cuántas veces se intentó usar.
          </li>
          <li>
            <strong>Dirección IP:</strong> como cualquier servicio en internet, nuestro servidor
            recibe la dirección IP de tu conexión. La usamos para limitar intentos (por ejemplo,
            de inicio de sesión), frenar abusos y proteger el servidor. No la guardamos en la
            base de datos.
          </li>
          <li>
            <strong>Registros técnicos:</strong> para detectar fallos y ataques, el servidor
            anota las conexiones en dos tipos de registro:
            <ul>
              <li>
                el <strong>registro de acceso del servidor de entrada</strong> (el que recibe todas
                las conexiones a la app y a esta web) guarda tu dirección IP, la fecha y hora, la
                dirección pedida y datos técnicos de la conexión (como el navegador o la versión de
                la app);
              </li>
              <li>
                el <strong>registro de la aplicación</strong> guarda el método, la ruta pedida, el
                resultado y el tiempo de respuesta, sin tu IP. La ruta puede incluir el texto de
                una búsqueda o el nombre de usuario de un perfil que abriste. Algunos eventos de
                seguridad (por ejemplo, el intento de reutilizar una sesión robada o un correo que
                no se pudo enviar) se anotan con el identificador interno de la cuenta afectada.
              </li>
            </ul>
            Ninguno de los dos incluye tu contraseña, tus credenciales ni el contenido de lo que
            envías (tus reseñas, por ejemplo).
          </li>
        </ul>

        <h3>Lo que se queda en tu teléfono</h3>
        <p>La app guarda algunas cosas solo en tu dispositivo:</p>
        <ul>
          <li>tus credenciales de sesión, en el almacenamiento cifrado de Android;</li>
          <li>tu identificador interno, tu nombre de usuario y tu avatar, para mostrarlos al abrir la app;</li>
          <li>
            qué versión de los términos aceptaste, para preguntarte antes de publicar si falta
            aceptar la vigente;
          </li>
          <li>una copia de la primera página del feed, para mostrarla sin conexión;</li>
          <li>tus preferencias (tema de colores y vista del feed);</li>
          <li>los borradores del formulario de lectura, para que no pierdas lo que escribiste;</li>
          <li>
            el cronómetro, que funciona en tu teléfono; solo se envía al servidor la sesión
            terminada.
          </li>
        </ul>
        <p>
          Al cerrar sesión se borran las credenciales, tus datos de usuario y la copia del feed.
          Los borradores y las preferencias quedan en el teléfono hasta que desinstales la app.
        </p>

        <h3>Lo que no recogemos</h3>
        <p>
          No accedemos a tu ubicación, contactos, fotos, cámara ni micrófono. No usamos el
          identificador de publicidad, ni cookies, ni herramientas de analítica o publicidad. El
          permiso de notificaciones se usa solo para mostrar el cronómetro mientras lees.
        </p>
        <p>
          Esta web tampoco usa cookies, publicidad ni analítica, y no tiene formularios.
        </p>
      </>
    ),
  },
  {
    id: 'finalidad',
    title: 'Para qué los usamos y con qué base legal',
    content: (
      <>
        <ul>
          <li>
            <strong>Darte el servicio</strong> que pediste al crear tu cuenta: guardar tu
            biblioteca, calcular tus estadísticas, mostrar el feed, recuperar tu contraseña y
            mantener tu sesión abierta. La base es la relación que tenemos contigo al aceptar los{' '}
            <a href="/terminos">Términos</a>.
          </li>
          <li>
            <strong>Mostrar a otros lo que tú decides compartir</strong> (lecturas públicas,
            perfil y estadísticas visibles). La base es tu consentimiento, que puedes retirar en
            cualquier momento haciéndolo privado.
          </li>
          <li>
            <strong>Proteger el servicio y a las personas que lo usan:</strong> limitar intentos,
            detectar el robo de sesiones, revisar denuncias y aplicar las reglas de moderación.
            La base es nuestro interés legítimo en mantener LectorApp segura.
          </li>
          <li>
            <strong>Cumplir la ley</strong>, si una autoridad competente nos lo pide.
          </li>
        </ul>
        <p>
          Algunas reglas de moderación se aplican de forma automática (por ejemplo, una reseña
          denunciada por 3 personas distintas pasa a privada). Están explicadas en los{' '}
          <a href="/terminos#moderacion">Términos</a> y siempre puedes pedir que una persona revise
          tu caso.
        </p>
      </>
    ),
  },
  {
    id: 'que-ven-otros',
    title: 'Qué ven otras personas',
    content: (
      <ul>
        <li>
          <strong>Tus lecturas privadas</strong> (todas, por defecto): solo tú.
        </li>
        <li>
          <strong>Tus lecturas públicas:</strong> tu nombre de usuario, tu avatar, el libro, el
          estado, la página en la que vas, tu calificación, tu reseña y el número de «me gusta».
          Las ve cualquier persona con cuenta (en el feed, en la página del libro y en tu
          perfil, si es público) y también quien abra un enlace a la página del libro, aunque no
          tenga cuenta. Ocultar tu perfil no oculta las lecturas que marcaste como públicas en el
          feed ni en la página del libro: para eso, hazlas privadas.
        </li>
        <li>
          <strong>Tu perfil y tus estadísticas</strong> (incluida tu meta del año) son visibles
          para otras personas con cuenta salvo que los ocultes en los ajustes de privacidad de tu
          perfil. Las estadísticas que ven los demás se calculan solo con tus lecturas públicas.
        </li>
        <li>
          <strong>Tu correo</strong> nunca se muestra a nadie.
        </li>
      </ul>
    ),
  },
  {
    id: 'terceros',
    title: 'Con quién compartimos datos',
    content: (
      <>
        <p>
          No vendemos ni alquilamos tus datos. Solo intervienen estos servicios, cada uno con lo
          mínimo para su función:
        </p>
        <ul>
          <li>
            <strong>ZeptoMail (Zoho)</strong>, para enviar correos (hoy, los códigos para crear
            una contraseña nueva). Recibe tu correo, tu nombre de usuario y el código.
          </li>
          <li>
            <strong>Open Library</strong> (Internet Archive), el catálogo de libros. Cuando buscas
            un libro, nuestro servidor le envía <strong>solo el texto de la búsqueda</strong>,
            sin datos de tu cuenta.
          </li>
          <li>
            <strong>Portadas de libros:</strong> la app las descarga directamente de Open Library
            (y, en algunos casos, de Google Books). Esos servicios reciben la petición de la
            imagen desde tu teléfono, con tu IP, pero ningún dato de tu cuenta.
          </li>
          <li>
            <strong>DiceBear</strong>, que dibuja los avatares. La app le pide a ese servicio la
            imagen de cada avatar que muestra, a partir del <strong>nombre de usuario</strong>{' '}
            (el tuyo y el de otras personas del feed), desde tu teléfono y con tu IP.
          </li>
          <li>
            <strong>Google Fonts</strong>: la app descarga sus tipografías desde servidores de
            Google, que reciben la petición desde tu teléfono con tu IP, sin datos de tu cuenta.
          </li>
          <li>
            <strong>Autoridades</strong>, solo si la ley nos obliga o para denunciar contenido
            ilegal.
          </li>
        </ul>
        <p>
          Cada uno de estos servicios tiene su propia política de privacidad. Si se añade uno
          nuevo, actualizaremos esta página.
        </p>
      </>
    ),
  },
  {
    id: 'donde',
    title: 'Dónde se guardan',
    content: (
      <p>
        Tu cuenta y tu biblioteca se guardan en un servidor propio ubicado en Chile, que
        administramos nosotros, en una base de datos a la que no se puede acceder directamente
        desde internet. Algunos de los
        servicios de la sección anterior funcionan fuera de Chile, así que los datos que les
        llegan pueden tratarse en otros países.
      </p>
    ),
  },
  {
    id: 'conservacion',
    title: 'Cuánto tiempo los guardamos',
    content: (
      <>
        <ul>
          <li>
            <strong>Tu cuenta y tu biblioteca:</strong> mientras tengas la cuenta.
          </li>
          <li>
            <strong>Una lectura que borras</strong> se elimina al instante, junto con sus sesiones
            de lectura y sus «me gusta».
          </li>
          <li>
            <strong>Credenciales de sesión:</strong> la de acceso vence a los 30 minutos y la que
            la renueva, a los 60 días sin uso. Al cerrar sesión, renovarla o crear una
            contraseña nueva, la credencial anterior deja de servir de inmediato. Sus registros
            (solo resúmenes cifrados) se borran en tareas de mantenimiento; las que se
            reemplazaron al renovar la sesión se conservan al menos 30 días, para poder detectar
            si alguien intenta reutilizar una robada.
          </li>
          <li>
            <strong>Códigos de recuperación:</strong> valen 15 minutos y admiten 5 intentos. Su
            registro (solo el resumen cifrado, nunca el código) queda asociado a tu cuenta hasta
            que la eliminas.
          </li>
          <li>
            <strong>Dirección IP para limitar intentos:</strong> solo en la memoria del servidor,
            como máximo una hora.
          </li>
          <li>
            <strong>Registros técnicos:</strong> el registro de acceso del servidor de entrada
            (con tu IP) se renueva cada semana y se conservan las últimas cuatro semanas, así que
            cada anotación dura unas cinco semanas como máximo. El registro de la aplicación (sin
            IP) se borra cada vez que actualizamos el servidor de la aplicación; no tiene un plazo
            fijo.
          </li>
          <li>
            <strong>Búsquedas:</strong> el servidor guarda en memoria los resultados de cada
            búsqueda durante 10 minutos, sin asociarlos a ninguna cuenta, para responder más
            rápido.
          </li>
          <li>
            <strong>Datos en tu teléfono:</strong> hasta que cierras sesión o desinstalas la app
            (ver la <a href="#datos">sección 3</a>).
          </li>
        </ul>
        <p>
          <strong>Si eliminas tu cuenta</strong>, borramos tu cuenta y todo lo asociado a ella:
          lecturas, reseñas, sesiones de lectura, metas, «me gusta», credenciales de sesión y
          códigos de recuperación. Puede quedar una copia en respaldos puntuales guardados en el
          mismo servidor, que solo usamos para recuperar el servicio ante un fallo y que borramos
          cuando dejan de ser necesarios. El catálogo de libros se mantiene porque es
          compartido y no contiene datos tuyos.
        </p>
      </>
    ),
  },
  {
    id: 'derechos',
    title: 'Tus derechos y cómo ejercerlos',
    content: (
      <>
        <p>Sobre tus datos personales tienes derecho a:</p>
        <ul>
          <li><strong>Acceso:</strong> saber qué datos tenemos de ti y pedir una copia.</li>
          <li><strong>Rectificación:</strong> corregir datos inexactos.</li>
          <li><strong>Supresión:</strong> que borremos tus datos o tu cuenta completa.</li>
          <li><strong>Oposición:</strong> que dejemos de usar tus datos para un fin concreto.</li>
          <li><strong>Portabilidad:</strong> recibir tu biblioteca en un formato que puedas llevarte.</li>
          <li><strong>Bloqueo:</strong> que suspendamos temporalmente el uso de tus datos mientras se resuelve una solicitud.</li>
        </ul>
        <p>
          Muchas cosas puedes hacerlas tú desde la app: ver, editar y borrar cada lectura, hacerla
          privada y cambiar la visibilidad de tu perfil y tus estadísticas. Para todo lo demás,
          incluido <strong>eliminar tu cuenta</strong>, escríbenos a <MailLink />{' '}
          <strong>desde el correo de tu cuenta</strong> (así comprobamos que eres tú) e indica tu
          nombre de usuario. Es gratis y te responderemos dentro de los plazos que fija la ley.
        </p>
        <p>
          Si no quedas conforme con nuestra respuesta, puedes reclamar ante la autoridad de
          protección de datos personales o ante los tribunales de Chile.
        </p>
      </>
    ),
  },
  {
    id: 'seguridad',
    title: 'Cómo protegemos tus datos',
    content: (
      <>
        <ul>
          <li>La app y esta web se comunican solo por conexiones cifradas (HTTPS).</li>
          <li>Las contraseñas se guardan con bcrypt; las credenciales de sesión y los códigos, solo como resúmenes cifrados.</li>
          <li>En tu teléfono, las credenciales van en el almacenamiento cifrado de Android.</li>
          <li>
            Si alguien reutiliza una credencial de sesión robada, cerramos esa sesión; y al crear
            una contraseña nueva se cierran las sesiones de todos tus dispositivos.
          </li>
          <li>
            Limitamos los intentos de inicio de sesión y de recuperación. Al iniciar sesión o
            pedir un código de recuperación, no revelamos si un correo tiene cuenta en LectorApp.
          </li>
        </ul>
        <p>
          Ningún sistema es infalible. Si ocurriera un incidente que afecte tus datos, te
          avisaremos, y también a la autoridad cuando la ley lo exija.
        </p>
      </>
    ),
  },
  {
    id: 'menores',
    title: 'Menores de edad',
    content: (
      <p>
        LectorApp es para personas de <strong>13 años o más</strong>. Si eres menor de edad,
        necesitas el permiso de tu madre, padre o tutor. Si sabemos que una persona menor de 13
        años creó una cuenta, la eliminaremos. Si eres madre, padre o tutor y crees que eso pasó,
        escríbenos a <MailLink />.
      </p>
    ),
  },
  {
    id: 'cambios',
    title: 'Cambios en esta política',
    content: (
      <p>
        La versión y la fecha de arriba indican cuándo cambió esta política por última vez. Si
        cambiamos algo importante (por ejemplo, un dato nuevo que se recoge o un servicio nuevo
        que lo recibe), te avisaremos en la app o por correo antes de que se aplique.
      </p>
    ),
  },
  {
    id: 'contacto',
    title: 'Contacto',
    content: (
      <p>
        Para cualquier pregunta o solicitud sobre tus datos, escríbenos a <MailLink />. Más
        detalles en la página de <a href="/contacto">contacto</a>.
      </p>
    ),
  },
];

export function PrivacyPage() {
  return (
    <LegalPage
      title="Política de privacidad"
      intro={
        <>
          <p className="lead">
            Qué datos recoge LectorApp, para qué, con quién se comparten y cómo puedes decidir
            sobre ellos.
          </p>
          <p>
            Las reglas de uso del servicio están en los{' '}
            <a href="/terminos">Términos y condiciones</a>.
          </p>
        </>
      }
      sections={SECTIONS}
    />
  );
}
