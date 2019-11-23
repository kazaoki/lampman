
# 設定ファイル詳説：ログコマンド設定

## config.js 設定例
<pre class="cmd">
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
        ],
        app: [
            ['/var/log/https/slime/logs/app.log', ['-ci', 'yellow']],
        ],
    },
</pre>

## `logs`
