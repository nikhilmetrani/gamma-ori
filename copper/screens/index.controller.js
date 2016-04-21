var user = "default";
var pass = "password";
var loggedin = false;
const userSettings = require("../js/copper-app/UserSettings");

//var menu = require('../js/menus');

//menu.create();

const ipcRenderer = require('electron').ipcRenderer;

var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http) {
  $http.get("https://s3-ap-southeast-1.amazonaws.com/eyot-staging.com/store.html")
  .then(function(response) {
      $scope.myWelcome = response.data;
  });
});
   
function showAboutBox() {
    ipcRenderer.sendSync('synchronous-message', 'open-about-window');
}
            
function enableWebViewMessageListener() {
    var webview = document.getElementById("contentWebView");
    webview.addEventListener('ipc-message', function(event) {
        var app = event.args[0][0];
        console.log(event.channel + " : " + app.id + ", " + app.name);
    });
}

function loadURLInToWebView(url) {
    var webview = document.getElementById("contentWebView");
    webview.loadURL(url);
}

function loadContentPage(url) {
    document.getElementById("content").innerHTML='<object type="text/html" data="' + url + '" ></object>';
}

function setCSS(css) {
	try {
		// append stylesheet to alter
        var themeCSS = document.getElementById('themeCSS');
        if (null !== themeCSS) {
            document.getElementsByTagName("head")[0].removeChild(themeCSS);
        }
		document.getElementsByTagName("head")[0].appendChild(css);
	} catch (e) {
		setTimeout(function(){setCSS(css)}, 100);
	}
}

function setTheme(themeName) {
    
    if ('dark' == themeName) {
    	document.getElementById("homenavbar").className = "navbar navbar-inverse";
    }

    if ('light' == themeName) {
    	document.getElementById("homenavbar").className = "navbar navbar-default";
    }
    
    // create CSS element to set up the page
    var css = document.createElement("link");
    css.setAttribute("id", "themeCSS");
    css.setAttribute("href", "../theme/"+themeName+".css");
    css.setAttribute("rel","stylesheet");
    
    // attempt to add the css and then keep trying till we do
    setCSS(css);
    css = null;
}

function loadCurrentTheme() {
    //initialize the theme
    setTheme(userSettings.readSetting('theme'));
}

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
    userSettings.saveSetting(settingKey, settingValue);
}

function readSetting(settingKey) {
    return userSettings.readSetting(settingKey);
}