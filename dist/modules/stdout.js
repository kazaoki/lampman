'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var child = require("child_process");
function stdout(commands, lampman) {
    child.execFileSync('docker-compose', [
        '-p', lampman.config.project,
        'logs',
        '-f',
    ], {
        stdio: 'inherit',
        cwd: lampman.config_dir
    });
}
exports.default = stdout;
