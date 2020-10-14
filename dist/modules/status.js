'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.action = exports.meta = void 0;
var child = require("child_process");
var docker = require("../docker");
function meta(lampman) {
    return {
        command: 'status',
        describe: 'dockerコンテナ達の標準出力(logs)を監視する',
    };
}
exports.meta = meta;
function action(argv, lampman) {
    docker.needDockerLive();
    child.execFileSync('docker-compose', [
        '-p', lampman.config.project,
        'logs',
        '-f',
    ], {
        stdio: 'inherit',
        cwd: lampman.config_dir
    });
}
exports.action = action;
