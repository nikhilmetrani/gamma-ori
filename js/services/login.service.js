'use strict'
const jsonRequest = require('./json-request.service')

module.exports.login = function login (username, password, handler) {
  const body = {
    username: username,
    password: password
  }
  jsonRequest.post(
    '/api/1/login',
    body,
    function (err, res, body) {
      if (!err && res.statusCode === 200) {
        window.localStorage.setItem('jwt', res.headers['x-auth-token'])
      }
      handler(err, res, body)
    }
  )
}

module.exports.logout = function logout () {
  window.localStorage.removeItem('jwt')
}

module.exports.isSignedIn = function isSignedIn () {
  return window.localStorage.getItem('jwt') !== null
}
