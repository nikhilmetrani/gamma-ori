'use strict';
const jsonRequest = require("./json-request.service");
const request = require('request');

function user(callback) {
    jsonRequest.get(
        '/api/0/user',
        (err, res, body) => callback(err, res, body)
    );
}

module.exports = {
    getUser: user,
}