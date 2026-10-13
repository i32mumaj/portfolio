import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Never inline fonts as data: URIs, so the CSP can keep font-src 'self'.
  build: { assetsInlineLimit: (file) => (/\.woff2?$/.test(file) ? false : undefined) },
})
