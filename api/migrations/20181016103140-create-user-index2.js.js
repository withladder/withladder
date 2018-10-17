'use strict'

exports.up = function (r, connection) {
  return Promise.all([
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
      .indexCreate('facebookProviderId')
      .run(connection)
  ])
}
