
'use strict'

/**
 * -------------------------------------------------------------------
 * [lamp down]
 * upで起動したコンテナ達を終了する（ボリュームは残る。
 * -------------------------------------------------------------------
 */

declare let lampman:any;

const child = require('child_process')

/**
 * コマンド登録用メタデータ
 */
export function meta()
{
    return {
        command: 'down',
        description: 'LAMP終了',
    }
}

/**
 * コマンド実行
 */
export function action(commands:any)
{
    child.spawn('docker-compose',
        [
            '--project-name', lampman.config.project,
            'down'
        ],
        {
            cwd: lampman.config_dir,
            stdio: 'inherit'
        }
    )
}
