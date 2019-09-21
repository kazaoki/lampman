
'use strict'

import child = require('child_process')
import jsYaml = require('js-yaml');
import path = require('path');
const toYaml = (inData: object)=>jsYaml.dump(inData, {lineWidth: -1})

/**
 * yamlout: 設定データをymlとして標準出力（プロジェクトルートから相対）
 */
export default function yamlout(commands: any, lampman: any)
{
    // docker-compose が認識しているYAML情報を取得する
    let yaml = jsYaml.load(
        child.execFileSync('docker-compose', ['config'], {cwd: lampman.config_dir}).toString()
    )

    // out timestamp
    let date = new Date()
    console.log(`# Built at ${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`)
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
    console.log(toYaml({services: yaml.services}))

    // networks
    console.log(toYaml({networks: yaml.networks}))

    // volumes
    console.log(toYaml({volumes: yaml.volumes}))
}
