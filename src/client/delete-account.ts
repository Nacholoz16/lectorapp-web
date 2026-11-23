/**
 * Script de /eliminar-cuenta (tarea 2.3). Es el ÚNICO JavaScript que llega al navegador en esta
 * web: un módulo propio servido desde /assets (CSP `script-src 'self'`), sin nada inline.
 *
 * Paso 1: correo → POST /account/deletion-request (la API responde igual exista o no la cuenta).
 * Paso 2: código + casilla "Entiendo…" → POST /account/deletion-confirm.
 * Paso 3: hecho.
 *
 * Accesibilidad: cada error se muestra junto a su campo (aria-invalid + aria-describedby) y se le
 * da el foco; al cambiar de paso, el foco va al título del paso nuevo; los avisos de estado van a
 * una región `role="status"`. Mientras se envía, el botón se deshabilita y lo dice.
 *
 * Privacidad: sin cookies (credentials: 'omit'), sin almacenamiento local; el correo y el código
 * solo viajan a la API por HTTPS.
 */
import { SITE } from '../site';

const REQUEST_TIMEOUT_MS = 15_000;
const CODE_PATTERN = /^\d{6}$/;
// La API envía como máximo un código por minuto por cuenta: antes de eso, "otro código" no saldría.
const RESEND_COOLDOWN_MS = 60_000;
const RESEND_LABEL = 'Enviarme otro código';
const RESEND_WAIT_LABEL = 'Podrás pedir otro código en un minuto';

const MESSAGES = {
  emailMissing: 'Escribe el correo de tu cuenta.',
  emailInvalid: 'Revisa el correo: parece que le falta algo (por ejemplo, la @).',
  codeInvalid: 'El código tiene 6 dígitos.',
  confirmMissing: 'Marca la casilla para confirmar que entiendes que no se puede deshacer.',
  network: 'No pudimos conectar con LectorApp. Revisa tu conexión e inténtalo de nuevo.',
  generic: 'Algo salió mal de nuestro lado. Inténtalo de nuevo en unos minutos.',
  resent: 'Si el correo tiene una cuenta, te enviamos un código nuevo. Usa siempre el último que te llegue.',
} as const;

type ApiResult =
  | { ok: true; body: unknown }
  | { ok: false; status: number; message: string };

/** Lee `{ error }` de una respuesta de la API sin confiar en su forma. */
function errorMessageOf(body: unknown): string | null {
  if (typeof body === 'object' && body !== null && 'error' in body) {
    const { error } = body;
    if (typeof error === 'string' && error.trim() !== '') return error;
  }
  return null;
}

async function postJson(path: string, payload: Record<string, string>): Promise<ApiResult> {
  let response: Response;
  try {
    response = await fetch(`${SITE.apiBase}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'omit',
      cache: 'no-store',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch {
    // Sin red, tiempo agotado o bloqueado (CORS/CSP): para la persona es lo mismo.
    return { ok: false, status: 0, message: MESSAGES.network };
  }

  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    // Un 502 de un proxy llega en HTML: se trata como error genérico.
  }
  if (response.ok) return { ok: true, body };
  // Los mensajes 4xx de la API están en español y pensados para la persona; los 5xx no.
  const apiMessage = response.status < 500 ? errorMessageOf(body) : null;
  return { ok: false, status: response.status, message: apiMessage ?? MESSAGES.generic };
}

function byId<T extends HTMLElement>(id: string, type: new () => T): T {
  const element = document.getElementById(id);
  if (!(element instanceof type)) throw new Error(`Falta #${id} en /eliminar-cuenta`);
  return element;
}

function init(): void {
  const status = byId('estado', HTMLElement);
  const steps = {
    email: byId('paso-email', HTMLElement),
    code: byId('paso-codigo', HTMLElement),
    done: byId('paso-hecho', HTMLElement),
  };
  const titles = {
    email: byId('titulo-paso-email', HTMLElement),
    code: byId('titulo-paso-codigo', HTMLElement),
    done: byId('titulo-paso-hecho', HTMLElement),
  };
  const emailForm = byId('form-email', HTMLFormElement);
  const emailFieldset = byId('fieldset-email', HTMLFieldSetElement);
  const emailInput = byId('email', HTMLInputElement);
  const emailError = byId('email-error', HTMLElement);
  const emailButton = byId('boton-email', HTMLButtonElement);
  const sentTo = byId('email-enviado', HTMLElement);
  const codeForm = byId('form-codigo', HTMLFormElement);
  const codeInput = byId('codigo', HTMLInputElement);
  const codeError = byId('codigo-error', HTMLElement);
  const confirmBox = byId('entiendo', HTMLInputElement);
  const confirmError = byId('entiendo-error', HTMLElement);
  const codeButton = byId('boton-codigo', HTMLButtonElement);
  const resendButton = byId('boton-reenviar', HTMLButtonElement);
  const otherEmailButton = byId('boton-otro-email', HTMLButtonElement);

  /** Correo ya normalizado con el que se pidió el código (lo usa el paso 2). */
  let email = '';
  let busy = false;
  let resendTimer: number | undefined;

  /** Tras cada envío, "Enviarme otro código" espera el minuto que la API exige entre códigos. */
  const startResendCooldown = (): void => {
    window.clearTimeout(resendTimer);
    resendButton.disabled = true;
    resendButton.textContent = RESEND_WAIT_LABEL;
    resendTimer = window.setTimeout(() => {
      resendTimer = undefined;
      resendButton.disabled = busy;
      resendButton.textContent = RESEND_LABEL;
    }, RESEND_COOLDOWN_MS);
  };

  const announce = (message: string): void => {
    // Vaciar antes de escribir: así el lector de pantalla repite un aviso idéntico al anterior.
    status.textContent = '';
    window.setTimeout(() => {
      status.textContent = message;
    }, 50);
  };

  const setFieldError = (input: HTMLInputElement, errorEl: HTMLElement, message: string | null): void => {
    const helpId = input.getAttribute('aria-describedby')?.split(' ')[0] ?? '';
    if (message === null) {
      errorEl.hidden = true;
      errorEl.textContent = '';
      input.removeAttribute('aria-invalid');
      input.setAttribute('aria-describedby', helpId);
      return;
    }
    errorEl.textContent = message;
    errorEl.hidden = false;
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', `${helpId} ${errorEl.id}`.trim());
    input.focus();
  };

  const showStep = (step: keyof typeof steps): void => {
    for (const [name, element] of Object.entries(steps)) element.hidden = name !== step;
    status.textContent = '';
    titles[step].focus();
  };

  /**
   * Deshabilita el botón durante el envío y cambia su texto (el lector lo anuncia con aria-busy).
   * Los botones secundarios también se deshabilitan: no se puede cambiar de correo ni pedir otro
   * código con una petición en curso.
   */
  const withBusy = async (button: HTMLButtonElement, busyLabel: string, work: () => Promise<void>): Promise<void> => {
    if (busy) return;
    busy = true;
    const label = button.textContent;
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    button.textContent = busyLabel;
    otherEmailButton.disabled = true;
    resendButton.disabled = true;
    try {
      await work();
    } finally {
      busy = false;
      button.removeAttribute('aria-busy');
      button.textContent = label;
      button.disabled = false;
      otherEmailButton.disabled = false;
      resendButton.disabled = resendTimer !== undefined;
    }
  };

  const requestCode = (): Promise<ApiResult> => postJson('/account/deletion-request', { email });

  // --- Paso 1 ---
  emailForm.addEventListener('submit', (event) => {
    event.preventDefault();
    // Misma normalización que la API (trim + minúsculas): así el paso 2 usa exactamente el mismo.
    const value = emailInput.value.trim().toLowerCase();
    if (value === '') {
      setFieldError(emailInput, emailError, MESSAGES.emailMissing);
      return;
    }
    emailInput.value = value;
    if (!emailInput.checkValidity()) {
      setFieldError(emailInput, emailError, MESSAGES.emailInvalid);
      return;
    }
    setFieldError(emailInput, emailError, null);

    let sent = false;
    void withBusy(emailButton, 'Enviando…', async () => {
      email = value;
      const result = await requestCode();
      if (!result.ok) {
        setFieldError(emailInput, emailError, result.message);
        return;
      }
      sent = true;
    }).then(() => {
      if (!sent) return;
      startResendCooldown();
      sentTo.textContent = email;
      codeInput.value = '';
      confirmBox.checked = false;
      setFieldError(codeInput, codeError, null);
      confirmError.hidden = true;
      showStep('code');
    });
  });

  // --- Paso 2 ---
  codeForm.addEventListener('submit', (event) => {
    event.preventDefault();
    // Quien pega el código desde el correo puede arrastrar espacios ("123 456").
    const code = codeInput.value.replace(/\s+/g, '');
    if (!CODE_PATTERN.test(code)) {
      setFieldError(codeInput, codeError, MESSAGES.codeInvalid);
      return;
    }
    codeInput.value = code;
    setFieldError(codeInput, codeError, null);
    if (!confirmBox.checked) {
      confirmError.textContent = MESSAGES.confirmMissing;
      confirmError.hidden = false;
      confirmBox.setAttribute('aria-invalid', 'true');
      confirmBox.setAttribute('aria-describedby', confirmError.id);
      confirmBox.focus();
      return;
    }

    void withBusy(codeButton, 'Eliminando tu cuenta…', async () => {
      const result = await postJson('/account/deletion-confirm', { email, code });
      if (result.ok) {
        showStep('done');
        return;
      }
      // 400: código inválido o vencido (mensaje genérico de la API); 429: demasiados intentos.
      setFieldError(codeInput, codeError, result.message);
    });
  });

  confirmBox.addEventListener('change', () => {
    if (confirmBox.checked) {
      confirmError.hidden = true;
      confirmBox.removeAttribute('aria-invalid');
      confirmBox.removeAttribute('aria-describedby');
    }
  });

  resendButton.addEventListener('click', () => {
    let sent = false;
    void withBusy(resendButton, 'Enviando…', async () => {
      const result = await requestCode();
      setFieldError(codeInput, codeError, null);
      if (result.ok) {
        sent = true;
        codeInput.value = '';
        announce(MESSAGES.resent);
      } else {
        announce(result.message);
      }
    }).then(() => {
      if (sent) startResendCooldown();
      // El botón quedó deshabilitado mientras tenía el foco: se lleva al campo del código.
      codeInput.focus();
    });
  });

  otherEmailButton.addEventListener('click', () => {
    if (busy) return;
    setFieldError(emailInput, emailError, null);
    showStep('email');
    emailInput.focus();
    emailInput.select();
  });

  // Listo: el formulario llega deshabilitado en el HTML (sin JS no se puede usar).
  emailFieldset.disabled = false;
}

init();
