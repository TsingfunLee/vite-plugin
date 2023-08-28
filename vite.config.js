import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import unused from './plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), unused()],
})
