var express = require('express')
var app = express()
var apiRoutes = require('./routes/api')
var authRoutes = require('./routes/auth')
// /auth => hello auth
// /api => hello api

app.use('/auth', authRoutes)

app.use('/api', apiRoutes)

app.listen(3001, function () {
  console.log('API server listening on port 3001!')
})

module.exports = app
