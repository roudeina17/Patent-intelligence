import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: [
      'ridgy-stickable-lida.ngrok-free.dev',
      'lorriane-remiss-lecia.ngrok-free.dev'
    ]
  }
})