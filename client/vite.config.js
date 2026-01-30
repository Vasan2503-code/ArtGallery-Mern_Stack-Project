import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/verify': 'http://localhost:4000',
      '/art': 'http://localhost:4000',
      '/cart': 'http://localhost:4000',
      '/uploads': 'http://localhost:4000'
    }
  }
})
