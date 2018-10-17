var debug = require('debug')('api:authentication')
// 利用google的strategy
var GoogleStrategy = require('passport-google-oauth2').Strategy

var FacebookStrategy = require('passport-facebook').Strategy

var GitHubStrategy = require('passport-github2').Strategy

var TwitterStrategy = require('passport-twitter').Strategy

// 再入passport
var passport = require('passport')
// 係models/users入面拿定義了的功能出黎用
var { createOrFindUser } = require('./models/users')
var { saveUserProvider } = require('./models/users')
var { getUserByIndex } = require('./models/users')

// 當browser first time向sever request時,sever就會整一個session出來(姐係有key:value個種)
// session係將cookie作為memory,d client的data會草左係seession的cookie到
// 因為係外面來的session,資料轉換成帳號資料: User
// https://andyyou.github.io/2017/04/11/express-passport/
module.exports = () => {
  debug('initPassport starting...')

  // 存到 req.session.passport.user = { id: ... }
  debug('define passport.serializeUser...')
  passport.serializeUser((user, done) => {
    debug('passport.serializeUser, user:', user)
    done(null, user.id)
  })

  // passport將session入面有的 userId ，從資料庫轉換成最初的 User
  debug('define passport.deserializeUser...')
  passport.deserializeUser((user, done) => {
    debug('passport.deserializeUser, user:', user)
    // 將 user object 再存到 req.user
    done(null, user)
  })

  // Google帳戶和OAuth 2.0對用戶進行身份驗證,該策略(姐係strategy)需要驗證callback
  // 客戶端ID，客戶端密鑰和回調URL的選項
  debug('define passport 用 google 的戰略...')
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
        debug('GoogleStrategy 戰略的 callback, profile 已經由 google 個邊攞左野返黎')

        // 由google 的profile提取用戶名稱.etc
        const name =
          profile.displayName || profile.name
            ? `${profile.name.givenName} ${profile.name.familyName}`
            : ''
        // 暫時定義 user object
        const user = {
          ProviderId: null,
          // google提供的ID
          googleProviderId: profile.id,
          // facebook提供的ID
          facebookProviderId: null,
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
        debug('我地由 profile 裡提取少少野, user:', user)

        // 這個createOrFindUser係api models裹的一個定義佐的野
        // 拿來查googleid在我們的資料庫找出真正的user
        return createOrFindUser(user, 'googleProviderId')
          // 找到user就交user出去,找不到user就null
          .then(user => {
            debug('執行完 createOrFindUser 之後, 返回資料庫裡的一筆 user 資料:', user)
            done(null, user)
            return user
          })
          // 如果資料庫操作有任何錯誤,就將錯誤交出去
          .catch(err => {
            debug('createOrFindUser 有錯誤:', err)
            done(err)
            return null
          })
      }
    )
  )

  // 客戶端ID，客戶端密鑰和回調URL的選項
  passport.use(
    new FacebookStrategy(
      {
        clientID: '1085221001634239',
        clientSecret: '4711c12d9c8341bd5eea6ecba918d70e',
        callbackURL: '/auth/facebook/callback',
        profileFields: [
          'id',
          'displayName',
          'email',
          'photos',
          'first_name',
          'last_name'
        ]
      },
      // 用 facebook profile object 同你資料庫裡的 user 作比對
      // 以找出你資料庫裡面屬於呢個 facebook 的 user
      (request, accessToken, refreshToken, profile, done) => {
        // 暫時定義 user object
        const user = {
          ProviderId: null,
          // facebook提供的ID
          facebookProviderId: profile.id,
          // google提供的ID
          googleProviderId: null,
          // 定義用戶名係空的
          username: null,
          // 用戶名稱
          name: profile.displayName,
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
            profile.emails &&
            profile.emails.length > 0 &&
            profile.emails[0].value !== undefined
              ? profile.emails[0].value
              : null,
          // 大頭照
          profilePhoto:
            profile.photos &&
            profile.photos.length > 0 &&
            profile.photos[0].value !== undefined
              ? profile.photos[0].value
              : null,
          // 新增時間
          createdAt: new Date(),
          // 最後上線時間
          lastSeen: new Date()
        }
        // 這個createOrFindUser係api models裹的一個定義佐的野
        // 拿來查facebookid在我們的資料庫找出真正的user
        return createOrFindUser(user, 'facebookProviderId')
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

  passport.use(new GitHubStrategy({

    clientID: '865fcadcb8427385690d',
    clientSecret: '973edf45a584184cdba35a0252e39dc64ab8ceb8',
    callbackURL: 'http://localhost:3001/auth/github/callback',
    scope: ['user'],
    passReqToCallback: true
  },
  async (request, accessToken, refreshToken, profile, done) => {
    debug('ffffffff')
    const name =
    profile.displayName || profile.username || profile._json.name || ''

    const splitProfileUrl = profile.profileUrl.split('/')
    const fallbackUsername = splitProfileUrl[splitProfileUrl.length - 1]
    const githubUsername =
    profile.username || profile._json.login || fallbackUsername

    if (request.user) {
      if (request.user.githubProviderId) {
        if (!request.user.githubUsername) {
          return saveUserProvider(
            request.user.id,
            'githubProviderId',
            profile.id,
            { githubUsername: githubUsername }
          )
            .then(user => {
              done(null, user)
              return user
            })
            .catch(err => {
              done(err)
              return null
            })
        }

        return done(null, request.user)
      }

      const existingUserWithProviderId = await getUserByIndex(
        'githubProviderId',
        profile.id
      )
      if (!existingUserWithProviderId) {
        return saveUserProvider(
          request.user.id,
          'githubProviderId',
          profile.id,
          { githubUsername: githubUsername }
        )
          .then(user => {
            done(null, user)
            return user
          })
          .catch(err => {
            done(err)
            return null
          })
      }
      if (existingUserWithProviderId) {
        return done(null, request.user)
      }
    }

    const user = {
      providerId: null,
      facebookProviderId: null,
      googleProviderId: null,
      githubProviderId: profile.id,
      username: null,
      name: name,
      email:
              (profile.emails &&
                profile.emails.length > 0 &&
                profile.emails[0].value) ||
              null,
      profilePhoto:
              (profile._json.avatar_url && profile._json.avatar_url) || null,
      createdAt: new Date(),
      lastSeen: new Date()
    }

    return createOrFindUser(user, 'githubProviderId')
      .then(user => {
        done(null, user)
        return user
      })
      .catch(err => {
        done(err)
        return null
      })
  }
  )
  )

  passport.use(
    new TwitterStrategy(
      {
        consumerKey: '',
        consumerSecret: '',
        callbackURL: '',
        includeEmail: true
      },
      (request, accessToken, refreshToken, profile, done) => {
        const name =
          profile.displayName ||
          profile._json.name ||
          profile._json.screen_name ||
          profile.username ||
          ''

        const user = {
          providerId: profile.id,
          facebookProviderId: null,
          googleProviderId: null,
          githubProviderId: null,
          username: null,
          name,

          // 電郵
          email:
            (profile.emails &&
              profile.emails.length > 0 &&
              profile.emails[0].value) ||
              null,
          // 大頭照
          profilePhoto:
            (profile.emails &&
              profile.emails.length > 0 &&
              profile.emails[0].value) ||
              null,
          coverPhoto: profile._json.profile_background_image_url_https
            ? profile._json.profile_background_image_url_https
            : null,
          createdAt: new Date(),
          lastSeen: new Date()
        }

        return createOrFindUser(user, 'ProviderId')
          .then(user => {
            done(null, user)
            return user
          })
          .catch(err => {
            done(err)
            return null
          })
      }
    )
  )
  debug('initPassport end...')
}
