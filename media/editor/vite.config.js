import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  base: './',
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, 'src')}/`
    }
  },
  build: {
    assetsDir: "./",
    rollupOptions: {
      output: {
        manualChunks: undefined,
        entryFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    },
    cssCodeSplit: false
  }
})