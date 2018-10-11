'use strict'

exports.up = function (r, connection) {
  // 新增資料表users
  return r
    .tableCreate('users')
    .run(connection)
}

exports.down = function (r, connection) {
  // 刪除資料表users
  return r
    .tableDrop('users')
    .run(connection)
}
