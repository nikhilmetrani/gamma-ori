module.exports.execute = function executeApp (appName, args, callback) {
  let replaced = appName.replace(/%([^%]+)%/g, function(_,n) {
    return process.env[n]
  })
  require('child_process').exec( '"' + replaced + '" ' + args,
    (error, stdout, stderr) => {
      callback(error, stdout, stderr)
    }
  )
}
