
'use strict'

/**
 * -------------------------------------------------------------------
 * [lamp version]
 * Lampmanバージョン確認
 * -------------------------------------------------------------------
 */

declare let lampman:any;

import libs = require('../libs');

/**
 * コマンド登録用メタデータ
 */
export function meta()
{
    return {
        command: 'version',
        description: 'バージョン表示',
    }
}

/**
 * コマンド実行
 */
export function action(commands:any)
{
    libs.Message(
        `Lampman ver ${libs.getLampmanVersion()}\n`+
        `mode: ${lampman.mode}`,
        'primary',
        1
    )
}
