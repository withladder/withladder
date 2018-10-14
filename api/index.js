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
// 初始化
initPassport()

// 定義app
var app = express()

// 初始化Passport的野
app.use(middlewares)

// 網址如果是auth的時候,執行authRoutes的仲介
app.use('/auth', authRoutes)
// 網址如果是api的時候,執行apiRoutes的仲介
app.use('/api', apiRoutes)

app.get('/', (req, res, next) => {
  res.end('this is homepage')
})

// 伺服器鈐聽3001 port
app.listen(3001, function () {
  console.log('API server listening on port 3001!')
  debug('api server started.')
})

// 滙出app
module.exports = app
