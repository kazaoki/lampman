
'use strict'

import child = require('child_process')

/**
 * stdout: docker-compose logs -f -p XXX と同等
 */
export default function stdout(commands: any, lampman: any)
{
    child.execFileSync(
        'docker-compose',
        [
            '-p', lampman.config.project,
            'logs',
            '-f',
        ],
        {
            stdio: 'inherit',
            cwd: lampman.config_dir
        }
    )
}
