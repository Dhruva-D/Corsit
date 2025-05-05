import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    watch: {
      usePolling: true,
    },
    // Set up fallback to handle client-side routing during development
    historyApiFallback: true,
  },
  build: {
    // Generate the _redirects file during build if it doesn't exist
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    // Copy all the files from public directory to the output directory
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
