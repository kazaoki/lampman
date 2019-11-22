
'use strict'

/**
 * -------------------------------------------------------------------
 * [lamp reject]
 * コンテナ・ボリュームを選択して削除
 * -------------------------------------------------------------------
 */

declare let lampman:any;

import libs   = require('../libs')
import docker = require('../docker')
import child  = require('child_process')
const color   = require('cli-color')
const prompts = require('prompts')

/**
 * コマンド登録用メタデータ
 */
export function meta()
{
    return {
        command: 'reject [options]',
        describe: 'コンテナ・ボリュームのリストから選択して削除（docker-compose管理外も対象）',
        options: {
            'locked': {
                alias: 'l',
                describe: 'ロック中のボリュームも選択できるようにします。',
                type: 'boolean',
            },
            'force': {
                alias: 'f',
                describe: 'リストから選択可能なものすべて強制的に削除する（※-faとすればロックボリュームも対象）',
                type: 'boolean',
            },
        },
    }
}

/**
 * コマンド実行
 */
export async function action(argv:any, lampman:any)
{
    // Docker起動必須
    docker.needDockerLive()

    // コンテナ一覧取得
    let containers = child.execFileSync('docker', ['ps', '-a', '--format={{.Names}}']).toString().split(/\r?\n/)

    // ボリューム一覧取得
    let volumes = child.execFileSync('docker', ['volume', 'ls', '-q']).toString().split(/\r?\n/)

    // 選択肢用意
    let list = []
    for(let name of containers) {
        if(name.length) {
            list.push({
                title: `[CONTAINER] ${name}`,
                value: {
                    type: 'container',
                    name: name
                },
                // description: 'xxx',
            })
        }
    }
    for(let name of volumes) {
        if(name.length) {
            list.push({
                title: `[VOLUME] ${name}`,
                value: {
                    type: 'volume',
                    name: name
                },
                disabled: !argv.locked && name.match(/^locked_/),
                // description: 'xxx',
            })
        }
    }

    // -lfのときのみ、確認だす
    if(argv.locked && argv.force) {
        const response = await prompts([
            {
                type: 'toggle',
                name: 'value',
                message: 'ロックボリュームも含めて全てのコンテナ・ボリュームを強制削除しますが本当によろしいですか？',
                initial: false,
                active: 'yes',
                inactive: 'no'
            }
        ]);
        if(!response.value) return
    }

    // 選択さす
    let targets = []
    if(argv.force) {
        for(let name of containers) {
            if(name.length) {
                targets.push({
                    type: 'container',
                    name: name
                })
            }
        }
        for(let name of volumes) {
            if(name.length) {
                if(!argv.locked && name.match(/^locked_/)) continue;
                targets.push({
                    type: 'volume',
                    name: name
                })
            }
        }
    } else {
        const response = await prompts([
            {
                type: 'multiselect',
                name: 'targets',
                message: '削除するコンテナ・ボリュームを選択してください。（スペースキーで複数選択可）',
                choices: list,
                instructions: false
            }
        ]);
        targets = response.targets
    }

    // 削除実行
    if(targets && targets.length) {
        let procs: any[] = []

        // コンテナ削除
        for(let item of targets.filter((item: any)=>'container'===item.type)) {
            let cid = item.name
            if(!cid) continue;
            procs.push(
                new Promise((resolve, reject)=>{
                    child.execFile('docker',['rm', '-f', cid])
                        .stderr.on('data', (data: string)=>{
                            console.log(`Removing ${cid} ... ${color.red('ng')}`)
                            reject(data)
                        })
                        .on('close', (code: any)=>{
                            console.log(`Removing ${cid} ... ${color.green('done')}`)
                            resolve()
                        })
                    ;
                })
            )
        }

        // ここまでで処理すべきものがあれば実行
        if(procs.length) await Promise.all(procs).catch(err=>{libs.Error(err)})
        procs = []

        // ボリューム削除
        for(let item of targets.filter((item: any)=>'volume'===item.type)) {
            let vid = item.name
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
        if(procs.length) await Promise.all(procs).catch(err=>{libs.Error(err)})

        return
    }
}
