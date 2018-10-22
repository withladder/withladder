// 載入router
const { Router } = require('express')
// 定義一個google router
const googleAuthRouter = Router()
// 戴入passport
const passport = require('passport')

// 驗證請求,使用passport.authenticate（）指定“google”策略來驗證請求。
// /auth/google/ => login google
googleAuthRouter.get('/', passport.authenticate('google', {
  scope: [
    'https://www.googleapis.com/auth/plus.login',
    'https://www.googleapis.com/auth/plus.profile.emails.read'
  ],
  prompt: 'select_account'
}))

// /auth/google/callback => 話比google反番嚟這個callback網站
googleAuthRouter.get('/callback', passport.authenticate('google', {

  // login work的時候行下面依行,根目錄
  successRedirect: '/',

  // fail的時候就下面
  failureRedirect: '/login'
}))

// 滙出一個 router,作為仲介者使用
module.exports = googleAuthRouter
