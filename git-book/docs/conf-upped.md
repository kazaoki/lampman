
# 設定ファイル詳説：起動時アクション設定

## config.js 設定例
<pre class="cmd">
    /**
     * ---------------------------------------------------------------
     * 起動時アクション設定
     * ---------------------------------------------------------------
     */
    on_upped: [
        {
            // MAILDEV
            type: 'open_browser',
            port: '1080',
        },
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
            type: 'run_command',
            command: 'gulp',
        },
        {
            // show message on upped
            type: 'show_message',
            message: 'hogehoge',
            style: 'primary', // primary|success|danger|warning|info|default
        },
        {
            // run extra command on upped
            type: 'run_extra_command',
            name: 'ab',
            // args: [],
        },
        {
            // run command on upped
            type: 'run_command',
            command: {
                win: 'dir',
                unix: 'ls -la',
            },
        },
    ],
</pre>

## `on_upped`
