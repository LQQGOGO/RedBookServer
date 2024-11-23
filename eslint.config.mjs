import { defineConfig } from 'eslint-define-config';

export default defineConfig({
  env: {
    node: true, // 启用 Node.js 环境
    es2021: true, // 启用 ES2021 的语法支持
  },
  extends: [
    'eslint:recommended', // 使用 ESLint 的推荐规则
    'plugin:prettier/recommended', // 集成 Prettier
  ],
  parserOptions: {
    ecmaVersion: 12, // 支持 ES2021 语法
    sourceType: 'module', // 如果使用 ES 模块，设置为 "module"
  },
  plugins: [
    'import', // 用于优化 import/export 语法的规则
    'security', // 添加常见安全检查规则
  ],
  rules: {
    // 添加自定义规则
    'prettier/prettier': 'error', // 使用 Prettier 的规则作为 ESLint 错误
    'no-console': 'off', // 后端项目允许使用 console.log
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
  },
});
