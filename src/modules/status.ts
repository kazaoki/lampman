
'use strict'

/**
 * -------------------------------------------------------------------
 * [lamp status]
 * docker-compose logs -f -p XXX と同等
 * -------------------------------------------------------------------
 */

declare let lampman:any;

import child = require('child_process')

/**
 * コマンド登録用メタデータ
 */
export function meta()
{
    return {
        command: 'status',
        description: 'dockerコンテナ達の標準出力(logs)を監視する',
    }
}

/**
 * コマンド実行
 */
export function action(commands:any)
{
    child.execFileSync(
        'docker-compose',
        [
            '-p', lampman.config.project,
            'logs',
            '-f',
        ],
        {
            stdio: 'inherit',
            cwd: lampman.config_dir
        }
    )
}
