# nice-alert

Librería de alertas tipo SweetAlert, con diseño moderno (glassmorphism).
Sin dependencias. Funciona en JavaScript puro y en TypeScript (tipos incluidos).

## Instalación

```bash
npm install nice-alert
```

## Uso con un bundler (JS o TS)

```ts
import { NiceAlert } from 'nice-alert';
import 'nice-alert/css'; // o 'nice-alert/dist/nice-alert.css'

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
const { NiceAlert } = require('nice-alert');
```

TypeScript obtiene autocompletado y tipos automáticamente (`NiceAlertOptions`,
`NiceAlertResult`, `NiceAlertIcon`, etc.) sin instalar nada adicional —
los `.d.ts` se publican junto al paquete.

## Uso directo en HTML vía CDN (sin bundler)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/nice-alert/dist/nice-alert.css" />
<script src="https://cdn.jsdelivr.net/npm/nice-alert/dist/nice-alert.umd.js"></script>

<script>
  NiceAlert.success('¡Hola!', 'Cargado desde CDN');
</script>
```

También disponible en unpkg:

```html
<script src="https://unpkg.com/nice-alert/dist/nice-alert.umd.js"></script>
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

## Desarrollo local

```bash
npm install
npm run build      # genera dist/ (cjs, esm, umd/iife, .d.ts, css)
npm run dev         # build en modo watch
npm run typecheck   # solo valida tipos, sin generar archivos
```

### Salidas del build (`dist/`)

| Archivo                      | Formato | Uso                                   |
|-------------------------------|---------|----------------------------------------|
| `nice-alert.cjs.js`           | CommonJS| `require('nice-alert')`                |
| `nice-alert.esm.js`           | ESM     | `import` con bundlers modernos         |
| `nice-alert.umd.js`           | IIFE/UMD| `<script>` directo / CDN               |
| `index.d.ts`                  | Tipos   | Autocompletado en TS y JS con JSDoc    |
| `nice-alert.css`               | CSS     | Estilos, cárgalos por separado         |

## Publicar en npm

```bash
npm login
npm run build
npm publish
```

Al publicarse, `unpkg.com` y `cdn.jsdelivr.net` sirven automáticamente el
paquete sin configuración adicional (leen `dist/` directo del registro npm).

## Licencia

MIT
