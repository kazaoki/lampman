'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var prompts = require('prompts');
var commander = require('commander');
// import * as libs from './libs';
var version_1 = require("./modules/version");
// 基本オプション
commander
    .option('-M=<mode>, --mode=<mode>', '実行モードを指定できます。（標準は default ）');
// バージョン表示
commander
    .command('version')
    .description('バージョン表示')
    .action(version_1.default);
// パース実行
commander.parse(process.argv);
