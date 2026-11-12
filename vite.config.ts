import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'icon-180.png', 'audio/*'],
      workbox: { globPatterns: ['**/*.{js,css,html,svg,png,jpg,webp,m4a,mp3}'] },
      manifest: {
        name: 'Fuerteventura Abenteuer',
        short_name: 'Fuerte ☀️',
        description: 'Unser Countdown bis zum Urlaub',
        lang: 'de',
        display: 'standalone',
        start_url: './',
        background_color: '#fdf3dc',
        theme_color: '#19b5b0',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
    }),
  ],
})
