
'use strict'

import libs = require('../libs');
import docker = require('../docker');
const child = require('child_process')
const path  = require('path')
const color = require('cli-color');

/**
 * up: LAMP起動
 */

export default async function up(commands: any, lampman: any)
{
    // 引数用意
    let args = ['up', '-d']

    // -r が指定されてれば --remove-orphans セット
    if(commands.removeOrphans) {
        args.push('--remove-orphans')
    }

    // -o が指定されてれば追加引数セット
    // ただし、ハイフン前になにもないとエラーになるので以下のように指定すること（commanderのバグ？
    // ex. $lamp up -o "\-t 500"
    //    バックスラッシュ↑
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
