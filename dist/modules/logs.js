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
var child = require('child_process');
var prompts = require('prompts');
function meta(lampman) {
    return {
        command: 'logs',
        usage: '$0 logs [groups...] [options]',
        describe: 'ログファイル監視（グループ未指定なら最初の１つが表示）',
        options: {
            'all': {
                alias: 'a',
                describe: '全て表示します。',
                type: 'boolean',
            },
            'select': {
                alias: 's',
                describe: '表示するものを１つ選択します。',
                type: 'boolean',
            },
        },
    };
}
exports.meta = meta;
function action(argv, lampman) {
    return __awaiter(this, void 0, void 0, function () {
        var groups, response, arg_string, _i, groups_1, group, i, column, file, opts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    groups = [];
                    docker.needDockerLive();
                    if (!('logs' in lampman.config) || 0 === Object.keys(lampman.config.logs).length)
                        libs.Error('ログ設定がありません');
                    if (!argv.all) return [3, 1];
                    groups = Object.keys(lampman.config.logs);
                    return [3, 4];
                case 1:
                    if (!argv.select) return [3, 3];
                    return [4, prompts([
                            {
                                type: 'select',
                                name: 'group',
                                message: '表示したいロググループを１つ選択してください。',
                                choices: Object.keys(lampman.config.logs).map(function (key) { return { value: key }; })
                            }
                        ])];
                case 2:
                    response = _a.sent();
                    if ('undefined' === typeof response.group)
                        return [2];
                    groups = [response.group];
                    return [3, 4];
                case 3:
                    if (argv._.slice(1).length) {
                        groups = argv._.slice(1);
                    }
                    else {
                        groups = [Object.keys(lampman.config.logs)[0]];
                    }
                    _a.label = 4;
                case 4:
                    arg_string = groups.length > 1 ? ['-s', groups.length] : [];
                    for (_i = 0, groups_1 = groups; _i < groups_1.length; _i++) {
                        group = groups_1[_i];
                        if (group && !(group in lampman.config.logs))
                            libs.Error("\u5B58\u5728\u3057\u306A\u3044\u30ED\u30B0\u30B0\u30EB\u30FC\u30D7\u540D\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u3059 -> " + group + "\n\u6307\u5B9A\u53EF\u80FD\u306A\u30ED\u30B0\u30B0\u30EB\u30FC\u30D7\u540D\u306F " + Object.keys(lampman.config.logs).join(', ') + " \u3067\u3059\u3002");
                        for (i = 0; i < lampman.config.logs[group].length; i++) {
                            column = lampman.config.logs[group][i];
                            file = column[0];
                            opts = column[1];
                            if (Array.isArray(opts) && opts.length)
                                arg_string.push.apply(arg_string, opts);
                            if (i > 0)
                                arg_string.push('-I');
                            arg_string.push(file);
                        }
                    }
                    child.spawn('docker-compose', __spreadArrays(['--project-name', lampman.config.project, 'exec', 'lampman', 'multitail', '-cS', 'apache'], arg_string), {
                        stdio: 'inherit',
                        cwd: lampman.config_dir
                    });
                    return [2];
            }
        });
    });
}
exports.action = action;
