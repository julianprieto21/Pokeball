import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import million from "million/compiler"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    million.vite({
      auto: {
        threshold: 0.01,
        skip: []
      }
    })
  ],
  base: '',
  build: {
    outDir: 'docs'
  }
})
