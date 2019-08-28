
'use strict'

const commander = require('commander')

// import * as libs from './libs';
import version from './modules/version';
import demo from './modules/demo';

// 基本オプション
commander
    .option('-M=<mode>, --mode=<mode>', '実行モードを指定できます。（標準は default ）')

// バージョン表示
commander
    .command('version')
    .description('バージョン表示')
    .action(version)

// デモ
commander
    .command('demo')
    .description('デモ実行')
    .action(demo)

// パース実行
commander.parse(process.argv)
