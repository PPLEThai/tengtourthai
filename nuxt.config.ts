import { defineNuxtConfig } from "nuxt/config";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  typescript: {
    strict: true,
    typeCheck: true
  },
  modules: [
    '@nuxtjs/tailwindcss',
  ],
  components: {
    dirs: [
      { path: '~/components/ui', pathPrefix: false },
      { path: '~/components/mp', pathPrefix: false },
      '~/components'
    ]
  },
  compatibilityDate: '2025-02-26',
  css: [
    '@/assets/css/fonts.css',
    '@/assets/css/tokens.css',
    "maplibre-gl/dist/maplibre-gl.css",
    '@/assets/css/styles.css'
  ],
  app: {
    head: {
      title: 'ติดตามเท้งทั่วไทย พรรคประชาชน', // Default title
      meta: [
        { name: 'description', content: 'สรุปผลการเดินทางของหัวหน้าพรรคประชาชน' },
        { property: 'og:title', content: 'ติดตามเท้งทั่วไทย พรรคประชาชน' },
        { property: 'og:description', content: 'สรุปผลการเดินทางของหัวหน้าพรรคประชาชน' },
        { property: 'og:image', content: 'https://tourthai.peoplesparty.or.th/images/thumbnail-somtourthai.png' }, // Path to your thumbnail image
        { property: 'og:type', content: 'website' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' }, // Prevent zoom on input focus
        { name: 'author', content: 'PPLE Team' }, // Optional: Specify the author or organization
        { name: 'theme-color', content: '#ff6a13' }, // Theme color for mobile browsers
        { name: 'keywords', content: 'Hackable City, PPLE, เมือง, ระบบจัดเก็บข้อมูล' }, // Keywords for SEO
        { property: 'og:locale', content: 'th_TH' }, // Specify the locale if targeting Thai users
        { property: 'og:url', content: 'https://tourthai.peoplesparty.or.th' } // Replace with your actual URL
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai+Looped:wght@400;500;600&display=swap' },
      ],
    },
  },
  runtimeConfig: {
    public: {
      apiTengData: process.env.API_TENG_DATA || '',
      apiDonationStats: process.env.API_DONATION_STATS || '',
      apiVolunteerStats: process.env.API_VOLUNTEER_STATS || '',
      apiCourseStats: process.env.API_COURSE_STATS || '',
      apiAgeProvinceStats: process.env.API_AGE_PROVINCE_STATS || '',
      gaId: process.env.GA_ID || ''
    }
  },
});