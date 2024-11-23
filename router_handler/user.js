//导入数据库操作模块
const db = require('../utils/db')
//导入bcyptjs包
const bcrypt = require('bcryptjs')

//导入生成token的包
const jwt = require('jsonwebtoken')
const config = require('../config')

//登录的逻辑
exports.login = async ctx => {
  try {
    const { username, password } = ctx.request.body

    // 检查用户名和密码是否为空
    if (!username || !password) {
      ctx.status = 400 // Bad Request
      ctx.body = { message: '用户名或密码不能为空！' }
      return
    }

    // 查询用户信息
    const sql = `SELECT * FROM users WHERE username = ?`
    const [rows] = await db.query(sql, [username]) // 解构 rows 部分
    console.log('查询结果:', rows)

    // 检查用户是否存在
    if (rows.length !== 1) {
      ctx.status = 401 // Unauthorized
      ctx.body = { message: '用户名不存在或登录失败！' }
      return
    }

    // 获取用户信息
    const user = rows[0]

    // 比较密码
    const isPasswordMatch = bcrypt.compareSync(password, user.password)
    if (!isPasswordMatch) {
      ctx.status = 401 // Unauthorized
      ctx.body = { message: '密码错误！' }
      return
    }

    // 清除敏感信息
    const safeUser = { ...user, password: '', user_pic: '' }

    // 生成 JWT Token
    const tokenStr = jwt.sign(safeUser, config.jwtSecretKey, {
      expiresIn: config.expiresIn
    })

    // 返回成功响应
    ctx.body = {
      status: 0,
      message: '登录成功！',
      token: 'Bearer ' + tokenStr
    }
  } catch (err) {
    console.error('登录错误:', err)
    ctx.status = 500 // Internal Server Error
    ctx.body = { message: err.message || '服务器内部错误' }
  }
}

// 注册逻辑
exports.register = async ctx => {
  try {
    const { username, password } = ctx.request.body

    // 检查用户名和密码是否为空
    if (!username || !password) {
      ctx.status = 400 // Bad Request
      ctx.body = { message: '用户名或密码不合法！' }
      return
    }

    // 检查用户名是否已存在
    const sqlStr = `SELECT * FROM users WHERE username = ?`
    const [rows] = await db.query(sqlStr, [username]) // 解构 rows
    console.log('查询结果:', rows)

    if (rows.length > 0) {
      ctx.status = 409 // Conflict
      ctx.body = { message: '用户名被占用，请更换其他用户名！' }
      return
    }

    // 对密码进行加密
    const hashedPassword = bcrypt.hashSync(password, 10)

    // 插入新用户
    const sql = `INSERT INTO users SET ?`
    const user = { username, password: hashedPassword }
    const [insertResult] = await db.query(sql, user) // 解构插入结果
    console.log('插入结果:', insertResult)

    if (insertResult.affectedRows !== 1) {
      console.log('Insert failed, affectedRows:', insertResult.affectedRows)
      ctx.status = 500 // Internal Server Error
      ctx.body = { message: '注册用户失败，请稍后再试！' }
      return
    }

    // 注册成功
    ctx.body = {
      status: 0,
      message: '注册成功！'
    }
  } catch (err) {
    console.error('注册错误:', err)
    ctx.status = 500 // Internal Server Error
    ctx.body = { message: err.message || '服务器内部错误' }
  }
}
