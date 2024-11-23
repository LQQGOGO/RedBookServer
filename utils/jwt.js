const jwt = require('koa-jwt')
const config = require('./config')

// 配置 JWT 中间件
const jwtMiddleware = jwt({
  secret: config.jwtSecretKey, // 你的密钥
  algorithms: ['HS256'] // Token 加密算法
}).unless({
  path: [
    // 不需要验证 Token 的路由
    /^\/login/, // 登录
    /^\/register/ // 注册
  ]
})

module.exports = jwtMiddleware
