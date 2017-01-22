
var remote = require('remote'),
    Menu = remote.require('menu');
const electron = require('electron');
//const app = electron.app;
//const Menu = electron.Menu;
const ipcRenderer = electron.ipcRenderer;

var menuTemplate = [
        {
            label: 'copper',
            click: function() {
                ipcRenderer.sendSync('synchronous-message', 'open-main-window');
            }
        },
        { 
            label: 'Item2', 
            type: 'radio' 
        },
        { 
            label: 'Item3',
            type: 'radio',
            checked: true
        },
        {
                type: 'separator'
        },
        {
            label: 'Exit',
            click: function() {
                ipcRenderer.sendSync('synchronous-message', 'exit-app');
            }
        }
    ]

function getTrayMenu() {
    //const Menu = require('electron').Menu;
    var traytMenu = Menu.buildFromTemplate(menuTemplate);
    return traytMenu;
}

module.exports = {
    getTrayMenu: getTrayMenu
}