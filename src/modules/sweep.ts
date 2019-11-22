
'use strict'

/**
 * -------------------------------------------------------------------
 * [lamp sweep]
 * 全てのコンテナ、未ロックボリューム、<none>イメージ、不要ネットワークの一掃
 * -------------------------------------------------------------------
 */

declare let lampman:any;

import libs   = require('../libs');
import docker = require('../docker');
import child  = require('child_process')
const prompts = require('prompts')
import { action as reject } from './reject';
import { action as rmi } from './rmi';

/**
 * コマンド登録用メタデータ
 */
export function meta()
{
    return {
        command: 'sweep',
        description: '全てのコンテナ、未ロックボリューム、<none>イメージ、不要ネットワークの一掃',
        options: [
            ['-f, --force', '確認なしで実行する'],
        ]
    }
}

/**
 * コマンド実行
 */
export async function action(commands:any)
{
    // Docker起動必須
    docker.needDockerLive()

    // Yes/No確認
    if(!commands.force) {
        const response = await prompts([
            {
                type: 'toggle',
                name: 'value',
                message: '起動しているかどうかに関わらず、全てのコンテナ、未ロックボリューム、<none>イメージ、不要ネットワークを一掃しますが本当によろしいですか？\n（※docker-compose外のコンテナも対象です）',
                initial: false,
                active: 'yes',
                inactive: 'no'
            }
        ]);
        if(!response.value) return
    }

    // 全てのコンテナとボリューム削除
    await reject({force: true}, lampman)

    // <none>イメージ削除
    await rmi({prune: true})

    // 不要ネットワークの削除
    child.spawnSync('docker', ['network', 'prune', '-f'], {stdio: 'inherit'})

    return
}
