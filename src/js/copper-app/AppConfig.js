'use strict';

var nconf = require('nconf').file({file: getConfigFilePath()});

function getConfigFilePath() {
    var path = require("path");
    var configFile = path.join(__dirname, '../..', 'config/app.config');
    return configFile;
}

function readSetting(settingKey) {
    nconf.load();
    return nconf.get(settingKey);
}

function getUserHome() {
    return process.env[(process.platform === 'win32') ? 'LOCALAPPDATA' : 'HOME'];
}

function createDirectory(path) {
    var fs = require('fs');
    try {
        fs.accessSync(path, fs.F_OK);
        return path;
    } catch (e) {
        fs.mkdir(path);
        return path;
    }
}

function getSettingsLocation() {
    var userHome = getUserHome();
    return createDirectory(userHome + "/.copper");
}

module.exports = {
    readSetting: readSetting
};