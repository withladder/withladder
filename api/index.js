// 比自己測有無錯時用
var debug = require('debug')('api')
debug('api server starting...')
// library
var express = require('express')
// middlewares
const middlewares = require('./routes/middlewares')

// 仲介者
// 處理api
var apiRoutes = require('./routes/api')
// 處理用戶認證
var authRoutes = require('./routes/auth')
// 處理googleAPI主人認證,session的data轉換
var initPassport = require('./authentication')

// 執行createApp function 就會返回一個app object
function createApp (options = {}) {
  // 定義app
  const app = express()

  // app.options = 參數options
  app.options = options
  //  app.models = options.models or empty object
  app.models = options.models || {}

  // 初始化
  initPassport(app)

  // 定義 req.models
  // 定義 req.app
  app.use((req, res, next) => {
    req.models = app.models
    req.app = app
    next()
  })

  // 初始化Passport的野
  app.use(middlewares)

  // 網址如果是auth的時候,執行authRoutes的仲介
  app.authRoutes = authRoutes
  app.use('/auth', authRoutes)
  // 網址如果是api的時候,執行apiRoutes的仲介
  app.apiRoutes = apiRoutes
  app.use('/api', apiRoutes)

  // 伺服器鈐聽3001 port
  app.listen(3001, function () {
    console.log('API server listening on port 3001!')
    debug('api server started.')
  })

  return app
}

// 滙出createApp function
module.exports = createApp
