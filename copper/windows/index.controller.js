var user = "default";
var pass = "password";
var loggedin = false;

/**
 * Renderer process
 * "Main" view
 */
var menu = require('../js/menus.js');

// create desktop menu
menu.create();

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

function loadURLInToWebView(url) {
    var webview = document.getElementById("contentWebView");
    webview.loadURL(url);
}