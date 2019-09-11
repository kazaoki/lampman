'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var libs = require("../libs");
function version(commands, lampman) {
    var json = require('../../package.json');
    process.stdout.write('\n');
    libs.Message(json.name + " ver " + json.version, 'primary');
    process.stdout.write('\n');
}
exports.default = version;
