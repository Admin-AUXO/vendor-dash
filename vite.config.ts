import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/vendor-dash/',
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Split React and React DOM into a separate chunk
          if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
            return 'vendor-react';
          }
          
          // Split Radix UI components into a separate chunk
          if (id.includes('@radix-ui')) {
            return 'vendor-radix';
          }
          
          // Split Recharts (charting library) into a separate chunk
          if (id.includes('recharts')) {
            return 'vendor-charts';
          }
          
          // Split other UI libraries into a separate chunk
          if (
            id.includes('lucide-react') ||
            id.includes('cmdk') ||
            id.includes('vaul') ||
            id.includes('sonner') ||
            id.includes('embla-carousel-react') ||
            id.includes('react-day-picker') ||
            id.includes('react-resizable-panels') ||
            id.includes('react-hook-form') ||
            id.includes('input-otp') ||
            id.includes('class-variance-authority') ||
            id.includes('clsx') ||
            id.includes('tailwind-merge')
          ) {
            return 'vendor-ui';
          }
          
          // Split node_modules into vendor chunk
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})

