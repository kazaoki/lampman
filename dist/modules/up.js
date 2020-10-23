'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.action = exports.meta = void 0;
var libs = require("../libs");
var docker = require("../docker");
var jsYaml = require("js-yaml");
var sweep_1 = require("./sweep");
var child = require('child_process');
var path = require('path');
var color = require('cli-color');
var fs = require('fs');
var find = require('find');
var open = require('open');
var prompts = require('prompts');
var notifier = require('node-notifier');
function meta(lampman) {
    return {
        command: 'up [options]',
        describe: "LAMP\u8D77\u52D5\uFF08.lampman" + libs.ModeString(lampman.mode) + "/docker-compose.yml \u81EA\u52D5\u66F4\u65B0\uFF09",
        options: {
            'kill-conflicted': {
                alias: 'c',
                describe: '該当ポートが使用中の既存コンテナを強制的に終了させてから起動する',
                type: 'boolean',
            },
            'sweep-force': {
                alias: 'f',
                describe: '`sweep -f` を実行して全て一層してから起動する',
                type: 'boolean',
            },
            'docker-compose-options': {
                alias: 'o',
                describe: 'docker-composeコマンドに渡すオプションを文字列で指定可能',
                type: 'string',
                nargs: 1,
            },
            'D': {
                describe: 'デーモンじゃなくフォアグラウンドで起動する',
                type: 'boolean',
            },
            'no-update': {
                alias: 'n',
                describe: 'docker-compose.yml を更新せずに起動する',
                type: 'boolean',
            },
            'thru-upped': {
                alias: 't',
                describe: 'config.jsで設定した起動時コマンド"on_upped"を実行しない',
                type: 'boolean',
            },
            'restore-volumes': {
                alias: 'r',
                describe: '該当するボリュームも全て削除してから起動する（ロックボリュームは除く）',
                type: 'boolean',
            },
        },
    };
}
exports.meta = meta;
function action(argv, lampman) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, _a, mount, dirs, pubdir, stats, files, _b, files_1, file, args, do_kill_conflicted, do_sweep_force, conflicts, message, _c, _d, id, potrs_str, response, result, message, _e, _f, id, volume_string, volumes, _g, _h, volume, result, proc;
        var _this = this;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    docker.needDockerLive();
                    if (!libs.existConfig(lampman)) {
                        libs.Error("\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB\u304C\u898B\u5F53\u305F\u308A\u307E\u305B\u3093\u3002\u5148\u306B\u30BB\u30C3\u30C8\u30A2\u30C3\u30D7\u3092\u5B9F\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002\nlamp init" + ('default' === lampman.mode ? '' : ' --mode ' + lampman.mode));
                    }
                    if ('apache' in lampman.config.lampman && 'mounts' in lampman.config.lampman.apache) {
                        for (_i = 0, _a = lampman.config.lampman.apache.mounts; _i < _a.length; _i++) {
                            mount = _a[_i];
                            dirs = mount.split(/\:/);
                            if (path.resolve('/var/www/html') === path.resolve(dirs[1])) {
                                pubdir = path.join(lampman.config_dir, dirs[0]);
                                stats = fs.statSync(pubdir);
                                if (!stats.isDirectory()) {
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
                    if (!argv.noUpdate)
                        libs.UpdateCompose(lampman);
                    args = [
                        '--project-name', lampman.config.project,
                        'up',
                        '--force-recreate',
                    ];
                    if (!argv.D) {
                        args.push('-d');
                    }
                    if (argv.dockerComposeOptions) {
                        args.push.apply(args, argv.dockerComposeOptions.replace('\\', '').split(' '));
                    }
                    do_kill_conflicted = false;
                    do_sweep_force = false;
                    if (!argv.sweepForce) return [3, 1];
                    do_sweep_force = true;
                    return [3, 4];
                case 1:
                    conflicts = get_confilict(lampman);
                    if (!Object.keys(conflicts).length) return [3, 4];
                    if (!argv.killConflicted) return [3, 2];
                    do_kill_conflicted = true;
                    return [3, 4];
                case 2:
                    message = '以下のコンテナが公開ポートを使用中のため起動できない可能性があります。\n';
                    for (_c = 0, _d = Object.keys(conflicts); _c < _d.length; _c++) {
                        id = _d[_c];
                        potrs_str = conflicts[id].ports.join(', ');
                        message += "- " + conflicts[id].label + " [" + potrs_str + "]\n";
                    }
                    libs.Message(message, 'warning', 1);
                    console.log();
                    notifier.notify({
                        title: 'Lampman',
                        message: 'ぶつかってるポートがあるのでそのままでは起動できません。',
                    });
                    return [4, prompts({
                            type: 'select',
                            name: 'action',
                            message: 'どうしますか。',
                            choices: [
                                { title: '該当コンテナのみ強制終了してから起動', value: 'kill', selected: true },
                                { title: '全てのコンテナ/未ロックボリューム/ネットワークを強制削除してから起動（sweep -f 同様）', value: 'sweep', selected: false },
                                { title: 'このまま起動してみる', value: 'nothing', selected: false },
                            ],
                            instructions: false,
                            hint: 'Ctrl+Cで終了',
                        })];
                case 3:
                    response = _j.sent();
                    if ('kill' === response.action) {
                        do_kill_conflicted = true;
                    }
                    else if ('sweep' === response.action) {
                        do_sweep_force = true;
                    }
                    else if ('nothing' === response.action) {
                    }
                    else {
                        return [2];
                    }
                    _j.label = 4;
                case 4:
                    if (do_kill_conflicted) {
                        libs.Label('Kill conflicted containers');
                        result = child.execFileSync('docker', __spreadArrays(['kill'], Object.keys(conflicts))).toString().trim();
                        message = '';
                        for (_e = 0, _f = result.split(/\s+/); _e < _f.length; _e++) {
                            id = _f[_e];
                            message += conflicts[id].label + " (" + id + ") [" + conflicts[id].ports.join(', ') + "]\n";
                        }
                        console.log(message);
                    }
                    if (!do_sweep_force) return [3, 6];
                    libs.Label('Sweep force');
                    return [4, sweep_1.action({ force: true }, lampman)];
                case 5:
                    _j.sent();
                    console.log();
                    _j.label = 6;
                case 6:
                    if (argv.restoreVolumes) {
                        libs.Label('Restore volumes (rm containers & volumes)');
                        volume_string = child.execFileSync('docker-compose', ['--project-name', lampman.config.project, 'config', '--volumes'], { cwd: lampman.config_dir }).toString().trim();
                        child.execFileSync('docker-compose', ['--project-name', lampman.config.project, 'kill'], { cwd: lampman.config_dir });
                        child.execFileSync('docker-compose', ['--project-name', lampman.config.project, 'rm', '-fv'], { cwd: lampman.config_dir });
                        volumes = [];
                        for (_g = 0, _h = volume_string.split(/\s+/); _g < _h.length; _g++) {
                            volume = _h[_g];
                            volumes.push(lampman.config.project + '-' + volume);
                        }
                        result = child.execFileSync('docker', __spreadArrays(['volume', 'rm', '-f'], volumes)).toString().trim();
                        console.log(result);
                        console.log();
                    }
                    libs.Label('Upping docker-compose');
                    proc = child.spawn('docker-compose', args, {
                        cwd: lampman.config_dir,
                        stdio: 'inherit'
                    });
                    proc.on('close', function (code) { return __awaiter(_this, void 0, void 0, function () {
                        var procs, lampman_id, sp, _loop_1, _i, _a, key, _b, _c, key, docker_host, http_port, https_port, count, _d, _e, action_1, url, extraopt;
                        var _f, _g, _h;
                        return __generator(this, function (_j) {
                            switch (_j.label) {
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
                                    _j.sent();
                                    if (!docker.isRunning('lampman', lampman)) {
                                        console.log();
                                        libs.Error('lampman container dead!!');
                                    }
                                    for (_b = 0, _c = Object.keys(lampman.config); _b < _c.length; _b++) {
                                        key = _c[_b];
                                        if (!key.match(/^(mysql|postgresql)/))
                                            continue;
                                        if (!docker.isRunning(key, lampman)) {
                                            console.log();
                                            libs.Error(key + " container dead!!");
                                        }
                                    }
                                    docker_host = docker.getDockerLocalhost();
                                    console.log();
                                    http_port = process.env.LAMPMAN_EXPORT_LAMPMAN_80;
                                    if (http_port)
                                        console.log(color.magenta.bold('  [Http] ') + color.magenta("http://" + docker_host + ('80' === http_port ? '' : ':' + http_port)));
                                    https_port = process.env.LAMPMAN_EXPORT_LAMPMAN_443;
                                    if (https_port)
                                        console.log(color.magenta.bold('  [Https] ') +
                                            color.magenta("https://" + docker_host + ('443' === https_port ? '' : ':' + https_port)));
                                    if (((_h = (_g = (_f = lampman === null || lampman === void 0 ? void 0 : lampman.config) === null || _f === void 0 ? void 0 : _f.lampman) === null || _g === void 0 ? void 0 : _g.maildev) === null || _h === void 0 ? void 0 : _h.start) && process.env.LAMPMAN_EXPORT_LAMPMAN_1080)
                                        console.log(color.magenta.bold('  [Maildev] ') +
                                            color.magenta("http://" + docker_host + ":" + process.env.LAMPMAN_EXPORT_LAMPMAN_1080));
                                    if (!('on_upped' in lampman.config && lampman.config.on_upped.length && !argv.thruUpped)) return [3, 7];
                                    count = 0;
                                    _d = 0, _e = lampman.config.on_upped;
                                    _j.label = 2;
                                case 2:
                                    if (!(_d < _e.length)) return [3, 6];
                                    action_1 = _e[_d];
                                    if (!('open_browser' === action_1.type)) return [3, 4];
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
                                    return [4, open(url.href)];
                                case 3:
                                    _j.sent();
                                    _j.label = 4;
                                case 4:
                                    if ('show_message' === action_1.type && action_1.message.length) {
                                        libs.Message(action_1.message, action_1.style);
                                        count++;
                                    }
                                    if ('run_command' === action_1.type) {
                                        extraopt = action_1;
                                        if ('object' === typeof extraopt.command)
                                            extraopt.command = extraopt.command[libs.isWindows() ? 'win' : 'unix'];
                                        console.log();
                                        libs.extra_action(extraopt, extraopt.args, lampman);
                                        count++;
                                    }
                                    if ('run_extra_command' === action_1.type && action_1.name in lampman.config.extra) {
                                        console.log();
                                        libs.extra_action(lampman.config.extra[action_1.name], action_1.args, lampman);
                                        count++;
                                    }
                                    _j.label = 5;
                                case 5:
                                    _d++;
                                    return [3, 2];
                                case 6:
                                    if (count)
                                        console.log();
                                    _j.label = 7;
                                case 7:
                                    console.log();
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
function get_confilict(lampman) {
    var result_yaml_comp = child.execFileSync('docker-compose', ['--project-name', lampman.config.project, 'config'], { cwd: lampman.config_dir }).toString().trim();
    var config = jsYaml.load(result_yaml_comp);
    var yaml_ports = [];
    if (config.services) {
        for (var _i = 0, _a = Object.keys(config.services); _i < _a.length; _i++) {
            var service_name = _a[_i];
            if (config.services[service_name].ports) {
                for (var _b = 0, _c = config.services[service_name].ports; _b < _c.length; _b++) {
                    var lump = _c[_b];
                    if ('object' === typeof (config.services[service_name].ports)) {
                        yaml_ports.push(lump.published);
                    }
                    else {
                        var matches = lump.match(/(\d+)\:/);
                        if (matches && matches[1])
                            yaml_ports.push(matches[1]);
                    }
                }
            }
        }
    }
    var service_names = [];
    var result_services = child.execFileSync('docker-compose', ['--project-name', lampman.config.project, 'config', '--services'], { cwd: lampman.config_dir }).toString().trim();
    for (var _d = 0, _e = result_services.split(/\s+/); _d < _e.length; _d++) {
        var service = _e[_d];
        service_names.push(lampman.config.project + '-' + service);
    }
    var conflicts = {};
    var result_containers = child.execFileSync('docker', ['ps', '-a', '--format', '{{.ID}} {{.Names}} {{.Ports}}', '--filter', 'status=running']).toString().trim();
    for (var _f = 0, _g = result_containers.split(/[\r\n]+/); _f < _g.length; _f++) {
        var line = _g[_f];
        var column = line.split(/\s+/);
        if (service_names.includes(column[1]))
            continue;
        if (2 >= column.length)
            continue;
        if (null === column[2] || !column[2].length)
            continue;
        var id = column.shift();
        var label = column.shift();
        for (var _h = 0, column_1 = column; _h < column_1.length; _h++) {
            var port = column_1[_h];
            var matches = port.match(/\:(\d+)\-\>/);
            if (matches && matches[1]) {
                var port_1 = parseInt(matches[1]);
                if (yaml_ports.includes(port_1)) {
                    if (!conflicts[id])
                        conflicts[id] = {
                            "id": id,
                            "label": label,
                            "ports": [],
                        };
                    conflicts[id].ports.push(port_1);
                }
            }
        }
    }
    return conflicts;
}
