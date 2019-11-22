'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var child = require('child_process');
var docker = require("../docker");
function meta() {
    return {
        command: 'down',
        describe: 'LAMP終了',
        options: {},
    };
}
exports.meta = meta;
function action(argv, lampman) {
    docker.needDockerLive();
    child.spawn('docker-compose', [
        '--project-name', lampman.config.project,
        'down'
    ], {
        cwd: lampman.config_dir,
        stdio: 'inherit'
    });
}
exports.action = action;
