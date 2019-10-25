'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var child = require('child_process');
function meta() {
    return {
        command: 'down',
        description: 'LAMP終了',
    };
}
exports.meta = meta;
function action(commands) {
    child.spawn('docker-compose', [
        '--project-name', lampman.config.project,
        'down'
    ], {
        cwd: lampman.config_dir,
        stdio: 'inherit'
    });
}
exports.action = action;
