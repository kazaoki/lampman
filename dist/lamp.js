'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var commander = require("commander");
var version_1 = require("./modules/version");
var demo_1 = require("./modules/demo");
var noargs_1 = require("./modules/noargs");
// モードの設定
process.argv.forEach(function (value, i) { if ('-m' === value || '--mode' === value)
    process.env.LAMPMAN_MODE = process.argv[i + 1]; });
if (!process.env.LAMPMAN_MODE)
    process.env.LAMPMAN_MODE = 'default';
// 設定ディレクトリ特定（見つかるまでディレクトリ遡る）
var lampman_dir;
var dirs = process.cwd().split(path.sep);
while (1 !== dirs.length && !lampman_dir) {
    // console.log(dirs)
    var tmp = path.join.apply(path, dirs.concat(['.lampman' + ('default' === process.env.LAMPMAN_MODE ? '' : '-' + process.env.LAMPMAN_MODE)]));
    try {
        fs.accessSync(tmp, fs.constants.R_OK);
        lampman_dir = tmp;
    }
    catch (e) { }
    dirs.pop();
}
// 設定ファイル特定
var lampman_config;
var config;
if (lampman_dir) {
    try {
        var tmp = path.join(lampman_dir, 'config.js');
        fs.accessSync(tmp, fs.constants.R_OK);
        lampman_config = tmp;
        config = require(lampman_config);
    }
    catch (e) { }
}
// console.log(lampman_dir)
// console.log(lampman_config)
// let config = require(lampman_config)
// 基本オプション
commander.option('-m, --mode <mode>', '実行モードを指定できます。（標準は default ）');
// バージョン表示
commander
    .command('version')
    .description('バージョン表示')
    .action(function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return version_1.default(args[0], args[1], config);
});
// デモ
commander
    .command('demo')
    .description('デモ実行')
    .action(function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return demo_1.default(args[0], args[1], config);
});
// パース実行
commander.parse(process.argv);
// 引数なし
if (!commander.args.length) {
    // console.log('引数なしのときの処理');
    noargs_1.default(commander.commands, commander.options, config);
}
