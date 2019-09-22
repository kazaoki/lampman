'use strict';
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
function ConfigToYaml(config) {
    var _a, _b, _c;
    var yaml = {
        version: config.version,
        services: {},
        volumes: {},
        networks: {},
    };
    var proj = config.lampman.project;
    var networks;
    if (config.network && 'name' in config.network) {
        networks = { networks: [proj + "-" + config.network.name] };
    }
    yaml.services.lampman = __assign({ container_name: proj + "-lampman", image: config.lampman.image, ports: [], depends_on: [], environment: {}, volumes_from: [], volumes: ['./:/lampman'], entrypoint: '/lampman/lampman/entrypoint.sh' }, networks);
    if ('ports' in config.lampman.apache && config.lampman.apache.ports.length) {
        (_a = yaml.services.lampman.ports).push.apply(_a, config.lampman.apache.ports);
    }
    if ('mounts' in config.lampman.apache && config.lampman.apache.mounts.length) {
        (_b = yaml.services.lampman.volumes).push.apply(_b, config.lampman.apache.mounts);
    }
    if ('php' in config.lampman) {
        if ('image' in config.lampman.php) {
            yaml.services.phpenv = {
                container_name: proj + "-phpenv",
                image: config.lampman.php.image,
                labels: [proj]
            };
            yaml.services.lampman.depends_on.push('phpenv');
            yaml.services.lampman.environment.LAMPMAN_PHP_PHPENV_IMAGE = config.lampman.php.image;
            var matches = config.lampman.php.image.match(/\:(.*)$/);
            yaml.services.lampman.environment.LAMPMAN_PHP_PHPENV_VERSION = matches[1];
            yaml.services.lampman.volumes_from.push('phpenv');
        }
        if ('error_report' in config.lampman.php)
            yaml.services.lampman.environment.LAMPMAN_PHP_ERROR_REPORT = config.lampman.php.error_report ? 1 : 0;
        if ('xdebug_start' in config.lampman.php)
            yaml.services.lampman.environment.LAMPMAN_PHP_XDEBUG_START = config.lampman.php.xdebug_start ? 1 : 0;
        if ('xdebug_host' in config.lampman.php)
            yaml.services.lampman.environment.LAMPMAN_PHP_XDEBUG_HOST = config.lampman.php.xdebug_host;
        if ('xdebug_port' in config.lampman.php)
            yaml.services.lampman.environment.LAMPMAN_PHP_XDEBUG_PORT = config.lampman.php.xdebug_port;
    }
    if ('maildev' in config.lampman) {
        if ('start' in config.lampman.maildev)
            yaml.services.lampman.environment.LAMPMAN_MAILDEV_START = config.lampman.maildev.start ? 1 : 0;
        if ('ports' in config.lampman.maildev) {
            yaml.services.lampman.environment.LAMPMAN_MAILDEV_PORTS = config.lampman.maildev.ports.join(', ');
            (_c = yaml.services.lampman.ports).push.apply(_c, config.lampman.maildev.ports);
        }
    }
    for (var _i = 0, _d = Object.keys(config); _i < _d.length; _i++) {
        var key = _d[_i];
        if (key.match(/^mysql/)) {
            yaml.services[key] = __assign({ container_name: proj + "-" + key, image: config[key].image, ports: config[key].ports, volumes: [
                    "./" + key + ":/mysql",
                    key + "_data:/var/lib/mysql",
                ], entrypoint: '/mysql/before-entrypoint.sh', command: ['mysqld'], labels: [proj], environment: {} }, networks);
            yaml.services[key].environment.MYSQL_ROOT_PASSWORD = config[key].password;
            yaml.services[key].environment.MYSQL_DATABASE = config[key].database;
            yaml.services[key].environment.MYSQL_USER = config[key].user;
            yaml.services[key].environment.MYSQL_PASSWORD = config[key].password;
            if ('charset' in config[key] && config[key].charset.length)
                yaml.services[key].command.push("--character-set-server=" + config[key].charset);
            if ('collation' in config[key] && config[key].collation.length)
                yaml.services[key].command.push("--collation-server=" + config[key].collation);
            if ('hosts' in config[key] && config[key].hosts.length) {
                for (var _e = 0, _f = config[key].hosts; _e < _f.length; _e++) {
                    var host = _f[_e];
                    if ('LAMPMAN_BIND_HOSTS' in yaml.services.lampman.environment) {
                        yaml.services.lampman.environment.LAMPMAN_BIND_HOSTS += ", " + host + ":" + key;
                    }
                    else {
                        yaml.services.lampman.environment.LAMPMAN_BIND_HOSTS = host + ":" + key;
                    }
                }
            }
            if ('volume_locked' in config[key])
                yaml.services[key].environment.VOLUME_LOCKED = config[key].volume_locked ? 1 : 0;
            if ('dump' in config[key]) {
                if ('rotations' in config[key].dump) {
                    yaml.services[key].environment.DUMP_ROTATIONS = config[key].dump.rotations;
                }
                if ('filename' in config[key].dump) {
                    yaml.services[key].environment.DUMP_FILENAME = config[key].dump.filename;
                    yaml.services[key].volumes.push("./" + key + "/" + config[key].dump.filename + ":/docker-entrypoint-initdb.d/import.sql");
                }
            }
            if ('LAMPMAN_MYSQLS' in yaml.services.lampman.environment) {
                yaml.services.lampman.environment.LAMPMAN_MYSQLS += ", " + key;
            }
            else {
                yaml.services.lampman.environment.LAMPMAN_MYSQLS = key;
            }
            yaml.volumes[key + "_data"] = {
                driver: 'local',
                name: proj + "-" + key + "_data"
            };
        }
        if (key.match(/^postgresql/)) {
            yaml.services[key] = __assign({ container_name: proj + "-" + key, image: config[key].image, ports: config[key].ports, volumes: [
                    "./" + key + ":/postgresql",
                    key + "_data:/var/lib/postgresql/data",
                ], entrypoint: '/postgresql/before-entrypoint.sh', command: 'postgres', labels: [proj], environment: {} }, networks);
            yaml.services[key].environment.POSTGRES_PASSWORD = config[key].password;
            yaml.services[key].environment.POSTGRES_USER = config[key].user;
            yaml.services[key].environment.POSTGRES_DB = config[key].database;
            if ('volume_locked' in config[key])
                yaml.services[key].environment.VOLUME_LOCKED = config[key].volume_locked ? 1 : 0;
            if ('dump' in config[key]) {
                if ('rotations' in config[key].dump) {
                    yaml.services[key].environment.DUMP_ROTATIONS = config[key].dump.rotations;
                }
                if ('filename' in config[key].dump) {
                    yaml.services[key].environment.DUMP_FILENAME = config[key].dump.filename;
                    yaml.services[key].volumes.push("./" + key + "/" + config[key].dump.filename + ":/docker-entrypoint-initdb.d/import.sql");
                }
            }
            if ('hosts' in config[key] && config[key].hosts.length) {
                for (var _g = 0, _h = config[key].hosts; _g < _h.length; _g++) {
                    var host = _h[_g];
                    if ('LAMPMAN_BIND_HOSTS' in yaml.services.lampman.environment) {
                        yaml.services.lampman.environment.LAMPMAN_BIND_HOSTS += ", " + host + ":" + key;
                    }
                    else {
                        yaml.services.lampman.environment.LAMPMAN_BIND_HOSTS = host + ":" + key;
                    }
                }
            }
            if ('LAMPMAN_POSTGRESQLS' in yaml.services.lampman.environment) {
                yaml.services.lampman.environment.LAMPMAN_POSTGRESQLS += ", " + key;
            }
            else {
                yaml.services.lampman.environment.LAMPMAN_POSTGRESQLS = key;
            }
            yaml.volumes[key + "_data"] = {
                driver: 'local',
                name: proj + "-" + key + "_data"
            };
        }
    }
    if (config.network && 'name' in config.network) {
        yaml.networks[proj + "-" + config.network.name] = {
            driver: 'bridge'
        };
    }
    return yaml;
}
exports.ConfigToYaml = ConfigToYaml;
