const jwt = require('koa-jwt')
const config = require('../config')

// 配置 JWT 中间件
const jwtMiddleware = jwt({
  secret: config.jwtSecretKey, // 你的密钥
  algorithms: ['HS256'] // Token 加密算法
}).unless({
  path: [
    // 不需要验证 Token 的路由
    /^\/api\/login$/, // 允许登录接口不需要验证
    /^\/api\/register$/ // 允许注册接口不需要验证
  ]
})

module.exports = jwtMiddleware
