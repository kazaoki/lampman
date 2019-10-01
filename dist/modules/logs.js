'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var libs = require("../libs");
var child = require('child_process');
function logs(group, commands, lampman) {
    if (!('logs' in lampman.config) || 0 === lampman.config.logs.length)
        libs.Error('ログ設定がありません');
    if (group && !(group in lampman.config.logs))
        libs.Error("\u5B58\u5728\u3057\u306A\u3044\u30ED\u30B0\u30B0\u30EB\u30FC\u30D7\u540D\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u3059 -> " + group + "\n\u6307\u5B9A\u53EF\u80FD\u306A\u30ED\u30B0\u30B0\u30EB\u30FC\u30D7\u540D\u306F " + Object.keys(lampman.config.logs).join(', ') + " \u3067\u3059\u3002");
    var groups = group
        ? [group]
        : Object.keys(lampman.config.logs);
    var args = groups.length > 1 ? ['-s', groups.length] : [];
    for (var _i = 0, groups_1 = groups; _i < groups_1.length; _i++) {
        var group_1 = groups_1[_i];
        for (var i = 0; i < lampman.config.logs[group_1].length; i++) {
            var column = lampman.config.logs[group_1][i];
            var file = column[0];
            var opts = column[1];
            if (Array.isArray(opts) && opts.length)
                args.push.apply(args, opts);
            if (i > 0)
                args.push('-I');
            args.push(file);
        }
    }
    child.spawn('docker-compose', ['--project-name', lampman.config.lampman.project, 'exec', 'lampman', 'multitail', '-cS', 'apache'].concat(args), {
        stdio: 'inherit',
        cwd: lampman.config_dir
    });
}
exports.default = logs;
