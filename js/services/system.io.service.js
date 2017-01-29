'use strict'

function getUserHome () {
  return process.env[(process.platform === 'win32') ? 'LOCALAPPDATA' : 'HOME']
}

function createDirectory (path) {
  let fs = require('fs')
  try {
    fs.accessSync(path, fs.F_OK)
    return path
  } catch (e) {
    fs.mkdir(path)
    return path
  }
}

function getSettingsDir () {
  return createDirectory(getUserHome() + '/.gamma-ori')
}

function getDownloadsDir () {
  return createDirectory(getUserHome() + '/.gamma-ori/downloads')
}

module.exports = {
  getUserHome: getUserHome,
  createDirectory: createDirectory,
  getSettingsDir: getSettingsDir,
  getDownloadsDir: getDownloadsDir
}