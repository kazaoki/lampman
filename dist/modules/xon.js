'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var libs = require("../libs");
var docker = require("../docker");
var child = require('child_process');
function meta() {
    return {
        command: 'xon',
        description: 'PHP Xdebug を有効にする',
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
        '/lampman/lampman/php-xdebug-on.sh'
    ], {
        stdio: 'inherit',
        cwd: lampman.config_dir
    });
    libs.Message('PHP Xdebugを有効にしました。');
}
exports.action = action;
