import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import { handleEzkoraApi } from './server/apiHandler.js'

function ezkoraApiPlugin() {
  return {
    name: 'ezkora-api-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        handleEzkoraApi(req, res, next)
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        handleEzkoraApi(req, res, next)
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), ezkoraApiPlugin()],
  server: {
    port: 5173,
    host: '0.0.0.0',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss({
          content: [
            "./index.html",
            "./src/**/*.{js,ts,jsx,tsx}",
          ],
          darkMode: 'class',
          theme: {
            extend: {
              colors: {
                emerald: {
                  400: '#34d399',
                  500: '#10b981',
                  950: '#022c22',
                },
                cyan: {
                  400: '#22d3ee',
                  500: '#06b6d4',
                  950: '#083344',
                },
                slate: {
                  800: '#1e293b',
                  900: '#0f172a',
                  950: '#020617',
                }
              }
            }
          },
          plugins: [],
        }),
        autoprefixer(),
      ],
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    sourcemap: false,
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'zustand',
      'react-icons',
    ],
  },
})
