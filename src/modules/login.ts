
'use strict'

import libs   = require('../libs');
const prompts = require('prompts');
const child   = require('child_process')
const color   = require('cli-color');

/**
 * login: リストから選択したコンテナのコンソールにログインします
 */
export default async function login(commands: any, lampman: any)
{
    // コンテナリスト取得
    let list = []
    let out = child.execFileSync('docker', ['ps', '--format', '{{.ID}}\t{{.Names}}\t{{.Status}}\t{{.Image}}'])
    for(let line of out.toString().split(/\n/)) {
        let column = line.split(/\t/)
        if(4!==column.length) continue;
        list.push({
            title: `[${column[0]}] ${column[1]}`,
            description: `${column[3]} @ ${column[2]}`,
            value: column[1]
        })
    }
    if(!list.length) {
        libs.Message('選択できるコンテナがありません。', 'info')
        return
    }

    // コンテナ選択
    const response = await prompts([
        {
            type: 'select',
            name: 'cname',
            message: 'コンソールにログインするコンテナを選択してください。',
            choices: list,
        }
    ]);

    // ログイン
    if(response.cname) {
        console.log()
        console.log(color.white.bold(`<${response.cname}>`))
        await child.spawn(
            'docker',
            ['exec', '-it', response.cname, commands.shell ? commands.shell : 'bash'],
            {
                stdio: 'inherit',
                env: {
                    TERM: 'xterm-256color',
                    LC_ALL: 'C',
                }
            }
        )
    }
}
