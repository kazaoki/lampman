
const __TRUE_ON_DEFAULT__ = 'default'===process.env.LAMPMAN_MODE

/**
 * load modules
 */

/**
 * export configs
 */
module.exports.config = {

    // docker-compose file version
    version: '2.2',

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
            port: 9981,
        },
    },

    // MySQL
    mysql: {
        image:          'mysql:5.7',
        ports:          ['3306:3306'],
        database:       'test',
        user:           'test',
        password:       'test', // same root password
        charset:        'utf8mb4',
        collation:      'utf8mb4_unicode_ci',
        hosts:          ['main.db'],
        volume_locked:  false,
        dump: {
            rotations:  3,
            filename:   'dump.sql',
        }
    },
    mysql_2: { // make '/mysql_2/' folder.
        image:          'mysql:5.5',
        ports:          ['3307:3306'],
        database:       'test2',
        user:           'test2',
        password:       'test2', // same root password
        charset:        'utf8mb4',
        collation:      'utf8mb4_unicode_ci',
        hosts:          ['main-2.db'],
        volume_locked:  true,
        dump:           {
            rotations:  5,
            filename:   'dump.sql',
        }
    },

    // PostgreSQL
    postgresql: {
        image:         'postgres:9',
        ports:         ['5432:5432'],
        database:      'test',
        user:          'test',
        password:      'test', // same root password
        hosts:         ['sub.db'],
        volume_locked: true,
        dump: {
            rotations: 5,
            filename:  'dump.sql',
        }
    },
    postgresql_b:  {
        image:         'kazaoki/postgres-bigm',
        ports:         ['5433:5432'],
        database:      'testb',
        user:          'testb',
        password:      'testb', // same root password
        hosts:         ['sub-b.db'],
        volume_locked: false,
        dump: {
            rotations: 3,
            filename:  'dump.sql',
        }
    },

    // network
    network: {
        name: 'internals'
    },

    // extra commands: ex. lamp ab
    extra: {

        // ファイル一覧
        filelist: {
            command: {
                win: 'dir',
                unix: 'ls -la',
            },
        },

        // LampmanコンテナでApacheベンチ実行
        ab: {
            command: 'ab -n1000 -c100 http://localhost/',
            container: 'lampman',
        },

        // 起動中の全てのコンテナ・未ロックボリューム・<none>イメージを強制削除する
        clean: {
            command: 'lamp reject --force && lamp rmi --prune',
        },

        // プロジェクトパスに本番用 docker-compose.yml を生成する（ .lampman-product/ を参照します）
        product_compose: {
            command: `cd ${__dirname}/../ && lamp yamlout -m product > docker-compose.yml`
        },
    },

    // logs
    logs: {
        apache: [
            ['/var/log/httpd/access_log', ['-cS', 'apache']],
            ['/var/log/httpd/error_log', ['-cS', 'apache_errors']],
            // ['/var/log/httpd/ssl_access_log', ['-cS', 'apache']],
            // ['/var/log/httpd/ssl_request_log', ['-cS', 'apache']],
            // ['/var/log/httpd/ssl_error_log', ['-ci', 'red']],
        ],
        // app: [
        //     ['/var/www/html/app.log', ['-ci', 'green']],
        // ],
    }

}
