
'use strict'

/**
 * -------------------------------------------------------------------
 * [lamp down]
 * upで起動したコンテナ達を終了する（ボリュームは残る。
 * -------------------------------------------------------------------
 */

const child = require('child_process')
import docker = require('../docker');
import libs   = require('../libs');
const color    = require('cli-color')

/**
 * コマンド登録用メタデータ
 */
export function meta(lampman:any)
{
    return {
        command: 'down',
        describe: 'LAMP高速終了（名無しボリュームは消える）',
    }
}

/**
 * コマンド実行
 */
export function action(argv:any, lampman:any)
{
    // Docker起動必須
    docker.needDockerLive()

    // 設定ファイルから実際のサービス名を全て生成する
    let service_names = []
    let result_services = child.execFileSync('docker-compose', ['--project-name', lampman.config.project, 'config', '--services'], {cwd: lampman.config_dir}).toString().trim()
    for(let service of result_services.split(/\s+/)) {
        service_names.push(lampman.config.project+'-'+service)
    }
    if(service_names) {
        libs.Label('Down containers')
        for(let service_name of service_names) {
            const id = child.execFileSync('docker', ['ps', '-qa', '--filter', `name=${service_name}`]).toString().trim()
            if(id) {
                process.stdout.write(service_name+' ... ')
                const result = child.execFileSync('docker', ['rm', '-fv', service_name]).toString().trim()
                console.log(color.green('done'))
            }
        }
    }
    console.log()

    return
}
