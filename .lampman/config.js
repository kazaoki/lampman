
const __TRUE_ON_DEFAULT__ = 'default'===process.env.LAMPMAN_MODE;

/**
 * load modules
 */

 /**
 * export configs
 */
module.exports.config = {

    // general
    project: 'lampman-test',
    image: 'kazaoki/lampman',

    // Apache
    apache: {
        ports: [
            '80:80',
            '443:443'
        ],
        mounts: [
            {'../public_html': '/var/www/html'},
        ],
    },

    // PHP
    php: {
        image: 'kazaoki/phpenv:5.6.22', // ref: https://hub.docker.com/r/kazaoki/phpenv/tags
        // ↑ image 未指定なら標準のPHP使用
        error_report: __TRUE_ON_DEFAULT__,
        xdebug_start: __TRUE_ON_DEFAULT__,
        xdebug_host: '192.168.0.10',
        xdebug_port: 9000,
    },

    // maildev
    maildev: {
        start: __TRUE_ON_DEFAULT__,
        ports: ['9981:9981'],
    },

    // MySQL
    mysql: {
        image: 'mysql:5.7',
        ports: ['3306:3306'],
        database: 'test',
        user: 'test',
        password: 'test', // same root password
        // charset, collate 設定したい
        hosts: ['mysql.db'],
    },
    // mysql_2: { // make '/mysql_2/' folder.
    //     image: 'mysql:5.7',
    //     ports: {3307: 3307},
    //     database: 'test',
    //     user: 'test',
    //     password: 'test', // same root password
    //     hosts: ['mysql.db'],
    // },

    // PostgreSQL
    postgresql: {
        image: 'postgres:9',
        ports: ['5432:5432'],
        database: 'test',
        user: 'test',
        password: 'test', // same root password
        // charset, collate 設定したい
        hosts: ['postgresql.db'],
    },

    // extra commands: ex. lamp ab
    extra: {

        // ab
        ab: {
            side: 'container', // host|container
            cmd: 'ab localhost',
        },

        // dir
        dir: {
            side: 'host', // host|container
            cmd: {
                win: 'dir',
                unix: 'ls -la',
            },
        },
    },

    // customize lampman object
    customize: lampman=>{
        lampman.yml.services.lampman.depends_on.push('test-alpine')
    },
}
