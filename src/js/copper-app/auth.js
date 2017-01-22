'use strict';

//requires
const electron = require('electron');
//const ipc = require('ipc');
const ipcMain = electron.ipcMain;

//constants
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.

//In built constants
const settings = require('../settings');

var loginWindow = null;

function showLoginWindow() {
    if (loginWindow) {
        return;
    }

    loginWindow = new BrowserWindow({
        //frame: false,
        height: 520,
        //resizable: false,
        width: 320
    });
    loginWindow.setMenu(null);
    loginWindow.loadURL('file://' + __dirname + '../../screens/login/login.html');

    loginWindow.on('closed', function () {
        loginWindow = null;
    });
}

module.exports = {
    login: showLoginWindow
}