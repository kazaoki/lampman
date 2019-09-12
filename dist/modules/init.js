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
    libs.Message("Created config dir.\n" + config_dir, 'primary', 1);
}
exports.default = init;
