
'use strict'

import libs = require('../libs');
import docker = require('../docker');
import reject    from './reject';

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
        Promise.all(procs)
            .catch(e=>libs.Error(e))
            .then(()=>{

                // start url
                let start_url = `${lampman.config.open_on_upped.schema}://${docker.getDockerLocalhost()}${lampman.config.open_on_upped.path}`

                // open browser on upped
                if('open_on_upped' in lampman.config) {
                    let opencmd = ''
                    if(libs.isWindows()) opencmd = 'start'
                    else if(libs.isMac()) opencmd = 'open'
                    if(opencmd) child.execSync(`${opencmd} ${start_url}`)
                }

                // show upped message
                if('message_on_upped' in lampman.config && lampman.config.message_on_upped.message) {
                    console.log('\n')
                    libs.Message(
                        lampman.config.message_on_upped.message,
                        lampman.config.message_on_upped.style
                    )
                }

                console.log()
            })
        return
    })
}
