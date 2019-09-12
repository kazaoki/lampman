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
import remove    from './modules/remove';
import clean     from './modules/clean';
import login     from './modules/login';
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
let lampman: any = {
    mode: process.env.LAMPMAN_MODE
}

// 設定ディレクトリ特定（見つかるまでディレクトリ遡る）
let dirs = process.cwd().split(path.sep)
while(1!==dirs.length) {
    let config_dir = path.join(...dirs, '.lampman'+('default'===lampman.mode ? '' : '-'+lampman.mode))
    try {
        fs.accessSync(config_dir, fs.constants.R_OK)
        lampman.config_dir = config_dir
        break
    } catch(e){
        ;
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
        libs.Error('config load error!\n'+e)
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
    .action(cmd=>init(cmd, lampman))

    // up: LAMP起動
commander
    .command('up')
    .description('LAMP起動（.lampman/docker-compose.yml 自動更新）')
    // .option('-r, --remove-orphans', '関係のないコンテナを削除してから起動')
    .option('-f, --flash', '既存のコンテナと未ロックボリュームを全て削除してキレイにしてから起動する')
    .option('-o, --docker-compose-options <args_string>', 'docker-composeコマンドに渡すオプションを文字列で指定可能')
    .action(cmd=>up(cmd, lampman))

// down: LAMP終了
commander
    .command('down')
    .description('LAMP終了')
    // .option('-v, --volumes', '関連ボリュームも合わせて削除する。（ロックされたボリュームはキープ）')
    .action(cmd=>down(cmd, lampman))

// clear: 起動中の全てのコンテナや未ロックなボリューム及び不要なイメージを強制削除する
commander
    .command('clean')
    .description('起動中の全てのコンテナや未ロックなボリューム及び不要なイメージを強制削除する')
    .action(cmd=>clean(cmd, lampman))

// rm: リストから選択してコンテナ・ボリューム・イメージ・ネットワークを削除する
commander
    .command('remove')
    .description('リストから選択してコンテナ・ボリューム・イメージ・ネットワークを削除する')
    .option('-f, --force', 'ロックされたボリュームも削除できるようになる')
    .action(cmd=>remove(cmd, lampman))

    // login: リストから選択したコンテナのコンソールにログインします
commander
    .command('login')
    .description('リストから選択したコンテナのコンソールにログインします')
    .option('-s, --shell <shell>', 'ログインシェルが指定できます。Default: bash')
    .action(cmd=>login(cmd, lampman))

// mysql: MySQL操作
commander
    .command('mysql')
    .description('MySQL操作（オプション未指定なら mysql クライアントが実行されます）')
    .option('-d, --dump <to>', 'ダンプします。（toで出力先指定可能）')
    .option('-r, --restore', 'リストアします。（ダンプ選択）')
    .action(cmd=>mysql(cmd, lampman))

// psql: PostgreSQL操作
commander
    .command('psql')
    .description('PostgreSQL操作（オプション未指定なら mysql クライアントが実行されます）')
    .option('-d, --dump <to>', 'ダンプします。（toで出力先指定可能）')
    .option('-r, --restore', 'リストアします。（ダンプ選択）')
    .option('-c, --cli', 'コンソールに入ります。')
    .action(cmd=>psql(cmd, lampman))

// errors: エラーログ監視
commander
    .command('logs')
    .description('エラーログ監視')
    .option('-g, --group <name>', 'ロググループ名を指定できます。未指定なら最初のやつ')
    .action(cmd=>logs(cmd, lampman))

// ymlout: 設定データをymlとして標準出力（プロジェクトルートから相対）
commander
    .command('ymlout')
    .description('設定データをymlとして標準出力（プロジェクトルートから相対）')
    .action(cmd=>ymlout(cmd, lampman))

// version: バージョン表示
commander
    .command('version')
    .description('バージョン表示')
    .action(cmd=>version(cmd, lampman))

// // demo: デモ
// commander
//     .command('demo')
//     .description('デモ実行')
// .action(args=>down(cmd, lampman))

// 追加コマンド
if('undefined'!==typeof lampman.config) {
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
            .action(cmd=>{
                if('undefined'===typeof func) {
                    // TODO: コマンド実行
                    console.log('run command: '+key)
                    console.log(cmd)
                } else {
                    // TODO: 関数実行
                    console.log('run function: '+key)
                }
            })
        ;
    }
}

// パース実行
commander.parse(process.argv)

if(commander.args.length) {
    if('string'===typeof commander.args[0]) {
        libs.Error(commander.args[0]+': ご指定のコマンドはありません。')
    }
} else {
    // 引数なし
    noargs(
        commander,
        lampman
    )
}
