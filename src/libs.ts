
'use strict'

const strwidth = require('string-width');
const color    = require('cli-color');
const wrap     = require('jp-wrap')(color.windowSize.width-8);
const util     = require('util');
const child    = require('child_process')
const path     = require('path')
const fs       = require('fs')

/**
 * d
 * @param {object} ダンプ表示するデータオブジェクト
 */
export function d(data: any) {
    console.log(util.inspect(data, {colors: true, compact: false, breakLength: 10, depth: 10}))
}

/**
 * Repeat
 *
 * @param {string} string 繰り返したい文字
 * @param {number} times 繰り返したい回数
 * @return {string} 繰り返した文字列
 */
export function Repeat (string: string, times: number=1): string {
    if(!(times>0)) return '';
    let lump = '';
    for(let i=0; i<times; i++) {
        lump += string;
    }
    return lump;
}

/**
 * Message
 *
 * @param {string} message 表示したいメッセージ。改行込み複数行対応。
 * @param {string} type タイプ。primary|success|danger|warning|info|default
 * @param {number} line タイトル線を引く位置。
 */
// const Message = (message: { replace: (arg0: RegExp, arg1: string) => void; split: (arg0: RegExp) => void; }, type='default', line=0)=>{
export function Message (message: any, type: string='default', line: number=0): void {
    let indent = '  ';
    let line_color = color.white;
    let fg_color = color.white;
    if(type==='primary') {
        line_color = color.blue
        fg_color = color.white
    } else if(type==='success') {
        line_color = color.green
        fg_color = color.greenBright
    } else if(type==='danger') {
        line_color = color.redBright
        fg_color = color.red
    } else if(type==='warning') {
        line_color = color.yellow
        fg_color = color.yellowBright
    } else if(type==='info') {
        line_color = color.whiteBright
        fg_color = color.whiteBright
    } else if(type==='whisper') {
        line_color = color.blackBright
        fg_color = color.blackBright
    }

    message = wrap(message.replace(/[\r\n]+$/, ''))
    let messages = message.split(/[\r\n]+/)
    let width = 0;
    for(let i in messages) {
        let len = strwidth(messages[i])
        if(width < len) width = len;
    }
    width += 2;

    console.log(
        indent +
        line_color('╒') +
        line_color(Repeat('═', width)) +
        line_color('╕')
    )
    for(let i in messages) {
        if(line>0 && line==(i as unknown as number)) {
            console.log(
                indent +
                line_color('├') +
                line_color(Repeat('-', width)) +
                line_color('┤')
            )
        }
        console.log(
            indent +
            line_color('│') +
            (
                (line>0 && line<=(i as unknown as number))
                    ? fg_color(' '+messages[i]+' ')
                    : fg_color.bold(' '+messages[i]+' ')
            )+
            Repeat(' ', (width-2) - strwidth(messages[i])) +
            line_color('│')
        )
    }
    console.log(
        indent +
        line_color('╘') +
        line_color(Repeat('═', width)) +
        line_color('╛')
    )
}

/**
 * Error
 * -----------------------------------------------------------------------------
 * @param {string} エラーメッセージ
 */
export function Error(message: string) {
    Message(`エラーが発生しました。\n${message}`, 'danger', 1)
	process.exit()
}

/**
 * ConfigLoad
 *
 * @return {string} mode引数で指定された場所のconfig.jsonをロード
 */
export function LoadConfig() {
    return {
        'test': 123
    }
}

/**
 * Label
 *
 * @param {string} 表示するラベル文字列
 */
export function Label(label: string) {
    console.log(color.bold(`<${label}>`))
}

/**
 * ContainerLogCheck
 * @param container コンテナ名
 * @param check_str 探す文字列
 * @param cwd composeファイルがあるパス（例：lampman.config_dir）
 */
export function ContainerLogCheck(container: string, check_str: string, cwd: string)
{
    return !!child.execFileSync(
        'docker-compose',
        ['logs', '--no-color', container],
        {cwd: cwd}
    ).toString().match(check_str)
}

/**
 * RotateFile
 * 指定ファイルを１つローテートする
 *
 * @param filepath ファイルのフルパス
 * @param max_number 最大数
 */
export function RotateFile(filepath: string, max_number: number)
{
    let dirname  = path.dirname(filepath)
    let basename = path.basename(filepath)

    // フルパスじゃなかったら無視
    if(!path.isAbsolute(filepath)) return false

    // max_numberが1以上じゃなかったら無視
    if(!(max_number>0)) return false

    // 指定ファイルが存在していなければローテート不要
    if(!fs.existsSync(filepath)) return false

    // 指定最大値以上のファイルがあれば削除
    let regex = new RegExp(`^${basename.replace('.','\\.')}\\.(\\d+)$`)
    for(let file of fs.readdirSync(dirname)) {
        let matched;
        if(matched = file.match(regex)) {
            if(matched[1]>=max_number)
                fs.unlinkSync(path.join(dirname, file))
            }
    }

    // 既存ファイルのローテート
    try {
        for(let num=max_number; num>0; num--) {
            let from = 1===num
                ? path.join(dirname, basename)
                : path.join(dirname, `${basename}.${num-1}`)
            let to = path.join(dirname, `${basename}.${num}`)
            if(!fs.existsSync(from)) continue
            fs.renameSync(from, to)
        }
    } catch(e) {
        throw e
    }

    return
}

/**
* ConfigToYaml
* 設定データをYaml用に整形する
*
* @param object
*/
export function ConfigToYaml(config: any)
{
    let yaml = {
        version:  config.version,
        services: <any>{},
        volumes:  <any>{},
        networks: <any>{},
    }
    let proj = config.lampman.project

    // lampman設定
    yaml.services.lampman = {
        container_name: `${proj}-lampman`,
        image: config.lampman.image,
        ports: [],
        depends_on: [],
        environment: {},
        volumes_from: [],
        volumes: ['./:/lampman'],
        entrypoint: '/lampman/lampman/entrypoint.sh',
        networks: [`${proj}-${config.network.name}`],
    }
    if('ports' in config.lampman.apache && config.lampman.apache.ports.length) {
        yaml.services.lampman.ports.push(...config.lampman.apache.ports)
    }
    if('mounts' in config.lampman.apache && config.lampman.apache.mounts.length) {
        yaml.services.lampman.volumes.push(...config.lampman.apache.mounts)
    }
    if('php' in config.lampman) {
        if('image' in config.lampman.php) {
            yaml.services.phpenv = {
                container_name: `${proj}-phpenv`,
                image: config.lampman.php.image,
                labels: [proj]
            }
            yaml.services.lampman.depends_on.push('phpenv')
            yaml.services.lampman.environment.LAMPMAN_PHP_PHPENV_IMAGE = config.lampman.php.image
            const matches = config.lampman.php.image.match(/\:(.*)$/)
            yaml.services.lampman.environment.LAMPMAN_PHP_PHPENV_VERSION = matches[1]
            yaml.services.lampman.volumes_from.push('phpenv')
        }
        if('error_report' in config.lampman.php) yaml.services.lampman.environment.LAMPMAN_PHP_ERROR_REPORT = config.lampman.php.error_report ? 1 : 0
        if('xdebug_start' in config.lampman.php) yaml.services.lampman.environment.LAMPMAN_PHP_XDEBUG_START = config.lampman.php.xdebug_start ? 1 : 0
        if('xdebug_host'  in config.lampman.php) yaml.services.lampman.environment.LAMPMAN_PHP_XDEBUG_HOST = config.lampman.php.xdebug_host
        if('xdebug_port'  in config.lampman.php) yaml.services.lampman.environment.LAMPMAN_PHP_XDEBUG_PORT = config.lampman.php.xdebug_port
    }
    if('maildev' in config.lampman) {
        if('start' in config.lampman.maildev) yaml.services.lampman.environment.LAMPMAN_MAILDEV_START = config.lampman.maildev.start ? 1 : 0
        if('port'  in config.lampman.maildev) yaml.services.lampman.environment.LAMPMAN_MAILDEV_PORT = config.lampman.maildev.port
        yaml.services.lampman.ports.push(config.lampman.maildev.port+':9981')
    }

    for(let key of Object.keys(config)) {

        // mysql設定
        if(key.match(/^mysql/)) {
            yaml.services[key] = {
                container_name: `${proj}-${key}`,
                image: config[key].image,
                ports: config[key].ports,
                volumes: [
                    `./${key}:/mysql`,
                    `${key}_data:/var/lib/mysql`,
                ],
                entrypoint: '/mysql/before-entrypoint.sh',
                command: 'mysqld',
                labels: [proj],
                environment: {},
                networks: [`${proj}-${config.network.name}`],
            }
            yaml.services[key].environment.MYSQL_ROOT_PASSWORD = config[key].password
            yaml.services[key].environment.MYSQL_DATABASE = config[key].database
            yaml.services[key].environment.MYSQL_USER = config[key].user
            yaml.services[key].environment.MYSQL_PASSWORD = config[key].password
            if('dump_rotations' in config[key]) yaml.services[key].environment.DUMP_ROTATIONS = config[key].dump_rotations
            if('is_locked' in config[key]) yaml.services[key].environment.IS_LOCKED = config[key].is_locked ? 1 : 0
            if('hosts' in config[key] && config[key].hosts.length) {
                for(let host of config[key].hosts) {
                    if ('LAMPMAN_BIND_HOSTS' in yaml.services.lampman.environment) {
                        yaml.services.lampman.environment.LAMPMAN_BIND_HOSTS += `, ${host}:${key}`
                    } else {
                        yaml.services.lampman.environment.LAMPMAN_BIND_HOSTS = `${host}:${key}`
                    }
                }
            }
            yaml.services.lampman.depends_on.push(key)
            if ('LAMPMAN_MYSQLS' in yaml.services.lampman.environment) {
                yaml.services.lampman.environment.LAMPMAN_MYSQLS += `, ${key}`
            } else {
                yaml.services.lampman.environment.LAMPMAN_MYSQLS = key
            }
            yaml.volumes[`${key}_data`] = {
                driver: 'local',
                name: `${proj}-${key}_data`
            }
        }

        // postgresql設定
        if(key.match(/^postgresql/)) {
            yaml.services[key] = {
                container_name: `${proj}-${key}`,
                image: config[key].image,
                ports: config[key].ports,
                volumes: [
                    `./${key}:/postgresql`,
                    `${key}_data:/var/lib/postgresql/data`,
                ],
                entrypoint: '/postgresql/before-entrypoint.sh',
                command: 'postgres',
                labels: [proj],
                environment: {},
                networks: [`${proj}-${config.network.name}`],
            }
            yaml.services[key].environment.POSTGRES_PASSWORD = config[key].password
            yaml.services[key].environment.POSTGRES_USER = config[key].user
            yaml.services[key].environment.POSTGRES_DB = config[key].database
            if('dump_rotations' in config[key]) yaml.services[key].environment.DUMP_ROTATIONS = config[key].dump_rotations
            if('is_locked' in config[key]) yaml.services[key].environment.IS_LOCKED = config[key].is_locked ? 1 : 0
            if('hosts' in config[key] && config[key].hosts.length) {
                for(let host of config[key].hosts) {
                    if ('LAMPMAN_BIND_HOSTS' in yaml.services.lampman.environment) {
                        yaml.services.lampman.environment.LAMPMAN_BIND_HOSTS += `, ${host}:${key}`
                    } else {
                        yaml.services.lampman.environment.LAMPMAN_BIND_HOSTS = `${host}:${key}`
                    }
                }
            }
            yaml.services.lampman.depends_on.push(key)
            if ('LAMPMAN_POSTGRESQLS' in yaml.services.lampman.environment) {
                yaml.services.lampman.environment.LAMPMAN_POSTGRESQLS += `, ${key}`
            } else {
                yaml.services.lampman.environment.LAMPMAN_POSTGRESQLS = key
            }
            yaml.volumes[`${key}_data`] = {
                driver: 'local',
                name: `${proj}-${key}_data`
            }
        }
    }

    // ネットワーク追加
    if(config.network) {
        yaml.networks[`${proj}-${config.network.name}`] = {
            driver: 'bridge'
        }
    }

    return yaml;
}
