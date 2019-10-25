
'use strict'

/**
 * -------------------------------------------------------------------
 * [lamp xon]
 * PHP Xdebugを有効にする
 * -------------------------------------------------------------------
 */

declare let lampman:any;

import libs = require('../libs');
const child = require('child_process')

/**
 * コマンド登録用メタデータ
 */
export function meta()
{
    return {
        command: 'xon',
        description: 'PHP Xdebug を有効にする',
    }
}

/**
 * コマンド実行
 */
export function action(commands:any)
{
    child.spawnSync(
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
    libs.Message('PHP Xdebugを有効にしました。')
}
