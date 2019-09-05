
'use strict'

import libs = require('../libs');

/**
 * バージョン情報モジュール
 */

export default function version(commands: any, options: any, lampman: object) {

    var json = require('../../package.json');
    process.stdout.write('\n')
    // console.log(`${json.name} ver ${json.version}`)
    libs.Message(`${json.name} ver ${json.version}`, 'primary');
    process.stdout.write('\n')

    // libs.d(config)
    // libs.d(commands)
    // libs.d(options)
}
