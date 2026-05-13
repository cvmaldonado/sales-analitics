import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',      // necesario para Docker
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://flask:5000',   // nombre del servicio en docker-compose
        changeOrigin: true,
      }
    }
  }
})