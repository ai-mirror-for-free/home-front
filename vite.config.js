import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 5173,
    proxy: {
            // OpenWebUI 服务器，保持路径不变
      '/api/v1': {
        target: 'https://chat.yang-sjq.cn',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      },
      // LobeAI API - 用户注册和验证接口
      '/api': {
        target: 'http://localhost:25141',
        changeOrigin: true,
        secure: false
      },
    }
  }
})
