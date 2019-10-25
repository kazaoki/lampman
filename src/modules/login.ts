
'use strict'

/**
 * -------------------------------------------------------------------
 * [lamp login]
 * リストから選択したコンテナのコンソールにログインします
 * -------------------------------------------------------------------
 */

declare let lampman:any;

import libs   = require('../libs');
import docker = require('../docker');
const prompts = require('prompts');
const child   = require('child_process')
const color   = require('cli-color');

/**
 * コマンド登録用メタデータ
 */
export function meta()
{
    return {
        command: 'login [container-name]',
        description: 'コンテナのコンソールにログインします',
        options: [
            ['-s, --select', 'コンテナを選択します。Default: lampman'],
            ['-l, --shell <shell>', 'ログインシェルを指定。Default: bash'],
            ['-p, --path <path>', 'ログインパスを指定。Default: /'],
        ]
    }
}

/**
 * コマンド実行
 */
export async function action(cname:string|null, commands:any)
{
    let target_cname

    // コンテナリスト取得
    let sname
    let cnames = []
    let list = []
    let out = child.execFileSync('docker', ['ps', '--format', '{{.ID}}\t{{.Names}}\t{{.Status}}\t{{.Image}}'])
    for(let line of out.toString().split(/\n/)) {
        let column = line.split(/\t/)
        if(4!==column.length) continue;
        list.push({
            title: `[${column[0]}] ${column[1]}`,
            description: `${column[3]} @ ${column[2]}`,
            value: column[1]
        })
        cnames.push(column[1])
    }
    if(!cnames.length) {
        libs.Message('選択できるコンテナがありません。', 'info')
        return
    }
    if(1===list.length) cname = cnames[0]

    // --selectの場合はリストから選択
    if(commands.select) {
        // コンテナ選択
        const response = await prompts([
            {
                type: 'select',
                name: 'cname',
                message: 'コンソールにログインするコンテナを選択してください。',
                choices: list,
            }
        ]);
        if(response.cname) target_cname = response.cname
        console.log()
    } else if(cname) {
        // コンテナ名入力した場合は、リストにあるかチェック
        if(cnames.includes(cname)) {
            target_cname = cname
        } else {
            // リストになければサービス名として docker-compose に渡して実際のコンテナ名を取得
            try {
                sname = cname
                target_cname = docker.getRealCname(cname, lampman)
            } catch(e) {
                libs.Error(e)
            }
        }
    } else {
        // コンテナ名も無く、--select でもなく、コンテナが複数ある場合は、強制的に lampman コンテナを対象にする
        try {
            sname = 'lampman'
            target_cname = docker.getRealCname(sname, lampman)
        } catch(e) {
            libs.Error('正しく実行モードの指定をするか、-s でコンテナを選択してください。')
        }
    }

    // ここまで来てもコンテナ名が取得できない場合は終了。
    if(!target_cname) {
        libs.Message(`ご指定のコンテナが見つかりませんでした。\n${target_cname}`, 'warning', 1)
        return
    }

    // docker-composeのコンテナならサービス名を取得しておく
    if(!sname) {
        try {
            let ret = child.execFileSync('docker', ['inspect', '--format', '{{ index .Config.Labels "com.docker.compose.service"}}', target_cname]).toString().trim()
            if(ret) sname = ret
        } catch(e){}
    }

    // ログインパス指定
    let login_path = '/'
    if(sname in lampman.config && 'login_path' in lampman.config[sname]) {
        login_path = lampman.config[sname].login_path
    }
    if(commands.path) {
        login_path = commands.path
    }

    // いざログイン
    console.log(color.white.bold(`<${target_cname}>`))
    await child.spawn(
        'docker',
        [
            'exec',
            '-e', 'TERM=xterm-256color',
            '-e', 'LANGUAGE=ja_JP.UTF-8',
            // '-e', 'LC_ALL=ja_JP.UTF-8',
            '-e', 'LANG=ja_JP.UTF-8',
            '-e', 'LC_TYPE=ja_JP.UTF-8',
            '-it',
            target_cname,
            commands.shell ? commands.shell : 'bash',
            '-c', `cd ${login_path} && ${commands.shell ? commands.shell : 'bash'}`,
        ],
        {
            stdio: 'inherit',
        }
    )
}
