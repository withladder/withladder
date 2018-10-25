const withladder = require('withladder')
const models = require('withladder-models-rethinkdb')

const app = withladder({
  models,
  twitter: {
    consumerKey: 'zI2IPQK2L35xx9s3G5Hs4bOiO',
    consumerSecret: 'MKgd4EsxsHeziQQbIvYCVPUydPkOG48tGsOUK0NvmBmXDlFCPa',
    callbackURL: 'https://macau.sh/auth/twitter/callback'
  },
  google: {
    clientID: '1068634871247-ckou6khh8g05fvb52g2f713eft3j9mmi.apps.googleusercontent.com',
    clientSecret: 'Ja2Dghn7XllztASGZebvImXI',
    callbackURL: 'https://macau.sh/auth/google/callback'
  },
  github: {
    clientID: '865fcadcb8427385690d',
    clientSecret: '973edf45a584184cdba35a0252e39dc64ab8ceb8',
    callbackURL: 'https://macau.sh/auth/github/callback'
  },
  facebook: {
    clientID: '1085221001634239',
    clientSecret: '4711c12d9c8341bd5eea6ecba918d70e',
    callbackURL: 'https://macau.sh/auth/facebook/callback'
  }
})

app.get('/', (req, res, next) => {
  if (req.user) {
    // 要執行html就用下面這行
    res.set('Content-Type', 'text/html')
    // login後出現的野
    res.end(`
      logged in 
      <br />hello, ${req.user.name}
      <br /><img src="${req.user.profilePhoto}" width="128" height="128" />
      <br /><a href="/auth/logout">logout</a>
    `)
  } else {
    // 要執行html就用下面這行
    res.set('Content-Type', 'text/html')
    // 未login出現的野
    res.end(`
      this is homepage, please login
      <a href="/auth/google">google login</a>
      <a href="/auth/facebook">facebook login</a>
      <a href="/auth/github">github login</a>
      <a href="/auth/twitter">twitter login</a>
    `)
  }
})

app.apiRoutes.use((req, res, next) => {
  res.end('hello api!!!!!!')
})
