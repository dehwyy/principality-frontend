import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import mkcert from 'vite-plugin-mkcert'
import fs from 'fs';
import path from 'path';

export default defineConfig({
  base: "/principality-frontend",
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'cert.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'cert.crt')),
    },
    host: true,
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
  plugins: [
    react(),
    mkcert(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,jpg}'],
      },
      manifest: {
        name: "Удельные княжества",
        short_name: "Княжества",
        start_url: "/principality-frontend/",
        display: "standalone",
        background_color: "#fdfdfd",
        theme_color: "#FEE500",
        orientation: "portrait-primary",
        icons: [
          {
            "src": "/principality-frontend/logo192.png",
            "type": "image/png", "sizes": "192x192"
          },
          {
            "src": "/principality-frontend/logo512.png",
            "type": "image/png", "sizes": "512x512"
          }
        ],
      }
    })
  ],
})
