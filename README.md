# 安裝

```
npm install withladder
```

# 用法

```js
require('withladder')
```

# 瀏覽器

http://localhost:3001

# 資料庫

在 `api/migrations` 起檔案

```
npm run rethinkdb:migrate create create-user
```

運行up所有程式

```
npm run db:migrate
```

刪除down所有程式

```
npm run db:drop
```

# 解釋資料夾內容

-/api : 運行一個伺服器,將網址交比中介處理
  -/migrations ： 利用3個特別功能去初始化資料夾
  -/routes : api和auth的中介
    -/api : 滙出api的中介
      -/models : 同有資料庫有關的操作直接放這裏
    -/auth : 同登入登出有關的仲介 
 
# 流程

當一個 request 入黎個時, 會經過啲乜?

- request 入到黎
  - 所有 url, 會經過 middlewares 中間件
    - 所有 url, 將經過cookieParser, 就是將那一堆req.header.cookie變成req.cookie
    - 所有 url, 將經過session, 如果資料庫有req.session的時候,自動化整一個cookie出來
    - 所有 url, 將經過passport.initialize, 是一個初始化Passport的中間件
    - 所有 url, 將經過passport.session, 正反序列化用戶對象
  - 設定createApp function
    - 只有 /auth, 會再經過 authRoutes
      - 根據 /auth/facebook網址載入到facebookAuthRoutes
        - 而facebookAuthRoutes, 會經過 api/routes/auth/facebook
          - 輸入http://localhost:3001/auth/facebook/ 就會login facebook
          - 輸入http://localhost:3001/auth/facebook/callback 
            - 成功登入就會返回根目錄
            - 失敗就會返回/login
      - 根據 /auth/google網址載入到googleAuthRoutes
        - 而googleAuthRoutes, 會經過 api/routes/auth/google
          - 輸入http://localhost:3001/auth/google/ 就會login google
          - 輸入http://localhost:3001/auth/google/callback 
            - 成功登入就會返回根目錄
            - 失敗就會返回/login
      - 根據 /auth/github網址載入到githubAuthRoutes
        - 而githubAuthRoutes, 會經過 api/routes/auth/github
          - 輸入http://localhost:3001/auth/github/ 就會login github
          - 輸入http://localhost:3001/auth/github/callback 
            - 成功登入就會返回根目錄
            - 失敗就會返回/login
      - 根據 /auth/twitter網址載入到twitterAuthRoutes
        - 而twitterAuthRoutes, 會經過 api/routes/auth/twitter
        - 輸入http://localhost:3001/auth/twitter/ 就會login twitter
        - 輸入http://localhost:3001/auth/twitter/callback 
            - 成功登入就會返回根目錄
            - 失敗就會返回/login
      - 根據 /auth/logout網址載入到logoutRoutes
        - 而logoutAuthRoutes, 會經過 api/routes/auth/logout
          - 輸入http://localhost:3001/auth/logout/ 就會登出網站
  - 只有 /api, 會再經過 apiRoutes 
  