import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // The Express server (server/index.js) handles the AI endpoints.
      // Run it separately with `npm run dev` inside /server.
      '/api': 'http://localhost:8787',
    },
  },
})
