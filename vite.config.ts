import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/principality-media': {
        target: 'http://localhost:9000',
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
})
