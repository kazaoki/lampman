
'use strict'

import libs = require('../libs');
const child = require('child_process')
const getPort = require('get-port');

/**
 * web: 現在のパスでビルトインPHPウェブサーバを一時的に起動
 */
export default async function web(commands: any, lampman: any)
{
    // ポート特定
    let port = commands.port
    if(!port) port = await getPort()

    // ビルトインPHPウェブサーバ起動
    child.spawn('php', ['-S', `localhost:${port}`], {stdio: 'inherit'})

    // ブラウザ起動
    let opencmd = libs.isWindows()
    ? 'start'
    : libs.isMac()
        ? 'open'
        :''
    if(opencmd) child.execSync(`${opencmd} http://localhost:${port}`)
}
