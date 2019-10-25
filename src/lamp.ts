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

// 基本オプション
commander.option('-m, --mode <mode>', '実行モードを指定できます。（標準は default ）')
    commander.helpOption('-h, --help', 'ヘルプを表示します。');

(async ()=>{
    let result = await new Promise(resolve=>{

        // モジュールファイル一覧
        let module_files = fs.readdirSync(path.join(__dirname, 'modules')).filter(file=>{
            return fs.statSync(path.join(__dirname, 'modules', file)).isFile() && /.*\.js$/.test(file);
        })

        // モジュール登録
        module_files.forEach(file=>{
            let module = require('./modules/'+file)
            let meta = module.meta()
            let c = commander
                .command(meta.command)
                .description(meta.description)
                .action((...args)=>resolve(false!==module.action(...args)))
            if('options' in meta) {
                for(let opt of meta.options) {
                    c.option(opt[0], opt[1], opt[2], opt[3])
                }
            }
        })

        // パース実行
        commander.parse(process.argv)
    })

    // どれも実行されなかった、または実行が無効だった場合
    if(!result) {
        if(commander.args.length) {
            // どれもマッチしなかった場合はヘルプ出す
            commander.help()
        } else {
            // 引数が指定されなかった場合は noargs を実行
            libs.dockerLs(lampman)
        }
    }
})()
