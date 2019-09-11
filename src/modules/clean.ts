
'use strict'

import libs = require('../libs');
import docker = require('../docker');
const child = require('child_process')

/**
 * clean: 起動中の全てのコンテナや未ロックなボリューム及び不要なイメージを強制削除する
 */

export default async function clean(commands: any, lampman: any)
{
    libs.Label('Cleaning')
    await docker.clean()
    child.execFileSync('docker', ['image', 'prune', '-f'], {stdio: 'inherit'})
}
