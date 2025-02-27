import { defineNuxtConfig } from "nuxt/config";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  typescript: {
    strict: true,
    typeCheck: true
  },
  modules: [
    '@nuxtjs/tailwindcss',
  ],
  tailwindcss: {
    config: {
      plugins: [require('daisyui')]
    }
  },
  compatibilityDate: '2025-02-26',
  css: [
    '@/assets/css/fonts.css',
    "maplibre-gl/dist/maplibre-gl.css"
  ],
});