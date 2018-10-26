# 安裝

```
npm i withladder
```

```
npm i withladder-models-rethinkdb
```

# 用法

運行up所有程式
```
npm run db:migrate
```

修改host ip address
```
npm run db:migrate -- --host localhost
```

修改username
```
npm run db:migrate -- -- username:
```

修改port
```
npm run db:migrate -- --port 12345
```

修改db
```
npm run db:migrate -- --db 12345 
```

修改driver
```
npm run db:migrate -- --driver mangodbdash
```

修改migrationsDirectory
```
npm run db:migrate -- --migrationsDirectory path.join(__dirname, '..', 'migrations')
```

# 流程

- 載入withladder, withladder-models-rethinkdb
- withladder = createApp,options object入面增入witherladder object
  - 輸入api的資料
  - 網站修改
  - api/routes/api/index.js入面比用戶發揮

# 執行

```
npm start
```