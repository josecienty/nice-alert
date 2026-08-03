import { DEFAULT_OPTIONS } from "../data/default-options";
import { ICONS } from "../data/icons";
import { NiceAlertOptions, NiceAlertResult } from "../types";
import { createEl, injectFontCheck } from "./functions";
import { getCurrentInstance, setCurrentInstance } from "./instance-store";

let zIndexBase = 20260;

export class NiceAlertInstance {
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

    /**
 * Construye y configura los elementos del DOM necesarios para la alerta.
 *
 * Crea el overlay, el popup, los botones, los campos de entrada y
 * demás componentes visuales según las opciones definidas en la instancia.
 *
 * @private
 * @returns {void}
 */
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

    /**
   * Maneja la confirmación de la alerta.
   */
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

    /**
   * Muestra la alerta en el DOM y devuelve una promesa con el resultado
   * de la interacción del usuario.
   *
   * @returns {Promise<NiceAlertResult>} Resultado de la alerta.
   */
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

        setCurrentInstance(this);

        return new Promise<NiceAlertResult>((resolve) => {
            this._resolve = resolve;
        });
    }

    /**
   * Inicia el temporizador de cierre automático de la alerta.
   *
   * Si la barra de progreso está habilitada, reinicia su estado visual,
   * fuerza un reflow para garantizar que el navegador aplique correctamente
   * los estilos iniciales y, posteriormente, anima su ancho desde `100%`
   * hasta `0%` durante el tiempo configurado.
   *
   * Al finalizar el temporizador, la alerta se cierra automáticamente
   * con el motivo de descarte `"timer"`.
   *
   * @private
   * @returns {void}
   */
    private startTimer(): void {
        const total = this.options.timer as number;
        if (this.progressBar) {
            const bar = this.progressBar.querySelector('.na-timer-bar') as HTMLDivElement;

            // Estados iniciales
            bar.style.width = '100%';
            bar.style.transition = 'none';

            // Forzar reflow
            void bar.offsetWidth;

            // Reiniciar el estado visual de la barra
            bar.style.transition = `width ${total}ms linear`;

            requestAnimationFrame(() => {
                bar.style.width = '0%';
            });
        }
        this._timerInterval = setTimeout(() => {
            this.close({ isDismissed: true, dismiss: 'timer' });
        }, total);
    }

    /**
     * Cierra la alerta.
     *
     * @param {NiceAlertResult<T>} result - El resultado de la alerta.
     * @returns {void}
     *
     * Esta función cierra la alerta removiendo los eventos, removiendo la alerta del DOM y ocultándola.
     * Si hay una función de resolución `this._resolve`, se llama con el resultado de la alerta.
     */
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
            
            const currentInstance = getCurrentInstance();
            if (currentInstance === this) setCurrentInstance(null);
            
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
