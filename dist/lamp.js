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
var remove_1 = require("./modules/remove");
var clean_1 = require("./modules/clean");
var login_1 = require("./modules/login");
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
var lampman = {
    mode: process.env.LAMPMAN_MODE
};
var dirs = process.cwd().split(path.sep);
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
if (lampman.config_dir) {
    try {
        var config_file = path.join(lampman.config_dir, 'config.js');
        fs.accessSync(config_file, fs.constants.R_OK);
        lampman.config = require(config_file).config;
    }
    catch (e) {
        libs.Error('config load error!\n' + e);
        process.exit();
    }
}
lampman.yml = { version: 2 };
commander.option('-m, --mode <mode>', '実行モードを指定できます。（標準は default ）');
commander
    .command('init')
    .description('初期化（.lampman/ ディレクトリ作成）')
    .action(function (cmd) { return init_1.default(cmd, lampman); });
commander
    .command('up')
    .description('LAMP起動（.lampman/docker-compose.yml 自動更新）')
    .option('-r, --remove-orphans', '関係のないコンテナを削除してから起動')
    .option('-o, --docker-compose-options <args_string>', 'docker-composeコマンドに渡すオプションを文字列で指定可能')
    .action(function (cmd) { return up_1.default(cmd, lampman); });
commander
    .command('down')
    .description('LAMP終了')
    .option('-v, --volumes', '関連ボリュームも合わせて削除する。（ロックされたボリュームはキープ）')
    .action(function (cmd) { return down_1.default(cmd, lampman); });
commander
    .command('remove')
    .description('リストから選択してコンテナ・ボリューム・イメージ・ネットワークを削除する')
    .option('-f, --force', 'ロックされたボリュームも削除できるようになる')
    .action(function (cmd) { return remove_1.default(cmd, lampman); });
commander
    .command('clean')
    .description('起動中の全てのコンテナや未ロックなボリューム及び不要なイメージを強制削除する')
    .action(function (cmd) { return clean_1.default(cmd, lampman); });
commander
    .command('login')
    .description('リストから選択したコンテナのコンソールにログインします')
    .option('-s, --shell <shell>', 'ログインシェルが指定できます。Default: bash')
    .action(function (cmd) { return login_1.default(cmd, lampman); });
commander
    .command('mysql')
    .description('MySQL操作（オプション未指定なら mysql クライアントが実行されます）')
    .option('-d, --dump <to>', 'ダンプします。（toで出力先指定可能）')
    .option('-r, --restore', 'リストアします。（ダンプ選択）')
    .action(function (cmd) { return mysql_1.default(cmd, lampman); });
commander
    .command('psql')
    .description('PostgreSQL操作（オプション未指定なら mysql クライアントが実行されます）')
    .option('-d, --dump <to>', 'ダンプします。（toで出力先指定可能）')
    .option('-r, --restore', 'リストアします。（ダンプ選択）')
    .option('-c, --cli', 'コンソールに入ります。')
    .action(function (cmd) { return psql_1.default(cmd, lampman); });
commander
    .command('logs')
    .description('エラーログ監視')
    .option('-g, --group <name>', 'ロググループ名を指定できます。未指定なら最初のやつ')
    .action(function (cmd) { return logs_1.default(cmd, lampman); });
commander
    .command('ymlout')
    .description('設定データをymlとして標準出力（プロジェクトルートから相対）')
    .action(function (cmd) { return ymlout_1.default(cmd, lampman); });
commander
    .command('version')
    .description('バージョン表示')
    .action(function (cmd) { return version_1.default(cmd, lampman); });
if ('undefined' !== typeof lampman.config) {
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
            .action(function (cmd) {
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
}
commander.parse(process.argv);
if (commander.args.length) {
    if ('string' === typeof commander.args[0]) {
        libs.Error(commander.args[0] + ': ご指定のコマンドはありません。');
    }
}
else {
    noargs_1.default(commander, lampman);
}
