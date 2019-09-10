'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var child = require('child_process');
var path = require('path');
function up(cmd, options, lampman) {
    var proc = child.spawn('docker-compose', ['up', '-d'], {
        cwd: lampman.config_dir,
        stdio: 'inherit'
    });
}
exports.default = up;
