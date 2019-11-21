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
var libs = require("../libs");
var docker = require("../docker");
var prompts = require('prompts');
var child = require('child_process');
var fs = require('fs');
var path = require('path');
var color = require('cli-color');
function meta() {
    return {
        command: 'psql [container-name]',
        description: 'PostgreSQL操作（オプション未指定なら psql クライアントが実行されます）',
        options: [
            ['-d, --dump', 'ダンプします'],
            ['-p, --dump-path <dump_path>', 'ダンプファイルのディレクトリパスを指定'],
            ['-n, --no-rotate', 'ファイルローテーションしないでダンプします。※-d時のみ'],
            ['-r, --restore', '最新のダンプファイルをリストアします。'],
        ]
    };
}
exports.meta = meta;
function action(cname, commands) {
    return __awaiter(this, void 0, void 0, function () {
        var postgresql, list, _i, _a, key, _b, list_1, item, before_str, response, is_gzip, dumpdir, dumpfile, procs, _c, procs_1, proc, conts, procs;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    docker.needDockerLive();
                    postgresql = {};
                    list = [];
                    for (_i = 0, _a = Object.keys(lampman.config); _i < _a.length; _i++) {
                        key = _a[_i];
                        if (key.match(/^postgresql/)) {
                            list.push({
                                title: key + (commands.restore && lampman.config[key].volume_locked ? ' - [locked]' : ''),
                                description: (lampman.config[key].volume_locked ? '[locked]' : ''),
                                value: __assign({ cname: key }, lampman.config[key]),
                                cname: key,
                                disabled: commands.restore && lampman.config[key].volume_locked
                            });
                        }
                    }
                    if (!(cname && cname.length)) return [3, 1];
                    for (_b = 0, list_1 = list; _b < list_1.length; _b++) {
                        item = list_1[_b];
                        if (item.cname === cname)
                            postgresql = item.value;
                    }
                    if (!Object.keys(postgresql).length) {
                        libs.Message('ご指定のコンテナ情報が設定ファイルに存在しません。\n' + cname, 'warning', 1);
                        process.exit();
                    }
                    return [3, 5];
                case 1:
                    if (!(list.length === 0)) return [3, 2];
                    libs.Error('PostgreSQL設定がありません。');
                    return [2];
                case 2:
                    if (!(list.length > 1)) return [3, 4];
                    before_str = '';
                    if (commands.dump)
                        before_str = 'ダンプを生成する';
                    else if (commands.restore)
                        before_str = 'リストアする';
                    else
                        before_str = 'PostgreSQL接続する';
                    return [4, prompts([
                            {
                                type: 'select',
                                name: 'cname',
                                message: before_str + 'postgresqlコンテナを選択してください。',
                                choices: list,
                            }
                        ])];
                case 3:
                    response = _d.sent();
                    if ('undefined' === typeof response.cname)
                        return [2];
                    postgresql = response.cname;
                    return [3, 5];
                case 4:
                    postgresql = list[0].value;
                    _d.label = 5;
                case 5:
                    try {
                        child.execFileSync('docker-compose', ['--project-name', lampman.config.project, 'ps', '-qa', postgresql.cname], { cwd: lampman.config_dir });
                    }
                    catch (e) {
                        libs.Error(e);
                    }
                    if (!commands.dump) return [3, 10];
                    libs.Label('Dump PostgreSQL');
                    is_gzip = !!postgresql.dump.filename.match(/\.gz$/);
                    dumpdir = commands.dumpPath ? commands.dumpPath : path.join(lampman.config_dir, postgresql.cname);
                    if (!path.isAbsolute(dumpdir)) {
                        dumpdir = path.join(process.cwd(), dumpdir);
                    }
                    if (!fs.existsSync(dumpdir)) {
                        fs.mkdirSync(dumpdir, { recursive: true });
                    }
                    dumpfile = path.join(dumpdir, (postgresql.dump.filename ? postgresql.dump.filename : 'dump.sql'));
                    if (commands.rotate && postgresql.dump.rotations > 0) {
                        process.stdout.write('Dumpfile rotate ... ');
                        libs.RotateFile(dumpfile, postgresql.dump.rotations);
                        console.log(color.green('done'));
                    }
                    process.stdout.write('Dump to ' + dumpfile + ' ... ');
                    procs = [];
                    procs.push(child.spawn('docker-compose', [
                        '--project-name', lampman.config.project,
                        'exec',
                        '-T',
                        '-e', 'LANGUAGE=ja_JP.UTF-8',
                        '-e', 'LC_ALL=ja_JP.UTF-8',
                        '-e', 'LANG=ja_JP.UTF-8',
                        '-e', 'LC_TYPE=ja_JP.UTF-8',
                        postgresql.cname,
                        'pg_dump',
                        postgresql.database,
                        '-U',
                        postgresql.user,
                    ], {
                        cwd: lampman.config_dir,
                        stdio: [
                            'ignore',
                            (is_gzip
                                ? 'pipe'
                                : fs.openSync(dumpfile, 'w')),
                            'ignore',
                        ]
                    }));
                    if (is_gzip) {
                        procs.push(child.spawn('gzip', {
                            stdio: [
                                procs[0].stdio[1],
                                fs.openSync(dumpfile, 'w'),
                                'ignore',
                            ]
                        }));
                    }
                    _c = 0, procs_1 = procs;
                    _d.label = 6;
                case 6:
                    if (!(_c < procs_1.length)) return [3, 9];
                    proc = procs_1[_c];
                    return [4, proc];
                case 7:
                    _d.sent();
                    _d.label = 8;
                case 8:
                    _c++;
                    return [3, 6];
                case 9:
                    console.log(color.green('done'));
                    return [2];
                case 10:
                    if (!commands.restore) return [3, 12];
                    if (postgresql.volume_locked)
                        libs.Error(postgresql.cname + " \u306F\u30ED\u30C3\u30AF\u6E08\u307F\u30DC\u30EA\u30E5\u30FC\u30E0\u306E\u305F\u3081\u30EA\u30B9\u30C8\u30A2\u3067\u304D\u307E\u305B\u3093\u3002");
                    libs.Label('Restore PostgreSQL');
                    conts = [postgresql.cname];
                    try {
                        child.spawnSync('docker-compose', [
                            '--project-name', lampman.config.project,
                            'rm', '-sf'
                        ].concat(conts), {
                            cwd: lampman.config_dir,
                            stdio: 'inherit'
                        });
                    }
                    catch (e) {
                        libs.Error(e);
                    }
                    postgresql.vname = lampman.config.project + "-" + postgresql.cname + "_data";
                    process.stdout.write("Removing volume " + postgresql.vname + " ... ");
                    try {
                        child.spawnSync('docker', ['volume', 'rm', postgresql.vname, '-f']);
                    }
                    catch (e) {
                        libs.Error(e);
                    }
                    console.log(color.green('done'));
                    try {
                        child.spawnSync('docker-compose', [
                            '--project-name', lampman.config.project,
                            'up', '-d'
                        ].concat(conts), {
                            cwd: lampman.config_dir,
                            stdio: 'inherit'
                        });
                    }
                    catch (e) {
                        libs.Error(e);
                    }
                    console.log('');
                    procs = [];
                    process.stdout.write(color.magenta.bold('  [Ready]'));
                    procs.push(libs.ContainerLogAppear(postgresql.cname, 'Entrypoint finish.', lampman)
                        .catch(function (err) { libs.Error(err); })
                        .then(function () { return process.stdout.write(color.magenta(" " + postgresql.cname)); }));
                    return [4, Promise.all(procs).catch(function (e) { return libs.Error(e); })];
                case 11:
                    _d.sent();
                    console.log();
                    return [2];
                case 12: return [4, child.spawn('docker-compose', [
                        '--project-name', lampman.config.project,
                        'exec',
                        '-e', 'TERM=xterm-256color',
                        '-e', 'LANGUAGE=ja_JP.UTF-8',
                        '-e', 'LC_ALL=ja_JP.UTF-8',
                        '-e', 'LANG=ja_JP.UTF-8',
                        '-e', 'LC_TYPE=ja_JP.UTF-8',
                        postgresql.cname,
                        'psql',
                        postgresql.database,
                        '-U',
                        postgresql.user,
                    ], {
                        cwd: lampman.config_dir,
                        stdio: 'inherit'
                    })];
                case 13:
                    _d.sent();
                    return [2];
            }
        });
    });
}
exports.action = action;
