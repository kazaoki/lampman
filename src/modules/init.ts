
'use strict'

import libs = require('../libs');
import fs   = require('fs-extra');
import path = require('path');
import config    from './config';

const prompts = require('prompts')

/**
 * init: 初期化
 */
export default async function init(commands: any, lampman: any)
{
    // 作成する設定ディレクトリを特定
    let config_dirname = `.lampman${libs.ModeString(lampman.mode)}`
    let config_dir = path.join(process.cwd(), config_dirname)

    // セットアップ内容を選択
    let setup = []
    if(commands.select) {
        let response = await prompts({
            type: 'multiselect',
            name: 'setup',
            message: 'セットアップしたい内容を選択してください。（スペースキーで複数選択可）',
            choices: [
                { title: 'Lampman設定',        value: 'LampmanConfig', description: `(proj)/${config_dirname}/config.js`,    selected: true },
                { title: 'MySQL設定',          value: 'Mysql',         description: `(proj)/${config_dirname}/mysql/*`,      selected: false },
                { title: 'PostgreSQL設定',     value: 'Postgresql',    description: `(proj)/${config_dirname}/postgresql/*`, selected: false },
                { title: '.envサンプル設定',   value: 'EnvSample',     description: '(proj)/.env-sample',                    selected: false },
                { title: 'VSCode用Xdebug設定', value: 'VSCodeDir',     description: '(proj)/.vs-code/',                      selected: false },
            ],
            instructions: false,
        })
        if(!response.setup) return
        setup = response.setup
    } else {
        // --select 無しのときの標準設定
        setup.push('LampmanConfig')
    }

    let messages = []
    try {
        // マスターからのコピー関数用意
        let copyFromMaster = (name: string, use_initdir: boolean=false)=>{
            fs.copySync(
                use_initdir
                    ? path.join(__dirname, '../../.lampman-init/'+name)
                    : path.join(__dirname, '../../'+name)
                ,
                use_initdir
                    ? path.join(config_dir, '/'+name)
                    : path.join(config_dir, '/../'+name)
                ,
                {
                    overwrite: false,
                    errorOnExist: true
                }
            )
        }

        // Lampman設定（`.lampman-init/` から各種ファイルをコピーしてくる）
        if(setup.includes('LampmanConfig')) {
            for(let name of [
                'lampman',
                'config.js',
                'docker-compose.override.yml',
            ]) {
                copyFromMaster(name, true)
                messages.push(`  - ${path.join(config_dir, '/'+name)}`)
            }
            // config.js 書き換え
            if(commands.project || commands.publicDir) {
                let content = fs.readFileSync(config_dir+'/config.js', 'utf-8')
                if(commands.project) content = content.replace(`project: 'lampman-proj',`, `project: '${commands.project}',`)
                if(commands.publicDir) content = content.replace(`'../public_html:/var/www/html'`, `'../${commands.publicDir}:/var/www/html'`)
                fs.writeFileSync(config_dir+'/config.js', content, 'utf-8')
            }
            // compose作成
            lampman.config_dir = config_dir
            lampman = libs.LoadConfig(lampman) // config.js を読み込み
            libs.UpdateCompose(lampman) // 最新の docker-compose.yml を生成
            messages.push(`  - ${path.join(config_dir, '/docker-compose.yml')}`)
            // config.js をエディタで開く
            config({}, lampman)
        }

        // MySQL設定
        if(setup.includes('Mysql')) {
            copyFromMaster('mysql', true)
            messages.push(`  - ${path.join(config_dir, '/mysql')}`)
        }

        // PostgreSQL設定
        if(setup.includes('Postgresql')) {
            copyFromMaster('postgresql', true)
            messages.push(`  - ${path.join(config_dir, '/postgresql')}`)
        }

        // .env-sampleコピー
        if(setup.includes('EnvSample')) {
            copyFromMaster('.env-sample')
            messages.push(`  - ${path.join(config_dir, '/../.env-sample')}`)
        }

        // .vs-code/作成
        if(setup.includes('VSCodeDir')) {
            copyFromMaster('.vscode')
            messages.push(`  - ${path.join(config_dir, '/../.vscode')}`)
        }

    } catch(e) {
        libs.Error(e)
    }

    //メッセージ出力して終了
    if(messages.length) {
        libs.Message('セットアップが完了しました。\n'+messages.join('\n'), 'primary', 1)
    }
}
