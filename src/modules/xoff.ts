
'use strict'

/**
 * -------------------------------------------------------------------
 * [lamp xoff]
 * PHP Xdebugを無効にする
 * -------------------------------------------------------------------
 */

declare let lampman:any;

import libs = require('../libs');
import docker = require('../docker');
const child = require('child_process')

/**
 * コマンド登録用メタデータ
 */
export function meta(lampman:any)
{
    return {
        command: 'xoff',
        describe: 'PHP Xdebug を無効にする',
    }
}

/**
 * コマンド実行
 */
export function action(argv:any, lampman:any)
{
    // Docker起動必須
    docker.needDockerLive()

    // コマンド実行
    let result = child.spawnSync(
        'docker-compose',
        [
            '--project-name',
            lampman.config.project,
            'exec',
            'lampman',
            'sh',
            '-c',
            '/lampman/lampman/php-xdebug-off.sh'
        ],
        {
            stdio: 'inherit',
            cwd: lampman.config_dir
        }
    )
    if(0===result.status) libs.Message('PHP Xdebugを無効にしました。', 'primary')
}
