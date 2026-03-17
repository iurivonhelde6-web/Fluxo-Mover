import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
  build: {
    // Aumenta o limite para 1000kb para silenciar o aviso
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Organiza as bibliotecas (Supabase, React, etc) em um arquivo separado
        // Isso ajuda na performance e resolve o aviso de "chunk size"
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
})

