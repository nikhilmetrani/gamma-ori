'use strict';
const jsonRequest = require("./json-request.service");
const request = require('request');

function login(username, password, handler) {
    const body = {
      username: username,
      password: password,
    };
    jsonRequest.post(
        '/api/1/login',
        body,
        function (err, res, body) {
            if (!err && res.statusCode == 200) {
                localStorage.setItem('jwt', res.headers['x-auth-token']);
            }
            handler(err, res, body);
        }
    );
}

function logout() {
    localStorage.removeItem('jwt');
}

function isSignedIn() {
    return localStorage.getItem('jwt') !== null;
}

module.exports = {
    login: login,
    logout: logout,
    isSignedIn: isSignedIn
}