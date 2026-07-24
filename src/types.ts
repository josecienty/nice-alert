export type NiceAlertIcon = 'success' | 'error' | 'warning' | 'info' | 'question';

export type NiceAlertPosition =
  | 'center'
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end';

export type NiceAlertInputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'textarea'
  | 'checkbox'
  | 'select';

export interface NiceAlertCustomClass {
  popup?: string;
}

export interface NiceAlertOptions {
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

export type NiceAlertDismissReason =
  | 'backdrop'
  | 'cancel'
  | 'close'
  | 'esc'
  | 'timer';

export interface NiceAlertResult<T = unknown> {
  isConfirmed: boolean;
  isDenied: boolean;
  isDismissed: boolean;
  dismiss?: NiceAlertDismissReason;
  value?: T;
}
