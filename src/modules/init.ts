
'use strict'

import libs = require('../libs');
import fs   = require('fs-extra');
import path = require('path');

/**
 * init: 初期化
 */
export default function init(commands: any, lampman: any)
{
    // 作成する設定ディレクトリを特定
    let config_dir = path.join(process.cwd(), '.lampman'+('default'===lampman.mode ? '' : '-'+lampman.mode))

    // `.lampman-init/` ディレクトリをカレントにコピーしてくる
    try {
        fs.copySync(
            path.join(__dirname, '../../.lampman-init'),
            config_dir,
            {
                overwrite: false,
                errorOnExist: true
            }
        );
    } catch(e) {
        libs.Error(e)
    }
    libs.Message(`Lampman 設定ディレクトリを生成しました。\n${config_dir}`, 'primary', 1)
}
