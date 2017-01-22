
'use strict';
const request = require('request');
const serverUrl = 'http://localhost:8080';

function get(api, callback) {
    return request.get(
        serverUrl + api,
        {
            headers: {
                'x-auth-token': localStorage.getItem('jwt')
            }
        },
        (err, res, body) => {
            try {
                callback(err, res, JSON.parse(body));
            } catch (ex) {
                callback(err, res, body);
            }
        }
    );
}

function post(api, body, callback) {
    return request.post(
        serverUrl + api,
        {
            json: body, 
            headers: {
                'x-auth-token': localStorage.getItem('jwt')
            }
        },
        (err, res, body) => {
            try {
                callback(err, res, JSON.parse(body));
            } catch (ex) {
                callback(err, res, body);
            }
        }
    );
}

module.exports = {
    get: get,
    post: post
}

// put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
//     return this.http.put(url, body, mergeAuthToken(options));
// }

// delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
//     return this.http.delete(url, mergeAuthToken(options));
// }

// patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
//     return this.http.patch(url, body, mergeAuthToken(options));
// }

// head(url: string, options?: RequestOptionsArgs): Observable<Response> {
// return this.http.head(url, mergeAuthToken(options));
// }