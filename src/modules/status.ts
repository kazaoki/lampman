
'use strict'

/**
 * -------------------------------------------------------------------
 * [lamp status]
 * docker-compose logs -f -p XXX と同等
 * -------------------------------------------------------------------
 */

declare let lampman:any;

import child = require('child_process')
import docker = require('../docker');

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
    // Docker起動必須
    docker.needDockerLive()

    // dpcker logs実行
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
