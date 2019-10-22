#!/usr/bin/env node

'use strict'

require('dotenv').config()

import fs        = require('fs');
import path      = require('path');
import child     = require('child_process');
import color     = require('cli-color');
import commander = require('commander');
import libs      = require('./libs');
import docker    = require('./docker');
import version   from './modules/version';
import init      from './modules/init';
import up        from './modules/up';
import down      from './modules/down';
import login     from './modules/login';
import mysql     from './modules/mysql';
import psql      from './modules/psql';
import logs      from './modules/logs';
import yamlout   from './modules/yamlout';
import noargs    from './modules/noargs';
import reject    from './modules/reject';
import sweep     from './modules/sweep';
import rmi       from './modules/rmi';
import config    from './modules/config';
import extra     from './modules/extra';

// 1行改行
console.log()

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
if(''===dirs[0]) dirs[0]='/'
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

// モード指定されている（default以外）のに設定が無い場合はエラー
if('default'!==lampman.mode && !lampman.config_dir) {
    libs.Error(`ご指定のモードがの設定ファイルが見つかりません。\nセットアップを実行してください。\nlamp init --mode ${lampman.mode}`)
}

// 設定ディレクトリがあれば config.js を読み込み
if(lampman.config_dir) lampman = libs.LoadConfig(lampman)

// 基本オプション
commander.option('-m, --mode <mode>', '実行モードを指定できます。（標準は default ）')
    commander.helpOption('-h, --help', 'ヘルプを表示します。');

// init: 初期化
commander
    .command('init')
    .description(`初期化（.lampman${libs.ModeString(lampman.mode)}/ ディレクトリ作成）`)
    .option('-s, --select', 'セットアップしたい内容を個別に選択可能です。')
    .action(cmd=>init(cmd, lampman))

    // up: LAMP起動
commander
    .command('up')
    .description(`LAMP起動（.lampman${libs.ModeString(lampman.mode)}/docker-compose.yml 自動更新）`)
    .option('-f, --flush', '既存のコンテナと未ロックボリュームを全て削除してキレイにしてから起動する')
    .option('-o, --docker-compose-options <args_string>', 'docker-composeコマンドに渡すオプションを文字列で指定可能')
    .option('-D', 'デーモンじゃなくフォアグラウンドで起動する')
    .option('-n --no-update', 'docker-compose.yml を更新せずに起動する')
    .action(cmd=>up(cmd, lampman))

// down: LAMP終了
commander
    .command('down')
    .description('LAMP終了')
    // .option('-v, --volumes', '関連ボリュームも合わせて削除する。（ロックされたボリュームはキープ）')
    .action(cmd=>down(cmd, lampman))

// config: 設定ファイル(config.js)をエディタで開く
commander
    .command('config')
    .description('設定ファイル(config.js)をエディタで開く')
    .action(cmd=>config(cmd, lampman))

// errors: エラーログ監視
commander
    .command('logs [groups...]')
    .description('ログファイル監視（グループ未指定なら最初の１つが表示）')
    .option('-a, --all', '全て表示します')
    .option('-s, --select', '表示するものを１つ選択します')
    .action((cname, cmd)=>logs(cname, cmd, lampman))

// login: リストから選択したコンテナのコンソールにログインします
commander
    .command('login [container-name]')
    .description('コンテナのコンソールにログインします')
    .option('-s, --select', 'コンテナを選択します。Default: lampman')
    .option('-l, --shell <shell>', 'ログインシェルを指定。Default: bash')
    .option('-p, --path <path>', 'ログインパスを指定。Default: /')
    .action((cname, cmd)=>login(cname, cmd, lampman))

// mysql: MySQL操作
commander
    .command('mysql [container-name]')
    .description('MySQL操作（オプション未指定なら mysql クライアントが実行されます）')
    .option('-d, --dump [file_path]', 'ダンプします。ダンプファイルのパス指定可能。')
    .option('-n, --no-rotate', 'ファイルローテーションしないでダンプします。※-d時のみ')
    .option('-r, --restore', '最新のダンプファイルをリストアします。')
    .action((cname, cmd)=>mysql(cname, cmd, lampman))

// psql: PostgreSQL操作
commander
    .command('psql [container-name]')
    .description('PostgreSQL操作（オプション未指定なら psql クライアントが実行されます）')
    .option('-d, --dump [file_path]', 'ダンプします。ダンプファイルのパス指定可能。')
    .option('-n, --no-rotate', 'ファイルローテーションしないでダンプします。※-d時のみ')
    .option('-r, --restore', '最新のダンプファイルをリストアします。')
    .action((cname, cmd)=>psql(cname, cmd, lampman))

// reject: コンテナ・ボリュームを選択して削除
commander
    .command('reject')
    .description('コンテナ・ボリュームのリストから選択して削除（docker-compose管理外も対象）')
    .option('-a, --all', 'ロック中のボリュームも選択できるようにする')
    .option('-f, --force', 'リストから選択可能なものすべて強制的に削除する（※-faとすればロックボリュームも対象）')
    .action(cmd=>reject(cmd, lampman))

// rmi: イメージを選択して削除
commander
    .command('rmi')
    .description('イメージを選択して削除')
    .option('-p, --prune', '選択を出さず <none> のみ全て削除')
    .action(cmd=>rmi(cmd, lampman))

// sweep: 全てのコンテナ、未ロックボリューム、<none>イメージ、不要ネットワークの一掃
commander
    .command('sweep')
    .description('全てのコンテナ、未ロックボリューム、<none>イメージ、不要ネットワークの一掃')
    .option('-f, --force', '確認なしで実行する')
    .action(cmd=>sweep(cmd, lampman))

// yamlout: 設定データをymlとして標準出力（プロジェクトルートから相対）
commander
    .command('yamlout')
    .description('設定データをymlとして標準出力（プロジェクトルートから相対）')
    .action(cmd=>yamlout(cmd, lampman))

// version: バージョン表示
commander
    .command('version')
    .description('バージョン表示')
    .action(cmd=>version(cmd, lampman))

// 追加コマンド
if('undefined'!==typeof lampman.config && 'extra' in lampman.config) {
    for(let key of Object.keys(lampman.config.extra)) {
        let extraopt = lampman.config.extra[key]
        if('object'===typeof extraopt.command) extraopt.command = extraopt.command[libs.isWindows() ? 'win' : 'unix']
        if('undefined'===typeof extraopt.desc) extraopt.desc = extraopt.command
        commander
            .command(key)
            .description(extraopt.desc+(extraopt.container ? color.blackBright(` on ${extraopt.container}`): ''))
            .action((...args)=>extra(extraopt, args, lampman))
        ;
    }
}

// パース実行
commander.parse(process.argv)

// どれもマッチしなかった場合はヘルプ出す
if(commander.args.length) {
    let pos = commander.args.length-1
    let str = 'object'===typeof commander.args[pos]
        ? (<any>commander.args[pos]).name()
        : commander.args[pos]
    if(!commander.commands.map((cmd: any)=>cmd.name()).includes(str)) {
        commander.help()
    }
}

// 引数なしの場合は noargs を実行
else {
    noargs(commander, lampman)
}
