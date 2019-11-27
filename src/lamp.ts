#!/usr/bin/env node

'use strict'

require('dotenv').config()

import fs    = require('fs')
import path  = require('path')
import color = require('cli-color')
import yargs = require('yargs')
import child  = require('child_process')
import libs  = require('./libs')
require('dotenv').config()

// 1行改行
console.log()

// モードの設定
let argv = yargs
    .help(false)
    .option('mode',
        {
            describe: '実行モードを指定',
            alias: 'm',
            default: 'default'
        }
    )
    .argv
if('mode' in argv && argv.mode.length) process.env.LAMPMAN_MODE = argv.mode

// Lampmanオブジェクト用意
let lampman: any = {
    mode: process.env.LAMPMAN_MODE
}
declare let global: any;
global.lampman = lampman

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

// モード指定されている（default以外）のに設定が無い場合はエラー。ただしinitの場合は通す。
if('default'!==lampman.mode && !lampman.config_dir && !process.argv.includes('init')) {
    libs.Error(`ご指定のモードの設定ファイルが見つかりません。\nセットアップを実行してください。\nlamp init --mode ${lampman.mode}`)
}

// 設定ディレクトリがあれば config.js を読み込み
if(lampman.config_dir) lampman = libs.LoadConfig(lampman)

// モジュールファイル一覧
let module_files = fs.readdirSync(path.join(__dirname, 'modules')).filter(file=>{
    return fs.statSync(path.join(__dirname, 'modules', file)).isFile() && /.*\.js$/.test(file);
})

// 順番指定
let files_new:string[] = []
let order = [
    'init.js',
    'up.js',
    'down.js',
    'config.js',
    'xoff.js',
    'xon.js',
    'reject.js',
    'rmi.js',
    'sweep.js',
    'logs.js',
    'status.js',
    'mysql.js',
    'psql.js',
    'login.js',
    'yaml.js',
    'version.js',
]
order.forEach(item=>{
    let index = module_files.indexOf(item)
    if(-1!==index) {
        files_new.push(item)
        module_files.splice(index, 1)
    }
})
module_files = [...files_new, ...module_files.sort()]

// モジュール登録
let keys:any[] = []
module_files.forEach(file=>{
    let module = require('./modules/'+file)
    if(!('meta' in module)) return
    let meta = module.meta(lampman)
    yargs.command(
        {
            command: meta.command,
            describe: meta.describe,
            builder: (yargs:any)=>{
                if(meta.options) yargs.options(meta.options)
                if(meta.usage) yargs.usage(meta.usage+'\n\n'+meta.describe) // usage指定されるとdescribeがでなくなるので。
                return yargs
            },
            handler: (argv:any)=>module.action(argv, lampman),
        },
    )
    keys.push(meta.command.match(/^([^\s]+)/)[1])
})

// extraコマンド登録
if('undefined'!==typeof lampman.config && 'extra' in lampman.config) {
    for(let key of Object.keys(lampman.config.extra)) {
        let extraopt = lampman.config.extra[key]
        if('object'===typeof extraopt.command) extraopt.command = extraopt.command[libs.isWindows() ? 'win' : 'unix']
        if('undefined'===typeof extraopt.desc) extraopt.desc = extraopt.command
        yargs.command(
            {
                command: key,
                describe: extraopt.desc+(extraopt.container ? color.blackBright(` on ${extraopt.container}`): ''),
                handler: (argv:any)=>libs.extra_action(extraopt, argv, lampman)
            },
        )
        keys.push(key.match(/^([^\s]+)/)[1])
    }
}

// グローバルオプション設定、引数解析実行
yargs
    .locale('en')
    .help('help', 'ヘルプ表示').alias('help', 'h')
    .version(false)
    .group('help', 'Global options:')
    .group('mode', 'Global options:')
    .usage('Usage: lamp|lm [command] [options]')
    .wrap(null)
    .scriptName('lamp')
    .argv

// コマンド指定が無い場合は docker の情報を表示
if(!argv._.length) {
    libs.dockerLs(lampman)
}
// 存在しないコマンドの場合はヘルプを表示
else if(!keys.includes(argv._[0])) {
    yargs.showHelp()
    console.log()
    libs.Message(`コマンド \`${argv._[0]}\` はありません。上記ヘルプを参照ください。`, 'danger')
}
