// 將models/users的getUsers輸入
const { getUsers } = require('./models/users')

// 滙出一個function,作為仲介者使用
module.exports = async (req, res, next) => {
  const users = await getUsers()
  console.log(users)

  console.log('hello api')
  next()
}
