import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const path = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  base: '/kin/',
  plugins: [vue()],
  root: path.resolve(__dirname, 'kin-erc20-swap'),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      crypto: 'crypto-browserify',
      process: "process/browser",
      stream: "stream-browserify",
      zlib: "browserify-zlib",
    },
  },
  define: {
    'process.env': {}
  },
  build: {
    chunkSizeWarningLimit: 1600,
  },
})
