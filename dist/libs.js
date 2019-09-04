'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var strwidth = require('string-width');
var color = require('cli-color');
var wrap = require('jp-wrap')(color.windowSize.width - 8);
var util = require('util');
// const fs       = require('fs')
// const child    = require('child_process')
// const path     = require('path')
/**
 * d
 * @param {object} ダンプ表示するデータオブジェクト
 */
function d(data) {
    console.log(util.inspect(data, { colors: true, compact: false, breakLength: 10, depth: 10 }));
}
exports.d = d;
/**
 * Repeat
 *
 * @param {string} string 繰り返したい文字
 * @param {number} times 繰り返したい回数
 * @return {string} 繰り返した文字列
 */
function Repeat(string, times) {
    if (times === void 0) { times = 1; }
    if (!(times > 0))
        return '';
    var lump = '';
    for (var i = 0; i < times; i++) {
        lump += string;
    }
    return lump;
}
exports.Repeat = Repeat;
/**
 * Message
 *
 * @param {string} message 表示したいメッセージ。改行込み複数行対応。
 * @param {string} type タイプ。primary|success|danger|warning|info|default
 * @param {number} line タイトル線を引く位置。
 */
// const Message = (message: { replace: (arg0: RegExp, arg1: string) => void; split: (arg0: RegExp) => void; }, type='default', line=0)=>{
function Message(message, type, line) {
    if (type === void 0) { type = 'default'; }
    if (line === void 0) { line = 0; }
    var indent = '  ';
    var line_color = color.white;
    var fg_color = color.white;
    if (type === 'primary') {
        line_color = color.xterm(26);
        fg_color = color.xterm(39);
    }
    else if (type === 'success') {
        line_color = color.green;
        fg_color = color.greenBright;
    }
    else if (type === 'danger') {
        line_color = color.red;
        fg_color = color.redBright;
    }
    else if (type === 'warning') {
        line_color = color.yellow;
        fg_color = color.yellowBright;
    }
    else if (type === 'info') {
        line_color = color.whiteBright;
        fg_color = color.whiteBright;
    }
    else if (type === 'whisper') {
        line_color = color.blackBright;
        fg_color = color.blackBright;
    }
    message = wrap(message.replace(/[\r\n]+$/, ''));
    var messages = message.split(/[\r\n]+/);
    var width = 0;
    for (var i in messages) {
        var len = strwidth(messages[i]);
        if (width < len)
            width = len;
    }
    width += 2;
    console.log(indent +
        line_color('╒') +
        // line_color(Repeat('╍', width)) +
        line_color(Repeat('═', width)) +
        line_color('╕'));
    for (var i in messages) {
        if (line > 0 && line == i) {
            console.log(indent +
                line_color('├') +
                line_color(Repeat('╌', width)) +
                line_color('┤'));
        }
        console.log(indent +
            line_color('│') +
            fg_color(' ' + messages[i] + ' ') +
            Repeat(' ', (width - 2) - strwidth(messages[i])) +
            line_color('│'));
    }
    console.log(indent +
        line_color('╘') +
        line_color(Repeat('═', width)) +
        line_color('╛'));
}
exports.Message = Message;
/**
 * ConfigLoad
 *
 * @return {string} mode引数で指定された場所のconfig.jsonをロード
 */
function LoadConfig() {
    return {
        'test': 123
    };
}
exports.LoadConfig = LoadConfig;
