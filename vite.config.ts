import { defineConfig } from 'vite';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        { src: 'manifest.json', dest: '.' },
        { src: 'src/popup.html', dest: '.' },
        { src: 'src/popup.css', dest: '.' },
        { src: 'src/background.js', dest: '.' },
        { src: 'icons', dest: '.' }
      ]
    })
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        content: resolve(__dirname, 'src/content.ts'),
        popup: resolve(__dirname, 'src/popup.ts'),
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