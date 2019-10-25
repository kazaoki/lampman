
'use strict'

/**
 * -------------------------------------------------------------------
 * [lamp logs]
 * エラーログ監視
 * -------------------------------------------------------------------
 */

declare let lampman:any;

import libs = require('../libs');
const child   = require('child_process')
const prompts = require('prompts')

/**
 * コマンド登録用メタデータ
 */
export function meta()
{
    return {
        command: 'logs [groups...]',
        description: 'ログファイル監視（グループ未指定なら最初の１つが表示）',
        options: [
            ['-a, --all', '全て表示します'],
            ['-s, --select', '表示するものを１つ選択します'],
        ]
    }
}

/**
 * コマンド実行
 */
export async function action(args:string[]|null, commands:any)
{
    let groups: string[] = []

    // 引数チェック
    if(!('logs' in lampman.config) || 0===Object.keys(lampman.config.logs).length) libs.Error('ログ設定がありません')

    // -a|--all指定の場合は全て
    if(commands.all) {
        groups = Object.keys(lampman.config.logs)
    }

    // -s|--select指定の場合は選択
    else if(commands.select) {
        const response = await prompts([
            {
                type: 'select',
                name: 'group',
                message: '表示したいロググループを１つ選択してください。',
                choices: Object.keys(lampman.config.logs).map(key=>{return{value:key}})
            }
        ]);
        if('undefined'===typeof response.group) return
        groups = [response.group]
    }

    // 引数にて空白区切りで複数指定可能
    else if(args.length) {
        groups = [...args]
    }

    // 引数未指定の場合は最初の１つ
    else {
        groups = [Object.keys(lampman.config.logs)[0]]
    }

    // 対象回して引数を作る
    let arg_string = groups.length>1 ? ['-s', groups.length] : []
    for(let group of groups) {
        if(group && !(group in lampman.config.logs)) libs.Error(`存在しないロググループ名が指定されています -> ${group}\n指定可能なロググループ名は ${Object.keys(lampman.config.logs).join(', ')} です。`)
        for(let i=0; i<lampman.config.logs[group].length; i++) {
            let column = lampman.config.logs[group][i]
            let file = column[0]
            let opts = column[1]
            if(Array.isArray(opts) && opts.length) arg_string.push(...opts)
            if(i>0) arg_string.push('-I')
            arg_string.push(file)
        }
    }

    // multitail実行
    child.spawn('docker-compose', ['--project-name', lampman.config.project, 'exec', 'lampman', 'multitail', '-cS', 'apache', ...arg_string], {
        stdio: 'inherit',
        cwd: lampman.config_dir
    })
}
