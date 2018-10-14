const debug = require('debug')('api:logout')

const { Router } = require('express')

const logoutRouter = Router()

logoutRouter.get('/', (req, res) => {
  debug('logout successful')
  req.session = null
  return res.redirect('/')
})

// 滙出 logout middleware
module.exports = logoutRouter
