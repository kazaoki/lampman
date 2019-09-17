'use strict';
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
var libs = require("./libs");
var child = require('child_process');
var color = require('cli-color');
function clean() {
    return __awaiter(this, void 0, void 0, function () {
        var procs, _loop_1, _i, _a, cid, _loop_2, _b, _c, vid;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    procs = [];
                    _loop_1 = function (cid) {
                        if (!cid)
                            return "continue";
                        procs.push(new Promise(function (resolve, reject) {
                            child.execFile('docker', ['rm', '-fv', cid])
                                .stderr.on('data', function (data) {
                                console.log("Deleting " + cid + " ... " + color.red('ng'));
                                reject(data);
                            })
                                .on('close', function (code) {
                                console.log("Deleting " + cid + " ... " + color.green('done'));
                                resolve();
                            });
                        }));
                    };
                    for (_i = 0, _a = child.execFileSync('docker', ['ps', '-qa', '--format', '{{.Names}}']).toString().trim().split(/\n/); _i < _a.length; _i++) {
                        cid = _a[_i];
                        _loop_1(cid);
                    }
                    if (!procs.length) return [3, 2];
                    return [4, Promise.all(procs)
                            .catch(function (err) { libs.Error(err); })];
                case 1:
                    _d.sent();
                    _d.label = 2;
                case 2:
                    procs = [];
                    _loop_2 = function (vid) {
                        if (!vid || vid.match(/^locked_/))
                            return "continue";
                        procs.push(new Promise(function (resolve, reject) {
                            child.execFile('docker', ['volume', 'rm', '-f', vid])
                                .stderr.on('data', function (data) {
                                console.log("Removing volume " + vid + " ... " + color.red('ng'));
                                reject(data);
                            })
                                .on('close', function (code) {
                                console.log("Removing volume " + vid + " ... " + color.green('done'));
                                resolve();
                            });
                        }));
                    };
                    for (_b = 0, _c = child.execFileSync('docker', ['volume', 'ls', '-q', '--filter', 'dangling=true']).toString().trim().split(/\n/); _b < _c.length; _b++) {
                        vid = _c[_b];
                        _loop_2(vid);
                    }
                    if (!procs.length) return [3, 4];
                    return [4, Promise.all(procs)
                            .catch(function (err) { libs.Error(err); })];
                case 3:
                    _d.sent();
                    _d.label = 4;
                case 4: return [2, procs.length];
            }
        });
    });
}
exports.clean = clean;
