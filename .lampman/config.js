
// Exprot config
module.exports.config = {

    /**
     * ---------------------------------------------------------------
     * 基本設定
     * ---------------------------------------------------------------
     */

    // プロジェクト名
    project: 'lampman-test',

    // docker-compose.yml のファイルバージョン
    // * docker-compose.override.ymlがあればそのversionと合わせる必要あり
    version: '2.2',

    // ネットワーク
    network: {
        name: 'default', // ネットワークを作成する場合。自動で頭にプロジェクト名が付く
        // external: 'lampman_default', // 既存ネットワークを指定する場合は実際の名前（頭にプロジェクト名が付いた状態）のものを指定
    },

    /**
     * ---------------------------------------------------------------
     * Lampmanコンテナ設定
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
            rewrite_log: false, // or 1-8, true=8
        },

        // PHP
        php: {
            // image: 'kazaoki/phpenv:5.6.22', // ここにあるバージョンから → https://hub.docker.com/r/kazaoki/phpenv/tags
            image: 'kazaoki/phpenv:8.0.0', // ここにあるバージョンから → https://hub.docker.com/r/kazaoki/phpenv/tags
            // ↑ コメントアウトするとlampman標準のPHP使用(5.4とか)
            error_report: true, // 本番環境の場合は必ずfalseに。
            xdebug_start: true, // 本番環境の場合は必ずfalseに。
            xdebug_host: 'host.docker.internal',
            xdebug_port: 9000,
        },

        // maildev
        maildev: {
            start: true,
            ports: ['9981:1080'],
        },

        // postfix
        postfix: {
            start: true,
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
     * MySQLコンテナ設定
     * ---------------------------------------------------------------
     */
    mysql: {
        image:          'mysql:5.7',
        ports:          ['3306:3306'],
        database:       'test',
        user:           'test',
        password:       'test', // same root password
        charset:        'utf8mb4',
        collation:      'utf8mb4_general_ci',
        hosts:          ['main.db'],
        volume_locked:  false,
        query_log:      true,
        query_cache:    true,
        dump: {
            rotations:  3,
            filename:   'dump.sql',
            // filename:   'dump.sql.gz', // .gzにすると自動的に圧縮されます
        }
    },
    mysql_2: { // make '/mysql_2/' folder.
        image:          'mysql:5.5',
        ports:          ['3307:3306'],
        database:       'test2',
        user:           'test2',
        password:       'test2', // same root password
        charset:        'utf8mb4',
        collation:      'utf8mb4_general_ci',
        hosts:          ['main-2.db'],
        volume_locked:  false,
        query_log:      false,
        query_cache:    false,
        dump:           {
            rotations:  5,
            filename:   'dump.sql',
            // filename:   'dump.sql.gz', // .gzにすると自動的に圧縮されます
        }
    },

    /**
     * ---------------------------------------------------------------
     * PostgreSQLコンテナ設定
     * ---------------------------------------------------------------
     */
    postgresql: {
        image:         'postgres:9',
        ports:         ['5432:5432'],
        database:      'test',
        user:          'test',
        password:      'test', // same root password
        hosts:         ['sub.db'],
        volume_locked: false,
        dump: {
            rotations: 5,
            filename:  'dump.sql',
            // filename:  'dump.sql.gz', // .gzにすると自動的に圧縮されます
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
            // filename:  'dump.sql.gz', // .gzにすると自動的に圧縮されます
        }
    },

    /**
     * ---------------------------------------------------------------
     * ログコマンド設定
     * ---------------------------------------------------------------
     */
    logs: {
        https: [
            ['/var/log/httpd/ssl_request_log', ['-cS', 'apache']],
            ['/var/log/httpd/ssl_error_log', ['-cS', 'apache_errors']],
        ],
        http: [
            ['/var/log/httpd/access_log', ['-cS', 'apache']],
            ['/var/log/httpd/error_log', ['-cS', 'apache_errors']],
        ],
        db: [
            ['/var/log/mysql/query.log', ['-ci', 'green']],
            // ['/var/log/mysql_2/query.log', ['-ci', 'blue']],
        ],
    },

    /**
     * ---------------------------------------------------------------
     * Extraコマンド設定
     * ---------------------------------------------------------------
     */
    extra: {

        // ngrok
        expose: {
            command: 'ngrok http 80',
            container: 'lampman',
            desc: 'ngrok を使用して一時的に外部からアクセスできるようにする'
        },

        // extraサンプル：`lamp sample`
        // sample: {
        //     command: '(command for all os)',
        //     command: {
        //         win: '(command for windows)',
        //         unix: '(command for mac|linux)',
        //     },
        //     function: (in1, in2)=>{console.log(`${in1}/${in2}/${lampman.config.project}`)},
        //     container: 'lampman', // if specified, run on container.
        //     desc: '(description)', // if specified, show desc on `lamp --help`
        // },

        // git-book serve
        gb: {
            command: {
                win: 'cd git-book && start http://localhost:4000 && gitbook serve',
                unix: 'cd git-book && open http://localhost:4000 && gitbook serve',
            },
            desc: 'git-book serve'
        },
        // _book 削除（↑コマンド後、別コンソールからこれ一度実行しないとファイル更新時にnode落ちる）
        gbc: {
            command: 'cd git-book && rm -rf _book',
            desc: 'delete git-book serve dir'
            // https://takamints.hatenablog.jp/entry/avoid-a-gitbook-bug-on-windows
        },
        // ドキュメントビルド
        gbb: {
            command: 'gitbook build git-book/ docs/',
            desc: 'gitbook build to docs/'
        },
    },

    /**
     * ---------------------------------------------------------------
     * 起動時アクション設定
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
        // {
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
