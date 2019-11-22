#!/usr/bin/env node
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
var fs = require("fs");
var path = require("path");
var color = require("cli-color");
var yargs = require("yargs");
var libs = require("./libs");
require('dotenv').config();
console.log();
var argv = yargs
    .help(false)
    .option('mode', {
    describe: '実行モードを指定',
    alias: 'm',
    default: 'default'
})
    .argv;
if ('mode' in argv && argv.mode.length)
    process.env.LAMPMAN_MODE = argv.mode;
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
var keys = [];
module_files.forEach(function (file) {
    var module = require('./modules/' + file);
    if (!('meta' in module))
        return;
    var meta = module.meta(lampman);
    yargs.command({
        command: meta.command,
        describe: meta.describe,
        builder: function (yargs) {
            if (meta.options)
                yargs.options(meta.options);
            if (meta.usage)
                yargs.usage(meta.usage + '\n\n' + meta.describe);
            return yargs;
        },
        handler: function (argv) { return module.action(argv, lampman); },
    });
    keys.push(meta.command.match(/^([^\s]+)/)[1]);
});
if ('undefined' !== typeof lampman.config && 'extra' in lampman.config) {
    var _loop_1 = function (key) {
        var extraopt = lampman.config.extra[key];
        if ('object' === typeof extraopt.command)
            extraopt.command = extraopt.command[libs.isWindows() ? 'win' : 'unix'];
        if ('undefined' === typeof extraopt.desc)
            extraopt.desc = extraopt.command;
        yargs.command({
            command: key,
            describe: extraopt.desc + (extraopt.container ? color.blackBright(" on " + extraopt.container) : ''),
            handler: function (argv) { return libs.extra_action(extraopt, argv, lampman); }
        });
        keys.push(key.match(/^([^\s]+)/)[1]);
    };
    for (var _i = 0, _a = Object.keys(lampman.config.extra); _i < _a.length; _i++) {
        var key = _a[_i];
        _loop_1(key);
    }
}
yargs
    .locale('en')
    .help('help', 'ヘルプ表示').alias('help', 'h')
    .version(false)
    .group('help', 'Global options:')
    .group('mode', 'Global options:')
    .usage('Usage: lamp|lm [command] [options]')
    .wrap(null)
    .scriptName('lamp')
    .argv;
if (!keys.includes(argv._[0])) {
    libs.dockerLs(lampman);
}
