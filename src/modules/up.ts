
'use strict'

/**
 * -------------------------------------------------------------------
 * [lamp up]
 * config.jsを基にymlを生成、docker-composeとしてupする。
 * -------------------------------------------------------------------
 */

import libs = require('../libs')
import docker = require('../docker')
import jsYaml = require('js-yaml');
import { action as sweep } from './sweep'

const child = require('child_process')
const path  = require('path')
const color = require('cli-color')
const fs    = require('fs')
const find  = require('find')
const open  = require('open')
const prompts = require('prompts')

/**
 * コマンド登録用メタデータ
 */
export function meta(lampman:any)
{
    return {
        command: 'up [options]',
        describe: `LAMP起動（.lampman${libs.ModeString(lampman.mode)}/docker-compose.yml 自動更新）`,
        options: {
            'kill-conflicted': {
                alias: 'c',
                describe: '該当ポートが使用中の既存コンテナを強制的に終了させてから起動する',
                type: 'boolean',
            },
            'sweep-force': {
                alias: 'f',
                describe: '`sweep -f` を実行して全て一層してから起動する',
                type: 'boolean',
            },
            'docker-compose-options': {
                alias: 'o',
                describe: 'docker-composeコマンドに渡すオプションを文字列で指定可能',
                type: 'string',
                nargs: 1,
            },
            'D': {
                describe: 'デーモンじゃなくフォアグラウンドで起動する',
                type: 'boolean',
            },
            'no-update': {
                alias: 'n',
                describe: 'docker-compose.yml を更新せずに起動する',
                type: 'boolean',
            },
            'thru-upped': {
                alias: 't',
                describe: 'config.jsで設定した起動時コマンド"on_upped"を実行しない',
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
                let stats = fs.statSync(pubdir);
                if(!stats.isDirectory()) {
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
    if(!argv.noUpdate) libs.UpdateCompose(lampman)

    // 引数用意
    let args = [
        '--project-name', lampman.config.project,
        'up',
        '--force-recreate',
    ]

    // -D が指定されてればフォアグラウンドーモードに。
    if(!argv.D) {
        args.push('-d')
    }

    // -o が指定されてれば追加引数セット
    // ただし、ハイフン前になにもないとエラーになるので以下のように指定すること（Windowsのみの現象？
    // ex. $lamp up -o "\-t 300"
    //    バックスラッシュ↑ 必要...
    if(argv.dockerComposeOptions) {
        args.push(...argv.dockerComposeOptions.replace('\\', '').split(' '))
    }

    // -c と -f の処理はコンフリクト状況と選択肢にカラムので変数(do_～)で処理わけ
    let do_kill_conflicted = false
    let do_sweep_force = false
    let conflicts
    if(argv.sweepForce) {
        // -f が指定されてれば既存のコンテナと未ロックボリュームを全て削除してから起動
        do_sweep_force = true
    } else {
        conflicts = get_confilict(lampman)
        // ぶつかるポートがある
        if(Object.keys(conflicts).length) {
            if(argv.killConflicted) {
                // -c 指定があれば該当コンテナ終了処理
                do_kill_conflicted = true
            } else {

                // 文章生成
                let message = '以下のコンテナが公開ポートを使用中のため起動できない恐れがあります。\n'
                for(let id of Object.keys(conflicts)) {
                    const potrs_str = conflicts[id].ports.join(', ')
                    message += `- ${conflicts[id].label} [${potrs_str}]\n`
                }

                // ぶつかっているポート情報を表示
                libs.Message(message, 'warning', 1)
                console.log()

                // 選択してもらう
                let response = await prompts({
                    type: 'select',
                    name: 'action',
                    message: 'どうしますか。',
                    choices: [
                        { title: '該当コンテナのみ強制終了してから起動', value: 'kill', selected: true },
                        { title: '全てのコンテナ/未ロックボリューム/ネットワークを強制削除してから起動（sweep -f 同様）', value: 'sweep', selected: false },
                        { title: 'このまま起動してみる',  value: 'nothing', selected: false },
                    ],
                    instructions: false,
                    hint: 'Ctrl+Cで終了',
                })

                // 処理分岐
                if('kill'===response.action) {
                    // 該当コンテナのみ強制終了してから起動 = `lampman up -c` と同じなので呼び出し
                    do_kill_conflicted = true
                } else if('sweep'===response.action) {
                    // 全て削除 = `lampman sweep -f` と同じなので呼び出し
                    do_sweep_force = true
                } else if('nothing'===response.action) {
                    // そのまま起動
                } else {
                    // キャンセル
                    return
                }
            }
        }
    }

    // ぶつかってるポートのコンテナを終了する
    if(do_kill_conflicted) {
        libs.Label('Kill conflicted containers')
        let result = child.execFileSync('docker', ['kill', ...Object.keys(conflicts)]).toString().trim()
        let message = ''
        for(let id of result.split(/\s+/)){
            message += `${conflicts[id].label} (${id}) [${conflicts[id].ports.join(', ')}]\n`
        }
        console.log(message)
    }

    // sweep -f する
    if(do_sweep_force) {
        libs.Label('Sweep force')
        await sweep({force:true}, lampman)
        console.log()
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
        if('on_upped' in lampman.config && lampman.config.on_upped.length && !argv.thruUpped) {
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
                    await open(url.href)
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

/**
 * ポートがコンフリクトしたコンテナを返す
 */
function get_confilict(lampman:any)
{
    // ymlファイルから公開ポートを得る
    let result_yaml_comp = child.execFileSync('docker-compose', ['--project-name', lampman.config.project, 'config'], {cwd: lampman.config_dir}).toString().trim()
    const config = jsYaml.load(result_yaml_comp)
    const yaml_ports: number[] = []
    if(config.services) {
        for(let service_name of Object.keys(config.services)) {
            if(config.services[service_name].ports) {
                for(let lump of config.services[service_name].ports) {
                    let matches = lump.match(/(\d+)\:/)
                    if(matches && matches[1]) yaml_ports.push(matches[1])
                }
            }
        }
    }

    // 設定ファイルから実際のサービス名を全て生成する
    let service_names = []
    let result_services = child.execFileSync('docker-compose', ['--project-name', lampman.config.project, 'config', '--services'], {cwd: lampman.config_dir}).toString().trim()
    for(let service of result_services.split(/\s+/)) {
        service_names.push(lampman.config.project+'-'+service)
    }

    // dockerコマンドで状況を取得し、プロジェクト以外のコンテナで使用中のポートを取得する
    let conflicts: any = {}
    let used_ports: any = {}
    let result_containers = child.execFileSync('docker', ['ps', '-a', '--format', '{{.ID}} {{.Names}} {{.Ports}}']).toString().trim()
    for(let line of result_containers.split(/[\r\n]+/)) {
        let column = line.split(/\s+/)
        if(service_names.includes(column[1])) continue
        if(2>=column.length) continue
        if(null===column[2] || !column[2].length) continue
        const id = column.shift()
        const label = column.shift()
        for(let port of column) {
            let matches = port.match(/\:(\d+)\-\>/)
            if(matches && matches[1]) {
                const port = matches[1]
                if(yaml_ports.includes(port)) {
                    if(!conflicts[id]) conflicts[id] = {
                        "id": id,
                        "label": label,
                        "ports": [],
                    }
                    conflicts[id].ports.push(port)
                }
            }
        }
    }

    return conflicts
}
