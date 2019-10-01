
'use strict'

import libs = require('../libs');
const child   = require('child_process')

/**
 * logs: エラーログ監視
 */
export default function logs(group: string|null, commands: any, lampman: any)
{
    // 引数チェック
    if(!('logs' in lampman.config) || 0===lampman.config.logs.length) libs.Error('ログ設定がありません')
    if(group && !(group in lampman.config.logs)) libs.Error(`存在しないロググループ名が指定されています -> ${group}\n指定可能なロググループ名は ${Object.keys(lampman.config.logs).join(', ')} です。`)

    // 対象ロググループ
    let groups = group
        ? [group]
        : Object.keys(lampman.config.logs)

    // 対象回して引数を作る
    let args = groups.length>1 ? ['-s', groups.length] : []
    for(let group of groups) {
        for(let i=0; i<lampman.config.logs[group].length; i++) {
            let column = lampman.config.logs[group][i]
            let file = column[0]
            let opts = column[1]
            if(Array.isArray(opts) && opts.length) args.push(...opts)
            if(i>0) args.push('-I')
            args.push(file)
        }
    }
    child.spawn('docker-compose', ['--project-name', lampman.config.lampman.project, 'exec', 'lampman', 'multitail', '-cS', 'apache', ...args], {
        stdio: 'inherit',
        cwd: lampman.config_dir
    })
}
