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
var find = require('find');
function meta() {
    return {
        command: 'up',
        description: "LAMP\u8D77\u52D5\uFF08.lampman" + libs.ModeString(lampman.mode) + "/docker-compose.yml \u81EA\u52D5\u66F4\u65B0\uFF09",
        options: [
            ['-f, --flush', '既存のコンテナと未ロックボリュームを全て削除してキレイにしてから起動する'],
            ['-o, --docker-compose-options <args_string>', 'docker-composeコマンドに渡すオプションを文字列で指定可能'],
            ['-D', 'デーモンじゃなくフォアグラウンドで起動する'],
            ['-n --no-update', 'docker-compose.yml を更新せずに起動する'],
        ]
    };
}
exports.meta = meta;
function action(commands) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, _a, mount, dirs, pubdir, files, _b, files_1, file, args, proc;
        var _this = this;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!libs.existConfig(lampman)) {
                        libs.Error("\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB\u304C\u898B\u5F53\u305F\u308A\u307E\u305B\u3093\u3002\u5148\u306B\u30BB\u30C3\u30C8\u30A2\u30C3\u30D7\u3092\u5B9F\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002\nlamp init" + ('default' === lampman.mode ? '' : ' --mode ' + lampman.mode));
                    }
                    if ('apache' in lampman.config.lampman && 'mounts' in lampman.config.lampman.apache) {
                        for (_i = 0, _a = lampman.config.lampman.apache.mounts; _i < _a.length; _i++) {
                            mount = _a[_i];
                            dirs = mount.split(/\:/);
                            if (path.resolve('/var/www/html') === path.resolve(dirs[1])) {
                                pubdir = path.join(lampman.config_dir, dirs[0]);
                                if (!fs.existsSync(pubdir)) {
                                    libs.Message('最初に公開ディレクトリを作成してください ↓\n' + pubdir, 'warning', 1);
                                    process.exit();
                                }
                            }
                        }
                    }
                    files = find.fileSync(/\.sh$/, lampman.config_dir);
                    if (files.length) {
                        for (_b = 0, files_1 = files; _b < files_1.length; _b++) {
                            file = files_1[_b];
                            fs.chmodSync(file, 453);
                        }
                    }
                    if (commands.update)
                        libs.UpdateCompose(lampman);
                    args = [
                        '--project-name', lampman.config.project,
                        'up',
                    ];
                    if (!commands.D) {
                        args.push('-d');
                    }
                    if (!commands.flush) return [3, 2];
                    libs.Label('Flush cleaning');
                    return [4, reject_1.action({ force: true })];
                case 1:
                    _c.sent();
                    console.log();
                    _c.label = 2;
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
                        var procs, lampman_id, sp, _loop_1, _i, _a, key, docker_host, http_port, https_port, count, _b, _c, action_1, url, opencmd, extraopt;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    if (code) {
                                        libs.Error("Up process exited with code " + code);
                                        process.exit();
                                    }
                                    procs = [];
                                    lampman_id = child.execFileSync('docker-compose', ['--project-name', lampman.config.project, 'ps', '-q', 'lampman'], { cwd: lampman.config_dir }).toString().trim();
                                    sp = child.execFile('docker', ['port', lampman_id]);
                                    sp.stdout.on('data', function (data) {
                                        for (var _i = 0, _a = data.toString().trim().split(/\n/); _i < _a.length; _i++) {
                                            var line = _a[_i];
                                            var matches = line.match(/^(\d+).+?(\d+)$/);
                                            process.env["LAMPMAN_EXPORT_LAMPMAN_" + matches[1]] = matches[2];
                                        }
                                    });
                                    procs.push(sp);
                                    console.log('');
                                    process.stdout.write(color.magenta.bold('  [Ready]'));
                                    procs.push(libs.ContainerLogAppear('lampman', 'lampman started', lampman).then(function () { return process.stdout.write(color.magenta(' lampman')); }));
                                    _loop_1 = function (key) {
                                        if (!key.match(/^(mysql|postgresql)/))
                                            return "continue";
                                        procs.push(libs.ContainerLogAppear(key, 'Entrypoint finish.', lampman).then(function () { return process.stdout.write(color.magenta(" " + key)); }));
                                    };
                                    for (_i = 0, _a = Object.keys(lampman.config); _i < _a.length; _i++) {
                                        key = _a[_i];
                                        _loop_1(key);
                                    }
                                    return [4, Promise.all(procs).catch(function (e) { return libs.Error(e); })];
                                case 1:
                                    _d.sent();
                                    docker_host = docker.getDockerLocalhost();
                                    console.log();
                                    http_port = process.env.LAMPMAN_EXPORT_LAMPMAN_80;
                                    if (http_port)
                                        console.log(color.magenta.bold('  [Http] ') + color.magenta("http://" + docker_host + ('80' === http_port ? '' : ':' + http_port)));
                                    https_port = process.env.LAMPMAN_EXPORT_LAMPMAN_443;
                                    if (https_port)
                                        console.log(color.magenta.bold('  [Https] ') +
                                            color.magenta("https://" + docker_host + ('443' === https_port ? '' : ':' + https_port)));
                                    if (process.env.LAMPMAN_EXPORT_LAMPMAN_1080)
                                        console.log(color.magenta.bold('  [Maildev] ') +
                                            color.magenta("http://" + docker_host + ":" + process.env.LAMPMAN_EXPORT_LAMPMAN_1080));
                                    if ('on_upped' in lampman.config && lampman.config.on_upped.length) {
                                        count = 0;
                                        for (_b = 0, _c = lampman.config.on_upped; _b < _c.length; _b++) {
                                            action_1 = _c[_b];
                                            if ('open_browser' === action_1.type) {
                                                url = action_1.url
                                                    ? new URL(action_1.url)
                                                    : new URL('http://' + docker_host);
                                                if (action_1.schema) {
                                                    url.protocol = action_1.schema;
                                                    url.port = docker.exchangePortFromSchema(action_1.schema, action_1.container, lampman);
                                                }
                                                if (action_1.path)
                                                    url.pathname = action_1.path;
                                                if (action_1.port)
                                                    url.port = docker.exchangePort(action_1.port, action_1.container, lampman);
                                                opencmd = libs.isWindows()
                                                    ? 'start'
                                                    : libs.isMac()
                                                        ? 'open'
                                                        : '';
                                                if (opencmd)
                                                    child.execSync(opencmd + " " + url.href);
                                            }
                                            if ('show_message' === action_1.type && action_1.message.length) {
                                                libs.Message(action_1.message, action_1.style);
                                                count++;
                                            }
                                            if ('run_command' === action_1.type) {
                                                extraopt = action_1;
                                                if ('object' === typeof extraopt.command)
                                                    extraopt.command = extraopt.command[libs.isWindows() ? 'win' : 'unix'];
                                                console.log();
                                                extra_1.action(extraopt, extraopt.args);
                                                count++;
                                            }
                                            if ('run_extra_command' === action_1.type && action_1.name in lampman.config.extra) {
                                                console.log();
                                                extra_1.action(lampman.config.extra[action_1.name], action_1.args);
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
exports.action = action;
