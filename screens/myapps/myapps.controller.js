
const jsonRequest = require('../../js/services/json-request.service')
const userSettings = require('../../js/app/UserSettings')
const launchService = require('../../js/services/launch.service')
const htmlService = require('../../js/services/html.service')
const bootstrapAlerts = htmlService.alerts
let downloadService = require('../../js/services/download.service')
let installedApps = userSettings.readSetting('installedApps')
if (installedApps === undefined) {
    installedApps = []
}
let subscribedApps = undefined
let downloadingApp = undefined

document.addEventListener('keydown', function (e) {
  if (e.which === 123) {
    require('electron').remote.getCurrentWindow().toggleDevTools()
  } else if (e.which === 116) {
    location.reload()
  }
})

function launchCalc() {
  const os = require('os');
  if (os.type() === 'Linux') {
    launchService.execute('gnome-calculator');
  }
  if (os.type() === 'Darwin') {
    launchService.execute('open /Applications/Calculator.app/');
  }
  if (os.type() === 'Windows_NT') {
    launchService.execute('calc');
  }
}

function getSubscriptions() {
  jsonRequest.get(
  '/api/0/store/subscriptions', 
  function (err, res, body) {
    if (!err && res.statusCode === 200) {
      if (body.applications.length === 0) {
        $('#appsDiv').append('<div class="alert alert-info">You do not have any applications in your library, please visit the store to get applications.</div>');
      } else {
        let lastApp = undefined
        subscribedApps = body.applications;
        subscribedApps.forEach(app => {
          let appDiv = '<div class="app-card">' +
          getApplicationCardHtml(app) +
          '</div>'
          $('#subscribedApps').append(appDiv)
          lastApp = app
        })
        setAppActionButton(lastApp)
      }
      } else {
        $('#appsDiv').append(htmlService.getBootstrapDismisableAlert(bootstrapAlerts.Warning, 'Please log in to see subscribed apps'));
      }
    }
  );
}

function getApplicationCardHtml (app) {
  return '<a class="title" href="#" onClick="viewApplicationDetails()">' + app.name + '</a>' +
         '<div class="tools">' +
         getApplicationButtonHtml(app)
}

function getApplicationButtonHtml (app) {
  if (isAppInstalled(app.rid)) {
    return '<a id="app-action" href="#" class="details" onClick="launchApp(\'' + app.rid +'\')">Launch</a>' +
            '<span class="tooltiptext">Launch ' + app.name + '</span>'
  } else {
    return '<a id="app-action" href="#" class="details" onClick="installApp(\'' + app.rid +'\')">Install</a>' +
            '<span class="tooltiptext">Install ' + app.name + '</span>'
  }
}

function isAppInstalled(appId) {
  if (installedApps === undefined) {
    return false
  }
  let appIsInstalled = false
  installedApps.forEach(appIdItem => {
    appIsInstalled = appIsInstalled ? true: appIdItem === appId
  })
  return appIsInstalled
}

function launchApp(appId) {
  subscribedApps.forEach(app => {
    if (app.rid === appId) {
      let installer = getInstallerForCurrentOS(app.installers)
      if (!installer.launchCommand) {
        $('#dlProgress').html(htmlService.getBootstrapDismisableAlert(bootstrapAlerts.Error, 'Launch command for this application is not specified.\nPlease contact the developer - ' + app.developer.email))
      } else {
        launchService.execute(installer.launchCommand, '', launchCallback)
      }
      return true
    }
  })
}

function launchCallback (error, stdout, stderr) {
  if (error !== null) {
    $('#dlProgress').html(htmlService.getBootstrapDismisableAlert(bootstrapAlerts.Error, 'Failed to launch application.\nPlease contact the developer - ' + downloadingApp.developer.email))
  } else {
    // Nothing to do here
  }
}

function installApp(appId) {
  if (downloadingApp !== undefined) {
    $('#dlProgress').html(htmlService.getBootstrapDismisableAlert(bootstrapAlerts.Warning, 'Another application is being downloaded'))
    return false
  }
  subscribedApps.forEach(app => {
  if (app.rid === appId) {
    downloadingApp = app
    let installer = getInstallerForCurrentOS(app.installers)
    if (!installer.downloadUrl) {
      $('#dlProgress').html(htmlService.getBootstrapDismisableAlert(bootstrapAlerts.Error, 'Download URL for this application is not specified.\nPlease contact the developer - ' + app.developer.email))
      downloadingApp = undefined
    } else {
      downloadService.download(installer.downloadUrl, showDownloadProgress, dlHandler)
    }
    return true
  }
  })
}

function showDownloadProgress (received, total) {
  let percentage = 0
  let unitString = '%'
  if (total === 0 || 
      isNaN(total) ||
      isNaN(received)) {
    percentage = (received / 1024).toFixed(0)
    unitString = ' Kb'
  } else {
    percentage = ((received * 100) / total).toFixed(0)
  }
  if (percentage === 100) {
    $('#dlProgress').html(htmlService.getBootstrapDismisableAlert(bootstrapAlerts.Success, 'Download complete ' + percentage + unitString))
  } else {
    $('#dlProgress').html(htmlService.getBootstrapDismisableAlert(bootstrapAlerts.Info, 'Downloading ' + percentage + unitString))
  }
}

function showInstallProgress () {
  $('#dlProgress').html(htmlService.getBootstrapDismisableAlert(bootstrapAlerts.Info, 'Installing ' + downloadingApp.name + '...'))
}

function dlHandler (data) {
  if (data.status === 200) {
    startInstallation(data.path)
  } else {
    $('#dlProgress').html(htmlService.getBootstrapDismisableAlert(bootstrapAlerts.Error, 'Error: Download failed'))
    downloadingApp = undefined
  }
}

function startInstallation (installerPath) {
  if (downloadingApp === undefined) {
    return false
  }
  let installer = getInstallerForCurrentOS(downloadingApp.installers)
  showInstallProgress()
  launchService.execute(installerPath,
    installer.expressInstallCommand, installCallback)
}

function installCallback (error, stdout, stderr) {
  if (error !== null) {
    $('#dlProgress').html(htmlService.getBootstrapDismisableAlert(bootstrapAlerts.Error, 'Failed to install application.\nPlease contact the developer - ' + downloadingApp.developer.email))
  } else {
    $('#dlProgress').html(htmlService.getBootstrapDismisableAlert(bootstrapAlerts.Success, 'Installation was successful'))
    installedApps.push(downloadingApp.rid)
    userSettings.saveSetting('installedApps', installedApps)
    setAppActionButton(downloadingApp)
  }
  downloadingApp = undefined
}

function setAppActionButton(app) {
  $( ".app-card" ).each(function( index ) {
    if ($( this ).text().startsWith(app.name)) {
      $( this ).html(getApplicationCardHtml(app))
    }
  })
}

function getInstallerForCurrentOS(installers) {
  let os = getOSName(process.platform);
  let platfrom = getPlatform(process.arch);
  let  = undefined;
  installers.forEach(inst => {
    if (inst.os === os && inst.platform == platfrom) {
      installerForCurrentPlatform = inst
    }
  })
  return installerForCurrentPlatform
}

function getOSName(platfrom) {
  if (platfrom === 'win32') {
  return 'Windows';
  } else if (platfrom === 'darwin') {
  return 'Mac';
  } else if (platfrom === 'linux') {
  return 'Linux';
  }
  return undefined;
}

function getPlatform(arch) {
  if (arch === 'x64') {
  return 'x64';
  } else if (arch === 'ia32') {
  return 'x86';
  }
  return 'x86';
}
