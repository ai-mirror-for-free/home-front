import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// 本地测试时可用环境变量把 /api/v1 指向本地 claude_agent（默认线上域名，生产构建不读这个配置）
const CLAUDE_AGENT_TARGET = process.env.CLAUDE_AGENT_PROXY || 'https://chat.yang-sjq.cn'

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
        target: CLAUDE_AGENT_TARGET,
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
