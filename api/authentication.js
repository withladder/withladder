// 比自己測有無錯時用
var debug = require('debug')('api:authentication')
// 利用google的strategy
var GoogleStrategy = require('passport-google-oauth2').Strategy
// 利用Facebook的strategy
var FacebookStrategy = require('passport-facebook').Strategy
// 利用GitHub的strategy
var GitHubStrategy = require('passport-github2').Strategy

// var TwitterStrategy = require('passport-twitter').Strategy

// 再入passport
var passport = require('passport')
// 係models/users入面拿定義了的功能出黎用
var { getUserByIndex, getUser, saveUserProvider, createOrFindUser } = require('./models/users')
// 字串的頭同尾,姐係{},有的話就true,無的話就false
const isSerializedJSON = (str) => str[0] === '{' && str[str.length - 1] === '}'

// 當browser first time向sever request時,sever就會整一個session出來(姐係有key:value個種)
// session係將cookie作為memory,d client的data會草左係seession的cookie到
// 因為係外面來的session,資料轉換成帳號資料: User
// https://andyyou.github.io/2017/04/11/express-passport/
module.exports = () => {
  debug('initPassport starting...')

  // 存到 req.session.passport.user = 'sdfsdfsf' <==id
  debug('define passport.serializeUser...')
  passport.serializeUser((user, done) => {
    debug('passport.serializeUser, user:', user)
    // 如果user係字串就將user變成字串
    // 如果不是字串,是其他object和array都變成字串
    done(null, typeof user === 'string' ? user : JSON.stringify(user))
  })

  // passport將session入面有的 userId ，從資料庫轉換成最初的 User
  debug('define passport.deserializeUser...')
  passport.deserializeUser(async (data, done) => {
    debug('passport.deserializeUser, data:', data)
    // 將 user object 再存到 req.user
    // 如果true的時候
    if (isSerializedJSON(data)) {
      // 定義user
      let user
      try {
        // 分析data
        user = JSON.parse(data)
        debug('user經過分析data', user)
      } catch (err) {} // 如果error的話就顯示空白
      // 如果有user 和 user.id 和user.createsAt用戶創立時間
      if (user && user.id && user.createdAt) {
        // 就返回user
        return done(null, user)
      }
    }
    // 如果無user 和 user.id 和user.createsAt用戶創立時間
    // 將個data當為user.id,data係有埋個D object同array變成的字串
    const user = await getUser({ id: data })
      .then(user => {
        done(null, user)
      })
      .catch(err => {
        done(err)
      })
    debug('經過database', user)
    return user
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
          providerId: null,
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
          providerId: null,
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
  // 客戶端ID，客戶端密鑰和回調URL的選項
  passport.use(new GitHubStrategy({

    clientID: '865fcadcb8427385690d',
    clientSecret: '973edf45a584184cdba35a0252e39dc64ab8ceb8',
    callbackURL: 'http://localhost:3001/auth/github/callback',
    scope: ['user'],
    passReqToCallback: true
  },
  // 用 github profile object 同你資料庫裡的 user 作比對
  // 以找出你資料庫裡面屬於呢個 github 的 user
  async (request, accessToken, refreshToken, profile, done) => {
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
      if (existingUserWithProviderId) {
        return done(null, request.user)
      }
    }
    // 暫時定義 user object
    const user = {
      providerId: null,
      facebookProviderId: null,
      googleProviderId: null,
      githubProviderId: profile.id,
      username: null,
      name: name,
      // 電郵
      email:
              (profile.emails &&
                profile.emails.length > 0 &&
                profile.emails[0].value) ||
              null,
      // 大頭照
      profilePhoto:
              (profile._json.avatar_url && profile._json.avatar_url) || null,
      // 新增時間
      createdAt: new Date(),
      // 最後上線時間
      lastSeen: new Date()
    }
    // 這個createOrFindUser係api models裹的一個定義佐的野
    // 拿來查githubid在我們的資料庫找出真正的user
    return createOrFindUser(user, 'githubProviderId')
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
  // 客戶端ID，客戶端密鑰和回調URL的選項
  /*
  passport.use(
    new TwitterStrategy(
      {
        consumerKey: '',
        consumerSecret: '',
        callbackURL: '',
        includeEmail: true
      },
      // 用 twitter profile object 同你資料庫裡的 user 作比對
      // 以找出你資料庫裡面屬於呢個 twitter 的 user
      (request, accessToken, refreshToken, profile, done) => {
        const name =
          profile.displayName ||
          profile._json.name ||
          profile._json.screen_name ||
          profile.username ||
          ''
        // 暫時定義 user object
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
          // 封面照片
          coverPhoto: profile._json.profile_background_image_url_https
            ? profile._json.profile_background_image_url_https
            : null,
          // 新增時間
          createdAt: new Date(),
          // 最後上線時間
          lastSeen: new Date()
        }
        // 這個createOrFindUser係api models裹的一個定義佐的野
        // 拿來查twitterid在我們的資料庫找出真正的user
        return createOrFindUser(user, 'providerId')
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
  */
  debug('initPassport end...')
}
