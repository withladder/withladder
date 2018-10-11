var GoogleStrategy = require('passport-google-oauth2').Strategy
var passport = require('passport')

module.exports = () => {
  passport.serializeUser((user, done) => {
    console.log('user', user)
    done(null, user.id)
  })

  passport.deserializeUser((user, done) => {
    console.log('user2', user)
    done(null, user)
  })

  passport.use(
    new GoogleStrategy(
      {
        clientID: '1068634871247-ckou6khh8g05fvb52g2f713eft3j9mmi.apps.googleusercontent.com',
        clientSecret: 'Ja2Dghn7XllztASGZebvImXI',
        callbackURL: '/auth/google/callback'
      },
      (request, accessToken, refreshToken, profile, done) => {
        // console.log(profile)
        done(undefined, { id: 'hello' })
      }
    )
  )
}
