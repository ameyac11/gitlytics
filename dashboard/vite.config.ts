import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Builds directly into the Python package's static folder
    outDir: '../src/gitlytics/static',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1500,
  },
})
