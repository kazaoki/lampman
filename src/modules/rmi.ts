
'use strict'

/**
 * -------------------------------------------------------------------
 * [lamp rmi]
 * イメージを選択して削除
 * -------------------------------------------------------------------
 */

import libs = require('../libs');
import docker = require('../docker');
import child = require('child_process')
const prompts = require('prompts')

/**
 * コマンド登録用メタデータ
 */
export function meta(lampman:any)
{
    return {
        command: 'rmi [options]',
        describe: 'イメージを選択して削除',
        options: {
            'prune': {
                alias: 'p',
                describe: '選択を出さず <none> のみ全て削除します。',
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

    // プルーン実行
    if(argv.prune) {
        child.execFileSync('docker', ['image', 'prune', '-f'], {stdio: 'inherit'})
        return
    }

    // イメージ一覧取得
    let lines = child.execFileSync('docker', ['images', '--format={{.Repository}}\t{{.Tag}}\t{{.ID}}\t{{.Size}}\t{{.CreatedSince}}']).toString().split(/\r?\n/)
    let list: any = []
    for(let line of lines) {
        let column = line.split(/\t/)
        let name   = column[0];
        let tag    = column[1];
        let id     = column[2];
        let size   = column[3];
        let since  = column[4];
        if(name.length) {
            list.push({
                title: `[IMAGE] ${name}:${tag} (${id}) ${size}`,
                value: id,
                description: since,
            })
        }
    }

    // 選択
    const response = await prompts([
        {
            type: 'multiselect',
            name: 'targets',
            message: '削除するイメージを選択してください。（複数可）',
            choices: list,
        }
    ]);

    // 削除開始
    // console.log(response.targets.join(' '))
    child.spawnSync('docker', ['rmi', '-f', ...response.targets], {stdio: 'inherit'})

    return
}
