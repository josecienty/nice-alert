import { defineConfig } from 'tsup';

export default defineConfig({
  entry: { 'nice-alert': 'src/index.ts' },
  format: ['cjs', 'esm', 'iife'],
  globalName: 'NiceAlertLib', // el bundle IIFE expone window.NiceAlertLib.NiceAlert,
                               // pero src/index.ts también asigna window.NiceAlert directamente
  outDir: 'dist',
  dts: true,
  sourcemap: true,
  minify: true,
  clean: true,
  splitting: false,
  target: 'es2018',
  outExtension({ format }) {
    if (format === 'cjs') return { js: '.cjs.js' };
    if (format === 'esm') return { js: '.esm.js' };
    return { js: '.umd.js' }; // iife -> usado en CDN (unpkg / jsDelivr)
  },
});
