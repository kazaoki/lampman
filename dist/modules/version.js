'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var libs = require("../libs");
/**
 * バージョン情報モジュール
 */
function version(cmd, options) {
    var json = require('../../package.json');
    process.stdout.write('\n');
    // console.log(`${json.name} ver ${json.version}`)
    libs.Message(json.name + " ver " + json.version, 'primary');
    process.stdout.write('\n');
}
exports.default = version;
