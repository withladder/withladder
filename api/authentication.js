var GoogleStrategy = require('passport-google-oauth2').Strategy
var passport = require('passport')

// 當browser first time向sever request時,sever就會整一個session出來(姐係有key:value個種)
// session係將cookie作為memory,d client的data會草左係seession的cookie到
// 因為係外面來的session,資料轉換成帳號資料: User
module.exports = () => {
  passport.serializeUser((user, done) => {
    console.log('user', user)
    // 驗證使用者id
    done(null, user.id)
  })

// passport將session入面有的 user ，從資料庫轉換成最初的 User
  passport.deserializeUser((user, done) => {
    console.log('user2', user)
    // 驗證使用者資訊
    done(null, user)
  })

// Google帳戶和OAuth 2.0對用戶進行身份驗證,該策略(姐係strategy)需要驗證callback
//客戶端ID，客戶端密鑰和回調URL的選項
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
