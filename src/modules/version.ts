
'use strict'

import libs = require('../libs');

/**
 * version: バージョン情報モジュール
 */
export default function version(commands: any, lampman: any)
{
    var json = require('../../package.json');
    libs.Message(`${json.name} ver ${json.version}`, 'primary');
}
