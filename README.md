# 安裝

```
npm install withladder
```

# 用法

```js
rquire('withladder')
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
 