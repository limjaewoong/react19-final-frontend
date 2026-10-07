import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // 절대경로 alias 설정
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true, // 로컬 IP(10.229.62.182) 접근 허용
    port: 5173,
    proxy: {
      // 개발환경에서 API 요청을 백엔드로 프록시
      '/api': {
        target: 'http://localhost:8070',
        changeOrigin: true,
        secure: false,
        // 쿠키 전달 설정
        cookieDomainRewrite: '',
        cookiePathRewrite: '/',
      },
      // SSO 로그인 (Spring Controller)
      '/common': {
        target: 'http://localhost:8070',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: '',
        cookiePathRewrite: '/',
      },
    },
  },
  preview: {
    port: 5173,
    proxy: {
      // 개발환경과 동일하게 API 요청을 백엔드로 프록시
      '/api': {
        target: 'http://localhost:8070',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: '',
        cookiePathRewrite: '/',
      },
      // SSO 로그인 (Spring Controller)
      '/common': {
        target: 'http://localhost:8070',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: '',
        cookiePathRewrite: '/',
      },
    },
  },
})
