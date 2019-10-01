'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var child = require('child_process');
var path = require('path');
function down(commands, lampman) {
    var proc = child.spawn('docker-compose', [
        '--project-name', lampman.config.lampman.project,
        'down'
    ], {
        cwd: lampman.config_dir,
        stdio: 'inherit'
    });
}
exports.default = down;
