
'use strict'

import libs = require('../libs');
import docker = require('../docker');

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
    if(lampman.config.lampman.apache.mounts) {
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
    let args = ['up', '-d']

    // // -r が指定されてれば --remove-orphans セット
    // if(commands.removeOrphans) {
    //     args.push('--remove-orphans')
    // }

    // -f が指定されてれば既存のコンテナと未ロックボリュームを全て削除
    if(commands.flash) {
        libs.Label('Flashing')
        await docker.clean()
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
    proc.on('close', (code: number) => {
        if(code) {
            libs.Error(`Up process exited with code ${code}`)
            process.exit()
        }
        console.log('');
        process.stdout.write(color.magenta.bold('  [Ready]'));

        let procs = []

        // lampman Ready
        procs.push(new Promise(resolve=>{
            let timer = setInterval(function () {
                if(libs.ContainerLogCheck('lampman', 'lampman started', lampman.config_dir)) {
                    process.stdout.write(color.magenta(' lampman'));
                    clearInterval(timer);
                    resolve()
                }
            }, 300);
        }))

        // mysql Ready
        for(let key of Object.keys(lampman.config)) {
            if(!key.match(/^mysql/)) continue
            procs.push(new Promise(resolve=>{
                let timer = setInterval(function () {
                    if(libs.ContainerLogCheck(key, 'Entrypoint finish.', lampman.config_dir)) {
                            process.stdout.write(color.magenta(` ${key}`));
                        clearInterval(timer);
                        resolve()
                    }
                }, 300);
            }))
        }

        // postgresql Ready
        for(let key of Object.keys(lampman.config)) {
            if(!key.match(/^postgresql/)) continue
            procs.push(new Promise(resolve=>{
                let timer = setInterval(function () {
                    if(libs.ContainerLogCheck(key, 'Entrypoint finish.', lampman.config_dir)) {
                        process.stdout.write(color.magenta(` ${key}`));
                        clearInterval(timer);
                        resolve()
                    }
                }, 300);
            }))
        }

        Promise.all(procs)
            .catch(err=>{libs.Error(err)})
            .then(()=>{
                console.log()
            })
    })
}
