
const __TRUE_ON_DEFAULT__ = 'default'===process.env.LAMPMAN_MODE;

/**
 * load modules
 */

 /**
 * export configs
 */
module.exports.config = {

    // Lampman
    lampman: {
        project: 'lampman-test',
        image: 'kazaoki/lampman',

        // Apache
        apache: {
            ports: [
                '80:80',
                '443:443'
            ],
            mounts: [ // 公開ディレクトリに /var/www/html を割り当ててください。
                '../public_html:/var/www/html',
                '../public_html:/home/user_a/public_html',
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
    mysql_2: { // make '/mysql_2/' folder.
        image: 'mysql:5.5',
        ports: {3307: 3306},
        database: 'test2',
        user: 'test2',
        password: 'test2', // same root password
        hosts: ['mysql55.db'],
    },
    // mysql_3: { // make '/mysql_2/' folder.
    //     image: 'mysql:5.5',
    //     ports: {3308: 3306},
    //     database: 'test2',
    //     user: 'test2',
    //     password: 'test2', // same root password
    //     hosts: ['mysql55.db'],
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

        // // Make docker-compose.yml for production
        // 'make-product-yml': {
        //     side: 'host',
        //     cmd: 'lamp ymlout -m product > $LAMPMAN_PROJECT_DIR/docker-compose.yml'
        // },

        // func_a
        func_a: {
            side: 'host', // host|container
            desc: 'test func',
            func: lampman=>{
                console.log(lampman)
                console.log('run from extra command: func_a.')
            }
        },
    },

    // customize lampman object
    customize: config=>{
        config.yml.services.lampman.depends_on.push('test-alpine')
    },
}
