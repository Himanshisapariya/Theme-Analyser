import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'assets',
    emptyOutDir: false,
    minify: true,
    rollupOptions: {
      input: './css/application.css',
      output: {
        dir: 'assets',
        assetFileNames: 'application.css.liquid',
      }
    },
  }
})