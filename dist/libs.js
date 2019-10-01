'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var strwidth = require('string-width');
var color = require('cli-color');
var jpwrap = require('jp-wrap')(color.windowSize.width - 8);
var util = require('util');
var child = require('child_process');
var path = require('path');
var fs = require('fs');
var docker = require("./docker");
var yaml = require("js-yaml");
function d(data) {
    console.log(util.inspect(data, { colors: true, compact: false, breakLength: 10, depth: 10 }));
}
exports.d = d;
function isWindows() {
    return 'win32' === process.platform;
}
exports.isWindows = isWindows;
function isMac() {
    return 'darwin' === process.platform;
}
exports.isMac = isMac;
function isLinux() {
    return 'linux' === process.platform;
}
exports.isLinux = isLinux;
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
function Message(message, type, line, opt) {
    if (type === void 0) { type = 'default'; }
    if (line === void 0) { line = 0; }
    if (opt === void 0) { opt = {}; }
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
    message = message.trim();
    if (!opt.for_container)
        message = jpwrap(message);
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
    for (var i = 0; i < messages.length; i++) {
        if (line > 0 && line === i) {
            console.log(indent +
                line_color('├') +
                line_color(Repeat('-', width)) +
                line_color('┤'));
        }
        console.log(indent +
            line_color('│') +
            ((line > 0 && i < line)
                ? fg_color.bold(' ' + messages[i] + ' ')
                : fg_color(' ' + messages[i] + ' ')) +
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
function Label(label) {
    console.log(color.bold("<" + label + ">"));
}
exports.Label = Label;
function ContainerLogAppear(container, check_str, cwd) {
    return new Promise(function (resolve, reject) {
        var sp = child.spawn('docker-compose', ['logs', '-f', '--no-color', container], { cwd: cwd });
        sp.stdout.on('data', function (data) {
            if (data.toString().match(check_str)) {
                if ('win32' === process.platform) {
                    child.spawn('taskkill', ['/pid', sp.pid, '/f', '/t']);
                }
                else {
                    sp.kill();
                }
                resolve();
            }
        });
        sp.on('error', function (e) {
            throw (e);
        });
        sp.on('close', function (code) {
            resolve();
        });
    });
}
exports.ContainerLogAppear = ContainerLogAppear;
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
function ModeString(modestr) {
    return 'default' === modestr ? '' : '-' + modestr;
}
exports.ModeString = ModeString;
function LoadConfig(lampman) {
    try {
        var config_file = path.join(lampman.config_dir, 'config.js');
        fs.accessSync(config_file, fs.constants.R_OK);
        lampman.config = require(config_file).config;
    }
    catch (e) {
        Error('config load error!\n' + e);
        process.exit();
    }
    lampman.project_dir = path.dirname(lampman.config_dir);
    return lampman;
}
exports.LoadConfig = LoadConfig;
function UpdateCompose(lampman) {
    var ymldata = docker.ConfigToYaml(lampman.config);
    fs.writeFileSync(lampman.config_dir + "/docker-compose.yml", '# Do not edit this file as it will update automatically !\n' +
        yaml.dump(ymldata));
}
exports.UpdateCompose = UpdateCompose;
