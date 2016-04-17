/**
 * Renderer process
 * "Main" view
 */
var menu = require('../js/menus');

menu.create();

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
    setTheme(settings.readSettings('theme'));
}