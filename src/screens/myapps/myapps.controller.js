
const jsonRequest = require("../../js/services/json-request.service");
const userSettings = require("../../js/app/UserSettings");
let http = require('http');
let fs = require('fs');

let subscribedApps = undefined;

function launchCalc() {
    const os = require('os');
    if (os.type() === 'Linux') {
        executeApp('gnome-calculator');
    }
    if (os.type() === 'Darwin') {
        executeApp('open /Applications/Calculator.app/');
    }
    if (os.type() === 'Windows_NT') {
        executeApp('calc');
    }
}

function executeApp(appName) {
    const exec = require('child_process').exec;
    const child = exec(`${appName}`,
        (error, stdout, stderr) => {
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        if (error !== null) {
            console.log(`exec error: ${error}`);
        }
    });
}

function getSubscriptions() {
    jsonRequest.get(
        '/api/0/store/subscriptions', 
        function (err, res, body) {
            if (!err && res.statusCode == 200) {
                if (body.applications.length === 0) {
                    $("#appsDiv").append('<div class="alert alert-info">You do not have any applications in your library, please visit the store to get applications.</div>');
                }else {
                    subscribedApps = body.applications;
                    subscribedApps.forEach(app => {
                        $("#subscribedApps").append( '<div class="app-card">' +
                                    '<a class="title" href="#" onClick="viewApplicationDetails()">' + app.name + '</a>' +
                                    '<div class="tools">' +
                                    '<a href="#" class="details" onClick="installApp(\'' + app.rid +'\')">Install</a>' +
                                    '<span class="tooltiptext">Install ' + app.name + '</span>' +
                                '</div>');
                    });
                }
            } else {
                $("#appsDiv").append('<div class="alert alert-warning">Please log in to see subscribed apps</div>');
            }
        }
    );
}

function installApp(appId) {
    subscribedApps.forEach(app => {
        if (app.rid === appId) {
            let installer = getInstallerForCurrentOS(app.installers);
            if (!installer.downloadUrl) {
                alert('Download URL for this application is not specified.\nPlease contact the developer - ' + app.developer.email);
            }
        }
    });
}

function downloadInstaller(url) {
    let file = fs.createWriteStream("file.jpg");
    let request = http.get(url, function(response) {
        response.pipe(file);
    });
}

function getApp(appId) {

}

function getInstallerForCurrentOS(installers) {
    let os = getOSName(process.platform);
    let platfrom = getPlatform(process.arch);
    let installerForCurrentPlatform = undefined;
    installers.forEach(inst => {
        if (inst.os === os && inst.platform == platfrom) {
            installerForCurrentPlatform = inst;
        }
    });
    return installerForCurrentPlatform;
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
