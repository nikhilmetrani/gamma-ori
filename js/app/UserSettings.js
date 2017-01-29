'use strict'
let nconf = require('nconf').file(
  {
    file: require('../services/system.io.service').getSettingsDir() + '/settings.json'
  }
)

module.exports.saveSetting = function saveSetting (settingKey, settingValue) {
  nconf.set(settingKey, settingValue)
  nconf.save()
}

module.exports.readSetting = function readSetting (settingKey) {
  nconf.load()
  return nconf.get(settingKey)
}

module.exports.removeSetting = function removeSetting (settingKey) {
  nconf.set(settingKey, '')
  nconf.save()
}
