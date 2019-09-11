
'use strict'

import libs = require('../libs');
const child = require('child_process')
const path  = require('path')
const color = require('cli-color');

/**
 * up: LAMP起動
 */

export default function up(cmd: any, options: any, lampman: any) {
    let proc = child.spawn('docker-compose',
    ['up', '-d'],
    {
        cwd: lampman.config_dir,
        stdio: 'inherit'
    })
    proc.on('close', (code: number) => {
        if(code) {
            libs.Message(`Up process exited with code ${code}`, 'danger', 1)
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
