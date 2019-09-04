
'use strict'

import fs        = require('fs');
import path      = require('path');
import util      = require('util');
import commander = require('commander');

import version from './modules/version';
import demo    from './modules/demo';
import noargs  from './modules/noargs';

// モードの設定
process.argv.forEach((value, i)=>{if('-m'===value || '--mode'===value) process.env.LAMPMAN_MODE = process.argv[i+1]})
if(!process.env.LAMPMAN_MODE) process.env.LAMPMAN_MODE = 'default'

// 設定ディレクトリ特定（見つかるまでディレクトリ遡る）
let lampman_dir: string
let dirs = process.cwd().split(path.sep)
while(1!==dirs.length && !lampman_dir) {
    // console.log(dirs)
    let tmp = path.join(...dirs, '.lampman'+('default'===process.env.LAMPMAN_MODE ? '' : '-'+process.env.LAMPMAN_MODE))
    try {
        fs.accessSync(tmp, fs.constants.R_OK)
        lampman_dir = tmp
    } catch(e){}
    dirs.pop()
}

// 設定ファイル特定
let lampman_config: string
let config: object
if(lampman_dir) {
    try {
        let tmp = path.join(lampman_dir, 'config.js')
        fs.accessSync(tmp, fs.constants.R_OK)
        lampman_config = tmp
        config = require(lampman_config)
    } catch(e){}
}
// console.log(lampman_dir)
// console.log(lampman_config)

// let config = require(lampman_config)


// 基本オプション
commander.option('-m, --mode <mode>', '実行モードを指定できます。（標準は default ）')

// バージョン表示
commander
    .command('version')
    .description('バージョン表示')
    .action((...args)=>version(args[0], args[1], config))

// デモ
commander
    .command('demo')
    .description('デモ実行')
    .action((...args)=>demo(args[0], args[1], config))

// パース実行
commander.parse(process.argv)

// 引数なし
if(!commander.args.length) {
    // console.log('引数なしのときの処理');
    noargs(
        commander.commands,
        commander.options,
        config
    )
}
