
# 設定ファイル詳説：Lampmanコンテナ設定

## config.js 設定例
<pre class="cmd">
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
                // '../public_html:/home/user_a/public_html',
            ],
            rewrite_log: false, // or 1-8, true=8
        },

        // PHP
        php: {
            image: 'kazaoki/phpenv:7.2.5', // ここにあるバージョンから → https://hub.docker.com/r/kazaoki/phpenv/tags
            // ↑ コメントアウトするとlampman標準のPHP使用(5.4とか)
            error_report: true, // 本番環境の場合は必ずfalseに。
            xdebug_start: true, // 本番環境の場合は必ずfalseに。
            xdebug_host: '192.168.0.10',
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
</pre>

## `Apache`
## `PHP`
## `maildev`
## `postfix`
## `sshd`
