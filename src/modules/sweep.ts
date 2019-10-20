
'use strict'

import libs   = require('../libs');
import child  = require('child_process')
const prompts = require('prompts')
import reject from './reject';
import rmi from './rmi';

/**
 * sweep: 全てのコンテナ、未ロックボリューム、<none>イメージ、不要ネットワークの一掃
 */
export default async function sweep(commands: any, lampman: any)
{
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
    await rmi({prune: true}, lampman)

    // 不要ネットワークの削除
    child.spawnSync('docker', ['network', 'prune', '-f'], {stdio: 'inherit'})

    return
}
