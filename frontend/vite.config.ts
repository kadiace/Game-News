import { defineConfig } from 'vite'

const backendTarget = process.env.VITE_API_BASE_URL || 'http://127.0.0.1:3000'

export default defineConfig({
  server: {
    proxy: {
      '/topics': backendTarget,
      '/news': backendTarget,
      '/subscribers': backendTarget,
    },
  },
})
