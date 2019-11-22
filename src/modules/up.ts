
'use strict'

/**
 * -------------------------------------------------------------------
 * [lamp up]
 * config.jsを基にymlを生成、docker-composeとしてupする。
 * -------------------------------------------------------------------
 */

declare let lampman:any;

import libs = require('../libs');
import docker = require('../docker');
import { action as reject } from './reject';
// import { action as extra } from './extra';

const child = require('child_process')
const path  = require('path')
const color = require('cli-color');
const fs    = require('fs');
const find  = require('find');

/**
 * コマンド登録用メタデータ
 */
export function meta()
{
    return {
        command: 'up',
        description: `LAMP起動（.lampman${libs.ModeString(lampman.mode)}/docker-compose.yml 自動更新）`,
        options: [
            ['-f, --flush', '既存のコンテナと未ロックボリュームを全て削除してキレイにしてから起動する'],
            ['-o, --docker-compose-options <args_string>', 'docker-composeコマンドに渡すオプションを文字列で指定可能'],
            ['-D', 'デーモンじゃなくフォアグラウンドで起動する'],
            ['-n --no-update', 'docker-compose.yml を更新せずに起動する'],
            ['-t --thru-upped', 'config.jsで設定した起動時コマンド"on_upped"を実行しない'],
        ]
    }
}

/**
 * コマンド実行
 */
export async function action(commands:any)
{
    // Docker起動必須
    docker.needDockerLive()

    // 設定ファイルがあるか
    if(!libs.existConfig(lampman)) {
        libs.Error(`設定ファイルが見当たりません。先にセットアップを実行してください。\nlamp init`+('default'===lampman.mode ? '' : ' --mode '+lampman.mode))
    }

    // 公開Webディレクトリが指定されているかチェック
    if('apache' in lampman.config.lampman && 'mounts' in lampman.config.lampman.apache) {
        for(let mount of lampman.config.lampman.apache.mounts) {
            let dirs = mount.split(/\:/)
            if(path.resolve('/var/www/html') === path.resolve(dirs[1])) {
                let pubdir = path.join(lampman.config_dir, dirs[0])
                if(!fs.existsSync(pubdir)) {
                    libs.Message('最初に公開ディレクトリを作成してください ↓\n'+pubdir, 'warning', 1)
                    process.exit();
                }
            }
        }
    }

    // 各shファイルのパーミッションに実行権を付与
    let files = find.fileSync(/\.sh$/, lampman.config_dir)
    if(files.length) {
        for(let file of files) {
            fs.chmodSync(file, 0o705)
        }
    }

    // 最新の docker-compose.yml を生成
    if(commands.update) libs.UpdateCompose(lampman)

    // 引数用意
    let args = [
        '--project-name', lampman.config.project,
        'up',
    ]

    // -D が指定されてればフォアグラウンドーモードに。
    if(!commands.D) {
        args.push('-d')
    }

    // -f が指定されてれば既存のコンテナと未ロックボリュームを全て削除
    if(commands.flush) {
        libs.Label('Flush cleaning')
        await reject({force:true})
        console.log()
    }

    // -o が指定されてれば追加引数セット
    // ただし、ハイフン前になにもないとエラーになるので以下のように指定すること（commanderのバグ？
    // ex. $lamp up -o "\-t 300"
    //    バックスラッシュ↑ 必要...
    if(commands.dockerComposeOptions) {
        args.push(...commands.dockerComposeOptions.replace('\\', '').split(' '))
    }

    // up実行
    libs.Label('Upping docker-compose')
    let proc = child.spawn('docker-compose',
        args,
        {
            cwd: lampman.config_dir,
            stdio: 'inherit'
        }
    )
    proc.on('close', async (code: number) => {
        if(code) {
            libs.Error(`Up process exited with code ${code}`)
            process.exit()
        }

        let procs = []

        // lampmanのみポート関係の情報を環境変数にセット
        let lampman_id = child.execFileSync('docker-compose', ['--project-name', lampman.config.project, 'ps', '-q', 'lampman'], {cwd: lampman.config_dir}).toString().trim()
        let sp = child.execFile('docker', ['port', lampman_id])
        sp.stdout.on('data', (data: any)=>{
            for(let line of data.toString().trim().split(/\n/)) {
                let matches = line.match(/^(\d+).+?(\d+)$/)
                process.env[`LAMPMAN_EXPORT_LAMPMAN_${matches[1]}`] = matches[2]
            }
        })
        procs.push(sp)

        // Ready before
        console.log('');
        process.stdout.write(color.magenta.bold('  [Ready]'));

        // lampman Ready
        procs.push(
            libs.ContainerLogAppear(
                'lampman',
                'lampman started',
                lampman,
            ).then(()=>process.stdout.write(color.magenta(' lampman')))
        )

        // mysql|postgresql Ready
        for(let key of Object.keys(lampman.config)) {
            if(!key.match(/^(mysql|postgresql)/)) continue
            procs.push(
                libs.ContainerLogAppear(
                    key,
                    'Entrypoint finish.',
                    lampman,
                ).then(()=>process.stdout.write(color.magenta(` ${key}`)))
            )
        }

        // Parallel processing
        await Promise.all(procs).catch(e=>libs.Error(e))

        // lampmanコンテナ死んでないか
        if(!docker.isRunning('lampman', lampman)) {
            console.log()
            libs.Error('lampman container dead!!')
        }

        // mysql/postgresqlコンテナ死んでないか
        for(let key of Object.keys(lampman.config)) {
            if(!key.match(/^(mysql|postgresql)/)) continue
            if(!docker.isRunning(key, lampman)) {
                console.log()
                libs.Error(`${key} container dead!!`)
            }
        }

        // Show links
        let docker_host = docker.getDockerLocalhost()
        console.log()
        let http_port = process.env.LAMPMAN_EXPORT_LAMPMAN_80
        if(http_port) console.log(color.magenta.bold('  [Http] ')+color.magenta(`http://${docker_host}${'80'===http_port?'':':'+http_port}`))
        let https_port = process.env.LAMPMAN_EXPORT_LAMPMAN_443
        if(https_port) console.log(
            color.magenta.bold('  [Https] ')+
            color.magenta(`https://${docker_host}${'443'===https_port?'':':'+https_port}`)
        )
        if(process.env.LAMPMAN_EXPORT_LAMPMAN_1080) console.log(
            color.magenta.bold('  [Maildev] ')+
            color.magenta(`http://${docker_host}:${process.env.LAMPMAN_EXPORT_LAMPMAN_1080}`)
        )

        // Actions on upped
        if('on_upped' in lampman.config && lampman.config.on_upped.length && !commands.thruUpped) {
            let count = 0;
            for(let action of lampman.config.on_upped) {

                // ブラウザで開く
                if('open_browser'===action.type) {
                    let url = action.url
                        ? new URL(action.url)
                        : new URL('http://' + docker_host)
                    if(action.schema) {
                        url.protocol = action.schema
                        url.port = docker.exchangePortFromSchema(action.schema, action.container, lampman)
                    }
                    if(action.path) url.pathname = action.path
                    if(action.port) url.port = docker.exchangePort(action.port, action.container, lampman)
                    let opencmd = libs.isWindows()
                        ? 'start'
                        : libs.isMac()
                            ? 'open'
                            :''
                    if(opencmd) child.execSync(`${opencmd} ${url.href}`)
                }

                // メッセージを表示する
                if('show_message'===action.type && action.message.length) {
                    libs.Message(action.message, action.style)
                    count ++
                }

                // コマンドを実行する
                if('run_command'===action.type) {
                    let extraopt = action
                    if('object'===typeof extraopt.command) extraopt.command = extraopt.command[libs.isWindows() ? 'win' : 'unix']
                    console.log()
                    libs.extra_action(extraopt, extraopt.args, lampman)
                    count ++
                }

                // extraコマンドを実行する
                if('run_extra_command'===action.type && action.name in lampman.config.extra) {
                    console.log()
                    libs.extra_action(lampman.config.extra[action.name], action.args, lampman)
                    count ++
                }
            }
            if(count) console.log()
        }

        return
    })
}
