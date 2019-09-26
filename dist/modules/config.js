'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var libs = require("../libs");
var child = require('child_process');
var fs = require('fs');
function config(commands, lampman) {
    if (!fs.existsSync(lampman.config_dir + "/config.js")) {
        var mode_label = 'default' === lampman.mode ? '' : lampman.mode;
        libs.Message("\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB\uFF08.lampman" + (mode_label ? '-' + mode_label : '') + "/config.js\uFF09\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3067\u3057\u305F\u3002\n" +
            ("\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u30D5\u30A9\u30EB\u30C0\u306E\u30EB\u30FC\u30C8\u306B\u3066 'lamp init " + (mode_label ? '--mode ' + mode_label : '') + "' \u3092\u5B9F\u884C\u3057\u3066\u521D\u671F\u5316\u3092\u884C\u3063\u3066\u304F\u3060\u3055\u3044\u3002"), 'warning');
        return;
    }
    if (libs.isWindows()) {
        child.execSync("start " + lampman.config_dir + "/config.js");
    }
    else if (libs.isMac()) {
        child.execSync("open " + lampman.config_dir + "/config.js");
    }
    else {
        libs.d(lampman.config);
    }
}
exports.default = config;
