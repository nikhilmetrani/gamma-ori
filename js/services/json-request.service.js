
'use strict'
const request = require('request')
const serverUrl = 'http://localhost:8080'

module.exports.get = function get (api, callback) {
  return request.get(
    serverUrl + api,
    {
      headers: {
        'x-auth-token': window.localStorage.getItem('jwt')
      }
    },
    (err, res, body) => {
      let data = undefined
      try {
        data = JSON.parse(body)
      } catch (ex) {
        data = ''
      }
      callback(err, res, data)
    }
  )
}

module.exports.post = function post (api, body, callback) {
  return request.post(
    serverUrl + api,
    {
      json: body,
      headers: {
        'x-auth-token': window.localStorage.getItem('jwt')
      }
    },
    (err, res, body) => {
      let data = undefined
      try {
        data = JSON.parse(body)
      } catch (ex) {
        data = ''
      }
      callback(err, res, data)
    }
  )
}

// put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
//   return this.http.put(url, body, mergeAuthToken(options))
// }

// delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
//   return this.http.delete(url, mergeAuthToken(options))
// }

// patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
//   return this.http.patch(url, body, mergeAuthToken(options))
// }

// head(url: string, options?: RequestOptionsArgs): Observable<Response> {
// return this.http.head(url, mergeAuthToken(options))
// }
