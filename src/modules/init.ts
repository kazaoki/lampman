
'use strict'

/**
 * -------------------------------------------------------------------
 * [lamp init]
 * Lampman初期化
 * -------------------------------------------------------------------
 */

import libs = require('../libs');
import fs   = require('fs-extra');
import path = require('path');
import { action as config } from './config';
const prompts = require('prompts')
const color   = require('cli-color')

/**
 * コマンド登録用メタデータ
 */
export function meta(lampman:any)
{
    return {
        command: 'init [options]',
        describe: `初期化（.lampman${libs.ModeString(lampman.mode)}/ ディレクトリ作成）`,
        options: {
            'force': {
                alias: 'f',
                describe: 'セットアップを飛ばします。',
                type: 'boolean',
            },
            'project': {
                alias: 'p',
                describe: 'セットアップするプロジェクト名を指定可能です。',
                type: 'string',
                nargs: 1,
            },
            'public-dir': {
                alias: 'd',
                describe: 'セットアップするウェブ公開ディレクトリ名を指定可能です。',
                type: 'string',
                nargs: 1,
                default: 'public_html',
            },
            'reset-entrypoint-shell': {
                alias: 'r',
                describe: 'lampman及び各DBコンテナの entrypoint.sh を標準のもので上書きする。',
                type: 'boolean',
            },
        },
    }
}

/**
 * コマンド実行
 */
export async function action(argv:any, lampman:any)
{
    // 作成する設定ディレクトリを特定
    let config_dirname = `.lampman${libs.ModeString(lampman.mode)}`
    let config_dir = path.join(process.cwd(), config_dirname)

    // entrypoint.sh リセット処理して終わる
    if(argv.resetEntrypointShell) {
        if(!lampman.config_dir) {
            libs.Message('設定ディレクトリが見つかりません。先にセットアップしてください。', 'warning')
            return
        }

        let targets = []

        // lampman本体
        targets.push({
            'from': path.join(__dirname, '../../.lampman-init/lampman/entrypoint.sh'),
            'to':   path.join(lampman.config_dir, '/lampman/entrypoint.sh')
        })

        // XDebugスイッチ
        targets.push({
            'from': path.join(__dirname, '../../.lampman-init/lampman/php-xdebug-off.sh'),
            'to':   path.join(lampman.config_dir, '/lampman/php-xdebug-off.sh')
        })
        targets.push({
            'from': path.join(__dirname, '../../.lampman-init/lampman/php-xdebug-on.sh'),
            'to':   path.join(lampman.config_dir, '/lampman/php-xdebug-on.sh')
        })

        // 各DB
        for(const key of Object.keys(lampman.config)) {
            // MySQL
            if(key.match(/^mysql/)) {
                targets.push({
                    'from': path.join(__dirname, '../../.lampman-init/mysql/entrypoint.sh'),
                    'to':   path.join(lampman.config_dir, `/${key}/entrypoint.sh`)
                })
            }
            // PostgreSQL
            if(key.match(/^postgresql/)) {
                targets.push({
                    'from': path.join(__dirname, '../../.lampman-init/postgresql/entrypoint.sh'),
                    'to':   path.join(lampman.config_dir, `/${key}/entrypoint.sh`)
                })
            }
        }

        let list_string = ''
        for(let obj of targets) {
            list_string += `- ${obj.to}\n`
        }
        libs.Message(list_string, 'primary')

        const response = await prompts([
            {
                type: 'toggle',
                name: 'value',
                message: '上記のファイルをそれぞれ標準の entrypoint.sh で上書きしますがよろしいでしょうか。',
                initial: false,
                active: 'yes',
                inactive: 'no'
            }
        ]);
        if(!response.value) return

        // マスターからコピー
        console.log()
        for(let target of targets) {
            fs.copySync(
                target.from,
                target.to,
                {
                    overwrite: true,
                    errorOnExist: true
                }
            )
            console.log(color.green('- '+target.to+' ... done'))
        }
        return
    }

    // セットアップ内容を選択
    let setup = []
    if(!argv.force) {
        let response = await prompts({
            type: 'multiselect',
            name: 'setup',
            message: 'セットアップしたい内容を選択してください。（スペースキーで複数選択可）',
            choices: [
                { title: 'Lampman設定',        value: 'LampmanConfig', description: `(proj)/${config_dirname}/config.js`,    selected: !libs.existConfig(lampman) },
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
        // --force のときの標準設定
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
            if(argv.project || argv.publicDir) {
                let content = fs.readFileSync(config_dir+'/config.js', 'utf-8')
                if(argv.project) content = content.replace(`project: 'lampman-proj',`, `project: '${argv.project}',`)
                if(argv.publicDir) content = content.replace(`'../public_html:/var/www/html'`, `'../${argv.publicDir}:/var/www/html'`)
                fs.writeFileSync(config_dir+'/config.js', content, 'utf-8')
            }
            // compose作成
            lampman.config_dir = config_dir
            lampman = libs.LoadConfig(lampman) // config.js を読み込み
            libs.UpdateCompose(lampman) // 最新の docker-compose.yml を生成
            messages.push(`  - ${path.join(config_dir, '/docker-compose.yml')}`)
            // config.js をエディタで開く
            config(null, lampman)
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
