import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        content: resolve(__dirname, 'content.ts'),
        popup: resolve(__dirname, 'popup.ts'),
      },
      output: {
        entryFileNames: '[name].js',
      },
    },
    lib: undefined, // Prevent Vite from expecting index.html
    minify: false,
    sourcemap: true,
    target: 'chrome90',
  },
}); 