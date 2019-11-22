'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var libs = require("../libs");
var docker = require("../docker");
var child = require('child_process');
function meta(lampman) {
    return {
        command: 'xoff',
        describe: 'PHP Xdebug を無効にする',
    };
}
exports.meta = meta;
function action(argv, lampman) {
    docker.needDockerLive();
    var result = child.spawnSync('docker-compose', [
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
    if (0 === result.status)
        libs.Message('PHP Xdebugを無効にしました。', 'primary');
}
exports.action = action;
