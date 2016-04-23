'use strict';

const electron = require('electron');
const ipcMain = electron.ipcMain;
const Menu = require('menu');
const copperApp = electron.app;
const BrowserWindow = electron.BrowserWindow;
const userSettings = require('./js/copper-app/UserSettings');
const appConfig = require('./js/copper-app/AppConfig');
const trayMenu = [
    {
      label: "copper",
      click: function() { 
          if (loginStatus || offlineMode) {
              showMainWindow();
            } else {
                showLoginWindow();
            }
        }
    },
    {
      type: 'separator'
    },
    {
      label: "Exit",
      click: function() {
          exitCopperApp();
        }
    }
  ];

var loginStatus = false;
var offlineMode = false;
var mainWindow = null;
var aboutWindow = null;
var loginWindow = null;
var dialog = require('dialog');
const Tray = electron.Tray;

var appIcon = null;

//startup
copperApp.on('ready', function() {
    appIcon = new Tray('./assets/images/eyot.png');
    var contextMenu = Menu.buildFromTemplate(trayMenu);
    appIcon.setToolTip('63Cu');
    appIcon.setContextMenu(contextMenu);
    
    if (getSavedSession()) {
        if (getLoginStatus()) {
            showMainWindow();
        } else {
            showLoginWindow();
        }
    } else {
        showLoginWindow();
    }
});

// shutdown
copperApp.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
   //copperApp.quit();
  }
});


//main window
function showMainWindow() {
    if (null !== mainWindow) {
        return;
    }
    if (!userSettings.readSetting('theme')) {
        userSettings.saveSetting('theme', appConfig.readSetting('theme'));
    }
    mainWindow = new BrowserWindow({width: 800, height: 600, minWidth: 640, minHeight: 480});
    mainWindow.setMenu(null);
    
    mainWindow.loadURL('file://' + __dirname + '/screens/index.html?loggedin=' + loginStatus);
    
    mainWindow.on('closed', function() {
        mainWindow = null;
    });
}

function closeMainWindow() {
    if (mainWindow) {
        mainWindow.close();
    }
};

//login window
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
        loginWindow = null;
    });
}

function closeLoginWindow() {
    if (loginWindow) {
        loginWindow.close();
    }
};

//about window
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

function closeAboutWindow() {
    if (aboutWindow) {
        aboutWindow.close();
    }
};

//closing all windows
function closeAllWindows() {
    closeAboutWindow();
    closeLoginWindow();
    closeMainWindow();
}

//ipc listner
ipcMain.on('synchronous-message', function(event, arg) {
  if (arg == 'open-about-window') {
      showAboutWindow();
  } else if (arg == 'open-login-window') {
      showLoginWindow();
  }  else if (arg == 'open-main-window') {
      showMainWindow();
  } else if (arg == 'close-about-window') {
      closeAboutWindow();
  } else if (arg == 'close-main-window') {
      closeMainWindow();
  } else if (arg == 'login-success') {
      loginStatus = true;
      offlineMode = false;
      showMainWindow();
      //closeLoginWindow();
  } else if (arg == 'use-offline-mode') {
      loginStatus = false;
      offlineMode = true;
      showMainWindow();
      //closeLoginWindow();
  } else if (arg == 'exit-copper-app') {
      exitCopperApp();
  }
  event.returnValue = 'done';
});

function exitCopperApp() {
    closeUserSession();
    closeAllWindows();
    copperApp.quit();
}

function getLoginStatus() {
    if (!userSettings.readSetting("loggedInUser")) {
        loginStatus = false;
    } else {
        loginStatus = true;
    }
    return loginStatus;
}

function getSavedSession() {
    if ("yes" == userSettings.readSetting("personalSys")) {
        return true;
    } else {
        return false;
    }
}

function closeUserSession() {
    if ("yes" !== userSettings.readSetting("personalSys")) {
        userSettings.removeSetting("loggedInUser");
        userSettings.removeSetting("offlineMode");
    }
}
