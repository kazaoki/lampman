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
var child = require("child_process");
var color = require('cli-color');
var prompts = require('prompts');
function meta(lampman) {
    return {
        command: 'reject [options]',
        describe: 'コンテナ・ボリュームのリストから選択して削除（docker-compose管理外も対象）',
        options: {
            'locked': {
                alias: 'l',
                describe: 'ロック中のボリュームも選択できるようにします。',
                type: 'boolean',
            },
            'force': {
                alias: 'f',
                describe: 'リストから選択可能なものすべて強制的に削除する（※-faとすればロックボリュームも対象）',
                type: 'boolean',
            },
        },
    };
}
exports.meta = meta;
function action(argv, lampman) {
    return __awaiter(this, void 0, void 0, function () {
        var containers, volumes, list, _i, containers_1, name_1, _a, volumes_1, name_2, response, targets, _b, containers_2, name_3, _c, volumes_2, name_4, response, procs, _loop_1, _d, _e, item, _loop_2, _f, _g, item;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    docker.needDockerLive();
                    containers = child.execFileSync('docker', ['ps', '-a', '--format={{.Names}}']).toString().split(/\r?\n/);
                    volumes = child.execFileSync('docker', ['volume', 'ls', '-q']).toString().split(/\r?\n/);
                    list = [];
                    for (_i = 0, containers_1 = containers; _i < containers_1.length; _i++) {
                        name_1 = containers_1[_i];
                        if (name_1.length) {
                            list.push({
                                title: "[CONTAINER] " + name_1,
                                value: {
                                    type: 'container',
                                    name: name_1
                                },
                            });
                        }
                    }
                    for (_a = 0, volumes_1 = volumes; _a < volumes_1.length; _a++) {
                        name_2 = volumes_1[_a];
                        if (name_2.length) {
                            list.push({
                                title: "[VOLUME] " + name_2,
                                value: {
                                    type: 'volume',
                                    name: name_2
                                },
                                disabled: !argv.locked && name_2.match(/([^A-Za-z0-9]|^)locked([^A-Za-z0-9]|$)/),
                            });
                        }
                    }
                    if (!(argv.locked && argv.force)) return [3, 2];
                    return [4, prompts([
                            {
                                type: 'toggle',
                                name: 'value',
                                message: 'ロックボリュームも含めて全てのコンテナ・ボリュームを強制削除しますが本当によろしいですか？',
                                initial: false,
                                active: 'yes',
                                inactive: 'no'
                            }
                        ])];
                case 1:
                    response = _h.sent();
                    if (!response.value)
                        return [2];
                    _h.label = 2;
                case 2:
                    targets = [];
                    if (!argv.force) return [3, 3];
                    for (_b = 0, containers_2 = containers; _b < containers_2.length; _b++) {
                        name_3 = containers_2[_b];
                        if (name_3.length) {
                            targets.push({
                                type: 'container',
                                name: name_3
                            });
                        }
                    }
                    for (_c = 0, volumes_2 = volumes; _c < volumes_2.length; _c++) {
                        name_4 = volumes_2[_c];
                        if (name_4.length) {
                            if (!argv.locked && name_4.match(/([^A-Za-z0-9]|^)locked([^A-Za-z0-9]|$)/))
                                continue;
                            targets.push({
                                type: 'volume',
                                name: name_4
                            });
                        }
                    }
                    return [3, 5];
                case 3: return [4, prompts([
                        {
                            type: 'multiselect',
                            name: 'targets',
                            message: '削除するコンテナ・ボリュームを選択してください。（スペースキーで複数選択可）',
                            choices: list,
                            instructions: false
                        }
                    ])];
                case 4:
                    response = _h.sent();
                    targets = response.targets;
                    _h.label = 5;
                case 5:
                    if (!(targets && targets.length)) return [3, 10];
                    procs = [];
                    _loop_1 = function (item) {
                        var cid = item.name;
                        if (!cid)
                            return "continue";
                        procs.push(new Promise(function (resolve, reject) {
                            child.execFile('docker', ['rm', '-f', cid])
                                .stderr.on('data', function (data) {
                                console.log("Removing " + cid + " ... " + color.red('ng'));
                                reject(data);
                            })
                                .on('close', function (code) {
                                console.log("Removing " + cid + " ... " + color.green('done'));
                                resolve();
                            });
                        }));
                    };
                    for (_d = 0, _e = targets.filter(function (item) { return 'container' === item.type; }); _d < _e.length; _d++) {
                        item = _e[_d];
                        _loop_1(item);
                    }
                    if (!procs.length) return [3, 7];
                    return [4, Promise.all(procs).catch(function (err) { libs.Error(err); })];
                case 6:
                    _h.sent();
                    _h.label = 7;
                case 7:
                    procs = [];
                    if (!argv.noVolumes) {
                        _loop_2 = function (item) {
                            var vid = item.name;
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
                        for (_f = 0, _g = targets.filter(function (item) { return 'volume' === item.type; }); _f < _g.length; _f++) {
                            item = _g[_f];
                            _loop_2(item);
                        }
                    }
                    if (!procs.length) return [3, 9];
                    return [4, Promise.all(procs).catch(function (err) { libs.Error(err); })];
                case 8:
                    _h.sent();
                    _h.label = 9;
                case 9: return [2];
                case 10: return [2];
            }
        });
    });
}
exports.action = action;
