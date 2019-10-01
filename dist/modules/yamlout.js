'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var child = require("child_process");
var jsYaml = require("js-yaml");
var path = require("path");
var toYaml = function (inData) { return jsYaml.dump(inData, { lineWidth: -1 }); };
function yamlout(commands, lampman) {
    var yaml = jsYaml.load(child.execFileSync('docker-compose', ['--project-name', lampman.config.lampman.project, 'config'], { cwd: lampman.config_dir }).toString());
    var date = new Date();
    console.log("# Built at " + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds());
    console.log();
    console.log(toYaml({ version: yaml.version }));
    for (var key in yaml.services) {
        if ('volumes' in yaml.services[key]) {
            var new_volumes = [];
            for (var _i = 0, _a = yaml.services[key].volumes; _i < _a.length; _i++) {
                var volume = _a[_i];
                var lump = volume.split(':');
                if (4 === lump.length) {
                    lump[0] = lump[0] + ":" + lump[1];
                    lump[1] = lump[2];
                    lump[2] = lump[3];
                    lump.pop();
                }
                if (path.isAbsolute(lump[0])) {
                    lump[0] = path.relative(process.cwd(), lump[0]).replace(/\\/g, '/') + '/';
                    if (!lump[0].match(/^\./))
                        lump[0] = './' + lump[0];
                    new_volumes.push(lump.join(':'));
                }
                else {
                    new_volumes.push(volume);
                }
            }
            yaml.services[key].volumes = new_volumes;
        }
    }
    if (yaml.services)
        console.log(toYaml({ services: yaml.services }));
    if (yaml.networks)
        console.log(toYaml({ networks: yaml.networks }));
    if (yaml.volumes)
        console.log(toYaml({ volumes: yaml.volumes }));
}
exports.default = yamlout;
