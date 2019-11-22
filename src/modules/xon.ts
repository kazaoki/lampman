
'use strict'

/**
 * -------------------------------------------------------------------
 * [lamp xon]
 * PHP Xdebugを有効にする
 * -------------------------------------------------------------------
 */

declare let lampman:any;

import libs = require('../libs');
import docker = require('../docker');
const child = require('child_process')

/**
 * コマンド登録用メタデータ
 */
export function meta()
{
    return {
        command: 'xon',
        describe: 'PHP Xdebug を有効にする',
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
            '/lampman/lampman/php-xdebug-on.sh'
        ],
        {
            stdio: 'inherit',
            cwd: lampman.config_dir
        }
    )
    if(0===result.status) libs.Message('PHP Xdebugを有効にしました。', 'primary')
}
