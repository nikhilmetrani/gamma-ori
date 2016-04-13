var remote = require('remote'),
    Menu = remote.require('menu');

module.exports = {
    create: function() {
        var appMenu = Menu.buildFromTemplate([
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
                        selector: 'terminate:' //osx only
                    }
                ]
            },
            {
                label: 'View',
                submenu: [
                    {
                        label: 'Home',
                        click: function() {
                            loadURLInToWebView('file://' + __dirname + '/../windows/home/home.html');
                            //ipc.send('toggle-insert-view');
                        }
                    },
                    {
                        label: 'My Apps',
                        click: function() {
                            if (isLoggedIn()) {
                                loadURLInToWebView('file://' + __dirname + '/../windows/myapps/myapps.html');
                            }
                            //alert('My Apps');
                        }
                    },
                    {
                        label: 'Store',
                        click: function() {
                            loadURLInToWebView('https://s3-ap-southeast-1.amazonaws.com/eyot-staging.com/store.html');
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
                                    changeTheme('light');
                                }
                            },
                            {
                                label: 'Dark theme',
                                click: function() {
                                    changeTheme('dark');
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
                            alert('SE23PT2: copper - USM Desktop prototype');
                        }
                    }
                ]
            }
        ]);

        Menu.setApplicationMenu(appMenu);
    }
};
