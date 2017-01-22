
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
                JSON.parse(body).applications.forEach(app => 
                    $(".subscribedApps").append(app.name)
                );
            }
        }
    );
}
