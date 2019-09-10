
'use strict'

import libs = require('../libs');
const child = require('child_process')
const path = require('path')

/**
 * down: LAMP終了
 */

export default function down(cmd: any, options: any, lampman: any) {
    let proc = child.spawn('docker-compose',
    ['down'],
    {
        cwd: lampman.config_dir,
        stdio: 'inherit'
    })
}
