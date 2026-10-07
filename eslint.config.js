import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
    globalIgnores(['dist']),
    {
        files: ['**/*.{js,jsx}'],
        plugins: {
            react,
        },
        extends: [
            js.configs.recommended,
            reactHooks.configs.flat.recommended,
            reactRefresh.configs.vite,
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        settings: {
            // eslint-plugin-react가 설치된 React 버전을 자동 감지 (버전 미지정 경고 방지)
            react: { version: 'detect' },
        },
        rules: {
            // JSX에서 사용된 컴포넌트를 no-unused-vars가 '사용됨'으로 인식하도록 (거짓양성 방지)
            'react/jsx-uses-vars': 'error',
            // React 17+ 새 JSX 변환 — 스코프 내 React import가 불필요하므로 비활성화
            'react/jsx-uses-react': 'off',
        },
    },
])
