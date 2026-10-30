import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const proxyConfig = {
  '/auth': { target: 'http://localhost:3000', changeOrigin: true },
  '/courses': { target: 'http://localhost:3000', changeOrigin: true },
  '/categories': { target: 'http://localhost:3000', changeOrigin: true },
  '/category': { target: 'http://localhost:3000', changeOrigin: true },
  '/bundles': { target: 'http://localhost:3000', changeOrigin: true },
  '/projects': { target: 'http://localhost:3000', changeOrigin: true },
  '/practice': { target: 'http://localhost:3000', changeOrigin: true },
  '/community': { target: 'http://localhost:3000', changeOrigin: true },
  '/articles': { target: 'http://localhost:3000', changeOrigin: true },
  '/commerce': { target: 'http://localhost:3000', changeOrigin: true },
  '/learning': { target: 'http://localhost:3000', changeOrigin: true },
};

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: true,
    proxy: proxyConfig,
  },
  preview: {
    host: true,
    port: 5173,
    allowedHosts: true,
    proxy: proxyConfig,
  },
})
