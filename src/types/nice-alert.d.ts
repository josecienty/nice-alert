export type NiceAlertTypes = {
    fire: <T = unknown>(
        options?: NiceAlertOptions | string
    ) => Promise<NiceAlertResult<T>>;

    success: <T = unknown>(
        title?: string,
        text?: string
    ) => Promise<NiceAlertResult<T>>;

    error: <T = unknown>(
        title?: string,
        text?: string
    ) => Promise<NiceAlertResult<T>>;

    warning: <T = unknown>(
        title?: string,
        text?: string
    ) => Promise<NiceAlertResult<T>>;

    info: <T = unknown>(
        title?: string,
        text?: string
    ) => Promise<NiceAlertResult<T>>;

    question: <T = unknown>(
        title?: string,
        text?: string
    ) => Promise<NiceAlertResult<T>>;

    confirm: <T = unknown>(
        title?: string,
        text?: string,
        options?: NiceAlertOptions
    ) => Promise<NiceAlertResult<T>>;

    toast: <T = unknown>(
        options?: NiceAlertOptions | string
    ) => Promise<NiceAlertResult<T>>;

    close: (result?: Partial<NiceAlertResult>) => void;
};