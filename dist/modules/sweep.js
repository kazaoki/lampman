'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
exports.action = exports.meta = void 0;
var docker = require("../docker");
var child = require("child_process");
var prompts = require('prompts');
var reject_1 = require("./reject");
var rmi_1 = require("./rmi");
function meta(lampman) {
    return {
        command: 'sweep [options]',
        describe: '全てのコンテナ、未ロックボリューム、<none>イメージ、不要ネットワークの一掃',
        options: {
            'containers': {
                alias: 'c',
                describe: 'コンテナのみ一掃します。',
                type: 'boolean',
            },
            'force': {
                alias: 'f',
                describe: '確認なしで実行します。',
                type: 'boolean',
            },
        },
    };
}
exports.meta = meta;
function action(argv, lampman) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    docker.needDockerLive();
                    if (!!argv.force) return [3, 2];
                    return [4, prompts([
                            {
                                type: 'toggle',
                                name: 'value',
                                message: (argv.containers
                                    ? '起動しているかどうかに関わらず、全てのコンテナを一掃しますが本当によろしいですか？\n（※docker-compose外のコンテナも対象です）'
                                    : '起動しているかどうかに関わらず、全てのコンテナ、未ロックボリューム、<none>イメージ、不要ネットワークを一掃しますが本当によろしいですか？\n（※docker-compose外のコンテナも対象です）'),
                                initial: false,
                                active: 'yes',
                                inactive: 'no'
                            }
                        ])];
                case 1:
                    response = _a.sent();
                    if (!response.value)
                        return [2];
                    _a.label = 2;
                case 2: return [4, reject_1.action({ noVolumes: argv.containers, force: true }, lampman)];
                case 3:
                    _a.sent();
                    if (!!argv.containers) return [3, 5];
                    return [4, rmi_1.action({ prune: true }, lampman)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    if (!argv.containers)
                        child.spawnSync('docker', ['network', 'prune', '-f'], { stdio: 'inherit' });
                    return [2];
            }
        });
    });
}
exports.action = action;
