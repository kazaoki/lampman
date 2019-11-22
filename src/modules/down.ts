
'use strict'

/**
 * -------------------------------------------------------------------
 * [lamp down]
 * upで起動したコンテナ達を終了する（ボリュームは残る。
 * -------------------------------------------------------------------
 */

declare let lampman:any;

const child = require('child_process')
import docker = require('../docker');

/**
 * コマンド登録用メタデータ
 */
export function meta()
{
    return {
        command: 'down',
        describe: 'LAMP終了',
        options: {},
    }
}

/**
 * コマンド実行
 */
export function action(argv:any, lampman:any)
{
    // Docker起動必須
    docker.needDockerLive()

    // down実行
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
