'use strict'

let nconf = require('nconf').file({file: getConfigFilePath()})

function getConfigFilePath () {
  let path = require('path')
  return path.join(__dirname, '../..', 'config/app.config')
}

module.exports.readSetting = function readSetting (settingKey) {
  nconf.load()
  return nconf.get(settingKey)
}
