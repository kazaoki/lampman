
'use strict'

import libs   = require('../libs');
const prompts = require('prompts');
const child   = require('child_process')
const color   = require('cli-color');

/**
 * login: リストから選択したコンテナのコンソールにログインします
 */
export default async function login(cname: string|null, commands: any, lampman: any)
{
    let target_cname

    // コンテナリスト取得
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

    // コンテナ名未入力の場合はリストから選択
    if(!cname) {
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
    } else {
        // コンテナ名入力した場合は、リストにあるかチェック
        if(cnames.includes(cname)) {
            target_cname = cname
        } else {
            // リストになければサービス名として docker-compose に渡して実際のコンテナ名を取得
            try {
                let cid = child.execFileSync('docker-compose', ['--project-name', lampman.config.project, 'ps', '-qa', cname], {cwd: lampman.config_dir}).toString()
                let res = child.execFileSync('docker', ['ps', '-f', `id=${cid.trim()}`, '--format', '{{.Names}}']).toString()
                if(res) target_cname = res.trim()
            } catch(e) {
                libs.Error(e)
            }
        }
    }

    // ここまで来てもコンテナ名が取得できない場合は終了。
    if(!target_cname) {
        libs.Message(`ご指定のコンテナが見つかりませんでした。\n${target_cname}`, 'warning', 1)
        return
    }

    // docker-composeのコンテナならサービス名を取得しておく
    let sname
    try {
        let ret = child.execFileSync('docker', ['inspect', '--format', '{{ index .Config.Labels "com.docker.compose.service"}}', target_cname]).toString().trim()
        if(ret) sname = ret
    } catch(e){}

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
