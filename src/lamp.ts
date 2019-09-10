#!/usr/bin/env node

'use strict'

import fs        = require('fs');
import path      = require('path');
import util      = require('util');
import commander = require('commander');
import libs      = require('./libs');

import version   from './modules/version';
// import demo      from './modules/demo';
import init      from './modules/init';
import up        from './modules/up';
import down      from './modules/down';
import rm        from './modules/rm';
import rmi       from './modules/rmi';
import mysql     from './modules/mysql';
import psql      from './modules/psql';
import logs      from './modules/logs';
import ymlout    from './modules/ymlout';
import noargs    from './modules/noargs';

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
        lampman.config_dir = config_dir
        break
    } catch(e){
        libs.Message('Unexpected error!\n'+e, 'danger', 1)
        process.exit()
    }
    dirs.pop()
}

// 設定ファイル特定
if(lampman.config_dir) {
    try {
        let config_file = path.join(lampman.config_dir, 'config.js')
        fs.accessSync(config_file, fs.constants.R_OK)
        lampman.config = require(config_file).config
    } catch(e){
        libs.Message('config load error!\n'+e, 'danger', 1)
        process.exit()
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
    .description('LAMP起動（.lampman/docker-compose.yml 自動更新）')
    .option('-c, --clear', '起動中の他のコンテナを全て強制削除してから起動する。（ボリュームはキープ）')
    .option('-cv, --clear-with-volumes', '起動中の他のコンテナ・ボリュームを全て強制削除してから起動する。（ロックされたボリュームはキープ）')
    .action((...args)=>up(args[0], args[1], lampman))

// down: LAMP終了
commander
    .command('down')
    .description('LAMP終了')
    .option('-v, --volumes', '関連ボリュームも合わせて削除する。（ロックされたボリュームはキープ）')
    .action((...args)=>down(args[0], args[1], lampman))

// rm: コンテナ・ボリューム削除
commander
    .command('rm')
    .description('リストから選択してコンテナ・ボリュームを削除する')
    .option('-f, --force', 'ロックされたボリュームも削除できるようになる')
    .action((...args)=>rm(args[0], args[1], lampman))

// rmi: イメージ削除
commander
    .command('rmi')
    .description('リストから選択してイメージを削除する')
    .action((...args)=>rmi(args[0], args[1], lampman))

// mysql: MySQL操作
commander
    .command('mysql')
    .description('MySQL操作（オプション未指定なら mysql クライアントが実行されます）')
    .option('-d, --dump <to>', 'ダンプします。（toで出力先指定可能）')
    .option('-r, --restore', 'リストアします。（ダンプ選択）')
    .option('-c, --cli', 'コンソールに入ります。')
    .action((...args)=>mysql(args[0], args[1], lampman))

// psql: PostgreSQL操作
commander
    .command('psql')
    .description('PostgreSQL操作（オプション未指定なら mysql クライアントが実行されます）')
    .option('-d, --dump <to>', 'ダンプします。（toで出力先指定可能）')
    .option('-r, --restore', 'リストアします。（ダンプ選択）')
    .option('-c, --cli', 'コンソールに入ります。')
    .action((...args)=>psql(args[0], args[1], lampman))

// errors: エラーログ監視
commander
    .command('logs')
    .description('エラーログ監視')
    .option('-g, --group <name>', 'ロググループ名を指定できます。未指定なら最初のやつ')
    .action((...args)=>logs(args[0], args[1], lampman))

// ymlout: 設定データをymlとして標準出力（プロジェクトルートから相対）
commander
    .command('ymlout')
    .description('設定データをymlとして標準出力（プロジェクトルートから相対）')
    .action((...args)=>ymlout(args[0], args[1], lampman))

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
    let func = lampman.config.extra[key].func
    let desc = lampman.config.extra[key].desc
    let side = lampman.config.extra[key].side
    if('object'===typeof cmd) cmd = cmd['win32'===process.platform ? 'win' : 'unix']
    if('undefined'===typeof desc) desc = 'undefined'===typeof func ? cmd : '(func)'
    commander
        .command(key)
        .description(desc+' ('+(side)+' side)')
        .action((...args)=>{
            if('undefined'===typeof func) {
                // TODO: コマンド実行
                console.log('run command: '+key)
                console.log(cmd)
            } else {
                // TODO: 関数実行
                console.log('run function: '+key)
            }
        })
}

// パース実行
commander.parse(process.argv)

if(commander.args.length) {
    if('string'===typeof commander.args[0]) {
        libs.Message(commander.args[0]+': ご指定のコマンドはありません。')
    }
} else {
    // 引数なし
    noargs(
        commander.commands,
        commander.options,
        lampman
    )
}
