/*!
 * NiceAlert
 * Librería de alertas, con diseño moderno (glassmorphism).
 * Uso: NiceAlert.fire({...}) o NiceAlert.success('Título''Texto')
 * Requiere: nice-alert.css (o el import './nice-alert.css' si usas un bundler)
 * Desarrollado por José Argüello (https://github.com/josecienty)
 */
import { assertDom } from './ts/functions';
import { getCurrentInstance } from './ts/instance-store';
import { NiceAlertInstance } from './ts/nice-alert-instance';
import type {
  NiceAlertIcon,
  NiceAlertOptions,
  NiceAlertResult
} from './types';

export * from './types';


/**
 * Iniciar NiceAlert
 * 
 * Proporciona métodos estáticos para crear, mostrar y controlar alertas,
 * incluyendo variantes preconfiguradas como success, error, warning, info,
 * confirmaciones y notificaciones tipo toast.
 */
export const NiceAlert = {
  /**
  * Crea y abre una nueva instancia de alerta.
  *
  * Acepta una configuración completa o simplemente un texto como título.
  * Retorna una promesa que se resuelve con el resultado de la interacción
  * del usuario.
  */
  fire<T = unknown>(options?: NiceAlertOptions | string): Promise<NiceAlertResult<T>> {
    assertDom();
    if (typeof options === 'string') {
      options = { title: options };
    }
    const instance = new NiceAlertInstance(options || {});
    return instance.open() as Promise<NiceAlertResult<T>>;
  },

  /**
   * Muestra una alerta de tipo éxito.
   *
   * Utiliza el icono "success" y está pensada para confirmar operaciones
   * completadas correctamente.
   */
  success(title?: string, text?: string) {
    return this.fire({ icon: 'success', title, text });
  },
  error(title?: string, text?: string) {
    return this.fire({ icon: 'error', title, text });
  },
  warning(title?: string, text?: string) {
    return this.fire({ icon: 'warning', title, text });
  },
  info(title?: string, text?: string) {
    return this.fire({ icon: 'info', title, text });
  },
  question(title?: string, text?: string) {
    return this.fire({ icon: 'question', title, text });
  },
  confirm(title?: string, text?: string, options?: NiceAlertOptions) {
    return this.fire(
      Object.assign(
        {
          icon: 'question' as NiceAlertIcon,
          title,
          text,
          showCancelButton: true,
        },
        options
      )
    );
  },
  toast(options?: NiceAlertOptions | string) {
    if (typeof options === 'string') options = { title: options, icon: 'info' };
    return this.fire(
      Object.assign(
        {
          toast: true,
          position: 'top-end' as const,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        },
        options
      )
    );
  },
  close(result?: Partial<NiceAlertResult>) {
    const currentInstance = getCurrentInstance();
    if (currentInstance) currentInstance.close(result || { isDismissed: true });
  },
};

export default NiceAlert;

// Adjunta a `window` automáticamente cuando se carga vía <script> (build UMD/IIFE).
// En entornos con bundler (ESM/CJS) esto es un no-op seguro.
if (typeof window !== 'undefined') {
  (window as typeof window & { NiceAlert?: typeof NiceAlert }).NiceAlert = NiceAlert;
}
