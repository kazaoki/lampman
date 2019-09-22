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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var libs = require("./libs");
var child = require('child_process');
var color = require('cli-color');
function clean() {
    return __awaiter(this, void 0, void 0, function () {
        var procs, _loop_1, _i, _a, cid, _loop_2, _b, _c, vid;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    procs = [];
                    _loop_1 = function (cid) {
                        if (!cid)
                            return "continue";
                        procs.push(new Promise(function (resolve, reject) {
                            child.execFile('docker', ['rm', '-fv', cid])
                                .stderr.on('data', function (data) {
                                console.log("Deleting " + cid + " ... " + color.red('ng'));
                                reject(data);
                            })
                                .on('close', function (code) {
                                console.log("Deleting " + cid + " ... " + color.green('done'));
                                resolve();
                            });
                        }));
                    };
                    for (_i = 0, _a = child.execFileSync('docker', ['ps', '-qa', '--format', '{{.Names}}']).toString().trim().split(/\n/); _i < _a.length; _i++) {
                        cid = _a[_i];
                        _loop_1(cid);
                    }
                    if (!procs.length) return [3, 2];
                    return [4, Promise.all(procs).catch(function (err) { libs.Error(err); })];
                case 1:
                    _d.sent();
                    _d.label = 2;
                case 2:
                    procs = [];
                    _loop_2 = function (vid) {
                        if (!vid || vid.match(/^locked_/))
                            return "continue";
                        procs.push(new Promise(function (resolve, reject) {
                            child.execFile('docker', ['volume', 'rm', '-f', vid])
                                .stderr.on('data', function (data) {
                                console.log("Removing volume " + vid + " ... " + color.red('ng'));
                                reject(data);
                            })
                                .on('close', function (code) {
                                console.log("Removing volume " + vid + " ... " + color.green('done'));
                                resolve();
                            });
                        }));
                    };
                    for (_b = 0, _c = child.execFileSync('docker', ['volume', 'ls', '-q', '--filter', 'dangling=true']).toString().trim().split(/\n/); _b < _c.length; _b++) {
                        vid = _c[_b];
                        _loop_2(vid);
                    }
                    if (!procs.length) return [3, 4];
                    return [4, Promise.all(procs).catch(function (err) { libs.Error(err); })];
                case 3:
                    _d.sent();
                    _d.label = 4;
                case 4: return [2, procs.length];
            }
        });
    });
}
exports.clean = clean;
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
                name: "" + (config[key].volume_locked ? 'locked_' : '') + proj + "-" + key + "_data"
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
                name: "" + (config[key].volume_locked ? 'locked_' : '') + proj + "-" + key + "_data"
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
