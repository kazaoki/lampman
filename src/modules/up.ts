
'use strict'

import libs = require('../libs');
const child = require('child_process')
const path = require('path')

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
}
