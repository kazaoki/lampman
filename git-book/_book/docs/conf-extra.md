
# 設定ファイル詳説：Extraコマンド設定

## config.js 設定例
<pre class="cmd">
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
        sample: {
            // command: '(command for all os)',
            command: {
                win: '(command for windows)',
                unix: '(command for mac|linux)',
            },
            container: 'lampman', // if specified, run on container.
            desc: '(description)', // if specified, show desc on `lamp --help`
        },
    },
</pre>

## `extra`
