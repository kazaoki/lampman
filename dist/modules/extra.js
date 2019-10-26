'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var child = require('child_process');
function action(extraopt, args) {
    if ('function' in extraopt) {
        extraopt.function.apply(extraopt, args);
    }
    else if ('container' in extraopt) {
        child.spawnSync('docker-compose', ['--project-name', lampman.config.project, 'exec', extraopt.container, 'sh', '-c', extraopt.command], {
            stdio: 'inherit',
            cwd: lampman.config_dir
        });
    }
    else {
        child.execSync(extraopt.command, {
            stdio: 'inherit',
            cwd: lampman.project_dir
        });
    }
    return;
}
exports.action = action;
