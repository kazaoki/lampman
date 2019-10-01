
'use strict'

import libs = require('../libs');
const child = require('child_process')
const path = require('path')

/**
 * down: LAMP終了
 */
export default function down(commands: any, lampman: any)
{
    let proc = child.spawn('docker-compose',
        [
            '--project-name', lampman.config.lampman.project,
            'down'
        ],
        {
            cwd: lampman.config_dir,
            stdio: 'inherit'
        })
}
