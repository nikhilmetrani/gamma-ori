const userSettings = require("../../js/copper-app/UserSettings");
const ipcRenderer = require('electron').ipcRenderer;
var user = null;
 
var userName = "default";
var userPass = "password";

document.addEventListener("keydown", function (e) {
    if (e.which === 123) {
        require('remote').getCurrentWindow().toggleDevTools();
    } else if (e.which === 116) {
        location.reload();
    }
});


function loadUserCredentialsFromCache() {
    user = userSettings.readSetting("loggedInUser");
    return user;
}

function populateUserToUI() {
    if ("yes" == userSettings.readSetting("personalSys")) {
        document.getElementById("inputEmail").value = user;
        document.getElementById("checkBoxMySystem").checked = true;
    } else {
        document.getElementById("inputEmail").value = "";
        document.getElementById("checkBoxMySystem").checked = false;
    }
}

function getSavedSession() {
    return userSettings.readSetting("personalSys");
}

function saveLoginInfo() {
    if (document.getElementById("checkBoxMySystem").checked) {
        userSettings.saveSetting("loggedInUser", document.getElementById("inputEmail").value);
        userSettings.saveSetting("personalSys", "yes");
    } else {
        userSettings.saveSetting("personalSys", "no");
    }
    userSettings.saveSetting("offlineMode", "false");
}

function saveOfflineMode() {
    userSettings.saveSetting("offlineMode", "true");
}

function launchInOfflineMode() {
    ipcRenderer.sendSync('synchronous-message', 'use-offline-mode');
}

function notifyLoginSuccess() {
    ipcRenderer.sendSync('synchronous-message', 'login-success');
}

function closeLoginWindow() {
    var remote = require('remote');
    remote.getCurrentWindow().close();
}

function validateLogin() {
    var inUserName = document.getElementById("inputEmail").value;
    var inPassword = document.getElementById("inputPassword").value;
    if (userName == inUserName) {
        if (userPass == inPassword) {
            return true;
        }
    }
    return false;
}

function processLogin() {
    if (validateLogin()) {
        return true;
    }
    alert("Invalid credentials");
    return false;
}