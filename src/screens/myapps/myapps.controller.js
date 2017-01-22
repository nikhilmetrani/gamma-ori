function launchCalc() {
    const os = require('os');
    //alert(os.type());
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