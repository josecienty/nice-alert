export type NiceAlertTypes = {
    /**
    * Crea y abre una nueva alerta.
    *    
    * Permite recibir una configuración completa de alerta o un string
    * que será utilizado como título.
    *
    * @param {NiceAlertOptions | string} options Configuración de la alerta.
    * @returns {Promise<NiceAlertResult<T>>} Resultado de la alerta. */
    fire: <T = unknown>(
        options?: NiceAlertOptions | string
    ) => Promise<NiceAlertResult<T>>;

    /**
    * Muestra una alerta de éxito.
    *
    * Utiliza el icono "success" para indicar que una operación
    * fue completada correctamente.
    *
    * @param title Título principal de la alerta.
    * @param text Texto descriptivo adicional de la alerta.
    * @returns Promesa con el resultado de la interacción del usuario.
    */
    success: <T = unknown>(
        title?: string,
        text?: string
    ) => Promise<NiceAlertResult<T>>;

    /**
    * Muestra una alerta de error.
    *
    * Utiliza el icono "error" para comunicar fallos o acciones
    * que no pudieron completarse correctamente.
    *
    * @param title Título principal de la alerta.
    * @param text Texto descriptivo adicional de la alerta.
    * @returns Promesa con el resultado de la interacción del usuario.
    */
    error: <T = unknown>(
        title?: string,
        text?: string
    ) => Promise<NiceAlertResult<T>>;

    /**
    * Muestra una alerta de advertencia.
    *
    * Utiliza el icono "warning" para informar situaciones que requieren
    * atención del usuario.
    *
    * @param title Título principal de la alerta.
    * @param text Texto descriptivo adicional de la alerta.
    * @returns Promesa con el resultado de la interacción del usuario.
    */
    warning: <T = unknown>(
        title?: string,
        text?: string
    ) => Promise<NiceAlertResult<T>>;

    /**
    * Muestra una alerta informativa.
    *
    * Utiliza el icono "info" para presentar información general.
    *
    * @param title Título principal de la alerta.
    * @param text Texto descriptivo adicional de la alerta.
    * @returns Promesa con el resultado de la interacción del usuario.
    */
    info: <T = unknown>(
        title?: string,
        text?: string
    ) => Promise<NiceAlertResult<T>>;

    /**
    * Muestra una alerta de tipo pregunta.
    *
    * Utiliza el icono "question" para solicitar una decisión
    * o acción por parte del usuario.
    *
    * @param title Título principal de la alerta.
    * @param text Texto descriptivo adicional de la alerta.
    * @returns Promesa con el resultado de la interacción del usuario.
    */
    question: <T = unknown>(
        title?: string,
        text?: string
    ) => Promise<NiceAlertResult<T>>;

    /**
    * Muestra un diálogo de confirmación.
    *
    * Incluye un botón de cancelación automáticamente y permite
    * personalizar opciones adicionales de la alerta.
    *
    * @param title Título principal del diálogo.
    * @param text Texto descriptivo adicional del diálogo.
    * @param options Opciones adicionales para personalizar la alerta.
    * @returns Promesa con el resultado de la confirmación del usuario.
    */
    confirm: <T = unknown>(
        title?: string,
        text?: string,
        options?: NiceAlertOptions
    ) => Promise<NiceAlertResult<T>>;

    /**
    * Muestra una notificación tipo toast.
    *
    * Permite configurar una alerta flotante con temporizador,
    * posición y comportamiento personalizado.
    *
    * @param options Configuración de la alerta toast o título en formato string.
    * @returns Promesa con el resultado de la interacción del usuario.
    */
    toast: <T = unknown>(
        options?: NiceAlertOptions | string
    ) => Promise<NiceAlertResult<T>>;

    /**
    * Cierra la alerta actualmente visible.
    *
    * Permite enviar información parcial sobre el resultado del cierre.
    *
    * @param result Resultado parcial utilizado al cerrar la alerta.
    * @returns No retorna ningún valor.
    */
    close: (result?: Partial<NiceAlertResult>) => void;
};