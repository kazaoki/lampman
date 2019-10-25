
'use strict'

/**
 * -------------------------------------------------------------------
 * [lamp yaml]
 * YAMLビルド、出力のためのモジュール
 * -------------------------------------------------------------------
 */

declare let lampman:any;

import libs   = require('../libs');
import jsYaml = require('js-yaml');
import child  = require('child_process')
import path   = require('path');
const toYaml  = (inData:object)=>jsYaml.dump(inData, {lineWidth: -1})

/**
 * コマンド登録用メタデータ
 */
export function meta()
{
    return {
        command: 'yaml',
        description: 'YAMLの更新のみ、出力のみする',
        options: [
            ['-b, --build', path.basename(lampman.config_dir)+'/docker-compose.yml を作成/更新する'],
            ['-o, --out', '標準出力にマージ後のYAMLデータを出力する'],
        ]
    }
}

/**
 * コマンド実行
 */
export function action(commands:any)
{
    // --build: docker-compose.yml を作成/更新する
    if(commands.build) {
        libs.UpdateCompose(lampman)
        libs.Message('Built it!', 'success')
    }

    // --out: 標準出力にYAMLデータを出力する
    if(commands.out) {

        // docker-compose が認識しているYAML情報を取得する
        let yaml = jsYaml.load(
            child.execFileSync('docker-compose', ['--project-name', lampman.config.project, 'config'], {cwd: lampman.config_dir}).toString()
        )

        // out timestamp
        let date = new Date()
        console.log(`# Built by Lampman ver ${libs.getLampmanVersion()} @ ${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`)
        console.log()

        // version
        console.log(toYaml({version: yaml.version}))

        // services
        for(let key in yaml.services) {
            if('volumes' in yaml.services[key]) {
                let new_volumes: string[] = []
                for(let volume of yaml.services[key].volumes) {
                    let lump = volume.split(':')
                    // Windowsのドライブレターでsplitされてたらここで連結
                    if(4===lump.length) {
                        lump[0] = `${lump[0]}:${lump[1]}`
                        lump[1] = lump[2]
                        lump[2] = lump[3]
                        lump.pop()
                    }
                    // ローカルパスにフルパスが指定されている場合、相対パスに変更
                    if(path.isAbsolute(lump[0])) {
                        // 相対パスに変換
                        lump[0] = path.relative(process.cwd(), lump[0]).replace(/\\/g, '/')+'/'
                        if(!lump[0].match(/^\./)) lump[0] = './'+lump[0]
                        new_volumes.push(lump.join(':'))
                    } else {
                        new_volumes.push(volume)
                    }
                }
                yaml.services[key].volumes = new_volumes
            }
        }
        if(yaml.services) console.log(toYaml({services: yaml.services}))

        // networks
        if(yaml.networks) console.log(toYaml({networks: yaml.networks}))

        // volumes
        if(yaml.volumes) console.log(toYaml({volumes: yaml.volumes}))
    }

    // 引数がどちらも実行されなかったら実行無効。（ヘルプ表示に移行
    if(!(commands.build||commands.out)) return false
}
