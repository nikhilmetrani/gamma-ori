const userSettings = require("../../js/copper-app/UserSettings");
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
    /*if (!user) {
        document.getElementById("checkBoxRemember").value = false;
        alert("no user"); 
    } else if (user) {
        document.getElementById("inputEmail").value = user.name;
        document.getElementById("checkBoxRemember").value = true;
        var keepSession = userSettings.readSetting("sessionToken");
        if (keepSession) {
            var remote = require('remote');
            remote.getCurrentWindow().close();
        }
    }*/
}

function populateUserToUI() {
    if (user) {
        document.getElementById("inputEmail").value = user;
        document.getElementById("checkBoxRemember").checked = true;
    }
}

function getSavedSession() {
    return userSettings.readSetting("keepSession");
}

function saveLoginInfo() {
    userSettings.saveSetting("loggedInUser", document.getElementById("inputEmail").value);
    userSettings.saveSetting("keepSession", "yes");
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
        if (document.getElementById("checkBoxRemember").checked) {
            var inUserName = document.getElementById("inputEmail").value;
            userSettings.saveSetting("loggedInUser", inUserName);
            if (document.getElementById("checkBoxSaveSession").checked) {
                userSettings.saveSetting("keepSession", "yes");
            }
        }
        return true;
    }
    alert("Invalid credentials");
}