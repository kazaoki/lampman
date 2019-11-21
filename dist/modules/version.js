'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var libs = require("../libs");
var color = require('cli-color');
function meta() {
    return {
        command: 'version',
        description: 'バージョン表示',
        options: [
            ['-q, --quiet', 'バージョン文字列のみ出力する'],
        ],
    };
}
exports.meta = meta;
function action(commands) {
    if (commands.quiet) {
        process.stdout.write(color.move(0, -1));
        process.stdout.write(libs.getLampmanVersion());
    }
    else {
        libs.Message("Lampman ver " + libs.getLampmanVersion() + "\n" +
            ("mode: " + lampman.mode), 'primary', 1);
    }
}
exports.action = action;
