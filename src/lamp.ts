#!/usr/bin/env node

'use strict'

require('dotenv').config()

import fs        = require('fs');
import path      = require('path');
import child     = require('child_process');
import color     = require('cli-color');
import commander = require('commander');
import yaml      = require('js-yaml');
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
import rmi       from './modules/rmi';

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
    lampman.project_dir = path.dirname(lampman.config_dir)

    // 最新の docker-compose.yml を生成
    let ymldata = docker.ConfigToYaml(lampman.config)
    fs.writeFileSync(
        `${lampman.config_dir}/docker-compose.yml`,
        '# Do not edit this file as it will update automatically !\n'+
        yaml.dump(ymldata)
    )
}

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
    .option('-f, --flush', '既存のコンテナと未ロックボリュームを全て削除してキレイにしてから起動する')
    .option('-o, --docker-compose-options <args_string>', 'docker-composeコマンドに渡すオプションを文字列で指定可能')
    .action(cmd=>up(cmd, lampman))

// down: LAMP終了
commander
    .command('down')
    .description('LAMP終了')
    // .option('-v, --volumes', '関連ボリュームも合わせて削除する。（ロックされたボリュームはキープ）')
    .action(cmd=>down(cmd, lampman))

    // login: リストから選択したコンテナのコンソールにログインします
commander
    .command('login')
    .description('リストから選択したコンテナのコンソールにログインします')
    .option('-s, --shell <shell>', 'ログインシェルが指定できます。Default: bash')
    .action(cmd=>login(cmd, lampman))

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

// errors: エラーログ監視
commander
    .command('logs [group]')
    .description('ログファイル監視（グループ未指定ならsplitして全て表示）')
    .action((cname, cmd)=>logs(cname, cmd, lampman))

// yamlout: 設定データをymlとして標準出力（プロジェクトルートから相対）
commander
    .command('yamlout')
    .description('設定データをymlとして標準出力（プロジェクトルートから相対）')
    .action(cmd=>yamlout(cmd, lampman))

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

// version: バージョン表示
commander
    .command('version')
    .description('バージョン表示')
    .action(cmd=>version(cmd, lampman))

// 追加コマンド
if('undefined'!==typeof lampman.config && 'extra' in lampman.config) {
    for(let key of Object.keys(lampman.config.extra)) {
        let extra = lampman.config.extra[key]
        if('object'===typeof extra.command) extra.command = extra.command['win32'===process.platform ? 'win' : 'unix']
        if('undefined'===typeof extra.desc) extra.desc = extra.command
        commander
            .command(key)
            .description(extra.desc+(extra.container ? color.blackBright(` on ${extra.container}`): ''))
            .action(cmd=>{
                libs.Message(`Execute the following command on ${extra.container ? extra.container: 'host OS'}\n${extra.desc}`, 'primary', 1)
                console.log()
                // コマンド実行
                if('container' in extra) {
                    // 指定コンテナにて実行
                    child.spawnSync('docker-compose', ['exec', 'lampman', 'sh', '-c', extra.command], {
                        stdio: 'inherit',
                        cwd: lampman.config_dir
                    })
                } else {
                    // ホストOSにて実行
                    child.exec(extra.command).stdout.on('data', data=>process.stdout.write(data))
                }
            })
        ;
    }
}

// パース実行
commander.parse(process.argv)

// 引数なしの場合は noargs を実行
if(!commander.args.length) noargs(commander, lampman)
