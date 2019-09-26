#!/usr/bin/env node
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
var fs = require("fs");
var path = require("path");
var child = require("child_process");
var color = require("cli-color");
var commander = require("commander");
var yaml = require("js-yaml");
var libs = require("./libs");
var docker = require("./docker");
var version_1 = require("./modules/version");
var init_1 = require("./modules/init");
var up_1 = require("./modules/up");
var down_1 = require("./modules/down");
var login_1 = require("./modules/login");
var mysql_1 = require("./modules/mysql");
var psql_1 = require("./modules/psql");
var logs_1 = require("./modules/logs");
var yamlout_1 = require("./modules/yamlout");
var noargs_1 = require("./modules/noargs");
var reject_1 = require("./modules/reject");
var rmi_1 = require("./modules/rmi");
var config_1 = require("./modules/config");
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
    lampman.project_dir = path.dirname(lampman.config_dir);
    var ymldata = docker.ConfigToYaml(lampman.config);
    fs.writeFileSync(lampman.config_dir + "/docker-compose.yml", '# Do not edit this file as it will update automatically !\n' +
        yaml.dump(ymldata));
}
commander.option('-m, --mode <mode>', '実行モードを指定できます。（標準は default ）');
commander
    .command('init')
    .description('初期化（.lampman/ ディレクトリ作成）')
    .action(function (cmd) { return init_1.default(cmd, lampman); });
commander
    .command('up')
    .description('LAMP起動（.lampman/docker-compose.yml 自動更新）')
    .option('-r, --force-recreate', 'コンテナを強制再生成')
    .option('-f, --flush', '既存のコンテナと未ロックボリュームを全て削除してキレイにしてから起動する')
    .option('-o, --docker-compose-options <args_string>', 'docker-composeコマンドに渡すオプションを文字列で指定可能')
    .action(function (cmd) { return up_1.default(cmd, lampman); });
commander
    .command('down')
    .description('LAMP終了')
    .action(function (cmd) { return down_1.default(cmd, lampman); });
commander
    .command('login [container-name]')
    .description('リストから選択したコンテナのコンソールにログインします')
    .option('-s, --shell <shell>', 'ログインシェルが指定できます。Default: bash')
    .option('-p, --path <path>', 'ログインパスを指定。Default: /')
    .action(function (cname, cmd) { return login_1.default(cname, cmd, lampman); });
commander
    .command('mysql [container-name]')
    .description('MySQL操作（オプション未指定なら mysql クライアントが実行されます）')
    .option('-d, --dump [file_path]', 'ダンプします。ダンプファイルのパス指定可能。')
    .option('-n, --no-rotate', 'ファイルローテーションしないでダンプします。※-d時のみ')
    .option('-r, --restore', '最新のダンプファイルをリストアします。')
    .action(function (cname, cmd) { return mysql_1.default(cname, cmd, lampman); });
commander
    .command('psql [container-name]')
    .description('PostgreSQL操作（オプション未指定なら psql クライアントが実行されます）')
    .option('-d, --dump [file_path]', 'ダンプします。ダンプファイルのパス指定可能。')
    .option('-n, --no-rotate', 'ファイルローテーションしないでダンプします。※-d時のみ')
    .option('-r, --restore', '最新のダンプファイルをリストアします。')
    .action(function (cname, cmd) { return psql_1.default(cname, cmd, lampman); });
commander
    .command('logs [group]')
    .description('ログファイル監視（グループ未指定ならsplitして全て表示）')
    .action(function (cname, cmd) { return logs_1.default(cname, cmd, lampman); });
commander
    .command('yamlout')
    .description('設定データをymlとして標準出力（プロジェクトルートから相対）')
    .action(function (cmd) { return yamlout_1.default(cmd, lampman); });
commander
    .command('reject')
    .description('コンテナ・ボリュームのリストから選択して削除（docker-compose管理外も対象）')
    .option('-a, --all', 'ロック中のボリュームも選択できるようにする')
    .option('-f, --force', 'リストから選択可能なものすべて強制的に削除する（※-faとすればロックボリュームも対象）')
    .action(function (cmd) { return reject_1.default(cmd, lampman); });
commander
    .command('rmi')
    .description('イメージを選択して削除')
    .option('-p, --prune', '選択を出さず <none> のみ全て削除')
    .action(function (cmd) { return rmi_1.default(cmd, lampman); });
commander
    .command('config')
    .description('設定ファイル(config.js)をエディタで開く')
    .action(function (cmd) { return config_1.default(cmd, lampman); });
commander
    .command('version')
    .description('バージョン表示')
    .action(function (cmd) { return version_1.default(cmd, lampman); });
if ('undefined' !== typeof lampman.config && 'extra' in lampman.config) {
    var _loop_1 = function (key) {
        var extra = lampman.config.extra[key];
        if ('object' === typeof extra.command)
            extra.command = extra.command['win32' === process.platform ? 'win' : 'unix'];
        if ('undefined' === typeof extra.desc)
            extra.desc = extra.command;
        commander
            .command(key)
            .description(extra.desc + (extra.container ? color.blackBright(" on " + extra.container) : ''))
            .action(function (cmd) {
            libs.Message("Execute the following command on " + (extra.container ? extra.container : 'host OS') + "\n" + extra.desc, 'primary', 1);
            console.log();
            if ('container' in extra) {
                child.spawnSync('docker-compose', ['exec', 'lampman', 'sh', '-c', extra.command], {
                    stdio: 'inherit',
                    cwd: lampman.config_dir
                });
            }
            else {
                child.exec(extra.command).stdout.on('data', function (data) { return process.stdout.write(data); });
            }
        });
    };
    for (var _i = 0, _a = Object.keys(lampman.config.extra); _i < _a.length; _i++) {
        var key = _a[_i];
        _loop_1(key);
    }
}
commander.parse(process.argv);
if (!commander.args.length)
    noargs_1.default(commander, lampman);
