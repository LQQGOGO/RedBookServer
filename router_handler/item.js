//导入数据库操作模块
const db = require('../utils/db')

//获得笔记列表
exports.getItemList = async ctx => {
  try {
    // 从数据库中查询所有笔记
    const [items] = await db.query('SELECT * FROM items_list') // 使用解构语法获取结果

    // 对返回的数据进行检查
    if (items.length === 0) {
      ctx.status = 404 // 使用 404 状态码表示没有找到数据
      ctx.body = { message: '没有找到笔记数据' }
      return
    }
    // 将查询到的结果作为响应返回
    ctx.status = 200
    ctx.body = items
  } catch (error) {
    ctx.status = 500 // Internal Server Error
    ctx.body = { message: error.message || '服务器内部错误' }
  }
}

// 获得笔记详情
exports.getItemDetail = async ctx => {
  try {
    const { note_id } = ctx.request.body

    if (!note_id) {
      ctx.status = 400
      ctx.body = { error: 'note_id无效' }
      return
    }
    // 查询数据库，根据 note_id 查找笔记详情
    const [note] = await db.query(
      'SELECT * FROM items_list WHERE note_id = ?',
      [note_id]
    )
    // 如果没有找到笔记，则返回 404 错误
    if (!note) {
      ctx.status = 404
      ctx.body = { error: '该笔记不存在' }
      return
    }
    // 返回查询到的笔记详情
    ctx.status = 200
    ctx.body = note
  } catch (error) {
    ctx.status = 500 // Internal Server Error
    ctx.body = { message: error.message || '服务器内部错误' }
  }
}
