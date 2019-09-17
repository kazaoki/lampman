
'use strict'

import libs = require('./libs');
import { resolve } from 'path';
const child = require('child_process')
const color = require('cli-color');


/**
 * clear
 */
export async function clean()
{
    let procs: any[] = []

    // 全コンテナと関連ボリューム削除
    for(let cid of child.execFileSync('docker', ['ps', '-qa', '--format', '{{.Names}}']).toString().trim().split(/\n/)) {
        if(!cid) continue;
        procs.push(
            new Promise((resolve, reject)=>{
                child.execFile('docker',['rm', '-fv', cid])
                    .stderr.on('data', (data: string)=>{
                        console.log(`Deleting ${cid} ... ${color.red('ng')}`)
                        reject(data)
                    })
                    .on('close', (code: any)=>{
                        console.log(`Deleting ${cid} ... ${color.green('done')}`)
                        resolve()
                    })
                ;
            })
        )
    }

    // ここまでで処理すべきものがあれば実行
    if(procs.length) {
        await Promise.all(procs)
            .catch(err=>{libs.Error(err)})
    }
    procs = []

    // 未ロックで宙ぶらりんなボリューム削除
    for(let vid of child.execFileSync('docker', ['volume', 'ls', '-q', '--filter', 'dangling=true']).toString().trim().split(/\n/)) {
        if(!vid || vid.match(/^locked_/)) continue;
        procs.push(
            new Promise((resolve, reject)=>{
                child.execFile('docker',['volume', 'rm', '-f', vid])
                    .stderr.on('data', (data: string)=>{
                        console.log(`Removing volume ${vid} ... ${color.red('ng')}`)
                        reject(data)
                    })
                    .on('close', (code: any)=>{
                        console.log(`Removing volume ${vid} ... ${color.green('done')}`)
                        resolve()
                    })
                ;
            })
        )
    }

    // 処理すべきものがあれば実行
    if(procs.length) {
        await Promise.all(procs)
            .catch(err=>{libs.Error(err)})
    }

    return procs.length
}
