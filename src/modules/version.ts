
'use strict'

import * as libs from '../libs';

/**
 * バージョン情報モジュール
 */

export default function version(cmd: any, options: any) {
    var json = require('../../package.json');
    process.stdout.write('\n')
    // console.log(`${json.name} ver ${json.version}`)
    libs.Message(`${json.name} ver ${json.version}`, 'primary');
    process.stdout.write('\n')
}
