
'use strict'

import libs = require('../libs');
const child = require('child_process')
const fs = require('fs')

/**
 * config: config.jsをエディタで開く
 */
export default function config(commands: any, lampman: any)
{
    // configあるか
    if(!fs.existsSync(`${lampman.config_dir}/config.js`)) {
        let mode_label = 'default'===lampman.mode ? '' : lampman.mode
        libs.Message(
            `設定ファイル（.lampman${mode_label?'-'+mode_label:''}/config.js）が見つかりませんでした。\n`+
            `プロジェクトフォルダのルートにて \'lamp init ${mode_label?'--mode '+mode_label:''}\' を実行して初期化を行ってください。`,
            'warning'
        )
        return
    }

    // Windows
    if(libs.isWindows()) {
        child.execSync(`start ${lampman.config_dir}/config.js`)
    }

    // Mac
    else if(libs.isMac()) {
        child.execSync(`open ${lampman.config_dir}/config.js`)
    }

    // Linux, show only
    else {
        libs.d(lampman.config)
    }
}
