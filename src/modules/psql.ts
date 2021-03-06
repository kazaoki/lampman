
'use strict'

/**
 * -------------------------------------------------------------------
 * [lamp psql]
 * PostgreSQL操作
 * -------------------------------------------------------------------
 */

import libs = require('../libs')
import docker = require('../docker');
const prompts = require('prompts')
const child   = require('child_process')
const fs      = require('fs');
const path    = require('path');
const color   = require('cli-color');

/**
 * コマンド登録用メタデータ
 */
export function meta(lampman:any)
{
    return {
        command: 'psql [service] [options]',
        describe: 'PostgreSQL操作（オプション未指定なら psql クライアントが実行されます）',
        options: {
            'dump': {
                alias: 'd',
                describe: 'ダンプします。',
                type: 'boolean',
            },
            'dump-path': {
                alias: 'p',
                describe: 'ダンプファイルのディレクトリパスを指定します。',
                type: 'string',
                nargs: 1,
            },
            'no-rotate': {
                alias: 'n',
                describe: 'ファイルローテーションしないでダンプします。',
                type: 'boolean',
            },
            'restore': {
                alias: 'r',
                describe: '最新のダンプファイルをリストアします。',
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

    // 対象のpostgresql情報の入れ物
    let postgresql: any = {}

    // まずはpostgresqlコンテナのリスト用意
    let list = []
    for(let key of Object.keys(lampman.config)) {
        if(key.match(/^postgresql/)) {
            list.push({
                title: key+(argv.restore && lampman.config[key].volume_locked ? ' - [locked]' : ''),
                description: (lampman.config[key].volume_locked ? '[locked]' : ''),
                value: {cname:key, ...lampman.config[key]} ,
                cname: key,
                disabled: argv.restore && lampman.config[key].volume_locked
            })
        }
    }

    // 引数にコンテナ名を指定している場合は、リストにあるかチェック
    if(argv.service && argv.service.length) {
        for(let item of list) {
            if(item.cname===argv.service) postgresql = item.value
        }
        if(!Object.keys(postgresql).length) {
            libs.Message('ご指定のコンテナ情報が設定ファイルに存在しません。\n'+argv.service, 'warning', 1)
            process.exit()
        }
    } else {
        // 引数未指定の場合
        if(list.length===0) {
            // 設定無し
            libs.Error('PostgreSQL設定がありません。')
            return
        } else if(list.length>1) {
            // 接頭辞
            let before_str = ''
            if(argv.dump) before_str = 'ダンプを生成する'
            else if(argv.restore) before_str = 'リストアする'
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
        child.execFileSync('docker-compose', ['--project-name', lampman.config.project, 'ps', '-qa', postgresql.cname], {cwd: lampman.config_dir})
    } catch(e) {
        libs.Error(e)
    }

    // ダンプ
    if(argv.dump) {

        // ラベル表示
        libs.Label('Dump PostgreSQL')

        // 圧縮モードか
        let is_gzip = !!postgresql.dump.filename.match(/\.gz$/)

        // ダンプディレクトリ
        let dumpdir = argv.dumpPath ? argv.dumpPath : path.join(lampman.config_dir, postgresql.cname)
        if(!path.isAbsolute(dumpdir)) {
            dumpdir = path.join(process.cwd(), dumpdir)
        }
        if(!fs.existsSync(dumpdir)) {
            fs.mkdirSync(dumpdir, {recursive: true})
        }

        // ダンプファイルの特定
        let dumpfile = path.join(
            dumpdir,
            (postgresql.dump.filename ? postgresql.dump.filename : 'dump.sql')
        )

        // ダンプファイルローテーション
        if((!argv.noRotate) && postgresql.dump.rotations>0) {
            process.stdout.write('Dumpfile rotate ... ')
            libs.RotateFile(dumpfile, postgresql.dump.rotations)
            console.log(color.green('done'))
        }

        // ダンプ開始
        process.stdout.write('Dump to '+dumpfile+' ... ')
        child.spawnSync(
            'docker-compose',
            [
                '--project-name', lampman.config.project,
                'exec',
                '-T',
                '-e', 'LANGUAGE=ja_JP.UTF-8',
                '-e', 'LC_ALL=ja_JP.UTF-8',
                '-e', 'LANG=ja_JP.UTF-8',
                '-e', 'LC_TYPE=ja_JP.UTF-8',
                postgresql.cname,
                'sh',
                '-c',
                `pg_dump ${postgresql.database} -U ${postgresql.user}`+(is_gzip ? ' | gzip' : '')
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
    if(argv.restore) {

        // ロック中のボリュームはリストアしない。
        if(postgresql.volume_locked) libs.Error(`${postgresql.cname} はロック済みボリュームのためリストアできません。`)

        // ラベル表示
        libs.Label('Restore PostgreSQL')

        // 再起動対象のコンテナ
        let conts = [postgresql.cname]
        // if(postgresql.query_log) conts.push('lampman') // クエリログを有効にしている場合、lampmanも一旦終了させないとボリュームが削除できないため

        // 対象のpostgresqlコンテナを強制終了
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
        postgresql.vname = `${lampman.config.project}-${postgresql.cname}_data`
        process.stdout.write(`Removing volume ${postgresql.vname} ... `)
        try {
            child.spawnSync('docker', ['volume', 'rm', postgresql.vname, '-f'])
        } catch(e) {
            libs.Error(e)
        }
        console.log(color.green('done'))

        // 対象のpostgresqlコンテナのみ起動
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

        // postgresql Ready
        procs.push(
            libs.ContainerIsLoaded(postgresql.cname, '/tmp/.container-loaded', lampman)
                .catch(err=>{libs.Error(err)})
                .then(()=>process.stdout.write(color.magenta(` ${postgresql.cname}`)))
        )

        // lampman Ready
        if(postgresql.query_log) {
            procs.push(
                libs.ContainerIsLoaded('lampman', '/tmp/.container-loaded', lampman)
                    .catch(err=>{libs.Error(err)})
                    .then(()=>process.stdout.write(color.magenta(' lampman')))
            )
        }

        // Parallel processing
        await Promise.all(procs).catch(e=>libs.Error(e))
        console.log()
        console.log()

        return
    }

    // psqlクライアントに入る
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
