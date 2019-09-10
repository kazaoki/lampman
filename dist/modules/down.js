'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var child = require('child_process');
var path = require('path');
function down(cmd, options, lampman) {
    var proc = child.spawn('docker-compose', ['down'], {
        cwd: lampman.config_dir,
        stdio: 'inherit'
    });
}
exports.default = down;
