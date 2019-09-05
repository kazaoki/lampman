'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var libs = require("../libs");
var child = require('child_process');
var color = require('cli-color');
var cliui = require('cliui')({ width: color.windowSize.width - 4 });
function noargs(cmd, options, lampman) {
    console.log('  [Images]');
    libs.Message(child.execFileSync('docker', ['images']).toString(), 'primary', 1);
    console.log('\n  [Volumes]');
    libs.Message(child.execFileSync('docker', ['volume', 'ls', '--format', 'table {{.Name}}\t{{.Driver}}\t{{.Scope}}']).toString(), 'primary', 1);
    console.log('\n  [Containers]');
    var lines = child.execFileSync('docker', ['ps', '-a', '--format', '{{.Names}}\t{{.ID}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}']).toString().trim().split('\n');
    lines.unshift(['NAMES', 'ID', 'IMAGE', 'STATUS', 'PORTS'].join('\t'));
    for (var i in lines) {
        var column = lines[i].split(/\t/);
        var set = [];
        for (var j in column) {
            set.push({
                text: column[j].replace(/, ?/g, '\n'),
                padding: [0, 1, 0, 1],
            });
        }
        cliui.div.apply(cliui, set);
    }
    libs.Message(cliui.toString(), 'primary', 1);
}
exports.default = noargs;
