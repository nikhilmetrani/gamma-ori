'use strict'
const jsonRequest = require('./json-request.service')

module.exports.getUser = function user (callback) {
  jsonRequest.get(
    '/api/0/user',
    (err, res, body) => callback(err, res, body)
  )
}
