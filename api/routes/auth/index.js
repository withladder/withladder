const { Router } = require('express')
const googleAuthRoutes = require('./google')
const logoutRoutes = require('./logout')
const authRouter = Router()

authRouter.use('/google', googleAuthRoutes)
authRouter.use('/logout', logoutRoutes)

// 滙出一個Router,作為仲介者使用
module.exports = authRouter
