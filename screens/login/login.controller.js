const userSettings = require('../../js/app/UserSettings')
const ipcRenderer = require('electron').ipcRenderer
const loginService = require('../../js/services/login.service')
const userService = require('../../js/services/user.service')

// let userName = 'default';
// let userPass = 'password';

document.addEventListener('keydown', function (e) {
  if (e.which === 123) {
    require('electron').remote.getCurrentWindow().toggleDevTools()
  } else if (e.which === 116) {
    location.reload();
  }
})

function populateUserToUI() {
  document.getElementById('inputEmail').value = getLastUser();
  if (isPersonalSystem()) {
    document.getElementById('checkBoxMySystem').checked = true;
  } else {
    document.getElementById('checkBoxMySystem').checked = false;
  }
}

function getLastUser() {
  u = userSettings.readSetting('lastUser');
  if (u !== undefined) {
    return u;
  }
  return '';
}

function isPersonalSystem() {
  return userSettings.readSetting('personalSys') === 'yes';
}

function saveLoginInfo() {
  if (document.getElementById('checkBoxMySystem').checked) {
    userSettings.saveSetting('personalSys', 'yes');
  } else {
    userSettings.saveSetting('personalSys', 'no');
  }
  userSettings.saveSetting('lastUser', document.getElementById('inputEmail').value);
  userSettings.saveSetting('x-auth-token', localStorage.getItem('jwt'));
  userSettings.saveSetting('offlineMode', 'false');
}

function saveOfflineMode() {
  userSettings.saveSetting('offlineMode', 'true');
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
  loginService.login(document.getElementById('inputEmail').value, document.getElementById('inputPassword').value, loginHandler);
}

function loginHandler(err, res, body) {
  if (!err && res.statusCode == 200) {
    saveLoginInfo();
    notifyLoginSuccess();
    closeLoginWindow();
  }
}

function proceedIfLoggedIn() {
  if (isPersonalSystem()) {
    token = userSettings.readSetting('x-auth-token');
    if (token !== '' || token !== undefined) {
      localStorage.setItem('jwt', token);
      userService.getUser(
        function (err, res, body) {
          if (!err && res.statusCode === 200) {
            document.getElementById('inputEmail').value = body.email;
            saveLoginInfo();
            notifyLoginSuccess();
            closeLoginWindow();
          }
        }
      );
    }
  }
}
