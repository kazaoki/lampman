'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var libs = require("../libs");
var color = require('cli-color');
function meta(lampman) {
    return {
        command: 'version [options]',
        describe: 'バージョン表示',
        options: {
            'quiet': {
                alias: 'q',
                describe: 'バージョン文字列のみ出力します。',
                type: 'boolean',
            },
        },
    };
}
exports.meta = meta;
function action(argv, lampman) {
    if (argv.quiet) {
        process.stdout.write(color.move(0, -1));
        process.stdout.write(libs.getLampmanVersion());
    }
    else {
        libs.Message("Lampman ver " + libs.getLampmanVersion() + "\n" +
            ("mode: " + lampman.mode), 'primary', 1);
    }
}
exports.action = action;
