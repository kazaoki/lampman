#!/usr/bin/env node
'use strict';
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
var module_files = fs.readdirSync(path.join(__dirname, 'modules')).filter(function (file) {
    return fs.statSync(path.join(__dirname, 'modules', file)).isFile() && /.*\.js$/.test(file);
});
var files_new = [];
var order = [
    'init.js',
    'up.js',
    'down.js',
    'config.js',
    'xoff.js',
    'xon.js',
    'reject.js',
    'rmi.js',
    'sweep.js',
    'logs.js',
    'status.js',
    'mysql.js',
    'psql.js',
    'login.js',
    'yaml.js',
    'version.js',
];
order.forEach(function (item) {
    var index = module_files.indexOf(item);
    if (-1 !== index) {
        files_new.push(item);
        module_files.splice(index, 1);
    }
});
module_files = files_new.concat(module_files.sort());
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
        return module.action.apply(module, args);
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
commander.on('command:*', function () {
    commander.help();
    process.exit(1);
});
commander.parse(process.argv);
if (!commander.args.length)
    libs.dockerLs(lampman);
