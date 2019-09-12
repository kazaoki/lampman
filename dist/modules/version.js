'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var libs = require("../libs");
function version(commands, lampman) {
    var json = require('../../package.json');
    libs.Message(json.name + " ver " + json.version, 'primary');
}
exports.default = version;
