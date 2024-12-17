const Router = require('koa-router')
const router = new Router({ prefix: '/item' })

//导入用户路由处理函数对应模块
const item_handler = require('../router_handler/item')

router.get('/item_detail', item_handler.getItemDetail)
router.get('/item_list', item_handler.getItemList)
router.post('/item_like', item_handler.addLike)

module.exports = router
