'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var child = require("child_process");
function meta() {
    return {
        command: 'status',
        description: 'dockerコンテナ達の標準出力(logs)を監視する',
    };
}
exports.meta = meta;
function action(commands) {
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
