import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: true,
    proxy: {
      '/auth': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/courses': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/categories': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/category': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: true,
    port: 5173,
    allowedHosts: true,
    proxy: {
      '/auth': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/courses': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/categories': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/category': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
