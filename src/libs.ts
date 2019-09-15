
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
        line_color = color.xterm(26)
        fg_color = color.xterm(39)
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
