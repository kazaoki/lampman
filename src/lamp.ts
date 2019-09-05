
'use strict'

import fs        = require('fs');
import path      = require('path');
import util      = require('util');
import commander = require('commander');
import libs      = require('./libs');

import version  from './modules/version';
import demo     from './modules/demo';
import init     from './modules/init';
import up       from './modules/up';
import down     from './modules/down';
import mysql    from './modules/mysql';
import psql     from './modules/psql';
import errors   from './modules/errors';
import yml      from './modules/yml';
import noargs   from './modules/noargs';

// 1行改行
console.log('\r')

// モードの設定
process.argv.forEach((value, i)=>{
    if('-m'===value || '--mode'===value) {
        if(process.argv[i+1]) process.env.LAMPMAN_MODE = process.argv[i+1]
    }
})
if(!process.env.LAMPMAN_MODE) process.env.LAMPMAN_MODE = 'default'

// Lampmanオブジェクト用意
let lampman: any = {}

// 設定ディレクトリ特定（見つかるまでディレクトリ遡る）
let dirs = process.cwd().split(path.sep)
while(1!==dirs.length) {
    let config_dir = path.join(...dirs, '.lampman'+('default'===process.env.LAMPMAN_MODE ? '' : '-'+process.env.LAMPMAN_MODE))
    try {
        fs.accessSync(config_dir, fs.constants.R_OK)
        lampman.dir = config_dir
        break
    } catch(e){
        console.log('Unexpected error!\n'+e)
        process.exit();
    }
    dirs.pop()
}

// 設定ファイル特定
if(lampman.dir) {
    try {
        let config_file = path.join(lampman.dir, 'config.js')
        fs.accessSync(config_file, fs.constants.R_OK)
        lampman.config = require(config_file).config
    } catch(e){
        console.log('config load error!\n'+e)
    }
}

// ymlビルド
// TODO: 生成
lampman.yml = {version: 2}

// TODO: カスタマイズ適用

// TODO: yml出力


// 基本オプション
commander.option('-m, --mode <mode>', '実行モードを指定できます。（標準は default ）')

// init: 初期化
commander
    .command('init')
    .description('初期化（.lampman/ ディレクトリ作成）')
    .action((...args)=>init(args[0], args[1], lampman))

// up: LAMP起動
commander
    .command('up')
    .description('LAMP起動')
    .action((...args)=>up(args[0], args[1], lampman))

// down: LAMP終了
commander
    .command('down')
    .description('LAMP終了')
    .action((...args)=>down(args[0], args[1], lampman))

// mysql: MySQL操作
commander
    .command('mysql')
    .description('MySQL操作')
    .action((...args)=>mysql(args[0], args[1], lampman))

// psql: PostgreSQL操作
commander
    .command('psql')
    .description('PostgreSQL操作')
    .action((...args)=>psql(args[0], args[1], lampman))

// errors: エラーログ監視
commander
    .command('errors')
    .description('エラーログ監視')
    .action((...args)=>errors(args[0], args[1], lampman))

// yml: マージした最終ymlを標準出力
commander
    .command('yml')
    .description('マージした最終ymlを標準出力（プロジェクトルートから相対）')
    .action((...args)=>yml(args[0], args[1], lampman))

// version: バージョン表示
commander
    .command('version')
    .description('バージョン表示')
    .action((...args)=>version(args[0], args[1], lampman))

// // demo: デモ
// commander
//     .command('demo')
//     .description('デモ実行')
//     .action((...args)=>demo(args[0], args[1], lampman))

    // 追加コマンド
for(let key of Object.keys(lampman.config.extra)) {
    let cmd = lampman.config.extra[key].cmd
    let side = lampman.config.extra[key].side
    if('object'===typeof cmd) cmd = cmd['win32'===process.platform ? 'win' : 'unix']
    commander
        .command(key)
        .description(cmd+' （'+(side)+' side）')
        .action((...args)=>{
            // TODO: コマンド実行
            console.log(key)
            console.log(cmd)
        })
}

    // パース実行
commander.parse(process.argv)

if(commander.args.length) {
    libs.Message(commander.args[0]+': ご指定のコマンドはありません。', 'danger')
} else {
    // 引数なし
    noargs(
        commander.commands,
        commander.options,
        lampman
    )
}


