/*!
 * NiceAlert
 * Librería de alertas, con diseño moderno (glassmorphism).
 * Uso: NiceAlert.fire({...}) o NiceAlert.success('Título''Texto')
 * Requiere: nice-alert.css (o el import './nice-alert.css' si usas un bundler)
 * Desarrollado por José Argüello (https://github.com/josecienty)
 */
import { useNiceAlert } from './ts/nice-alert';
import type {
} from './types';

export * from './types';


/**
 * Iniciar NiceAlert
 * 
 * Proporciona métodos estáticos para crear, mostrar y controlar alertas,
 * incluyendo variantes preconfiguradas como success, error, warning, info,
 * confirmaciones y notificaciones tipo toast.
 */
export const NiceAlert = useNiceAlert(); 

export default NiceAlert;

// Adjunta a `window` automáticamente cuando se carga vía <script> (build UMD/IIFE).
// En entornos con bundler (ESM/CJS) esto es un no-op seguro.
if (typeof window !== 'undefined') {
  (window as typeof window & { NiceAlert?: typeof NiceAlert }).NiceAlert = NiceAlert;
}
