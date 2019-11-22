'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var strwidth = require('string-width');
var color = require('cli-color');
var jpwrap = require('jp-wrap')(color.windowSize.width - 8);
var util = require('util');
var child = require('child_process');
var path = require('path');
var fs = require('fs');
var cliui = require('cliui')({ width: color.windowSize.width - 4 });
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
        line_color('╭') +
        line_color(Repeat('─', width)) +
        line_color('╮'));
    for (var i = 0; i < messages.length; i++) {
        if (line > 0 && line === i) {
            console.log(indent +
                line_color('├') +
                line_color(Repeat('╶', width)) +
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
function ContainerLogAppear(container, check_str, lampman) {
    var cwd = lampman.config_dir;
    return new Promise(function (resolve, reject) {
        var sp = child.spawn('docker-compose', ['--project-name', lampman.config.project, 'logs', '-f', '--no-color', container], { cwd: cwd });
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
    var current_yaml;
    var yaml_file = path.join(lampman.config_dir, 'docker-compose.yml');
    if (fs.existsSync(yaml_file)) {
        current_yaml = yaml.safeLoad(fs.readFileSync(yaml_file));
    }
    var ymldata = docker.ConfigToYaml(lampman.config, lampman.config_dir);
    if (JSON.stringify(current_yaml) !== JSON.stringify(ymldata)) {
        var date = new Date();
        fs.writeFileSync(path.join(lampman.config_dir, 'docker-compose.yml'), '# Do not edit this file as it will update automatically !\n' +
            ("# Built by Lampman ver " + getLampmanVersion() + " @ " + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "\n") +
            yaml.dump(ymldata));
        return true;
    }
    return false;
}
exports.UpdateCompose = UpdateCompose;
function getLampmanVersion() {
    var json = require(path.resolve(path.dirname(__dirname), 'package.json'));
    return json.version;
}
exports.getLampmanVersion = getLampmanVersion;
function dockerLs(lampman) {
    console.log('  [Images]');
    Message(child.execFileSync('docker', ['images']).toString(), 'primary', 1);
    console.log('\n  [Volumes]');
    Message(child.execFileSync('docker', ['volume', 'ls', '--format', 'table {{.Name}}\t{{.Driver}}\t{{.Scope}}']).toString(), 'primary', 1);
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
            var is_group = 'config' in lampman && line.label && line.label.split(/,/).includes("com.docker.compose.project=" + lampman.config.project);
            var texts = [];
            for (var _e = 0, _f = text.split(/, ?/); _e < _f.length; _e++) {
                var item = _f[_e];
                texts.push(is_group
                    ? color.bold(item)
                    : item);
            }
            set.push({
                text: texts.join('\n'),
                padding: [0, 1, 0, 0],
            });
        }
        cliui.div.apply(cliui, set);
    }
    Message(cliui.toString(), 'primary', 1, { for_container: true });
}
exports.dockerLs = dockerLs;
function existConfig(lampman) {
    return 'config_dir' in lampman
        ? fs.existsSync(path.join(lampman.config_dir, 'config.js'))
        : false;
}
exports.existConfig = existConfig;
function extra_action(extraopt, argv, lampman) {
    if ('function' in extraopt) {
        extraopt.function.apply(extraopt, argv._.slice(1));
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
}
exports.extra_action = extra_action;
