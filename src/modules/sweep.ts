
'use strict'

/**
 * -------------------------------------------------------------------
 * [lamp sweep]
 * 全てのコンテナ、未ロックボリューム、<none>イメージ、不要ネットワークの一掃
 * -------------------------------------------------------------------
 */

import libs   = require('../libs');
import docker = require('../docker');
import child  = require('child_process')
const prompts = require('prompts')
import { action as reject } from './reject';
import { action as rmi } from './rmi';

/**
 * コマンド登録用メタデータ
 */
export function meta(lampman:any)
{
    return {
        command: 'sweep [options]',
        describe: '全てのコンテナ、未ロックボリューム、<none>イメージ、不要ネットワークの一掃',
        options: {
            'containers': {
                alias: 'c',
                describe: 'コンテナのみ一掃します。',
                type: 'boolean',
            },
            'force': {
                alias: 'f',
                describe: '確認なしで実行します。',
                type: 'boolean',
            },
        },
    }
}

/**
 * コマンド実行
 */
export async function action(argv:any, lampman:any)
{
    // Docker起動必須
    docker.needDockerLive()

    // Yes/No確認
    if(!argv.force) {
        const response = await prompts([
            {
                type: 'toggle',
                name: 'value',
                message: (argv.containers
                    ? '起動しているかどうかに関わらず、全てのコンテナを一掃しますが本当によろしいですか？\n（※docker-compose外のコンテナも対象です）'
                    : '起動しているかどうかに関わらず、全てのコンテナ、未ロックボリューム、<none>イメージ、不要ネットワークを一掃しますが本当によろしいですか？\n（※docker-compose外のコンテナも対象です）'
                ),
                initial: false,
                active: 'yes',
                inactive: 'no'
            }
        ]);
        if(!response.value) return
    }

    // 全てのコンテナとボリューム削除
    await reject({noVolumes: argv.containers, force: true}, lampman)

    // <none>イメージ削除
    if(!argv.containers) await rmi({prune: true}, lampman)

    // 不要ネットワークの削除
    if(!argv.containers) child.spawnSync('docker', ['network', 'prune', '-f'], {stdio: 'inherit'})

    return
}
