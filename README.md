# nice-alert

Librería de alertas tipo SweetAlert, con diseño moderno (glassmorphism).
Sin dependencias. Funciona en JavaScript puro y en TypeScript (tipos incluidos).

## Instalación

```bash
npm install @josecienty/nice-alert
```

## Uso con un bundler (JS o TS)

```ts
import { NiceAlert } from '@josecienty/nice-alert';
import '@josecienty/nice-alert/style.css'; // o '@josecienty/nice-alert/dist/nice-alert.css'

const result = await NiceAlert.fire({
  title: '¿Estás seguro?',
  text: 'Esta acción no se puede deshacer',
  icon: 'warning',
  showCancelButton: true,
});

if (result.isConfirmed) {
  await NiceAlert.success('Listo', 'Se completó correctamente');
}
```

En CommonJS:

```js
const { NiceAlert } = require('@josecienty/nice-alert');
```

TypeScript obtiene autocompletado y tipos automáticamente (`NiceAlertOptions`,
`NiceAlertResult`, `NiceAlertIcon`, etc.) sin instalar nada adicional —
los `.d.ts` se publican junto al paquete.

## Uso directo en HTML vía CDN (sin bundler)

```html
<!-- CDN -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@josecienty/nice-alert/dist/nice-alert.css" />
<script src="https://cdn.jsdelivr.net/npm/@josecienty/nice-alert/dist/nice-alert.umd.js"></script>

<!-- Script -->
<script>
  NiceAlert.success('¡Hola!', 'Cargado desde CDN');
</script>
```

También disponible en unpkg:

```html
<script src="https://unpkg.com/@josecienty/nice-alert/dist/nice-alert.umd.js"></script>
```

## API rápida

- `NiceAlert.fire(options)` — alerta configurable, retorna una `Promise<NiceAlertResult>`
- `NiceAlert.success(title, text)`
- `NiceAlert.error(title, text)`
- `NiceAlert.warning(title, text)`
- `NiceAlert.info(title, text)`
- `NiceAlert.question(title, text)`
- `NiceAlert.confirm(title, text, options)`
- `NiceAlert.toast(options)` — notificación tipo toast, arriba a la derecha por defecto
- `NiceAlert.close(result)` — cierra la alerta abierta actualmente

Ver `src/types.ts` para el detalle completo de `NiceAlertOptions` y `NiceAlertResult`.

## Licencia

MIT
