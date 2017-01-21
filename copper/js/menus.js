const {Menu} = require('electron')
const ipcRenderer = require('electron').ipcRenderer;

const menuTemplate = [
    {
        label: 'copper',
        submenu: [
            {
                label: "Login",
                click: function() {
                    alert('Login');
                }
            },
            {
                label: "Log-off",
                click: function() {
                    alert('Log-off');
                }
            },
            {
                type: 'separator'
            },
            {
                label: 'Developer Tools',
                accelerator: 'CmdOrCtrl+Shift+i',
                click: function() {
                    toggleDeveloperTools();
                }
            },
            {
                type: 'separator'
            },
            {
                label: 'Exit',
                accelerator: 'CmdOrCtrl+X',
                selector: 'terminate:', //osx only
                click: function() {
                    require('electron').remote.getCurrentWindow().close();
                    //ipcRenderer.sendSync('synchronous-message', 'close-main-window');
                }
            }
        ]
    },
    {
        label: 'View',
        submenu: [
            {
                label: 'Home',
                click: function() {
                    loadURLInToWebView('file://' + __dirname + '/../screens/home/home.html');
                    //ipc.send('toggle-insert-view');
                }
            },
            {
                label: 'My Apps',
                click: function() {
                    if (isLoggedIn()) {
                        loadURLInToWebView('file://' + __dirname + '/../screens/myapps/myapps.html');
                    }
                    //alert('My Apps');
                }
            },
            {
                label: 'Store',
                click: function() {
                    loadURLInToWebView('http://localhost:4200/#/store?client=copper');
                    //alert('Store');
                }
            },
            {
                type: 'separator'
            },
            {
                label: 'Themes',
                submenu: [
                    {
                        label: 'Light theme',
                        click: function() {
                            setTheme('light');
                            saveSetting('theme', 'light');
                        }
                    },
                    {
                        label: 'Dark theme',
                        click: function() {
                            setTheme('dark');
                            saveSetting('theme', 'dark');
                        }
                    }
                ]
            }
        ]
    },
    {
        label: 'Help',
        submenu: [
            //{
            //    label: 'Create Password',
            //    accelerator: 'CmdOrCtrl+N',
            //    click: function() {
            //        alert('Create new password');
            //        //ipc.send('toggle-insert-view');
            //    }
            //},
            {
                label: 'Support',
                click: function() {
                    alert('Support');
                }
            },
            {
                type: 'separator'
            },
            {
                label: 'Subscriber Agreement',
                click: function() {
                    alert('copper Subscriber Agreement');
                }
            },
            {
                type: 'separator'
            },
            {
                label: 'About copper',
                click: function() {
                    //alert('SE23PT2: copper - USM Desktop prototype');
                    ipcRenderer.sendSync('synchronous-message', 'open-about-window');
                }
            }
        ]
    }
]; //menuTemplate

function getMenuFromTemplate() {
    return Menu.buildFromTemplate(menuTemplate);
}

function setApplicationMenu() {
    const appMenu = getMenuFromTemplate();
    Menu.setApplicationMenu(appMenu);
}

module.exports = {
    getMenu: getMenuFromTemplate,
    create: setApplicationMenu
}