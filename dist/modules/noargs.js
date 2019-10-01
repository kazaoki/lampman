'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var libs = require("../libs");
var child = require('child_process');
var color = require('cli-color');
var cliui = require('cliui')({ width: color.windowSize.width - 4 });
function noargs(commands, lampman) {
    console.log('  [Images]');
    libs.Message(child.execFileSync('docker', ['images']).toString(), 'primary', 1);
    console.log('\n  [Volumes]');
    libs.Message(child.execFileSync('docker', ['volume', 'ls', '--format', 'table {{.Name}}\t{{.Driver}}\t{{.Scope}}']).toString(), 'primary', 1);
    console.log('\n  [Containers]');
    var groups = [];
    var lines = [];
    for (var _i = 0, _a = child.execFileSync('docker', ['ps', '-a', '--format', '{{.Names}}\t{{.ID}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}\t{{.Labels}}']).toString().split('\n'); _i < _a.length; _i++) {
        var line = _a[_i];
        var columns = line.split(/\t/);
        var label = columns.pop();
        lines.push({
            columns: columns,
            label: label
        });
    }
    lines.unshift({ columns: ['NAMES', 'ID', 'IMAGE', 'STATUS', 'PORTS'] });
    for (var _b = 0, lines_1 = lines; _b < lines_1.length; _b++) {
        var line = lines_1[_b];
        var set = [];
        for (var _c = 0, _d = line.columns; _c < _d.length; _c++) {
            var column = _d[_c];
            var text = column;
            var is_group = 'config' in lampman && line.label && line.label.split(/,/).includes("com.docker.compose.project=" + lampman.config.lampman.project);
            var texts = [];
            for (var _e = 0, _f = text.split(/, ?/); _e < _f.length; _e++) {
                var item = _f[_e];
                texts.push(is_group
                    ? item
                    : 'label' in line
                        ? color.blue(item)
                        : item);
            }
            set.push({
                text: texts.join('\n'),
                padding: [0, 1, 0, 1],
            });
        }
        cliui.div.apply(cliui, set);
    }
    libs.Message(cliui.toString(), 'primary', 1, { for_container: true });
}
exports.default = noargs;
