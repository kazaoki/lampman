
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
        libs.Label('Cleaning')
        await docker.clean()
        console.log()
    }

    // -o が指定されてれば追加引数セット
    // ただし、ハイフン前になにもないとエラーになるので以下のように指定すること（commanderのバグ？
    // ex. $lamp up -o "\-t 500"
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
        process.stdout.write('Lampman starting ');
        let timer = setInterval(function () {
            if(is_lampman_started(lampman)) {
                process.stdout.write('... '+color.green('Ready!'));
                clearInterval(timer);
                console.log('');
            } else {
                process.stdout.write('.');
            }
        }, 1000);
    })
}

function is_lampman_started(lampman: any)
{
    return !!child.execFileSync(
        'docker-compose',
        ['logs', 'lampman'],
        {cwd: lampman.config_dir}
    ).toString().match(/lampman started\./)
}
