'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var libs = require("../libs");
var fs = require("fs-extra");
var path = require("path");
function init(commands, lampman) {
    var config_dir = path.join(process.cwd(), '.lampman' + ('default' === lampman.mode ? '' : '-' + lampman.mode));
    try {
        fs.copySync(path.join(__dirname, '../../.lampman-init'), config_dir, {
            overwrite: false,
            errorOnExist: true
        });
    }
    catch (e) {
        libs.Error(e);
    }
    libs.Message("Lampman \u8A2D\u5B9A\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u3092\u751F\u6210\u3057\u307E\u3057\u305F\u3002\n" + config_dir, 'primary', 1);
}
exports.default = init;
