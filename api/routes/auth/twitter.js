// 載入router
const { Router } = require('express')
// 定義twitter router
const twitterAuthRouter = Router()
// 戴入passport
const passport = require('passport')

// 驗證請求,使用passport.authenticate（）指定“twitter”策略來驗證請求。
// /auth/twitter/ => login twitter
twitterAuthRouter.get('/', passport.authenticate('twitter', {

}))

// /auth/twitter/callback => 話比twitter反番嚟這個callback網站
twitterAuthRouter.get('/callback', passport.authenticate('twitter', {
  // login work的時候行下面依行,根目錄
  successRedirect: '/',
  // fail的時候就下面
  failureRedirect: '/login'
}))

// 滙出一個 router,作為仲介者使用
module.exports = twitterAuthRouter
