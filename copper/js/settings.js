'use strict';

var nconf = require('nconf').file({file: getSettingsLocation() + '/settings.json'});

function saveSettings(settingKey, settingValue) {
    nconf.set(settingKey, settingValue);
    nconf.save();
}

function readSettings(settingKey) {
    nconf.load();
    return nconf.get(settingKey);
}

function getUserHome() {
    return process.env[(process.platform == 'win32') ? 'LOCALAPPDATA' : 'HOME'];
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
    saveSettings: saveSettings,
    readSettings: readSettings
};