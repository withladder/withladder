// 再入database
const { db } = require('./db')

// 設定功能反回database中所有用戶data
const getUsers = () => {
  return db.table('users')
}

// 滙 出一個object
module.exports = {
  getUsers
}
