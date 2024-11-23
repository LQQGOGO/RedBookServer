const Router = require('koa-router')
const router = new Router()

//导入用户路由处理函数对应模块
const user_handler = require('../router_handler/user')

//导入需要的验证规则对象
const { reg_login_schema } = require('../schema/user')
//导入验证数据的中间件
const validate = require('../utils/validate')

router.post('/register', validate( reg_login_schema ), user_handler.register)
router.post('/login', validate( reg_login_schema ), user_handler.login)

module.exports = router