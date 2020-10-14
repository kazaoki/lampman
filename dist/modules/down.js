'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.action = exports.meta = void 0;
var child = require('child_process');
var docker = require("../docker");
var libs = require("../libs");
var color = require('cli-color');
function meta(lampman) {
    return {
        command: 'down',
        describe: 'LAMP高速終了（名無しボリュームは消える）',
    };
}
exports.meta = meta;
function action(argv, lampman) {
    docker.needDockerLive();
    var service_names = [];
    var result_services = child.execFileSync('docker-compose', ['--project-name', lampman.config.project, 'config', '--services'], { cwd: lampman.config_dir }).toString().trim();
    for (var _i = 0, _a = result_services.split(/\s+/); _i < _a.length; _i++) {
        var service = _a[_i];
        service_names.push(lampman.config.project + '-' + service);
    }
    if (service_names) {
        libs.Label('Down containers');
        for (var _b = 0, service_names_1 = service_names; _b < service_names_1.length; _b++) {
            var service_name = service_names_1[_b];
            var id = child.execFileSync('docker', ['ps', '-qa', '--filter', "name=" + service_name]).toString().trim();
            if (id) {
                process.stdout.write(service_name + ' ... ');
                var result = child.execFileSync('docker', ['rm', '-fv', service_name]).toString().trim();
                console.log(color.green('done'));
            }
        }
    }
    return;
}
exports.action = action;
