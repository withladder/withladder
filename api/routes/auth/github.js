// 載入router
const { Router } = require('express')
// 定義github router
const githubAuthRouter = Router()

const passport = require('passport')

// 驗證請求,使用passport.authenticate（）指定“github”策略來驗證請求。
// /auth/github/ => login github
githubAuthRouter.get('/', passport.authenticate('github', {
  scope: [
    'read:user,user:email'
  ]
}))

// /auth/github/callback => 話比github反番嚟這個callback網站
githubAuthRouter.get('/callback', passport.authenticate('github', {
  // login work的時候行下面依行,根目錄
  successRedirect: '/',
  // fail的時候就下面
  failureRedirect: '/login'
}))

// 滙出一個 router,作為仲介者使用
module.exports = githubAuthRouter
