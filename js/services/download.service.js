'use strict'

module.exports.download = function (file_url, progressHandler, callback) {
  let fs = require('fs')
  let url = require('url')
  let http = require('http')
  let ioService = require('./system.io.service')
  let path = require('path')
  let options = {
    host: url.parse(file_url).host,
    path: url.parse(file_url).pathname
  }

  let file_name = url.parse(file_url).pathname.split('/').pop()
  let file_path = path.join(ioService.getDownloadsDir(), file_name)
  if (fs.existsSync(file_path)) {
    callback({
      status: 200,
      path: file_path,
      error: undefined
    })
    return true
  }
  let file = fs.createWriteStream(file_path)
  let downloaded = 0;

  http.get(options, function (res) {
    let len = parseInt(res.headers['content-length'], 10);
    res.pipe(file)
    file.on('finish', function () {
      file.close(() => {
        callback({
          status: 200,
          path: file_path,
          error: undefined
        })
      })  // close() is async, call cb after close completes.
    })
    res
    .on('data', function (chunk) {
    //   file.write(chunk)
      downloaded += chunk.length
      progressHandler(downloaded, len)
    })
    // .on('end', function () {
    //   file.end();
    //   callback({
    //       status: 200,
    //       path: file_path,
    //       error: undefined
    //   });
    // })
    .on('error', function (err) {
      callback({
          status: 404,
          path: undefined,
          error: err
      });
    });  
  })
}
