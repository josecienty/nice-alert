let styleInjected = false;

/**
 * Crea un elemento HTML con la etiqueta especificada, opcionalmente con una clase y contenido HTML.
 *
 * @param {string} tag - La etiqueta HTML del elemento a crear.
 * @param {string|null} className - La clase CSS opcional para el elemento.
 * @param {string|null} html - El contenido HTML opcional para el elemento.
 * @returns {HTMLElement} - El elemento HTML creado.
 */
export function createEl<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    className?: string | null,
    html?: string
): HTMLElementTagNameMap[K] {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (html !== undefined) el.innerHTML = html;
    return el;
}

/**
 * Inyecta el estilo de FontCheck en el documento si aún no ha sido inyectado.
 * Verifica que la librería se esté ejecutando en un entorno con DOM disponible.
 * @throws {Error} Si `document` no existe en el entorno actual.
 */
export function injectFontCheck(): void {
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

/**
 * Verifica que la librería se esté ejecutando en un entorno con DOM disponible.
 *
 * Esta validación evita errores cuando NiceAlert es importado desde
 * Node.js, entornos SSR (Server-Side Rendering) o procesos sin acceso
 * al objeto `document`.
 *
 * @throws {Error} Si `document` no existe en el entorno actual.
 */
export function assertDom(): void {
    if (typeof document === 'undefined') {
        throw new Error(
            'NiceAlert: this library requires a DOM environment (browser). ' +
            'It cannot run in Node.js / SSR contexts.'
        );
    }
}