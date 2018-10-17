'use strict'

exports.up = function (r, connection) {
  return Promise.all([
    // 新增資料表users,ProviderId
    r
      .table('users')
      .indexCreate('ProviderId')
      .run(connection)
  ])
}

exports.down = function (r, connection) {
  return Promise.all([
    // 刪除資料表users,ProviderId
    r
      .table('users')
      .indexCreate('ProviderId')
      .run(connection)
  ])
}
