var user = "default";
var pass = "password";
var loggedin = false;
const settings = require("../js/settings");

document.addEventListener("keydown", function (e) {
    if (e.which === 123) {
        toggleDeveloperTools();
    } else if (e.which === 116) {
        location.reload();
    }
});

function validateLogin() {
    var inUserName = document.getElementById("email").value;
    var inPassword = document.getElementById("pwd").value;
    if (user == inUserName) {
        if (pass == inPassword) {
            loggedin = true;
            $('#loginModal').modal('hide');
        }
    }
    if (!loggedin) {
        alert("Error: Invalid unername and/or password!");
    }
    return loggedin;
}

function isLoggedIn() {
    if (!loggedin) {
        alert("Error: You must login first");
    }
    return loggedin;
}

function toggleDeveloperTools() {
    require('remote').getCurrentWindow().toggleDevTools();
}

function saveSetting(settingKey, settingValue) {
    settings.saveSettings(settingKey, settingValue);
}

function readSetting(settingKey) {
    return settings.readSettings(settingKey);
}