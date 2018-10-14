// 戴入express係object裹面
const { Router } = require('express')

// 定義Router為功能
const middlewares = Router()

// 戴入cookie-parser為一個cookieParser
const cookieParser = require('cookie-parser')
// 用cookieParser功能
// 就是將那一堆req.header.cookie變成req.cookie(就是不明數字字母分開成幾部分)
middlewares.use(cookieParser())

// 如果資料庫有req.session的時候,google自動化整一個cookie出來
const session = require('cookie-session')
const ONE_YEAR = 31556952000
middlewares.use(session({
  keys: ['this is secret'],
  name: 'session',
  secure: false,
  maxAge: ONE_YEAR,
  signed: true
}))

// 戴入passport
const passport = require('passport')
middlewares.use(passport.initialize())
middlewares.use(passport.session())

module.exports = middlewares
