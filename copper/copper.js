'use strict';

//requires
const electron = require('electron');
//const ipc = require('ipc');
const ipcMain = electron.ipcMain;

//constants
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.

//In built constants
const settings = require('./js/settings');

var mainWindow = null;
var aboutWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  //if (process.platform != 'darwin') {
    app.quit();
  //}
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
    //ensure theme setting is available for the app
    if (!settings.readSettings('theme')) {
        settings.saveSettings('theme', 'light'); //['ctrl', 'shift']);
    }
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 800, height: 600, minWidth: 640, minHeight: 480});

    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/windows/index.html');

    // Open the DevTools.
    //mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});

function closeMainWindow() {
    if (mainWindow) {
        mainWindow.close();
    }
};

ipcMain.on('synchronous-message', function(event, arg) {
  if (arg == 'open-about-window') {
      showAboutWindow();
  } else if (arg == 'close-about-window') {
      closeAboutWindow();
  } else if (arg == 'close-main-window') {
      closeMainWindow();
  }
  event.returnValue = 'done';
});

function showAboutWindow() {
    if (aboutWindow) {
        return;
    }

    aboutWindow = new BrowserWindow({
        //frame: false,
        height: 520,
        resizable: false,
        width: 320
    });

    aboutWindow.loadURL('file://' + __dirname + '/windows/about/about.html');

    aboutWindow.on('closed', function () {
        aboutWindow = null;
    });
}

//Required to close from web page control or menu
function closeAboutWindow() {
    if (aboutWindow) {
        aboutWindow.close();
    }
};