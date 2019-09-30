'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var child = require('child_process');
var color = require('cli-color');
function ConfigToYaml(config) {
    var _a, _b, _c, _d, _e;
    var yaml = {
        version: config.version,
        services: {},
        volumes: {},
        networks: {},
    };
    var proj = config.lampman.project;
    yaml.services.lampman = {
        container_name: proj + "-lampman",
        image: config.lampman.image,
        ports: [],
        depends_on: [],
        environment: {},
        volumes_from: [],
        volumes: ['./:/lampman'],
        entrypoint: '/lampman/lampman/entrypoint.sh',
    };
    if (config.network && 'name' in config.network) {
        yaml.services.lampman.networks = [config.network.name];
    }
    if ('apache' in config.lampman) {
        if ('start' in config.lampman.apache)
            yaml.services.lampman.environment.LAMPMAN_APACHE_START = 1;
        if ('ports' in config.lampman.apache && config.lampman.apache.ports.length) {
            (_a = yaml.services.lampman.ports).push.apply(_a, config.lampman.apache.ports);
        }
        if ('mounts' in config.lampman.apache && config.lampman.apache.mounts.length) {
            (_b = yaml.services.lampman.volumes).push.apply(_b, config.lampman.apache.mounts);
        }
    }
    if ('php' in config.lampman) {
        if ('image' in config.lampman.php) {
            yaml.services.phpenv = {
                container_name: proj + "-phpenv",
                image: config.lampman.php.image,
                labels: [proj]
            };
            yaml.services.lampman.depends_on.push('phpenv');
            yaml.services.lampman.environment.LAMPMAN_PHP_PHPENV_IMAGE = config.lampman.php.image;
            var matches = config.lampman.php.image.match(/\:(.*)$/);
            yaml.services.lampman.environment.LAMPMAN_PHP_PHPENV_VERSION = matches[1];
            yaml.services.lampman.volumes_from.push('phpenv');
        }
        if ('error_report' in config.lampman.php)
            yaml.services.lampman.environment.LAMPMAN_PHP_ERROR_REPORT = config.lampman.php.error_report ? 1 : 0;
        if ('xdebug_start' in config.lampman.php)
            yaml.services.lampman.environment.LAMPMAN_PHP_XDEBUG_START = config.lampman.php.xdebug_start ? 1 : 0;
        if ('xdebug_host' in config.lampman.php)
            yaml.services.lampman.environment.LAMPMAN_PHP_XDEBUG_HOST = config.lampman.php.xdebug_host;
        if ('xdebug_port' in config.lampman.php)
            yaml.services.lampman.environment.LAMPMAN_PHP_XDEBUG_PORT = config.lampman.php.xdebug_port;
    }
    if ('maildev' in config.lampman) {
        if ('start' in config.lampman.maildev)
            yaml.services.lampman.environment.LAMPMAN_MAILDEV_START = config.lampman.maildev.start ? 1 : 0;
        if ('ports' in config.lampman.maildev) {
            yaml.services.lampman.environment.LAMPMAN_MAILDEV_PORTS = config.lampman.maildev.ports.join(', ');
            (_c = yaml.services.lampman.ports).push.apply(_c, config.lampman.maildev.ports);
        }
    }
    if ('postfix' in config.lampman) {
        if ('start' in config.lampman.postfix)
            yaml.services.lampman.environment.LAMPMAN_POSTFIX_START = config.lampman.postfix.start ? 1 : 0;
        if ('ports' in config.lampman.postfix) {
            yaml.services.lampman.environment.LAMPMAN_POSTFIX_PORTS = config.lampman.postfix.ports.join(', ');
            (_d = yaml.services.lampman.ports).push.apply(_d, config.lampman.postfix.ports);
        }
    }
    if ('sshd' in config.lampman) {
        if ('start' in config.lampman.sshd)
            yaml.services.lampman.environment.LAMPMAN_SSHD_START = config.lampman.sshd.start ? 1 : 0;
        if ('ports' in config.lampman.sshd) {
            yaml.services.lampman.environment.LAMPMAN_SSHD_PORTS = config.lampman.sshd.ports.join(', ');
            (_e = yaml.services.lampman.ports).push.apply(_e, config.lampman.sshd.ports);
        }
        if ('user' in config.lampman.sshd)
            yaml.services.lampman.environment.LAMPMAN_SSHD_USER = config.lampman.sshd.user;
        if ('pass' in config.lampman.sshd)
            yaml.services.lampman.environment.LAMPMAN_SSHD_PASS = config.lampman.sshd.pass;
        if ('path' in config.lampman.sshd)
            yaml.services.lampman.environment.LAMPMAN_SSHD_PATH = config.lampman.sshd.path;
    }
    for (var _i = 0, _f = Object.keys(config); _i < _f.length; _i++) {
        var key = _f[_i];
        if (key.match(/^mysql/)) {
            yaml.services[key] = {
                container_name: proj + "-" + key,
                image: config[key].image,
                ports: config[key].ports,
                volumes: [
                    "./" + key + ":/mysql",
                    key + "_data:/var/lib/mysql",
                ],
                entrypoint: '/mysql/before-entrypoint.sh',
                command: ['mysqld'],
                labels: [proj],
                environment: {},
            };
            if (config.network && 'name' in config.network) {
                yaml.services[key].networks = [config.network.name];
            }
            yaml.services[key].environment.MYSQL_ROOT_PASSWORD = config[key].password;
            yaml.services[key].environment.MYSQL_DATABASE = config[key].database;
            yaml.services[key].environment.MYSQL_USER = config[key].user;
            yaml.services[key].environment.MYSQL_PASSWORD = config[key].password;
            if ('charset' in config[key] && config[key].charset.length)
                yaml.services[key].command.push("--character-set-server=" + config[key].charset);
            if ('collation' in config[key] && config[key].collation.length)
                yaml.services[key].command.push("--collation-server=" + config[key].collation);
            if ('hosts' in config[key] && config[key].hosts.length) {
                for (var _g = 0, _h = config[key].hosts; _g < _h.length; _g++) {
                    var host = _h[_g];
                    if ('LAMPMAN_BIND_HOSTS' in yaml.services.lampman.environment) {
                        yaml.services.lampman.environment.LAMPMAN_BIND_HOSTS += ", " + host + ":" + key;
                    }
                    else {
                        yaml.services.lampman.environment.LAMPMAN_BIND_HOSTS = host + ":" + key;
                    }
                }
            }
            if ('volume_locked' in config[key])
                yaml.services[key].environment.VOLUME_LOCKED = config[key].volume_locked ? 1 : 0;
            if ('dump' in config[key]) {
                if ('rotations' in config[key].dump) {
                    yaml.services[key].environment.DUMP_ROTATIONS = config[key].dump.rotations;
                }
                if ('filename' in config[key].dump) {
                    yaml.services[key].environment.DUMP_FILENAME = config[key].dump.filename;
                    yaml.services[key].volumes.push("./" + key + "/" + config[key].dump.filename + ":/docker-entrypoint-initdb.d/import.sql");
                }
            }
            if ('LAMPMAN_MYSQLS' in yaml.services.lampman.environment) {
                yaml.services.lampman.environment.LAMPMAN_MYSQLS += ", " + key;
            }
            else {
                yaml.services.lampman.environment.LAMPMAN_MYSQLS = key;
            }
            yaml.volumes[key + "_data"] = {
                driver: 'local',
                name: "" + (config[key].volume_locked ? 'locked_' : '') + proj + "-" + key + "_data"
            };
        }
        if (key.match(/^postgresql/)) {
            yaml.services[key] = {
                container_name: proj + "-" + key,
                image: config[key].image,
                ports: config[key].ports,
                volumes: [
                    "./" + key + ":/postgresql",
                    key + "_data:/var/lib/postgresql/data",
                ],
                entrypoint: '/postgresql/before-entrypoint.sh',
                command: 'postgres',
                labels: [proj],
                environment: {},
            };
            if (config.network && 'name' in config.network) {
                yaml.services[key].networks = [config.network.name];
            }
            yaml.services[key].environment.POSTGRES_PASSWORD = config[key].password;
            yaml.services[key].environment.POSTGRES_USER = config[key].user;
            yaml.services[key].environment.POSTGRES_DB = config[key].database;
            if ('volume_locked' in config[key])
                yaml.services[key].environment.VOLUME_LOCKED = config[key].volume_locked ? 1 : 0;
            if ('dump' in config[key]) {
                if ('rotations' in config[key].dump) {
                    yaml.services[key].environment.DUMP_ROTATIONS = config[key].dump.rotations;
                }
                if ('filename' in config[key].dump) {
                    yaml.services[key].environment.DUMP_FILENAME = config[key].dump.filename;
                    yaml.services[key].volumes.push("./" + key + "/" + config[key].dump.filename + ":/docker-entrypoint-initdb.d/import.sql");
                }
            }
            if ('hosts' in config[key] && config[key].hosts.length) {
                for (var _j = 0, _k = config[key].hosts; _j < _k.length; _j++) {
                    var host = _k[_j];
                    if ('LAMPMAN_BIND_HOSTS' in yaml.services.lampman.environment) {
                        yaml.services.lampman.environment.LAMPMAN_BIND_HOSTS += ", " + host + ":" + key;
                    }
                    else {
                        yaml.services.lampman.environment.LAMPMAN_BIND_HOSTS = host + ":" + key;
                    }
                }
            }
            if ('LAMPMAN_POSTGRESQLS' in yaml.services.lampman.environment) {
                yaml.services.lampman.environment.LAMPMAN_POSTGRESQLS += ", " + key;
            }
            else {
                yaml.services.lampman.environment.LAMPMAN_POSTGRESQLS = key;
            }
            yaml.volumes[key + "_data"] = {
                driver: 'local',
                name: "" + (config[key].volume_locked ? 'locked_' : '') + proj + "-" + key + "_data"
            };
        }
    }
    if ('network' in config) {
        if ('name' in config.network) {
            yaml.networks[config.network.name] = {
                driver: 'bridge'
            };
        }
        else if ('external' in config.network) {
            yaml.networks['default'] = {
                driver: 'bridge',
                external: { name: config.network.external }
            };
        }
    }
    return yaml;
}
exports.ConfigToYaml = ConfigToYaml;
function getDockerLocalhost() {
    var host = 'localhost';
    try {
        var res = child.execFileSync('docker-machine', ['ip'], { stdio: ['pipe', 'pipe', 'ignore'] });
        if (res)
            host = res.toString().trim();
    }
    catch (e) { }
    return host;
}
exports.getDockerLocalhost = getDockerLocalhost;
