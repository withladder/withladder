// 載入router
const { Router } = require('express')
// 定義facebook router
const facebookAuthRouter = Router()
// 戴入passport
const passport = require('passport')

// 驗證請求,使用passport.authenticate（）指定“facebook”策略來驗證請求。
// /auth/facebook/ => login facebook
facebookAuthRouter.get('/', passport.authenticate('facebook', {
  scope: [
    'email'
  ]
}))

// /auth/facebook/callback => 話比facebook反番嚟這個callback網站
facebookAuthRouter.get('/callback', passport.authenticate('facebook', {
  // login work的時候行下面依行,根目錄
  successRedirect: '/',
  // fail的時候就下面
  failureRedirect: '/login'
}))

// 滙出一個 router,作為仲介者使用
module.exports = facebookAuthRouter
