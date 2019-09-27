
'use strict'

import libs   = require('../libs');
import child  = require('child_process')
const prompts = require('prompts')
import reject from './reject';
import rmi from './rmi';

/**
 * sweep: 全てのコンテナ、未ロックボリューム、<none>イメージ、不要ネットワークの一掃
 */
export default async function sweep(commands: any, lampman: any)
{
    // Yes/No確認
    if(!commands.force) {
        const response = await prompts([
            {
                type: 'toggle',
                name: 'value',
                message: '起動しているかどうかに関わらず、全てのコンテナ、未ロックボリューム、<none>イメージ、不要ネットワークを一掃しますが本当によろしいですか？\n（※docker-compose外のコンテナも対象です）',
                initial: false,
                active: 'yes',
                inactive: 'no'
            }
        ]);
        if(!response.value) return
    }

    let procs = [];

    // 全てのコンテナとボリューム削除
    procs.push(reject({force: true}, lampman))

    // <none>イメージ削除
    procs.push(rmi({prune: true}, lampman))

    // 不要ネットワークの削除
    procs.push(
        // child.spawn('docker', ['network', 'prune', '-f'], {stdio: 'inherit'})
        new Promise((resolve, reject)=>{
            child.execFile('docker', ['network', 'prune', '-f'])
                .stderr.on('data', (data: string)=>{
                    // console.log(`Removing network ${data} ... ${color.red('ng')}`)
                    reject(data)
                })
                .on('close', (code: any)=>{
                    // console.log(`Removing network ${data} ... ${color.green('done')}`)
                    resolve()
                })
            ;
        })
    )

    // Parallel processing
    Promise.all(procs)
        .catch(e=>libs.Error(e))
        .then(()=>{
            console.log()
        })
    return
}
