// 比自己測有無錯時用
const debug = require('debug')('api:logout')
// 載入router
const { Router } = require('express')
// 定義logout router
const logoutRouter = Router()

// logout時輸入http://localhost:3001/就返回根目錄
logoutRouter.get('/', (req, res) => {
  // 測有無錯時用
  debug('logout successful')
  req.session = null
  return res.redirect('/')
})

// 滙出 logout middleware
module.exports = logoutRouter
