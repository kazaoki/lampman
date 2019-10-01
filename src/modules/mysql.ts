
'use strict'

import libs = require('../libs')
const prompts = require('prompts')
const child   = require('child_process')
const fs      = require('fs');
const path    = require('path');
const color   = require('cli-color');

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
            // 接頭辞
            let before_str = ''
            if(commands.dump) before_str = 'ダンプを生成する'
            else if(commands.restore) before_str = 'リストアする'
            else before_str = 'MySQL接続する'
            // mysql設定が複数ある場合は選択させる
            const response = await prompts([
                {
                    type: 'select',
                    name: 'cname',
                    message: before_str+'mysqlコンテナを選択してください。',
                    choices: list,
                }
            ]);
            if('undefined'===typeof response.cname) return
            mysql = response.cname
        } else {
            // mysql設定が１つのみならそれセット
            mysql = list[0].value
        }
    }

    // 現在有効に起動しているコンテナが指定されているのかをチェック
    try {
        child.execFileSync('docker-compose', ['--project-name', lampman.config.lampman.project, 'ps', '-qa', mysql.cname], {cwd: lampman.config_dir})
    } catch(e) {
        libs.Error(e)
    }

    // ダンプ
    if(commands.dump) {

        // ラベル表示
        console.log()
        libs.Label('Dump MySQL')

        // ダンプファイルの特定
        let dumpfile = commands.dump
        if(true===dumpfile) {
            dumpfile = path.join(lampman.config_dir, mysql.cname ,'dump.sql')
        } else if(!path.isAbsolute(dumpfile)) {
            dumpfile = path.join(lampman.config_dir, mysql.cname, dumpfile)
        }

        // ダンプファイルローテーション
        if(commands.rotate && mysql.dump_rotations>0) {
            process.stdout.write('Dumpfile rotate ... ')
            libs.RotateFile(dumpfile, mysql.dump_rotations)
            console.log(color.green('done'))
        }

        // ダンプ開始
        process.stdout.write('Dump to '+dumpfile+' ... ')
        child.spawnSync(
            'docker-compose',
            [
                '--project-name', lampman.config.lampman.project,
                'exec',
                '-T',
                mysql.cname,
                'mysqldump',
                mysql.database,
                '-u'+mysql.user,
                '-p'+mysql.password,
            ],
            {
                cwd: lampman.config_dir,
                stdio: [
                    'ignore',
                    fs.openSync(dumpfile, 'w'),
                    'ignore',
                ]
            }
        )

        // 完了表示
        console.log(color.green('done'))

        return
    }

    // リストア
    if(commands.restore) {

        // ラベル表示
        console.log()
        libs.Label('Restore MySQL')

        // 対象のmysqlコンテナを強制終了
        process.stdout.write(`Stopping ${mysql.cname} ... `)
        try {
            child.spawnSync('docker-compose', ['--project-name', lampman.config.lampman.project, 'rm', '-sf', mysql.cname], {cwd: lampman.config_dir})
        } catch(e) {
            libs.Error(e)
        }
        console.log(color.green('done'))

        // 対象のボリュームを強制削除
        mysql.vname = `${lampman.config.lampman.project}-${mysql.cname}_data`
        process.stdout.write(`Removing volume ${mysql.vname} ... `)
        try {
            child.spawnSync('docker', ['volume', 'rm', mysql.vname, '-f'])
        } catch(e) {
            libs.Error(e)
        }
        console.log(color.green('done'))

        // 対象のmysqlコンテナのみ起動
        process.stdout.write(`Reupping ${mysql.cname} ... `)
        try {
            child.spawnSync('docker-compose', ['--project-name', lampman.config.lampman.project, 'up', '-d', mysql.cname], {cwd: lampman.config_dir})
        } catch(e) {
            libs.Error(e)
        }
        console.log(color.green('done'))
        console.log('');
        process.stdout.write(color.magenta.bold('  [Ready]'));
        libs.ContainerLogAppear(
            mysql.cname,
            'Entrypoint finish.',
            lampman,
        ).catch(err=>{libs.Error(err)})
            .then(()=>{
                process.stdout.write(color.magenta(` ${mysql.cname}`))
                console.log()
            }
        )

        return
    }

    // MySQLクライアントに入る
    await child.spawn(
        'docker-compose',
        [
            '--project-name', lampman.config.lampman.project,
            'exec',
            '-e', 'TERM=xterm-256color',
            '-e', 'LANGUAGE=ja_JP.UTF-8',
            '-e', 'LC_ALL=ja_JP.UTF-8',
            '-e', 'LANG=ja_JP.UTF-8',
            '-e', 'LC_TYPE=ja_JP.UTF-8',
            mysql.cname,
            'mysql',
            mysql.database,
            // '-u'+mysql.user,
            '-uroot',
            '-p'+mysql.password
        ],
        {
            cwd: lampman.config_dir,
            stdio: 'inherit'
        }
    )
}
