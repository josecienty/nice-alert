import { NiceAlertIcon, NiceAlertOptions, NiceAlertResult } from "../types";
import { NiceAlertTypes } from "../types/nice-alert";
import { assertDom } from "./functions";
import { getCurrentInstance } from "./instance-store";
import { NiceAlertInstance } from "./nice-alert-instance";

export const useNiceAlert = (): NiceAlertTypes => {
    /**
      * Crea y abre una nueva instancia de alerta.
      *
      * Acepta una configuración completa o simplemente un texto como título.
      * Retorna una promesa que se resuelve con el resultado de la interacción
      * del usuario.
      */
    const fire = <T = unknown>(options?: NiceAlertOptions | string): Promise<NiceAlertResult<T>> => {
        assertDom();
        if (typeof options === 'string') {
            options = { title: options };
        }
        const instance = new NiceAlertInstance(options || {});
        return instance.open() as Promise<NiceAlertResult<T>>;
    }

    const success = (title?: string, text?: string) => {
        return fire({ icon: 'success', title, text });
    }

    const error = (title?: string, text?: string) => {
        return fire({ icon: 'error', title, text });
    }

    const warning = (title?: string, text?: string) => {
        return fire({ icon: 'warning', title, text });
    }

    const info = (title?: string, text?: string) => {
        return fire({ icon: 'info', title, text });
    }
    const question = (title?: string, text?: string) => {
        return fire({ icon: 'question', title, text });
    }

    const confirm = (title?: string, text?: string, options?: NiceAlertOptions) => {
        return fire(
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
    }

    const toast = (options?: NiceAlertOptions | string) => {
        if (typeof options === 'string') options = { title: options, icon: 'info' };
        return fire(
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
    }

    const close = (result?: Partial<NiceAlertResult>) => {
        const currentInstance = getCurrentInstance();
        if (currentInstance) currentInstance.close(result || { isDismissed: true });
    }

    return {
        fire,
        success,
        error,
        warning,
        info,
        question,
        toast,
        confirm,
        close
    }
}