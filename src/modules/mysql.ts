
'use strict'

import libs = require('../libs')
const prompts = require('prompts')
const child   = require('child_process')

/**
 * mysql: MySQL操作
 */

export default async function mysql(cname: string|null, commands: any, lampman: any)
{
    // 対象のmysql情報の入れ物
    let mysql: any = {}

    // まずはmysqlコンテナのリスト用意
    let list = []
    for(let key of Object.keys(lampman.config)) {
        if(key.match(/^mysql/)) {
            list.push({
                title: key,
                // description: key,
                value: {cname:key, ...lampman.config[key]} ,
                cname: key,
            })
        }
    }

    // 引数にコンテナ名を指定している場合は、リストにあるかチェック
    if(cname && cname.length) {
        for(let item of list) {
            if(item.cname===cname) mysql = item.value
        }
        if(!Object.keys(mysql).length) {
            libs.Message('ご指定のコンテナ情報が設定ファイルに存在しません。\n'+cname, 'warning', 1)
            process.exit()
        }
    } else {
        // 引数未指定の場合
        if(list.length>1) {
            // mysql設定が複数ある場合は選択させる
            const response = await prompts([
                {
                    type: 'select',
                    name: 'cname',
                    message: '対象のmysqlコンテナを選択してください。',
                    choices: list,
                }
            ]);
            mysql = response.cname
        } else {
            // mysql設定が１つのみならそれセット
            mysql = list[0].value
        }
    }

    // 現在有効に起動しているコンテナが指定されているのかをチェック
    try {
        child.execFileSync('docker-compose', ['ps', '-qa', mysql.cname], {cwd: lampman.config_dir})
    } catch(e) {
        libs.Error(e)
    }

    // ダンプ
    // TODO
    if(commands.dump) {
        console.log('DUMP IT!')
        return;
    }

    // リストア
    // TODO
    if(commands.restore) {
        console.log('RESOTRE!')
        return;
    }

    // MySQLクライアントに入る
    await child.spawn(
        'docker-compose',
        [
            'exec',
            mysql.cname,
            'mysql',
            mysql.database,
            '-u'+mysql.user,
            '-p'+mysql.password
        ],
        {
            cwd: lampman.config_dir,
            stdio: 'inherit'
        }
    )
}
