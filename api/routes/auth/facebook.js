const { Router } = require('express')

const facebookAuthRouter = Router()

const passport = require('passport')

facebookAuthRouter.get('/', passport.authenticate('facebook', {
  scope: [
    'email'
  ]
}))

facebookAuthRouter.get('/callback', passport.authenticate('facebook', {

  successRedirect: '/',

  failureRedirect: '/login'
}))

module.exports = facebookAuthRouter
