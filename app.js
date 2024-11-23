const Koa = require('koa2')
const bodyParser = require('koa-bodyparser')
const app = new Koa()

//定义端口号
const port = 3007
//引入路由
const userRouters = require('./router/user')

//导入并配置cors中间件
const koaCors = require('koa-cors')
app.use(koaCors())

//配置解析表单数据的中间件
app.use(bodyParser())

//在路由之前配置解析token的中间件
const jwtMiddleware = require('./utils/jwt')
app.use(jwtMiddleware)

//将路由模块注册到应用中
app.use(userRouters.routes()).use(userRouters.allowedMethods())

//定义错误级别的中间件
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    // Joi 校验错误
    if (err.isJoi) {
      ctx.status = 400 // Bad Request
      ctx.body = { message: err.message || '请求参数错误！' }
      return
    }

    // JWT 身份认证失败
    if (err.name === 'UnauthorizedError') {
      ctx.status = 401 // Unauthorized
      ctx.body = { message: '身份认证失败！' }
      return
    }

    // 其他错误
    ctx.status = 500 // Internal Server Error
    ctx.body = { message: err.message || '服务器内部错误' }
  }
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
