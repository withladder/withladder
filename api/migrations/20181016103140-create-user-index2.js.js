'use strict'

exports.up = function (r, connection) {
  return Promise.all([
    // 新增資料表users,facebookProviderId
    r
      .table('users')
      .indexCreate('facebookProviderId')
      .run(connection)
  ])
}

exports.down = function (r, connection) {
  return Promise.all([
    // 刪除資料表users,facebookProviderId
    r
      .table('users')
      .indexCreate('facebookProviderId')
      .run(connection)
  ])
}
