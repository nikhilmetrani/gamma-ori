const userSettings = require("../../js/app/UserSettings");
const ipcRenderer = require('electron').ipcRenderer;
let user = null;
const loginService = require('../../js/services/login.service');

let userName = "default";
let userPass = "password";

document.addEventListener("keydown", function (e) {
    if (e.which === 123) {
        require('electron').remote.getCurrentWindow().toggleDevTools();
    } else if (e.which === 116) {
        location.reload();
    }
});


function loadUserCredentialsFromCache() {
    user = userSettings.readSetting("loggedInUser");
    return user;
}

function populateUserToUI() {
    if ("yes" === userSettings.readSetting("personalSys")) {
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
    require('electron').remote.getCurrentWindow().close();
}

function processLogin() {
    loginService.login(document.getElementById("inputEmail").value, document.getElementById("inputPassword").value, loginHandler);
}

function loginHandler(err, res, body) {
    if (!err && res.statusCode == 200) {
        notifyLoginSuccess();
        closeLoginWindow();
    }
}
