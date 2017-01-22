
const jsonRequest = require("../../js/services/json-request.service");
const userSettings = require("../../js/app/UserSettings");

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
                    body.applications.forEach(app => 
                        $("#subscribedApps").append( '<div class="app-card">' +
                                    '<a class="title" href="#" onClick="viewApplicationDetails()">' + app.name + '</a>' +
                                    '<div class="tools">' +
                                    '<a href="#" class="details">Install</a>' +
                                    '<span class="tooltiptext">Install ' + app.name + '</span>' +
                                '</div>')
                    );
                }
            } else {
                $("#appsDiv").append('<div class="alert alert-warning">Please log in to see subscribed apps</div>');
            }
        }
    );
}
