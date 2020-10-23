
'use strict'

/**
 * -------------------------------------------------------------------
 * [lamp config]
 * config.jsをエディタで開く
 * -------------------------------------------------------------------
 */

import libs = require('../libs');
const fs = require('fs')
const open = require('open')

/**
 * コマンド登録用メタデータ
 */
export function meta(lampman:any)
{
    return {
        command: 'config',
        describe: '設定ファイル(config.js)をエディタで開く',
    }
}

/**
 * コマンド実行
 */
export async function action(argv:any, lampman:any)
{
    // configあるか
    if(!fs.existsSync(`${lampman.config_dir}/config.js`)) {
        let mode_label = 'default'===lampman.mode ? '' : lampman.mode
        libs.Message(
            `設定ファイル（.lampman${mode_label?'-'+mode_label:''}/config.js）が見つかりませんでした。\n`+
            `プロジェクトフォルダのルートにて \'lamp init${mode_label?' --mode '+mode_label:''}\' を実行して初期化を行ってください。`,
            'warning'
        )
        return
    }

    // open
    if(libs.isLinux() && process.env.SHELL && process.env.SHLVL) {
        console.log(lampman.config)
    } else {
        await open(`${lampman.config_dir}/config.js`)
    }
    console.log()
}
