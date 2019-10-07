
'use strict'

import libs = require('../libs')
const child   = require('child_process')

/**
 * extra commands
 */

export default function extra(extraopt: any, args: any, lampman: any)
{
    // メッセージ表示
    if(!('not_show_message' in extraopt && extraopt.not_show_message)) {
        libs.Message(`以下のコマンドを ${extraopt.container ? extraopt.container: 'ホストOS'} 上で実行します。\n${extraopt.command}`, 'primary', 1)
        console.log()
    }

    // コマンド実行
    if('container' in extraopt) {
        // 指定コンテナにてコマンド実行
        child.spawnSync('docker-compose', ['--project-name', lampman.config.project, 'exec', extraopt.container, 'sh', '-c', extraopt.command], {
            stdio: 'inherit',
            cwd: lampman.config_dir
        })
    } else {
        // ホストOSにてコマンド実行
        child.execSync(extraopt.command, {stdio: 'inherit'})
    }

    return
}
