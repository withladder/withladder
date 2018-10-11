// 輸入router
const { Router } = require('express')
// 定義一個google router
const googleAuthRouter = Router()

const passport = require('passport')

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
  successRedirect: '/',
  failureRedirect: '/login'
}))

// 滙出一個 router,作為仲介者使用
module.exports = googleAuthRouter
