
'use strict'

import libs = require('../libs');
import docker = require('../docker');
import reject    from './reject';
import extra     from './extra';

const child = require('child_process')
const path  = require('path')
const color = require('cli-color');
const fs    = require('fs');

/**
 * up: LAMP起動
 */

export default async function up(commands: any, lampman: any)
{
    // 公開Webディレクトリが指定されているかチェック
    if('apache' in lampman.config.lampman && 'mounts' in lampman.config.lampman.apache) {
        for(let mount of lampman.config.lampman.apache.mounts) {
            let dirs = mount.split(/\:/)
            if(path.resolve('/var/www/html') === path.resolve(dirs[1])) {
                let pubdir = path.join(lampman.config_dir, dirs[0])
                if(!fs.existsSync(pubdir)) {
                    libs.Message('最初に公開ディレクトリを作成してください ↓\n'+pubdir, 'primary', 1)
                    process.exit();
                }
            }
        }
    }

    // 引数用意
    let args = ['up', '-d', '--force-recreate']

    // -f が指定されてれば既存のコンテナと未ロックボリュームを全て削除
    if(commands.flush) {
        libs.Label('Flush cleaning')
        await reject({force:true}, lampman)
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
        console.log('');
        process.stdout.write(color.magenta.bold('  [Ready]'));
        let procs = []

        // lampman Ready
        procs.push(
            libs.ContainerLogAppear(
                'lampman',
                'lampman started',
                lampman.config_dir,
            ).then(()=>process.stdout.write(color.magenta(' lampman')))
        )

        // mysql|postgresql Ready
        for(let key of Object.keys(lampman.config)) {
            if(!key.match(/^(mysql|postgresql)/)) continue
            procs.push(
                libs.ContainerLogAppear(
                    key,
                    'Entrypoint finish.',
                    lampman.config_dir,
                ).then(()=>process.stdout.write(color.magenta(` ${key}`)))
            )
        }

        // Parallel processing
        await Promise.all(procs).catch(e=>libs.Error(e))

        // Actions on upped
        console.log()
        if('on_upped' in lampman.config && lampman.config.on_upped.length) {
            let count = 0;
            for(let action of lampman.config.on_upped) {

                // ブラウザで開く
                if('open_browser'===action.type) {
                    let url = action.url
                        ? new URL(action.url)
                        : new URL('http://' + docker.getDockerLocalhost())
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
                    extra(extraopt, extraopt.args, lampman)
                    count ++
                }

                // extraコマンドを実行する
                if('run_extra_command'===action.type && action.name in lampman.config.extra) {
                    extra(lampman.config.extra[action.name], action.args, lampman)
                    count ++
                }
            }
            if(count) console.log()
        }

        return
    })
}
