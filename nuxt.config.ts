// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxt/icon',
    '@nuxtjs/google-fonts'
  ],
  googleFonts: {
    families: {
      Cairo: [400, 500, 600, 700],
      'IBM Plex Sans Arabic': [400, 500, 600, 700]
    },
    display: 'swap'
  },
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.ts',
  },
})
