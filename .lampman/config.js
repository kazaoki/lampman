
// DEFAULT BOOL
const __IS_DEFAULT__ = 'default'===process.env.LAMPMAN_MODE

// load dotenv
require(module.parent.path+'/../node_modules/dotenv').config()

// Exprot config
module.exports.config = {

    /**
     * ---------------------------------------------------------------
     * General settings
     * ---------------------------------------------------------------
     */

    // project name
    project: 'lampman-test',

    // docker-compose file version
    // * docker-compose.override.ymlがあればそのversionと合わせる必要あり
    version: '2.2',

    // // network
    // network: {
    //     name: 'default', // ネットワークを作成する場合。自動で頭にプロジェクト名が付く
    //     // external: 'lampman_default', // 既存ネットワークを指定する場合は実際の名前（頭にプロジェクト名が付いた状態）のものを指定
    // },

    /**
     * ---------------------------------------------------------------
     * Lampman base container settings
     * ---------------------------------------------------------------
     */
    lampman: {
        image: 'kazaoki/lampman',
        login_path: '/var/www/html',

        // Apache
        apache: {
            start: true,
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
            image: 'kazaoki/phpenv:5.6.22', // ここにあるバージョンから → https://hub.docker.com/r/kazaoki/phpenv/tags
            // ↑ image 未指定なら標準のPHP使用
            error_report: __IS_DEFAULT__,
            xdebug_start: __IS_DEFAULT__,
            xdebug_host: '192.168.0.10',
            xdebug_port: 9000,
        },

        // maildev
        maildev: {
            start: __IS_DEFAULT__,
            ports: ['9981:1080'],
        },

        // postfix
        postfix: {
            start: __IS_DEFAULT__,
            // ports: [],
        },

        // sshd
        sshd: {
            start: true,
            ports: ['2222:22'],
            user: 'sshuser',
            pass: '123456', // or process.env.LAMPMAN_SSHD_PASS
            path: '/var/www/html',
        },
    },

    /**
     * ---------------------------------------------------------------
     * MySQL container(s) settings
     * ---------------------------------------------------------------
     */
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
        query_log:      true,
        query_cache:    true,
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
        volume_locked:  false,
        query_log:      false,
        query_cache:    false,
        dump:           {
            rotations:  5,
            filename:   'dump.sql',
        }
    },

    /**
     * ---------------------------------------------------------------
     * PostgreSQL container(s) settings
     * ---------------------------------------------------------------
     */
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

    /**
     * ---------------------------------------------------------------
     * Logs command settings
     * ---------------------------------------------------------------
     */
    logs: {
        http: [
            ['/var/log/httpd/access_log', ['-cS', 'apache']],
            ['/var/log/httpd/error_log', ['-cS', 'apache_errors']],
        ],
        https: [
            ['/var/log/httpd/ssl_request_log', ['-cS', 'apache']],
            ['/var/log/httpd/ssl_error_log', ['-cS', 'apache_errors']],
        ],
        db: [
            ['/var/log/mysql/query.log', ['-ci', 'green']],
            // ['/var/log/mysql_2/query.log', ['-ci', 'blue']],
        ],
        // app: [
        //     ['/var/www/html/slime/logs/app.log', ['-ci', 'green']],
        // ],
    },

    /**
     * ---------------------------------------------------------------
     * Extra command settings
     * ---------------------------------------------------------------
     */
    extra: {
        // Lampmanコンテナ上でApacheベンチ実行
        ab: {
            command: 'ab -n1000 -c100 https://localhost/',
            container: 'lampman',
        },

        // PHP Xdebug の有効/無効切り替え
        xon: {
            command: '/lampman/lampman/php-xdebug-on.sh',
            container: 'lampman',
            desc: 'Xdebugを開始する'
        },
        xoff: {
            command: '/lampman/lampman/php-xdebug-off.sh',
            container: 'lampman',
            desc: 'Xdebugを終了する'
        },

        // プロジェクトパスに本番用 docker-compose.yml を生成する（ productモードにするので .lampman-product/ が必要です）
        product_compose: {
            command: `cd ${__dirname}/../ && lamp yamlout --mode product > docker-compose.yml`,
            desc: '本番用の docker-compose.yml をプロジェクトパスに生成'
        },

        // extraサンプル：`lamp sample`
        // sample: {
        //     command: '(command for all os)',
        //     command: {
        //         win: '(command for windows)',
        //         unix: '(command for mac|linux)',
        //     },
        //     container: 'lampman', // if specified, run on container.
        //     desc: '(description)', // if specified, show desc on `lamp --help`
        // },
    },

    /**
     * ---------------------------------------------------------------
     * Add action on upped lampman
     * ---------------------------------------------------------------
     */
    on_upped: [
        {
            // open browser on upped (win&mac only)
            type: 'open_browser',
            schema: 'https',
            path: '/',
            // port: '',
            // container: 'lampman',
            // url: 'http://localhost:9981',
        },
        {
            // MAILDEV
            type: 'open_browser',
            port: '1080',
        },
        //     // show message on upped
        //     type: 'show_message',
        //     message: 'hogehoge',
        //     style: 'primary', // primary|success|danger|warning|info|default
        // },
        // {
        //     // run extra command on upped
        //     type: 'run_extra_command',
        //     name: 'ab',
        //     // args: [],
        // },
        // {
        //     // run command on upped
        //     type: 'run_command',
        //     command: {
        //         win: 'dir',
        //         unix: 'ls -la',
        //     },
        // },
        {
            type: 'run_command',
            command: 'gulp',
        },
    ],
}
