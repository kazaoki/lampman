'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var libs = require("../libs");
function meta() {
    return {
        command: 'version',
        description: 'バージョン表示',
    };
}
exports.meta = meta;
function action(commands) {
    libs.Message("Lampman ver " + libs.getLampmanVersion() + "\n" +
        ("mode: " + lampman.mode), 'primary', 1);
}
exports.action = action;
