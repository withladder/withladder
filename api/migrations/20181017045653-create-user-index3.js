'use strict'

exports.up = function (r, connection) {
  return Promise.all([
    // 新增資料表users,githubProviderId
    r
      .table('users')
      .indexCreate('githubProviderId')
      .run(connection)
  ])
}

exports.down = function (r, connection) {
  return Promise.all([
    // 刪除資料表users,githubProviderId
    r
      .table('users')
      .indexDrop('githubProviderId')
      .run(connection)
  ])
}
