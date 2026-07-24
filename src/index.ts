/*!
 * NiceAlert
 * Librería de alertas tipo SweetAlert, con diseño moderno (glassmorphism).
 * Uso: NiceAlert.fire({...}) o NiceAlert.success('Título', 'Texto')
 * Requiere: nice-alert.css (o el import './nice-alert.css' si usas un bundler)
 */
import type {
  NiceAlertIcon,
  NiceAlertOptions,
  NiceAlertResult,
} from './types';

export * from './types';

const ICONS: Record<NiceAlertIcon, string> = {
  success: `<svg viewBox="0 0 52 52"><circle class="na-icon-circle" cx="26" cy="26" r="24"/><path class="na-icon-check" d="M14 27l7 7 17-17"/></svg>`,
  error: `<svg viewBox="0 0 52 52"><circle class="na-icon-circle" cx="26" cy="26" r="24"/><path class="na-icon-x" d="M16 16l20 20M36 16l-20 20"/></svg>`,
  warning: `<svg viewBox="0 0 52 52"><circle class="na-icon-circle" cx="26" cy="26" r="24"/><line class="na-icon-line" x1="26" y1="14" x2="26" y2="30"/><circle class="na-icon-dot" cx="26" cy="38" r="1.6"/></svg>`,
  info: `<svg viewBox="0 0 52 52"><circle class="na-icon-circle" cx="26" cy="26" r="24"/><line class="na-icon-line" x1="26" y1="22" x2="26" y2="36"/><circle class="na-icon-dot" cx="26" cy="15" r="1.6"/></svg>`,
  question: `<svg viewBox="0 0 52 52"><circle class="na-icon-circle" cx="26" cy="26" r="24"/><path class="na-icon-q" d="M20 20a6 6 0 1 1 8 5.6c-1.5.8-2 1.6-2 3.4" /><circle class="na-icon-dot" cx="26" cy="36" r="1.6"/></svg>`,
};

const DEFAULT_OPTIONS: Required<Omit<NiceAlertOptions, 'inputValidator'>> &
  Pick<NiceAlertOptions, 'inputValidator'> = {
  title: '',
  text: '',
  html: null,
  icon: null,
  iconHtml: null,
  toast: false,
  position: 'center',
  showConfirmButton: true,
  showCancelButton: false,
  showDenyButton: false,
  confirmButtonText: 'Aceptar',
  cancelButtonText: 'Cancelar',
  denyButtonText: 'No',
  confirmButtonColor: null,
  cancelButtonColor: null,
  denyButtonColor: null,
  allowOutsideClick: true,
  allowEscapeKey: true,
  showCloseButton: false,
  timer: null,
  timerProgressBar: false,
  input: null,
  inputPlaceholder: '',
  inputValue: '',
  inputOptions: null,
  inputValidator: null,
  footer: null,
  width: null,
  backdrop: true,
  reverseButtons: false,
  customClass: {},
};

let zIndexBase = 20260;
let currentInstance: NiceAlertInstance | null = null;
let styleInjected = false;

function assertDom(): void {
  if (typeof document === 'undefined') {
    throw new Error(
      'NiceAlert: this library requires a DOM environment (browser). ' +
      'It cannot run in Node.js / SSR contexts.'
    );
  }
}

function injectFontCheck(): void {
  if (styleInjected) return;
  styleInjected = true;
  if (
    !document.querySelector('link[href*="nice-alert.css"]') &&
    !document.getElementById('na-inline-warning')
  ) {
    // solo aviso en consola, no bloqueante
    // eslint-disable-next-line no-console
    console.info(
      '%cNiceAlert:%c recuerda incluir nice-alert.css en tu proyecto.',
      'color:#7c5cff;font-weight:bold',
      'color:inherit'
    );
  }
}

function createEl<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string | null,
  html?: string
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (html !== undefined) el.innerHTML = html;
  return el;
}

class NiceAlertInstance {
  options: Required<Omit<NiceAlertOptions, 'inputValidator'>> &
    Pick<NiceAlertOptions, 'inputValidator'>;
  overlay!: HTMLDivElement;
  popup!: HTMLDivElement;
  inputEl: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null = null;
  errorEl?: HTMLDivElement;
  progressBar?: HTMLDivElement;

  private _resolve: ((result: NiceAlertResult) => void) | null = null;
  private _timerInterval: ReturnType<typeof setTimeout> | null = null;
  private _closed = false;
  private _firstButton: HTMLButtonElement | undefined;
  private _onKeydown: ((e: KeyboardEvent) => void) | null = null;

  constructor(options: NiceAlertOptions) {
    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
    this.build();
  }

  private build(): void {
    injectFontCheck();

    const opt = this.options;
    const isToast = !!opt.toast;

    this.overlay = createEl(
      'div',
      'na-overlay' + (isToast ? ' na-overlay--toast' : '')
    );
    if (!opt.backdrop && !isToast) this.overlay.classList.add('na-overlay--no-backdrop');

    this.popup = createEl(
      'div',
      'na-popup' + (isToast ? ' na-popup--toast' : '') + ` na-pos-${opt.position}`
    );
    if (opt.width) this.popup.style.width = typeof opt.width === 'number' ? opt.width + 'px' : opt.width;
    if (opt.customClass?.popup) this.popup.classList.add(opt.customClass.popup);

    // Close button
    if (opt.showCloseButton) {
      const closeBtn = createEl('button', 'na-close', '&times;');
      closeBtn.setAttribute('aria-label', 'Cerrar');
      closeBtn.addEventListener('click', () => this.close({ isDismissed: true, dismiss: 'close' }));
      this.popup.appendChild(closeBtn);
    }

    // Icon
    if (opt.icon || opt.iconHtml) {
      const iconWrap = createEl('div', `na-icon na-icon--${opt.icon || 'custom'}`);
      iconWrap.innerHTML = opt.iconHtml || (opt.icon ? ICONS[opt.icon] : '') || '';
      this.popup.appendChild(iconWrap);
    }

    // Title
    if (opt.title) {
      this.popup.appendChild(createEl('h2', 'na-title', opt.title));
    }

    // Text / HTML content
    if (opt.html) {
      this.popup.appendChild(createEl('div', 'na-html', opt.html));
    } else if (opt.text) {
      this.popup.appendChild(createEl('p', 'na-text', opt.text));
    }

    // Input
    this.inputEl = null;
    if (opt.input) {
      const wrap = createEl('div', 'na-input-wrap');

      if (opt.input === 'textarea') {
        const el = createEl('textarea', 'na-input na-textarea');
        el.placeholder = opt.inputPlaceholder;
        el.value = (opt.inputValue as string) || '';
        this.inputEl = el;
        wrap.appendChild(el);
        this.popup.appendChild(wrap);
      } else if (opt.input === 'select') {
        const el = createEl('select', 'na-input na-select');
        const options = opt.inputOptions || {};
        Object.keys(options).forEach((val) => {
          const o = createEl('option', null, options[val]);
          o.value = val;
          el.appendChild(o);
        });
        this.inputEl = el;
        wrap.appendChild(el);
        this.popup.appendChild(wrap);
      } else if (opt.input === 'checkbox') {
        const label = createEl('label', 'na-checkbox-label');
        const el = createEl('input', 'na-checkbox');
        el.type = 'checkbox';
        el.checked = !!opt.inputValue;
        this.inputEl = el;
        label.appendChild(el);
        label.appendChild(document.createTextNode(' ' + (opt.inputPlaceholder || '')));
        wrap.appendChild(label);
        this.popup.appendChild(wrap);
      } else {
        // text, email, password, number, tel, url, etc.
        const el = createEl('input', 'na-input');
        el.type = opt.input;
        el.placeholder = opt.inputPlaceholder;
        el.value = (opt.inputValue as string) || '';
        this.inputEl = el;
        wrap.appendChild(el);
        this.popup.appendChild(wrap);
      }

      this.errorEl = createEl('div', 'na-input-error');
      this.popup.appendChild(this.errorEl);

      setTimeout(() => this.inputEl && this.inputEl.focus(), 150);
    }

    // Timer progress bar
    if (opt.timer && opt.timerProgressBar) {
      this.progressBar = createEl('div', 'na-timer-bar-wrap', '<div class="na-timer-bar"></div>');
      this.popup.appendChild(this.progressBar);
    }

    // Footer
    if (opt.footer) {
      this.popup.appendChild(createEl('div', 'na-footer', opt.footer));
    }

    // Buttons
    if (opt.showConfirmButton || opt.showDenyButton || opt.showCancelButton) {
      const actions = createEl('div', 'na-actions');
      const buttons: HTMLButtonElement[] = [];

      if (opt.showConfirmButton) {
        const b = createEl('button', 'na-btn na-btn-confirm', opt.confirmButtonText);
        if (opt.confirmButtonColor) b.style.background = opt.confirmButtonColor;
        b.addEventListener('click', () => this.handleConfirm());
        buttons.push(b);
      }
      if (opt.showDenyButton) {
        const b = createEl('button', 'na-btn na-btn-deny', opt.denyButtonText);
        if (opt.denyButtonColor) b.style.background = opt.denyButtonColor;
        b.addEventListener('click', () => this.close({ isDenied: true }));
        buttons.push(b);
      }
      if (opt.showCancelButton) {
        const b = createEl('button', 'na-btn na-btn-cancel', opt.cancelButtonText);
        if (opt.cancelButtonColor) b.style.background = opt.cancelButtonColor;
        b.addEventListener('click', () => this.close({ isDismissed: true, dismiss: 'cancel' }));
        buttons.push(b);
      }

      if (opt.reverseButtons) buttons.reverse();
      buttons.forEach((b) => actions.appendChild(b));
      this.popup.appendChild(actions);
      this._firstButton = buttons[0];
    }

    this.overlay.appendChild(this.popup);
    this.overlay.style.zIndex = String(zIndexBase++);
  }

  private handleConfirm(): void {
    const opt = this.options;
    let value: string | boolean = true;
    if (opt.input) {
      if (opt.input === 'checkbox') {
        value = (this.inputEl as HTMLInputElement).checked;
      } else {
        value = (this.inputEl as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value;
      }

      if (opt.inputValidator) {
        const err = opt.inputValidator(value);
        if (err) {
          if (this.errorEl) {
            this.errorEl.textContent = err;
            this.errorEl.classList.add('na-input-error--show');
          }
          this.inputEl?.classList.add('na-input--error');
          return;
        }
      }
    }
    this.close({ isConfirmed: true, value });
  }

  open(): Promise<NiceAlertResult> {
    document.body.appendChild(this.overlay);
    document.body.classList.add('na-lock-scroll');
    requestAnimationFrame(() => {
      this.overlay.classList.add('na-overlay--show');
      this.popup.classList.add('na-popup--show');
    });

    if (this.options.allowOutsideClick) {
      this.overlay.addEventListener('mousedown', (e) => {
        if (e.target === this.overlay) this.close({ isDismissed: true, dismiss: 'backdrop' });
      });
    }

    this._onKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && this.options.allowEscapeKey) {
        this.close({ isDismissed: true, dismiss: 'esc' });
      }
      if (e.key === 'Enter' && this.options.input !== 'textarea' && this.options.showConfirmButton) {
        this.handleConfirm();
      }
    };
    document.addEventListener('keydown', this._onKeydown);

    if (this._firstButton) this._firstButton.focus();

    if (this.options.timer) {
      this.startTimer();
    }

    currentInstance = this;

    return new Promise<NiceAlertResult>((resolve) => {
      this._resolve = resolve;
    });
  }

  private startTimer(): void {
    const total = this.options.timer as number;
    if (this.progressBar) {
      const bar = this.progressBar.querySelector('.na-timer-bar') as HTMLDivElement;
      bar.style.transition = `width ${total}ms linear`;
      requestAnimationFrame(() => {
        bar.style.width = '0%';
      });
    }
    this._timerInterval = setTimeout(() => {
      this.close({ isDismissed: true, dismiss: 'timer' });
    }, total);
  }

  close(result: Partial<NiceAlertResult>): void {
    if (this._closed) return;
    this._closed = true;

    if (this._timerInterval) clearTimeout(this._timerInterval);
    if (this._onKeydown) document.removeEventListener('keydown', this._onKeydown);

    this.overlay.classList.remove('na-overlay--show');
    this.popup.classList.remove('na-popup--show');
    this.popup.classList.add('na-popup--hide');

    setTimeout(() => {
      if (this.overlay.parentNode) this.overlay.parentNode.removeChild(this.overlay);
      document.body.classList.remove('na-lock-scroll');
      if (currentInstance === this) currentInstance = null;
      if (this._resolve) {
        this._resolve(
          Object.assign(
            {
              isConfirmed: false,
              isDenied: false,
              isDismissed: false,
              value: undefined,
            },
            result
          ) as NiceAlertResult
        );
      }
    }, 220);
  }
}

export const NiceAlert = {
  fire<T = unknown>(options?: NiceAlertOptions | string): Promise<NiceAlertResult<T>> {
    assertDom();
    if (typeof options === 'string') {
      options = { title: options };
    }
    const instance = new NiceAlertInstance(options || {});
    return instance.open() as Promise<NiceAlertResult<T>>;
  },
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
    if (currentInstance) currentInstance.close(result || { isDismissed: true });
  },
};

export default NiceAlert;

// Adjunta a `window` automáticamente cuando se carga vía <script> (build UMD/IIFE).
// En entornos con bundler (ESM/CJS) esto es un no-op seguro.
if (typeof window !== 'undefined') {
  (window as typeof window & { NiceAlert?: typeof NiceAlert }).NiceAlert = NiceAlert;
}
