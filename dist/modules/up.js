'use strict';
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
var libs = require("../libs");
var docker = require("../docker");
var reject_1 = require("./reject");
var extra_1 = require("./extra");
var child = require('child_process');
var path = require('path');
var color = require('cli-color');
var fs = require('fs');
function up(commands, lampman) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, _a, mount, dirs, pubdir, args, proc;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if ('apache' in lampman.config.lampman && 'mounts' in lampman.config.lampman.apache) {
                        for (_i = 0, _a = lampman.config.lampman.apache.mounts; _i < _a.length; _i++) {
                            mount = _a[_i];
                            dirs = mount.split(/\:/);
                            if (path.resolve('/var/www/html') === path.resolve(dirs[1])) {
                                pubdir = path.join(lampman.config_dir, dirs[0]);
                                if (!fs.existsSync(pubdir)) {
                                    libs.Message('最初に公開ディレクトリを作成してください ↓\n' + pubdir, 'primary', 1);
                                    process.exit();
                                }
                            }
                        }
                    }
                    args = ['up', '-d', '--force-recreate'];
                    if (!commands.flush) return [3, 2];
                    libs.Label('Flush cleaning');
                    return [4, reject_1.default({ force: true }, lampman)];
                case 1:
                    _b.sent();
                    console.log();
                    _b.label = 2;
                case 2:
                    if (commands.dockerComposeOptions) {
                        args.push.apply(args, commands.dockerComposeOptions.replace('\\', '').split(' '));
                    }
                    libs.Label('Upping docker-compose');
                    proc = child.spawn('docker-compose', args, {
                        cwd: lampman.config_dir,
                        stdio: 'inherit'
                    });
                    proc.on('close', function (code) { return __awaiter(_this, void 0, void 0, function () {
                        var procs, _loop_1, _i, _a, key, count, _b, _c, action, url, opencmd, extraopt;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    if (code) {
                                        libs.Error("Up process exited with code " + code);
                                        process.exit();
                                    }
                                    console.log('');
                                    process.stdout.write(color.magenta.bold('  [Ready]'));
                                    procs = [];
                                    procs.push(libs.ContainerLogAppear('lampman', 'lampman started', lampman.config_dir).then(function () { return process.stdout.write(color.magenta(' lampman')); }));
                                    _loop_1 = function (key) {
                                        if (!key.match(/^(mysql|postgresql)/))
                                            return "continue";
                                        procs.push(libs.ContainerLogAppear(key, 'Entrypoint finish.', lampman.config_dir).then(function () { return process.stdout.write(color.magenta(" " + key)); }));
                                    };
                                    for (_i = 0, _a = Object.keys(lampman.config); _i < _a.length; _i++) {
                                        key = _a[_i];
                                        _loop_1(key);
                                    }
                                    return [4, Promise.all(procs).catch(function (e) { return libs.Error(e); })];
                                case 1:
                                    _d.sent();
                                    console.log();
                                    if ('on_upped' in lampman.config && lampman.config.on_upped.length) {
                                        count = 0;
                                        for (_b = 0, _c = lampman.config.on_upped; _b < _c.length; _b++) {
                                            action = _c[_b];
                                            if ('open_browser' === action.type) {
                                                url = action.url
                                                    ? new URL(action.url)
                                                    : new URL('http://' + docker.getDockerLocalhost());
                                                if (action.schema) {
                                                    url.protocol = action.schema;
                                                    url.port = docker.exchangePortFromSchema(action.schema, action.container, lampman);
                                                }
                                                if (action.path)
                                                    url.pathname = action.path;
                                                if (action.port)
                                                    url.port = docker.exchangePort(action.port, action.container, lampman);
                                                opencmd = libs.isWindows()
                                                    ? 'start'
                                                    : libs.isMac()
                                                        ? 'open'
                                                        : '';
                                                if (opencmd)
                                                    child.execSync(opencmd + " " + url.href);
                                            }
                                            if ('show_message' === action.type && action.message.length) {
                                                libs.Message(action.message, action.style);
                                                count++;
                                            }
                                            if ('run_command' === action.type) {
                                                extraopt = action;
                                                if ('object' === typeof extraopt.command)
                                                    extraopt.command = extraopt.command[libs.isWindows() ? 'win' : 'unix'];
                                                extra_1.default(extraopt, extraopt.args, lampman);
                                                count++;
                                            }
                                            if ('run_extra_command' === action.type && action.name in lampman.config.extra) {
                                                extra_1.default(lampman.config.extra[action.name], action.args, lampman);
                                                count++;
                                            }
                                        }
                                        if (count)
                                            console.log();
                                    }
                                    return [2];
                            }
                        });
                    }); });
                    return [2];
            }
        });
    });
}
exports.default = up;
