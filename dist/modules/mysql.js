'use strict';
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var libs = require("../libs");
var prompts = require('prompts');
var child = require('child_process');
var fs = require('fs');
var path = require('path');
var color = require('cli-color');
function mysql(cname, commands, lampman) {
    return __awaiter(this, void 0, void 0, function () {
        var mysql, list, _i, _a, key, _b, list_1, item, before_str, response, dumpfile;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    mysql = {};
                    list = [];
                    for (_i = 0, _a = Object.keys(lampman.config); _i < _a.length; _i++) {
                        key = _a[_i];
                        if (key.match(/^mysql/)) {
                            list.push({
                                title: key,
                                value: __assign({ cname: key }, lampman.config[key]),
                                cname: key,
                            });
                        }
                    }
                    if (!(cname && cname.length)) return [3, 1];
                    for (_b = 0, list_1 = list; _b < list_1.length; _b++) {
                        item = list_1[_b];
                        if (item.cname === cname)
                            mysql = item.value;
                    }
                    if (!Object.keys(mysql).length) {
                        libs.Message('ご指定のコンテナ情報が設定ファイルに存在しません。\n' + cname, 'warning', 1);
                        process.exit();
                    }
                    return [3, 4];
                case 1:
                    if (!(list.length > 1)) return [3, 3];
                    before_str = '';
                    if (commands.dump)
                        before_str = 'ダンプを生成する';
                    else if (commands.restore)
                        before_str = 'リストアする';
                    else
                        before_str = 'MySQL接続する';
                    return [4, prompts([
                            {
                                type: 'select',
                                name: 'cname',
                                message: before_str + 'mysqlコンテナを選択してください。',
                                choices: list,
                            }
                        ])];
                case 2:
                    response = _c.sent();
                    if ('undefined' === typeof response.cname)
                        return [2];
                    mysql = response.cname;
                    return [3, 4];
                case 3:
                    mysql = list[0].value;
                    _c.label = 4;
                case 4:
                    try {
                        child.execFileSync('docker-compose', ['--project-name', lampman.config.project, 'ps', '-qa', mysql.cname], { cwd: lampman.config_dir });
                    }
                    catch (e) {
                        libs.Error(e);
                    }
                    if (commands.dump) {
                        console.log();
                        libs.Label('Dump MySQL');
                        dumpfile = commands.dump;
                        if (true === dumpfile) {
                            dumpfile = path.join(lampman.config_dir, mysql.cname, 'dump.sql');
                        }
                        else if (!path.isAbsolute(dumpfile)) {
                            dumpfile = path.join(lampman.config_dir, mysql.cname, dumpfile);
                        }
                        if (commands.rotate && mysql.dump_rotations > 0) {
                            process.stdout.write('Dumpfile rotate ... ');
                            libs.RotateFile(dumpfile, mysql.dump_rotations);
                            console.log(color.green('done'));
                        }
                        process.stdout.write('Dump to ' + dumpfile + ' ... ');
                        child.spawnSync('docker-compose', [
                            '--project-name', lampman.config.project,
                            'exec',
                            '-T',
                            mysql.cname,
                            'mysqldump',
                            mysql.database,
                            '-u' + mysql.user,
                            '-p' + mysql.password,
                        ], {
                            cwd: lampman.config_dir,
                            stdio: [
                                'ignore',
                                fs.openSync(dumpfile, 'w'),
                                'ignore',
                            ]
                        });
                        console.log(color.green('done'));
                        return [2];
                    }
                    if (commands.restore) {
                        console.log();
                        libs.Label('Restore MySQL');
                        process.stdout.write("Stopping " + mysql.cname + " ... ");
                        try {
                            child.spawnSync('docker-compose', ['--project-name', lampman.config.project, 'rm', '-sf', mysql.cname], { cwd: lampman.config_dir });
                        }
                        catch (e) {
                            libs.Error(e);
                        }
                        console.log(color.green('done'));
                        mysql.vname = lampman.config.project + "-" + mysql.cname + "_data";
                        process.stdout.write("Removing volume " + mysql.vname + " ... ");
                        try {
                            child.spawnSync('docker', ['volume', 'rm', mysql.vname, '-f']);
                        }
                        catch (e) {
                            libs.Error(e);
                        }
                        console.log(color.green('done'));
                        process.stdout.write("Reupping " + mysql.cname + " ... ");
                        try {
                            child.spawnSync('docker-compose', ['--project-name', lampman.config.project, 'up', '-d', mysql.cname], { cwd: lampman.config_dir });
                        }
                        catch (e) {
                            libs.Error(e);
                        }
                        console.log(color.green('done'));
                        console.log('');
                        process.stdout.write(color.magenta.bold('  [Ready]'));
                        libs.ContainerLogAppear(mysql.cname, 'Entrypoint finish.', lampman).catch(function (err) { libs.Error(err); })
                            .then(function () {
                            process.stdout.write(color.magenta(" " + mysql.cname));
                            console.log();
                        });
                        return [2];
                    }
                    return [4, child.spawn('docker-compose', [
                            '--project-name', lampman.config.project,
                            'exec',
                            '-e', 'TERM=xterm-256color',
                            '-e', 'LANGUAGE=ja_JP.UTF-8',
                            '-e', 'LC_ALL=ja_JP.UTF-8',
                            '-e', 'LANG=ja_JP.UTF-8',
                            '-e', 'LC_TYPE=ja_JP.UTF-8',
                            mysql.cname,
                            'mysql',
                            mysql.database,
                            '-uroot',
                            '-p' + mysql.password
                        ], {
                            cwd: lampman.config_dir,
                            stdio: 'inherit'
                        })];
                case 5:
                    _c.sent();
                    return [2];
            }
        });
    });
}
exports.default = mysql;
