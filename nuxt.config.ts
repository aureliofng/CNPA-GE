export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@vite-pwa/nuxt'],
  css: ['~/app/assets/main.css'],
  ssr: true,
  nitro: {
    preset: 'bun'
  },
  runtimeConfig: {
    sessionSecret: process.env.SESSION_SECRET || 'cnpa-ge-secret'
  },
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'CNPA-GE',
      short_name: 'CNPA-GE',
      description: 'Gestión de ubicaciones CNPA',
      theme_color: '#0f766e',
      background_color: '#ffffff',
      display: 'standalone',
      start_url: '/',
      icons: [
        { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
        { src: '/icon-maskable.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}']
    }
  }
})
