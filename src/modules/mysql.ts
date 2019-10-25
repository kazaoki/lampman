
'use strict'

/**
 * -------------------------------------------------------------------
 * [lamp mysql]
 * MySQL操作
 * -------------------------------------------------------------------
 */

declare let lampman:any;

import libs = require('../libs')
const prompts = require('prompts')
const child   = require('child_process')
const fs      = require('fs');
const path    = require('path');
const color   = require('cli-color');

/**
 * コマンド登録用メタデータ
 */
export function meta()
{
    return {
        command: 'mysql [container-name]',
        description: 'MySQL操作（オプション未指定なら mysql クライアントが実行されます）',
        options: [
            ['-d, --dump', 'ダンプします'],
            ['-p, --file-path <file_path>', 'ダンプファイルのディレクトリパスを指定'],
            ['-n, --no-rotate', 'ファイルローテーションしないでダンプします。※-d時のみ'],
            ['-r, --restore', '最新のダンプファイルをリストアします。'],
        ]
    }
}

/**
 * コマンド実行
 */
export async function action(cname:string|null, commands:any)
{
    // 対象のmysql情報の入れ物
    let mysql: any = {}

    // まずはmysqlコンテナのリスト用意
    let list = []
    for(let key of Object.keys(lampman.config)) {
        if(key.match(/^mysql/)) {
            list.push({
                title: key+(commands.restore && lampman.config[key].volume_locked ? ' - [locked]' : ''),
                description: (lampman.config[key].volume_locked ? '[locked]' : ''),
                value: {cname:key, ...lampman.config[key]} ,
                cname: key,
                disabled: commands.restore && lampman.config[key].volume_locked
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
        child.execFileSync('docker-compose', ['--project-name', lampman.config.project, 'ps', '-qa', mysql.cname], {cwd: lampman.config_dir})
    } catch(e) {
        libs.Error(e)
    }

    // ダンプ
    if(commands.dump) {

        // ラベル表示
        libs.Label('Dump MySQL')

        // 圧縮モードか
        let is_gzip = mysql.dump.filename.match(/\.gz$/)

        // ダンプファイルの特定
        let dumpfile = path.join(
            (commands.filePath   ? commands.filePath   : path.join(lampman.config_dir, mysql.cname)),
            (mysql.dump.filename ? mysql.dump.filename : 'dump.sql')
        )

        // ダンプファイルローテーション
        if(commands.rotate && mysql.dump.rotations>0) {
            process.stdout.write('Dumpfile rotate ... ')
            libs.RotateFile(dumpfile, mysql.dump.rotations)
            console.log(color.green('done'))
        }

        // ダンプ開始
        process.stdout.write('Dump to '+dumpfile+' ... ')
        let procs = []
        procs.push(child.spawn(
            'docker-compose',
            [
                '--project-name', lampman.config.project,
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
                    (is_gzip
                        ? 'pipe'
                        : fs.openSync(dumpfile, 'w')
                    ),
                    'ignore',
                ]
            }
        ))
        // 圧縮処理
        if(is_gzip) {
            procs.push(child.spawn(
                'gzip',
                {
                    stdio: [
                        procs[0].stdio[1],
                        fs.openSync(dumpfile, 'w'),
                        'ignore',
                    ]
                }
            ))
        }

        // 直列実行
        for(let proc of procs) {
            await proc
        }

        // 完了表示
        console.log(color.green('done'))

        return
    }

    // リストア
    if(commands.restore) {

        // ロック中のボリュームはリストアしない。
        if(mysql.volume_locked) libs.Error(`${mysql.cname} はロック済みボリュームのためリストアできません。`)

        // ラベル表示
        libs.Label('Restore MySQL')

        // 再起動対象のコンテナ
        let conts = [mysql.cname]
        if(mysql.query_log) conts.push('lampman') // クエリログを有効にしている場合、lampmanも一旦終了させないとボリュームが削除できないため

        // 対象のmysqlコンテナを強制終了
        try {
            child.spawnSync('docker-compose', [
                '--project-name', lampman.config.project,
                'rm', '-sf',
                ...conts
            ], {
                cwd: lampman.config_dir,
                stdio: 'inherit'
            })
        } catch(e) {
            libs.Error(e)
        }

        // 対象のボリュームを強制削除
        mysql.vname = `${lampman.config.project}-${mysql.cname}_data`
        process.stdout.write(`Removing volume ${mysql.vname} ... `)
        try {
            child.spawnSync('docker', ['volume', 'rm', mysql.vname, '-f'])
        } catch(e) {
            libs.Error(e)
        }
        console.log(color.green('done'))

        // 対象のmysqlコンテナのみ起動
        try {
            child.spawnSync('docker-compose', [
                '--project-name', lampman.config.project,
                'up', '-d',
                ...conts
            ], {
                cwd: lampman.config_dir,
                stdio: 'inherit'
            })
        } catch(e) {
            libs.Error(e)
        }
        console.log('');
        let procs = [];
        process.stdout.write(color.magenta.bold('  [Ready]'));

        // mysql Ready
        procs.push(libs.ContainerLogAppear(
            mysql.cname,
            'Entrypoint finish.',
            lampman,
        )
            .catch(err=>{libs.Error(err)})
            .then(()=>process.stdout.write(color.magenta(` ${mysql.cname}`)))
        )

        // lampman Ready
        if(mysql.query_log) {
            procs.push(
                libs.ContainerLogAppear(
                    'lampman',
                    'lampman started',
                    lampman,
            )
                .catch(err=>{libs.Error(err)})
                .then(()=>process.stdout.write(color.magenta(' lampman')))
            )
        }

        // Parallel processing
        await Promise.all(procs).catch(e=>libs.Error(e))
        console.log()

        return
    }

    // MySQLクライアントに入る
    await child.spawn(
        'docker-compose',
        [
            '--project-name', lampman.config.project,
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
