// 利用google的strategy
var GoogleStrategy = require('passport-google-oauth2').Strategy
// 再入passport
var passport = require('passport')

// 當browser first time向sever request時,sever就會整一個session出來(姐係有key:value個種)
// session係將cookie作為memory,d client的data會草左係seession的cookie到
// 因為係外面來的session,資料轉換成帳號資料: User
// https://andyyou.github.io/2017/04/11/express-passport/
module.exports = () => {
  // 存到 req.session.passport.user = { id: ... }
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  // passport將session入面有的 userId ，從資料庫轉換成最初的 User
  passport.deserializeUser((user, done) => {
    // 將 user object 再存到 req.user
    done(null, user)
  })

  // Google帳戶和OAuth 2.0對用戶進行身份驗證,該策略(姐係strategy)需要驗證callback
  // 客戶端ID，客戶端密鑰和回調URL的選項
  passport.use(
    new GoogleStrategy(
      {
        clientID: '1068634871247-ckou6khh8g05fvb52g2f713eft3j9mmi.apps.googleusercontent.com',
        clientSecret: 'Ja2Dghn7XllztASGZebvImXI',
        callbackURL: '/auth/google/callback'
      },
      // 當 google 驗證成功或者失敗, 都會執行下面呢個 function
      // 若成功時, 最後要執行 done(undefined, user)
      // 若失敗時, 最後要執行 done(error)
      // 用 google profile object 同你資料庫裡的 user 作比對
      // 以找出你資料庫裡面屬於呢個 google 的 user
      // { googleId: 'sdkjlfjslkdflksdjfljdsklfjldsk' }
      // { id: 1, user: 'comus', googleId: 'sdkjlfjslkdflksdjfljdsklfjldsk' }
      (request, accessToken, refreshToken, profile, done) => {
        // 由 google 個邊既 profile 攞啲有用既資料

        // 由google 的profile提取用戶名稱.etc
        const name =
          profile.displayName || profile.name
            ? `${profile.name.givenName} ${profile.name.familyName}`
            : ''
        // 暫時定義 user object
        const user = {
          // google提供的ID
          googleProviderId: profile.id,
          // 定義用戶名係空的
          username: null,
          // 用戶名稱
          name,
          // 名
          firstName:
            profile.name && profile.name.givenName
              ? profile.name.givenName
              : '',
          // 姓
          lastName:
            profile.name && profile.name.familyName
              ? profile.name.familyName
              : '',
          // 電郵
          email:
            (profile.emails &&
              profile.emails.length > 0 &&
              profile.emails[0].value) ||
              null,
          // 大頭照
          profilePhoto:
            (profile.photos &&
              profile.photos.length > 0 &&
              profile.photos[0].value) ||
              null,
          // 新增時間
          createdAt: new Date(),
          // 最後上線時間
          lastSeen: new Date()
        }

        // 這個createOrFindUser係api models裹的一個定義佐的野
        // 拿來查googleid在我們的資料庫找出真正的user
        return createOrFindUser(user, 'googleProviderId')
          // 找到user就交user出去,找不到user就null
          .then(user => {
            done(null, user)
            return user
          })
          // 如果資料庫操作有任何錯誤,就將錯誤交出去
          .catch(err => {
            done(err)
            return null
          })
      }
    )
  )
}
