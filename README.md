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
