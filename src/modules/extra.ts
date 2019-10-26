
'use strict'

/**
 * -------------------------------------------------------------------
 * extraコマンド
 * -------------------------------------------------------------------
 */

declare let lampman:any;

import libs = require('../libs')
const child   = require('child_process')

export function action(extraopt:any, args:any)
{
    // 関数実行
    if('function' in extraopt) {
        extraopt.function(...args)
    }

    // コマンド実行
    else if('container' in extraopt) {
        // 指定コンテナにてコマンド実行
        child.spawnSync('docker-compose', ['--project-name', lampman.config.project, 'exec', extraopt.container, 'sh', '-c', extraopt.command], {
            stdio: 'inherit',
            cwd: lampman.config_dir
        })
    } else {
        // ホストOSにてコマンド実行
        child.execSync(extraopt.command, {
            stdio: 'inherit',
            cwd: lampman.project_dir
        })
    }

    return
}
