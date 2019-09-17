'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var strwidth = require('string-width');
var color = require('cli-color');
var wrap = require('jp-wrap')(color.windowSize.width - 8);
var util = require('util');
var child = require('child_process');
var path = require('path');
var fs = require('fs');
function d(data) {
    console.log(util.inspect(data, { colors: true, compact: false, breakLength: 10, depth: 10 }));
}
exports.d = d;
function Repeat(string, times) {
    if (times === void 0) { times = 1; }
    if (!(times > 0))
        return '';
    var lump = '';
    for (var i = 0; i < times; i++) {
        lump += string;
    }
    return lump;
}
exports.Repeat = Repeat;
function Message(message, type, line) {
    if (type === void 0) { type = 'default'; }
    if (line === void 0) { line = 0; }
    var indent = '  ';
    var line_color = color.white;
    var fg_color = color.white;
    if (type === 'primary') {
        line_color = color.blue;
        fg_color = color.white;
    }
    else if (type === 'success') {
        line_color = color.green;
        fg_color = color.greenBright;
    }
    else if (type === 'danger') {
        line_color = color.redBright;
        fg_color = color.red;
    }
    else if (type === 'warning') {
        line_color = color.yellow;
        fg_color = color.yellowBright;
    }
    else if (type === 'info') {
        line_color = color.whiteBright;
        fg_color = color.whiteBright;
    }
    else if (type === 'whisper') {
        line_color = color.blackBright;
        fg_color = color.blackBright;
    }
    message = wrap(message.replace(/[\r\n]+$/, ''));
    var messages = message.split(/[\r\n]+/);
    var width = 0;
    for (var i in messages) {
        var len = strwidth(messages[i]);
        if (width < len)
            width = len;
    }
    width += 2;
    console.log(indent +
        line_color('╒') +
        line_color(Repeat('═', width)) +
        line_color('╕'));
    for (var i in messages) {
        if (line > 0 && line == i) {
            console.log(indent +
                line_color('├') +
                line_color(Repeat('-', width)) +
                line_color('┤'));
        }
        console.log(indent +
            line_color('│') +
            ((line > 0 && line <= i)
                ? fg_color(' ' + messages[i] + ' ')
                : fg_color.bold(' ' + messages[i] + ' ')) +
            Repeat(' ', (width - 2) - strwidth(messages[i])) +
            line_color('│'));
    }
    console.log(indent +
        line_color('╘') +
        line_color(Repeat('═', width)) +
        line_color('╛'));
}
exports.Message = Message;
function Error(message) {
    Message("\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F\u3002\n" + message, 'danger', 1);
    process.exit();
}
exports.Error = Error;
function LoadConfig() {
    return {
        'test': 123
    };
}
exports.LoadConfig = LoadConfig;
function Label(label) {
    console.log(color.bold("<" + label + ">"));
}
exports.Label = Label;
function ContainerLogCheck(container, check_str, cwd) {
    return !!child.execFileSync('docker-compose', ['logs', '--no-color', container], { cwd: cwd }).toString().match(check_str);
}
exports.ContainerLogCheck = ContainerLogCheck;
function RotateFile(filepath, max_number) {
    var dirname = path.dirname(filepath);
    var basename = path.basename(filepath);
    if (!path.isAbsolute(filepath))
        return false;
    if (!(max_number > 0))
        return false;
    if (!fs.existsSync(filepath))
        return false;
    var regex = new RegExp("^" + basename.replace('.', '\\.') + "\\.(\\d+)$");
    for (var _i = 0, _a = fs.readdirSync(dirname); _i < _a.length; _i++) {
        var file = _a[_i];
        var matched = void 0;
        if (matched = file.match(regex)) {
            if (matched[1] >= max_number)
                fs.unlinkSync(path.join(dirname, file));
        }
    }
    try {
        for (var num = max_number; num > 0; num--) {
            var from = 1 === num
                ? path.join(dirname, basename)
                : path.join(dirname, basename + "." + (num - 1));
            var to = path.join(dirname, basename + "." + num);
            if (!fs.existsSync(from))
                continue;
            fs.renameSync(from, to);
        }
    }
    catch (e) {
        throw e;
    }
    return;
}
exports.RotateFile = RotateFile;
