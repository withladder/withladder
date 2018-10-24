// 滙出一個function,作為仲介者使用
// awit係等要同asnyc一起使用,而且要loading這一行再運行下面的東西
module.exports = async (req, res, next) => {
  const users = await req.models.getUsers()
  console.log(users)
  console.log('hello api')
  next()
}
