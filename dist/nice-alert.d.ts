type NiceAlertIcon = 'success' | 'error' | 'warning' | 'info' | 'question';
type NiceAlertPosition = 'center' | 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end';
type NiceAlertInputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea' | 'checkbox' | 'select';
interface NiceAlertCustomClass {
    popup?: string;
}
interface NiceAlertOptions {
    title?: string;
    text?: string;
    html?: string | null;
    icon?: NiceAlertIcon | null;
    iconHtml?: string | null;
    toast?: boolean;
    position?: NiceAlertPosition;
    showConfirmButton?: boolean;
    showCancelButton?: boolean;
    showDenyButton?: boolean;
    confirmButtonText?: string;
    cancelButtonText?: string;
    denyButtonText?: string;
    confirmButtonColor?: string | null;
    cancelButtonColor?: string | null;
    denyButtonColor?: string | null;
    allowOutsideClick?: boolean;
    allowEscapeKey?: boolean;
    showCloseButton?: boolean;
    timer?: number | null;
    timerProgressBar?: boolean;
    input?: NiceAlertInputType | null;
    inputPlaceholder?: string;
    inputValue?: string | boolean;
    inputOptions?: Record<string, string> | null;
    inputValidator?: ((value: string | boolean) => string | null | undefined) | null;
    footer?: string | null;
    width?: number | string | null;
    backdrop?: boolean;
    reverseButtons?: boolean;
    customClass?: NiceAlertCustomClass;
}
type NiceAlertDismissReason = 'backdrop' | 'cancel' | 'close' | 'esc' | 'timer';
interface NiceAlertResult<T = unknown> {
    isConfirmed: boolean;
    isDenied: boolean;
    isDismissed: boolean;
    dismiss?: NiceAlertDismissReason;
    value?: T;
}

/*!
 * NiceAlert
 * Librería de alertas tipo SweetAlert, con diseño moderno (glassmorphism).
 * Uso: NiceAlert.fire({...}) o NiceAlert.success('Título', 'Texto')
 * Requiere: nice-alert.css (o el import './nice-alert.css' si usas un bundler)
 */

declare const NiceAlert: {
    fire<T = unknown>(options?: NiceAlertOptions | string): Promise<NiceAlertResult<T>>;
    success(title?: string, text?: string): Promise<NiceAlertResult<unknown>>;
    error(title?: string, text?: string): Promise<NiceAlertResult<unknown>>;
    warning(title?: string, text?: string): Promise<NiceAlertResult<unknown>>;
    info(title?: string, text?: string): Promise<NiceAlertResult<unknown>>;
    question(title?: string, text?: string): Promise<NiceAlertResult<unknown>>;
    confirm(title?: string, text?: string, options?: NiceAlertOptions): Promise<NiceAlertResult<unknown>>;
    toast(options?: NiceAlertOptions | string): Promise<NiceAlertResult<unknown>>;
    close(result?: Partial<NiceAlertResult>): void;
};

export { NiceAlert, type NiceAlertCustomClass, type NiceAlertDismissReason, type NiceAlertIcon, type NiceAlertInputType, type NiceAlertOptions, type NiceAlertPosition, type NiceAlertResult, NiceAlert as default };
