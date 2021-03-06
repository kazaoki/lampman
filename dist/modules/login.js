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
Object.defineProperty(exports, "__esModule", { value: true });
exports.action = exports.meta = void 0;
var libs = require("../libs");
var docker = require("../docker");
var prompts = require('prompts');
var child = require('child_process');
var color = require('cli-color');
function meta(lampman) {
    return {
        command: 'login [service] [options]',
        describe: 'コンテナのコンソールにログインします',
        options: {
            'select': {
                alias: 's',
                describe: 'ログインするコンテナを選択肢から選びます。',
                type: 'boolean',
            },
            'shell': {
                alias: 'l',
                describe: 'ログインシェルが指定できます。',
                type: 'string',
                nargs: 1,
                default: 'bash',
            },
            'path': {
                alias: 'p',
                describe: 'ログインパスが指定できます。（lampmanのみ設定ファイルにてデフォルト指定可能）',
                type: 'string',
            },
        },
    };
}
exports.meta = meta;
function action(argv, lampman) {
    return __awaiter(this, void 0, void 0, function () {
        var target_cname, cname, sname, cnames, list, out, _i, _a, line, column, response, ret, login_path;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    docker.needDockerLive();
                    cname = argv.service;
                    cnames = [];
                    list = [];
                    out = child.execFileSync('docker', ['ps', '--format', '{{.ID}}\t{{.Names}}\t{{.Status}}\t{{.Image}}']);
                    for (_i = 0, _a = out.toString().split(/\n/); _i < _a.length; _i++) {
                        line = _a[_i];
                        column = line.split(/\t/);
                        if (4 !== column.length)
                            continue;
                        list.push({
                            title: "[" + column[0] + "] " + column[1],
                            description: column[3] + " @ " + column[2],
                            value: column[1]
                        });
                        cnames.push(column[1]);
                    }
                    if (!cnames.length) {
                        libs.Message('選択できるコンテナがありません。', 'info');
                        return [2];
                    }
                    if (1 === list.length)
                        cname = cnames[0];
                    if (!argv.select) return [3, 2];
                    return [4, prompts([
                            {
                                type: 'select',
                                name: 'cname',
                                message: 'コンソールにログインするコンテナを選択してください。',
                                choices: list,
                            }
                        ])];
                case 1:
                    response = _b.sent();
                    if (response.cname)
                        target_cname = response.cname;
                    console.log();
                    return [3, 3];
                case 2:
                    if (cname) {
                        if (cnames.includes(cname)) {
                            target_cname = cname;
                        }
                        else {
                            try {
                                sname = cname;
                                target_cname = docker.getRealCname(cname, lampman);
                            }
                            catch (e) {
                                libs.Error(e);
                            }
                        }
                    }
                    else {
                        try {
                            sname = 'lampman';
                            target_cname = docker.getRealCname(sname, lampman);
                        }
                        catch (e) {
                            libs.Error('正しく実行モードの指定をするか、-s でコンテナを選択してください。');
                        }
                    }
                    _b.label = 3;
                case 3:
                    if ('undefined' === typeof target_cname)
                        return [2];
                    if (!target_cname) {
                        libs.Message("\u3054\u6307\u5B9A\u306E\u30B3\u30F3\u30C6\u30CA\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3067\u3057\u305F\u3002\n" + target_cname, 'warning', 1);
                        return [2];
                    }
                    if (!sname) {
                        try {
                            ret = child.execFileSync('docker', ['inspect', '--format', '{{ index .Config.Labels "com.docker.compose.service"}}', target_cname]).toString().trim();
                            if (ret)
                                sname = ret;
                        }
                        catch (e) { }
                    }
                    login_path = '/';
                    if (lampman.config && sname in lampman.config && 'login_path' in lampman.config[sname]) {
                        login_path = lampman.config[sname].login_path;
                    }
                    else if (argv.path) {
                        login_path = argv.path;
                    }
                    else {
                        login_path = '/';
                    }
                    console.log(color.white.bold("<" + target_cname + ">"));
                    return [4, child.spawn('docker', [
                            'exec',
                            '-e', 'TERM=xterm-256color',
                            '-e', 'LANGUAGE=ja_JP.UTF-8',
                            '-e', 'LANG=ja_JP.UTF-8',
                            '-e', 'LC_TYPE=ja_JP.UTF-8',
                            '-it',
                            target_cname,
                            argv.shell ? argv.shell : 'bash',
                            '-c',
                            "cd " + login_path + " && " + (argv.shell ? argv.shell : 'bash'),
                        ], {
                            stdio: 'inherit',
                        })];
                case 4:
                    _b.sent();
                    return [2];
            }
        });
    });
}
exports.action = action;
