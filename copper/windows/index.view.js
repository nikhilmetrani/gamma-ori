/**
 * Renderer process
 * "Main" view
 */
var menu = require('../js/menus.js');

// create desktop menu
menu.create();

function loadURLInToWebView(url) {
    var webview = document.getElementById("contentWebView");
    webview.loadURL(url);
}

function setCSS(css) {
	try {
		// append stylesheet to alter
        var themeCSS = document.getElementById('themeCSS');
        document.getElementsByTagName("head")[0].removeChild(themeCSS);
		document.getElementsByTagName("head")[0].appendChild(css);
	} catch (e) {
		setTimeout(function(){setCSS(css)}, 100);
	}
}

function changeTheme(themeName) {
    if (themeName == "dark") {
        document.getElementById("navbarMain").className = "navbar navbar-inverse";
    }
    
    if (themeName == "light") {
        document.getElementById("navbarMain").className = "navbar navbar-default";
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