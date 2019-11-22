'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var libs = require("../libs");
var docker = require("../docker");
var child = require('child_process');
function meta() {
    return {
        command: 'xon',
        describe: 'PHP Xdebug を有効にする',
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
        '/lampman/lampman/php-xdebug-on.sh'
    ], {
        stdio: 'inherit',
        cwd: lampman.config_dir
    });
    if (0 === result.status)
        libs.Message('PHP Xdebugを有効にしました。', 'primary');
}
exports.action = action;
