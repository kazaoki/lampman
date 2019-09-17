
'use strict'

import libs = require('../libs')
const prompts = require('prompts')
const child   = require('child_process')
const fs      = require('fs');
const path    = require('path');
const color   = require('cli-color');

/**
 * psql: PostgreSQL操作
 */

export default async function psql(cname: string|null, commands: any, lampman: any)
{
    // 対象のpostgresql情報の入れ物
    let postgresql: any = {}

    // まずはpostgresqlコンテナのリスト用意
    let list = []
    for(let key of Object.keys(lampman.config)) {
        if(key.match(/^postgresql/)) {
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
            if(item.cname===cname) postgresql = item.value
        }
        if(!Object.keys(postgresql).length) {
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
            else before_str = 'PostgreSQL接続する'
            // PostgreSQL設定が複数ある場合は選択させる
            const response = await prompts([
                {
                    type: 'select',
                    name: 'cname',
                    message: before_str+'postgresqlコンテナを選択してください。',
                    choices: list,
                }
            ]);
            if('undefined'===typeof response.cname) return
            postgresql = response.cname
        } else {
            // PostgreSQL設定が１つのみならそれセット
            postgresql = list[0].value
        }
    }

    // 現在有効に起動しているコンテナが指定されているのかをチェック
    try {
        child.execFileSync('docker-compose', ['ps', '-qa', postgresql.cname], {cwd: lampman.config_dir})
    } catch(e) {
        libs.Error(e)
    }

    // // ダンプ
    // if(commands.dump) {

    //     // ラベル表示
    //     console.log()
    //     libs.Label('Dump PostgreSQL')

    //     // ダンプファイルの特定
    //     let dumpfile = commands.dump
    //     if(true===dumpfile) {
    //         dumpfile = path.join(lampman.config_dir, postgresql.cname ,'dump.sql')
    //     } else if(!path.isAbsolute(dumpfile)) {
    //         dumpfile = path.join(lampman.config_dir, postgresql.cname, dumpfile)
    //     }

    //     // ダンプファイルローテーション
    //     if(commands.rotate && postgresql.dump_rotations>0) {
    //         process.stdout.write('Dumpfile rotate ... ')
    //         libs.RotateFile(dumpfile, postgresql.dump_rotations)
    //         console.log(color.green('done'))
    //     }

    //     // ダンプ開始
    //     process.stdout.write('Dump to '+dumpfile+' ... ')
    //     child.spawnSync(
    //         'docker-compose',
    //         [
    //             'exec',
    //             '-T',
    //             postgresql.cname,
    //             'mysqldump',
    //             postgresql.database,
    //             '-u'+postgresql.user,
    //             '-p'+postgresql.password,
    //         ],
    //         {
    //             cwd: lampman.config_dir,
    //             stdio: [
    //                 'ignore',
    //                 fs.openSync(dumpfile, 'w'),
    //                 'ignore',
    //             ]
    //         }
    //     )

    //     // 完了表示
    //     console.log(color.green('done'))

    //     return
    // }

    // // リストア
    // // TODO
    // if(commands.restore) {

    //     // ラベル表示
    //     console.log()
    //     libs.Label('Restore PostgreSQL')

    //     // 対象のpostgresqlコンテナを強制終了
    //     process.stdout.write(`Stopping ${postgresql.cname} ... `)
    //     try {
    //         child.spawnSync('docker-compose', ['rm', '-sf', postgresql.cname], {cwd: lampman.config_dir})
    //     } catch(e) {
    //         libs.Error(e)
    //     }
    //     console.log(color.green('done'))

    //     // 対象のボリュームを強制削除
    //     postgresql.vname = `${lampman.config.lampman.project}-${postgresql.cname}_data`
    //     process.stdout.write(`Removing volume ${postgresql.vname} ... `)
    //     try {
    //         child.spawnSync('docker', ['volume', 'rm', postgresql.vname, '-f'])
    //     } catch(e) {
    //         libs.Error(e)
    //     }
    //     console.log(color.green('done'))

    //     // 対象のpostgresqlコンテナのみ起動
    //     process.stdout.write(`Reupping ${postgresql.cname} ... `)
    //     try {
    //         child.spawnSync('docker-compose', ['up', '-d', postgresql.cname], {cwd: lampman.config_dir})
    //     } catch(e) {
    //         libs.Error(e)
    //     }
    //     console.log(color.green('done'))
    //     console.log('');
    //     process.stdout.write(color.magenta.bold('  [Ready]'));
    //     (new Promise(resolve=>{
    //         let timer = setInterval(function () {
    //             if(libs.ContainerLogCheck(postgresql.cname, 'Entrypoint finish.', lampman.config_dir)) {
    //                     process.stdout.write(color.magenta(` ${postgresql.cname}`));
    //                 clearInterval(timer);
    //                 resolve()
    //             }
    //         }, 300);
    //     })).catch(err=>{libs.Error(err)})
    //         .then(()=>{
    //             console.log()
    //         })

    //     return
    // }

    // psqlクライアントに入る
    await child.spawn(
        'docker-compose',
        [
            'exec',
            '-e', 'TERM=xterm-256color',
            '-e', 'LANGUAGE=ja_JP.UTF-8',
            '-e', 'LC_ALL=ja_JP.UTF-8',
            '-e', 'LANG=ja_JP.UTF-8',
            '-e', 'LC_TYPE=ja_JP.UTF-8',
            postgresql.cname,
            'psql',
            postgresql.database,
            '-U',
            postgresql.user,
        ],
        {
            cwd: lampman.config_dir,
            stdio: 'inherit'
        }
    )
}
