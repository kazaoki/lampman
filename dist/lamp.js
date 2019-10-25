#!/usr/bin/env node
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
var fs = require("fs");
var path = require("path");
var color = require("cli-color");
var commander = require("commander");
var libs = require("./libs");
console.log();
process.argv.forEach(function (value, i) {
    if ('-m' === value || '--mode' === value) {
        if (process.argv[i + 1])
            process.env.LAMPMAN_MODE = process.argv[i + 1];
    }
});
if (!process.env.LAMPMAN_MODE)
    process.env.LAMPMAN_MODE = 'default';
var lampman = {
    mode: process.env.LAMPMAN_MODE
};
global.lampman = lampman;
var dirs = process.cwd().split(path.sep);
if ('' === dirs[0])
    dirs[0] = '/';
while (1 !== dirs.length) {
    var config_dir = path.join.apply(path, dirs.concat(['.lampman' + ('default' === lampman.mode ? '' : '-' + lampman.mode)]));
    try {
        fs.accessSync(config_dir, fs.constants.R_OK);
        lampman.config_dir = config_dir;
        break;
    }
    catch (e) {
        ;
    }
    dirs.pop();
}
if ('default' !== lampman.mode && !lampman.config_dir && !process.argv.includes('init')) {
    libs.Error("\u3054\u6307\u5B9A\u306E\u30E2\u30FC\u30C9\u306E\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3002\n\u30BB\u30C3\u30C8\u30A2\u30C3\u30D7\u3092\u5B9F\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002\nlamp init --mode " + lampman.mode);
}
if (lampman.config_dir)
    lampman = libs.LoadConfig(lampman);
commander.option('-m, --mode <mode>', '実行モードを指定できます。（標準は default ）');
commander.helpOption('-h, --help', 'ヘルプを表示します。');
(function () { return __awaiter(_this, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, new Promise(function (resolve) {
                    var module_files = fs.readdirSync(path.join(__dirname, 'modules')).filter(function (file) {
                        return fs.statSync(path.join(__dirname, 'modules', file)).isFile() && /.*\.js$/.test(file);
                    });
                    module_files.forEach(function (file) {
                        var module = require('./modules/' + file);
                        if (!('meta' in module))
                            return;
                        var meta = module.meta();
                        var c = commander
                            .command(meta.command)
                            .description(meta.description)
                            .action(function () {
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i] = arguments[_i];
                            }
                            return resolve(false !== module.action.apply(module, args));
                        });
                        if ('options' in meta) {
                            for (var _i = 0, _a = meta.options; _i < _a.length; _i++) {
                                var opt = _a[_i];
                                c.option(opt[0], opt[1], opt[2], opt[3]);
                            }
                        }
                    });
                    var extra = require('./modules/extra');
                    if ('undefined' !== typeof lampman.config && 'extra' in lampman.config) {
                        var _loop_1 = function (key) {
                            var extraopt = lampman.config.extra[key];
                            if ('object' === typeof extraopt.command)
                                extraopt.command = extraopt.command[libs.isWindows() ? 'win' : 'unix'];
                            if ('undefined' === typeof extraopt.desc)
                                extraopt.desc = extraopt.command;
                            commander
                                .command(key)
                                .description(extraopt.desc + (extraopt.container ? color.blackBright(" on " + extraopt.container) : ''))
                                .action(function () {
                                var args = [];
                                for (var _i = 0; _i < arguments.length; _i++) {
                                    args[_i] = arguments[_i];
                                }
                                return extra(extraopt, args, lampman);
                            });
                        };
                        for (var _i = 0, _a = Object.keys(lampman.config.extra); _i < _a.length; _i++) {
                            var key = _a[_i];
                            _loop_1(key);
                        }
                    }
                    commander.parse(process.argv);
                })];
            case 1:
                result = _a.sent();
                if (!result) {
                    if (commander.args.length) {
                        commander.help();
                    }
                    else {
                        libs.dockerLs(lampman);
                    }
                }
                return [2];
        }
    });
}); })();
