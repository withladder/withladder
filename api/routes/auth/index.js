// 從express輸入router
const { Router } = require('express')

// 輸入google,twitter,facebook,github and logout middleware
const googleAuthRoutes = require('./google')
const facebookAuthRoutes = require('./facebook')
const twitterAuthRoutes = require('./twitter')
const githubAuthRoutes = require('./github')
const logoutRoutes = require('./logout')

// 定義router
const authRouter = Router()

// 根據唔同的網址再入到router
authRouter.use('/facebook', facebookAuthRoutes)
authRouter.use('/twitter', twitterAuthRoutes)
authRouter.use('/google', googleAuthRoutes)
authRouter.use('/github', githubAuthRoutes)
authRouter.use('/logout', logoutRoutes)

// 滙出一個Router,作為仲介者使用
module.exports = authRouter
