#!/usr/bin/env node
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
var rm_1 = require("./modules/rm");
var rmi_1 = require("./modules/rmi");
var mysql_1 = require("./modules/mysql");
var psql_1 = require("./modules/psql");
var logs_1 = require("./modules/logs");
var ymlout_1 = require("./modules/ymlout");
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
        lampman.config_dir = config_dir;
        break;
    }
    catch (e) {
        libs.Message('Unexpected error!\n' + e, 'danger', 1);
        process.exit();
    }
    dirs.pop();
}
if (lampman.config_dir) {
    try {
        var config_file = path.join(lampman.config_dir, 'config.js');
        fs.accessSync(config_file, fs.constants.R_OK);
        lampman.config = require(config_file).config;
    }
    catch (e) {
        libs.Message('config load error!\n' + e, 'danger', 1);
        process.exit();
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
    .description('LAMP起動（.lampman/docker-compose.yml 自動更新）')
    .option('-c, --clear', '起動中の他のコンテナを全て強制削除してから起動する。（ボリュームはキープ）')
    .option('-cv, --clear-with-volumes', '起動中の他のコンテナ・ボリュームを全て強制削除してから起動する。（ロックされたボリュームはキープ）')
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
    .option('-v, --volumes', '関連ボリュームも合わせて削除する。（ロックされたボリュームはキープ）')
    .action(function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return down_1.default(args[0], args[1], lampman);
});
commander
    .command('rm')
    .description('リストから選択してコンテナ・ボリュームを削除する')
    .option('-f, --force', 'ロックされたボリュームも削除できるようになる')
    .action(function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return rm_1.default(args[0], args[1], lampman);
});
commander
    .command('rmi')
    .description('リストから選択してイメージを削除する')
    .action(function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return rmi_1.default(args[0], args[1], lampman);
});
commander
    .command('mysql')
    .description('MySQL操作（オプション未指定なら mysql クライアントが実行されます）')
    .option('-d, --dump <to>', 'ダンプします。（toで出力先指定可能）')
    .option('-r, --restore', 'リストアします。（ダンプ選択）')
    .option('-c, --cli', 'コンソールに入ります。')
    .action(function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return mysql_1.default(args[0], args[1], lampman);
});
commander
    .command('psql')
    .description('PostgreSQL操作（オプション未指定なら mysql クライアントが実行されます）')
    .option('-d, --dump <to>', 'ダンプします。（toで出力先指定可能）')
    .option('-r, --restore', 'リストアします。（ダンプ選択）')
    .option('-c, --cli', 'コンソールに入ります。')
    .action(function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return psql_1.default(args[0], args[1], lampman);
});
commander
    .command('logs')
    .description('エラーログ監視')
    .option('-g, --group <name>', 'ロググループ名を指定できます。未指定なら最初のやつ')
    .action(function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return logs_1.default(args[0], args[1], lampman);
});
commander
    .command('ymlout')
    .description('設定データをymlとして標準出力（プロジェクトルートから相対）')
    .action(function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return ymlout_1.default(args[0], args[1], lampman);
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
    var func = lampman.config.extra[key].func;
    var desc = lampman.config.extra[key].desc;
    var side = lampman.config.extra[key].side;
    if ('object' === typeof cmd)
        cmd = cmd['win32' === process.platform ? 'win' : 'unix'];
    if ('undefined' === typeof desc)
        desc = 'undefined' === typeof func ? cmd : '(func)';
    commander
        .command(key)
        .description(desc + ' (' + (side) + ' side)')
        .action(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if ('undefined' === typeof func) {
            console.log('run command: ' + key);
            console.log(cmd);
        }
        else {
            console.log('run function: ' + key);
        }
    });
};
for (var _i = 0, _a = Object.keys(lampman.config.extra); _i < _a.length; _i++) {
    var key = _a[_i];
    _loop_1(key);
}
commander.parse(process.argv);
if (commander.args.length) {
    if ('string' === typeof commander.args[0]) {
        libs.Message(commander.args[0] + ': ご指定のコマンドはありません。');
    }
}
else {
    noargs_1.default(commander.commands, commander.options, lampman);
}
