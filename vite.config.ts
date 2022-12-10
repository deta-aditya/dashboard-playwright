/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: [
      './src/**/*.test.{ts,tsx}',
    ],
    setupFiles: [
      './src/__tests__/setup.ts',
    ],
  },
})
