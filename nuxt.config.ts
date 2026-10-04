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
  // Runs next to the storefront (E-commerce-v2 on :3000), which proxies /api/storefront from here
  devServer: {
    port: 3001,
  },
  runtimeConfig: {
    public: {
      // Links sent to customers (abandoned-cart recovery). Override with NUXT_PUBLIC_STOREFRONT_URL.
      storefrontUrl: 'http://localhost:3000'
    }
  },
  nitro: {
    storage: {
      // Shared mock database (discounts, shipping, payments) — see server/utils/db.ts
      db: { driver: 'fs', base: './.data/db' },
    },
  },
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.ts',
  },
})
