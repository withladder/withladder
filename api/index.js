// library
var express = require('express')
var passport = require('passport')

// 仲介者
// 處理api
var apiRoutes = require('./routes/api')
// 處理用戶認證
var authRoutes = require('./routes/auth')

var initPassport = require('./authentication')
initPassport()

// 定義app
var app = express()

app.use(passport.initialize())
app.use(passport.session())

// 網址如果是auth的時候,執行authRoutes的仲介
app.use('/auth', authRoutes)
// 網址如果是api的時候,執行apiRoutes的仲介
app.use('/api', apiRoutes)

// 伺服器鈐聽3001 port口
app.listen(3001, function () {
  console.log('API server listening on port 3001!')
})

// 滙出app
module.exports = app
