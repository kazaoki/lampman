'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var libs = require("../libs");
var child = require('child_process');
var path = require('path');
var color = require('cli-color');
function up(cmd, options, lampman) {
    var proc = child.spawn('docker-compose', ['up', '-d'], {
        cwd: lampman.config_dir,
        stdio: 'inherit'
    });
    proc.on('close', function (code) {
        if (code) {
            libs.Message("Up process exited with code " + code, 'danger', 1);
            process.exit();
        }
        console.log('');
        process.stdout.write('Lampman starting ');
        var timer = setInterval(function () {
            if (is_lampman_started(lampman)) {
                process.stdout.write('... ' + color.greenBright('OK!'));
                clearInterval(timer);
                console.log('');
            }
            else {
                process.stdout.write('.');
            }
        }, 1000);
    });
}
exports.default = up;
function is_lampman_started(lampman) {
    return !!child.execFileSync('docker-compose', ['logs', 'lampman'], { cwd: lampman.config_dir }).toString().match(/lampman started\./);
}
