'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var libs = require("../libs");
var docker = require("../docker");
var child = require('child_process');
function meta() {
    return {
        command: 'xoff',
        description: 'PHP Xdebug を無効にする',
    };
}
exports.meta = meta;
function action(commands) {
    docker.needDockerLive();
    child.spawnSync('docker-compose', [
        '--project-name',
        lampman.config.project,
        'exec',
        'lampman',
        'sh',
        '-c',
        '/lampman/lampman/php-xdebug-off.sh'
    ], {
        stdio: 'inherit',
        cwd: lampman.config_dir
    });
    libs.Message('PHP Xdebugを無効にしました。');
}
exports.action = action;
