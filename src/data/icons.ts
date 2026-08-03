import { NiceAlertIcon } from "../types";

export const ICONS: Record<NiceAlertIcon, string> = {
    success: `<svg viewBox="0 0 52 52"><circle class="na-icon-circle" cx="26" cy="26" r="24"/><path class="na-icon-check" d="M14 27l7 7 17-17"/></svg>`,
    error: `<svg viewBox="0 0 52 52"><circle class="na-icon-circle" cx="26" cy="26" r="24"/><path class="na-icon-x" d="M16 16l20 20M36 16l-20 20"/></svg>`,
    warning: `<svg viewBox="0 0 52 52"><circle class="na-icon-circle" cx="26" cy="26" r="24"/><line class="na-icon-line" x1="26" y1="14" x2="26" y2="30"/><circle class="na-icon-dot" cx="26" cy="38" r="1.6"/></svg>`,
    info: `<svg viewBox="0 0 52 52"><circle class="na-icon-circle" cx="26" cy="26" r="24"/><line class="na-icon-line" x1="26" y1="22" x2="26" y2="36"/><circle class="na-icon-dot" cx="26" cy="15" r="1.6"/></svg>`,
    question: `<svg viewBox="0 0 52 52"><circle class="na-icon-circle" cx="26" cy="26" r="24"/><path class="na-icon-q" d="M20 20a6 6 0 1 1 8 5.6c-1.5.8-2 1.6-2 3.4" /><circle class="na-icon-dot" cx="26" cy="36" r="1.6"/></svg>`,
};