
'use strict'

/**
 * -------------------------------------------------------------------
 * [lamp version]
 * Lampmanバージョン確認
 * -------------------------------------------------------------------
 */

declare let lampman:any;

import libs = require('../libs');
const color = require('cli-color');

/**
 * コマンド登録用メタデータ
 */
export function meta()
{
    return {
        command: 'version',
        description: 'バージョン表示',
        options: [
            ['-q, --quit', 'バージョン文字列のみ出力する'],
        ],
    }
}

/**
 * コマンド実行
 */
export function action(commands:any)
{
    if(commands.quit) {
        process.stdout.write(color.move(0, -1))
        process.stdout.write(libs.getLampmanVersion())
    }  else {
        libs.Message(
            `Lampman ver ${libs.getLampmanVersion()}\n`+
            `mode: ${lampman.mode}`,
            'primary',
            1
        )
    }
}
