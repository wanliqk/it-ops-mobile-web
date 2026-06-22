import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      // 匹配以 /api 开头的请求，原样转发给后端（后端路由本身就带 /api/mobile 前缀，不能去掉）
      '^/api': {
        target: 'http://127.0.0.1:8000', // 目标后端服务器地址
        changeOrigin: true,
        autoRewrite: true
      }
    }
  }
})
