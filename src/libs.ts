
'use strict'

const strwidth = require('string-width')
const color    = require('cli-color')
const jpwrap   = require('jp-wrap')(color.windowSize.width-8)
const util     = require('util');
const child    = require('child_process')
const path     = require('path')
const fs       = require('fs')
import docker  = require('./docker');
import yaml    = require('js-yaml');

/**
 * d
 * @param {object} ダンプ表示するデータオブジェクト
 */
export function d(data: any) {
    console.log(util.inspect(data, {colors: true, compact: false, breakLength: 10, depth: 10}))
}

/**
 * isWindows
 * -----------------------------------------------------------------------------
 * @return {boolean} Windowsかどうか
 */
export function isWindows() {
    return 'win32'===process.platform
}

/**
 * isMac
 * -----------------------------------------------------------------------------
 * @return {boolean} MacOSかどうか
 */
export function isMac() {
    return 'darwin'===process.platform
}

/**
 * isLinux
 * -----------------------------------------------------------------------------
 * @return {boolean} Linuxかどうか
 */
export function isLinux() {
    return 'linux'===process.platform
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
export function Message (message: any, type: string='default', line: number=0, opt: any={}): void {
    let indent = '  ';
    let line_color = color.white;
    let fg_color = color.white;
    if     (type==='primary') { line_color = color.blue;        fg_color = color.white }
    else if(type==='success') { line_color = color.green;       fg_color = color.greenBright }
    else if(type==='danger')  { line_color = color.redBright;   fg_color = color.red }
    else if(type==='warning') { line_color = color.yellow;      fg_color = color.yellowBright }
    else if(type==='info')    { line_color = color.whiteBright; fg_color = color.whiteBright }
    else if(type==='whisper') { line_color = color.blackBright; fg_color = color.blackBright }
    message = message.trim()
    if(!opt.for_container) message = jpwrap(message)
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
    for(let i=0; i<messages.length; i++) {
        if(line>0 && line===i) {
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
                (line>0 && i<line)
                    ? fg_color.bold(' '+messages[i]+' ')
                    : fg_color(' '+messages[i]+' ')
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
 * Label
 *
 * @param {string} 表示するラベル文字列
 */
export function Label(label: string) {
    console.log(color.bold(`<${label}>`))
}

/**
 * ContainerLogAppear
 * @param container コンテナ名
 * @param check_str 探す文字列
 * @param cwd composeファイルがあるパス（例：lampman.config_dir）
 */
export function ContainerLogAppear(container: string, check_str: string, lampman: any)
{
    let cwd = lampman.config_dir
    return new Promise((resolve, reject)=>{
        let sp = child.spawn('docker-compose', ['--project-name', lampman.config.project, 'logs', '-f', '--no-color', container], {cwd: cwd})
        sp.stdout.on('data', (data: any) => {
            if(data.toString().match(check_str)) {
                if('win32'===process.platform) {
                    child.spawn('taskkill', ['/pid', sp.pid, '/f', '/t']);
                } else {
                    sp.kill()
                }
                resolve()
            }
        })
        sp.on('error', (e: any)=>{
            throw(e)
        })
        sp.on('close', (code:any)=>{
            resolve()
        })
    })
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
 * モードをハイフン付きの文字列で返す。ただし `default` のときは空を返す
 * 指定ファイルを１つローテートする
 *
 * @param modestr モード文字列
 */
export function ModeString(modestr: string)
{
    return 'default'===modestr ? '' : '-'+modestr;
}

/**
 * config.js を読み込み
 *
 * @param lampman
 */
export function LoadConfig(lampman: any)
{
    try {
        let config_file = path.join(lampman.config_dir, 'config.js')
        fs.accessSync(config_file, fs.constants.R_OK)
        lampman.config = require(config_file).config
    } catch(e){
        Error('config load error!\n'+e)
        process.exit()
    }
    lampman.project_dir = path.dirname(lampman.config_dir)
    return lampman
}

/**
 * 最新の docker-compose.yml を生成
 *
 * @param lampman
 */
export function UpdateCompose(lampman: any)
{
    let ymldata = docker.ConfigToYaml(lampman.config)
    fs.writeFileSync(
        `${lampman.config_dir}/docker-compose.yml`,
        '# Do not edit this file as it will update automatically !\n'+
        yaml.dump(ymldata)
    )
}
