'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var commander = require("commander");
var libs = require("./libs");
var version_1 = require("./modules/version");
var init_1 = require("./modules/init");
var up_1 = require("./modules/up");
var down_1 = require("./modules/down");
var mysql_1 = require("./modules/mysql");
var psql_1 = require("./modules/psql");
var errors_1 = require("./modules/errors");
var yml_1 = require("./modules/yml");
var noargs_1 = require("./modules/noargs");
console.log('\r');
process.argv.forEach(function (value, i) {
    if ('-m' === value || '--mode' === value) {
        if (process.argv[i + 1])
            process.env.LAMPMAN_MODE = process.argv[i + 1];
    }
});
if (!process.env.LAMPMAN_MODE)
    process.env.LAMPMAN_MODE = 'default';
var lampman = {};
var dirs = process.cwd().split(path.sep);
while (1 !== dirs.length) {
    var config_dir = path.join.apply(path, dirs.concat(['.lampman' + ('default' === process.env.LAMPMAN_MODE ? '' : '-' + process.env.LAMPMAN_MODE)]));
    try {
        fs.accessSync(config_dir, fs.constants.R_OK);
        lampman.dir = config_dir;
        break;
    }
    catch (e) {
        console.log('Unexpected error!\n' + e);
        process.exit();
    }
    dirs.pop();
}
if (lampman.dir) {
    try {
        var config_file = path.join(lampman.dir, 'config.js');
        fs.accessSync(config_file, fs.constants.R_OK);
        lampman.config = require(config_file).config;
    }
    catch (e) {
        console.log('config load error!\n' + e);
    }
}
lampman.yml = { version: 2 };
commander.option('-m, --mode <mode>', '実行モードを指定できます。（標準は default ）');
commander
    .command('init')
    .description('初期化（.lampman/ ディレクトリ作成）')
    .action(function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return init_1.default(args[0], args[1], lampman);
});
commander
    .command('up')
    .description('LAMP起動')
    .action(function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return up_1.default(args[0], args[1], lampman);
});
commander
    .command('down')
    .description('LAMP終了')
    .action(function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return down_1.default(args[0], args[1], lampman);
});
commander
    .command('mysql')
    .description('MySQL操作')
    .action(function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return mysql_1.default(args[0], args[1], lampman);
});
commander
    .command('psql')
    .description('PostgreSQL操作')
    .action(function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return psql_1.default(args[0], args[1], lampman);
});
commander
    .command('errors')
    .description('エラーログ監視')
    .action(function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return errors_1.default(args[0], args[1], lampman);
});
commander
    .command('yml')
    .description('マージした最終ymlを標準出力（プロジェクトルートから相対）')
    .action(function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return yml_1.default(args[0], args[1], lampman);
});
commander
    .command('version')
    .description('バージョン表示')
    .action(function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return version_1.default(args[0], args[1], lampman);
});
var _loop_1 = function (key) {
    var cmd = lampman.config.extra[key].cmd;
    var side = lampman.config.extra[key].side;
    if ('object' === typeof cmd)
        cmd = cmd['win32' === process.platform ? 'win' : 'unix'];
    commander
        .command(key)
        .description(cmd + ' （' + (side) + ' side）')
        .action(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        console.log(key);
        console.log(cmd);
    });
};
for (var _i = 0, _a = Object.keys(lampman.config.extra); _i < _a.length; _i++) {
    var key = _a[_i];
    _loop_1(key);
}
commander.parse(process.argv);
if (commander.args.length) {
    libs.Message(commander.args[0] + ': ご指定のコマンドはありません。', 'danger');
}
else {
    noargs_1.default(commander.commands, commander.options, lampman);
}
