import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Subruta del sitio de GitHub Pages (repo de proyecto, no de usuario/org).
  base: '/ingenieria-sol-service-portal/',
  plugins: [react(), tailwindcss()],
})
