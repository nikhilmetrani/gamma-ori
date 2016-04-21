'use strict';

//requires
const electron = require('electron');
//const ipc = require('ipc');
const ipcMain = electron.ipcMain;
const Menu = require('menu');
//constants
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.

//In built constants
const userSettings = require('./js/copper-app/UserSettings');
const appConfig = require('./js/copper-app/AppConfig');

//const trayMenu = require('./js/copper-app/traymenu');

var mainWindow = null;
var aboutWindow = null;
var loginWindow = null;
var dialog = require('dialog');


const Tray = electron.Tray;

var appIcon = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
   //app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
    appIcon = new Tray('./assets/images/eyot@1.33x.png');
    var trayMenu = appConfig.readSetting("trayMenu");
    //dialog.showMessageBox({ message: trayMenu,
      //buttons: ["OK"] });
    var contextMenu = Menu.buildFromTemplate(trayMenu);
    appIcon.setToolTip('This is my application.');
    appIcon.setContextMenu(contextMenu);
    showLoginWindow();
});

function showMainWindow() {
    //ensure theme setting is available for the app
    if (!userSettings.readSetting('theme')) {
        userSettings.saveSetting('theme', 'light'); //['ctrl', 'shift']);
    }
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 800, height: 600, minWidth: 640, minHeight: 480});
    mainWindow.setMenu(null);
    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/screens/index.html');

    // Open the DevTools.
    //mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function() {
        mainWindow = null;
    });
}

function closeMainWindow() {
    if (mainWindow) {
        mainWindow.close();
    }
};

ipcMain.on('synchronous-message', function(event, arg) {
  if (arg == 'open-about-window') {
      showAboutWindow();
  } else if (arg == 'open-main-window') {
      showMainWindow();
  } else if (arg == 'close-about-window') {
      closeAboutWindow();
  } else if (arg == 'close-main-window') {
      closeMainWindow();
  } else if (arg == 'login-success') {
      showMainWindow();
      closeLoginWindow();
  } else if (arg == 'use-offline-mode') {
      showMainWindow();
      closeLoginWindow();
  } else if (arg == 'exit-copper-app') {
      closeAllWindows();
      app.quit();
  }
  event.returnValue = 'done';
});

function showLoginWindow() {
    if (loginWindow) {
        return;
    }

    loginWindow = new BrowserWindow({
        //frame: false,
        height: 320,
        //resizable: false,
        width: 480
    });
    loginWindow.setMenu(null);
    loginWindow.loadURL('file://' + __dirname + '/screens/login/login.html');

    loginWindow.on('closed', function () {
        showMainWindow();
        loginWindow = null;
    });
}

function closeLoginWindow() {
    if (loginWindow) {
        loginWindow.close();
    }
};

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
    aboutWindow.setMenu(null);
    aboutWindow.loadURL('file://' + __dirname + '/screens/about/about.html');

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

function closeAllWindows() {
    closeAboutWindow();
    closeLoginWindow();
    closeMainWindow();
}