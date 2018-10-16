'use strict'

exports.up = function (r, connection) {
  return Promise.all([
    r
      .table('users')
      .indexCreate('email')
      .run(connection),
    r
      .table('users')
      .indexCreate('googleProviderId')
      .run(connection),
    r
      .table('users')
      .indexCreate('facebookProviderId')
      .run(connection)
  ])
}

exports.down = function (r, connection) {
  return Promise.all([
    r
      .table('users')
      .indexDrop('email')
      .run(connection),
    r
      .table('users')
      .indexDrop('googleProviderId')
      .run(connection),
    r
      .table('users')
      .indexCreate('facebookProviderId')
      .run(connection)
  ])
}
