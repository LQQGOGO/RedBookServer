//导入数据库操作模块
const db = require('../utils/db')

//获得笔记列表
exports.getItemList = async ctx => {
  try {
    // 获取分页参数，默认为第一页，每页 20 条，频道默认为 "recommend"
    const { page = 1, pageSize = 20, channel = 'recommend' } = ctx.query

    // 转换为数字类型，确保输入合法
    const pageNumber = Math.max(1, parseInt(page)) // 页码最小值为 1
    const pageSizeNumber = Math.max(1, parseInt(pageSize)) // 每页至少 1 条

    // 计算偏移量
    const offset = (pageNumber - 1) * pageSizeNumber

    // 从数据库中查询总记录数
    const [[{ total }]] = await db.query(
      'SELECT COUNT(*) AS total FROM items_list WHERE channel = ?',
      [channel]
    )

    // 从数据库中查询当前页的数据
    const [items] = await db.query(
      'SELECT * FROM items_list WHERE channel = ? LIMIT ? OFFSET ?',
      [channel, pageSizeNumber, offset]
    )

    // 如果没有数据
    if (items.length === 0) {
      ctx.status = 200
      ctx.body = {
        message: '没有找到更多笔记数据',
        data: [],
        total,
        page: pageNumber,
        pageSize: pageSizeNumber
      }
      return
    }

    // 返回分页数据
    ctx.status = 200
    ctx.body = {
      message: '请求成功',
      data: items,
      total,
      page: pageNumber,
      pageSize: pageSizeNumber
    }
  } catch (error) {
    console.error('获取笔记列表失败:', error)
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

//点赞功能
exports.addLike = async ctx => {
  try {
    const { note_id } = ctx.request.body

    // 参数校验
    if (!note_id) {
      ctx.status = 400
      ctx.body = { error: 'note_id 无效' }
      return
    }

    // 查询数据库中对应的文章
    const [note] = await db.query(
      'SELECT * FROM items_list WHERE note_id = ?',
      [note_id]
    )

    if (!note) {
      ctx.status = 404
      ctx.body = { error: '文章不存在' }
      return
    }

    // 根据当前点赞状态，决定是点赞还是取消点赞
    let newLikedStatus = 0
    let newLikedCount = note.liked_count

    if (note.liked === 0) {
      // 点赞操作
      newLikedStatus = 1
      newLikedCount += 1

      await db.query(
        'UPDATE items_list SET liked = ?, liked_count = ? WHERE note_id = ?',
        [newLikedStatus, newLikedCount, note_id]
      )

      ctx.body = {
        success: true,
        message: '点赞成功'
      }
    } else {
      // 取消点赞操作
      newLikedStatus = 0
      newLikedCount = Math.max(0, note.liked_count - 1)

      await db.query(
        'UPDATE items_list SET liked = ?, liked_count = ? WHERE note_id = ?',
        [newLikedStatus, newLikedCount, note_id]
      )

      ctx.body = {
        success: true,
        message: '取消点赞成功'
      }
    }
  } catch (error) {
    ctx.status = 500 // Internal Server Error
    ctx.body = { message: error.message || '服务器内部错误' }
  }
}
