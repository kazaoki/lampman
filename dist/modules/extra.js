'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var libs = require("../libs");
var child = require('child_process');
function extra(extraopt, args, lampman) {
    if (!('not_show_message' in extraopt && extraopt.not_show_message)) {
        libs.Message("\u4EE5\u4E0B\u306E\u30B3\u30DE\u30F3\u30C9\u3092 " + (extraopt.container ? extraopt.container : 'ホストOS') + " \u4E0A\u3067\u5B9F\u884C\u3057\u307E\u3059\u3002\n" + extraopt.command, 'primary', 1);
        console.log();
    }
    if ('container' in extraopt) {
        child.spawnSync('docker-compose', ['exec', extraopt.container, 'sh', '-c', extraopt.command], {
            stdio: 'inherit',
            cwd: lampman.config_dir
        });
    }
    else {
        child.exec(extraopt.command).stdout.on('data', function (data) { return process.stdout.write(data); });
    }
    return;
}
exports.default = extra;