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
var fs = require("fs-extra");
var path = require("path");
var config_1 = require("./config");
var prompts = require('prompts');
function meta(lampman) {
    return {
        command: 'init [options]',
        describe: "\u521D\u671F\u5316\uFF08.lampman" + libs.ModeString(lampman.mode) + "/ \u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u4F5C\u6210\uFF09",
        options: {
            'force': {
                alias: 'f',
                describe: 'セットアップを飛ばします。',
                type: 'boolean',
            },
            'project': {
                alias: 'p',
                describe: 'セットアップするプロジェクト名を指定可能です。',
                type: 'string',
                nargs: 1,
            },
            'public-dir': {
                alias: 'd',
                describe: 'セットアップするウェブ公開ディレクトリ名を指定可能です。',
                type: 'string',
                nargs: 1,
                default: 'public_html',
            },
        },
    };
}
exports.meta = meta;
function action(argv, lampman) {
    return __awaiter(this, void 0, void 0, function () {
        var config_dirname, config_dir, setup, response, messages, copyFromMaster, _i, _a, name_1, content;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    config_dirname = ".lampman" + libs.ModeString(lampman.mode);
                    config_dir = path.join(process.cwd(), config_dirname);
                    setup = [];
                    if (!!argv.force) return [3, 2];
                    return [4, prompts({
                            type: 'multiselect',
                            name: 'setup',
                            message: 'セットアップしたい内容を選択してください。（スペースキーで複数選択可）',
                            choices: [
                                { title: 'Lampman設定', value: 'LampmanConfig', description: "(proj)/" + config_dirname + "/config.js", selected: !libs.existConfig(lampman) },
                                { title: 'MySQL設定', value: 'Mysql', description: "(proj)/" + config_dirname + "/mysql/*", selected: false },
                                { title: 'PostgreSQL設定', value: 'Postgresql', description: "(proj)/" + config_dirname + "/postgresql/*", selected: false },
                                { title: '.envサンプル設定', value: 'EnvSample', description: '(proj)/.env-sample', selected: false },
                                { title: 'VSCode用Xdebug設定', value: 'VSCodeDir', description: '(proj)/.vs-code/', selected: false },
                            ],
                            instructions: false,
                        })];
                case 1:
                    response = _b.sent();
                    if (!response.setup)
                        return [2];
                    setup = response.setup;
                    return [3, 3];
                case 2:
                    setup.push('LampmanConfig');
                    _b.label = 3;
                case 3:
                    messages = [];
                    try {
                        copyFromMaster = function (name, use_initdir) {
                            if (use_initdir === void 0) { use_initdir = false; }
                            fs.copySync(use_initdir
                                ? path.join(__dirname, '../../.lampman-init/' + name)
                                : path.join(__dirname, '../../' + name), use_initdir
                                ? path.join(config_dir, '/' + name)
                                : path.join(config_dir, '/../' + name), {
                                overwrite: false,
                                errorOnExist: true
                            });
                        };
                        if (setup.includes('LampmanConfig')) {
                            for (_i = 0, _a = [
                                'lampman',
                                'config.js',
                                'docker-compose.override.yml',
                            ]; _i < _a.length; _i++) {
                                name_1 = _a[_i];
                                copyFromMaster(name_1, true);
                                messages.push("  - " + path.join(config_dir, '/' + name_1));
                            }
                            if (argv.project || argv.publicDir) {
                                content = fs.readFileSync(config_dir + '/config.js', 'utf-8');
                                if (argv.project)
                                    content = content.replace("project: 'lampman-proj',", "project: '" + argv.project + "',");
                                if (argv.publicDir)
                                    content = content.replace("'../public_html:/var/www/html'", "'../" + argv.publicDir + ":/var/www/html'");
                                fs.writeFileSync(config_dir + '/config.js', content, 'utf-8');
                            }
                            lampman.config_dir = config_dir;
                            lampman = libs.LoadConfig(lampman);
                            libs.UpdateCompose(lampman);
                            messages.push("  - " + path.join(config_dir, '/docker-compose.yml'));
                            config_1.action(null, lampman);
                        }
                        if (setup.includes('Mysql')) {
                            copyFromMaster('mysql', true);
                            messages.push("  - " + path.join(config_dir, '/mysql'));
                        }
                        if (setup.includes('Postgresql')) {
                            copyFromMaster('postgresql', true);
                            messages.push("  - " + path.join(config_dir, '/postgresql'));
                        }
                        if (setup.includes('EnvSample')) {
                            copyFromMaster('.env-sample');
                            messages.push("  - " + path.join(config_dir, '/../.env-sample'));
                        }
                        if (setup.includes('VSCodeDir')) {
                            copyFromMaster('.vscode');
                            messages.push("  - " + path.join(config_dir, '/../.vscode'));
                        }
                    }
                    catch (e) {
                        libs.Error(e);
                    }
                    if (messages.length) {
                        libs.Message('セットアップが完了しました。\n' + messages.join('\n'), 'primary', 1);
                    }
                    return [2];
            }
        });
    });
}
exports.action = action;
