
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

コマンド [`lamp logs`](cmd-logs.html) を実行するとこの設定で定義されたファイルが [MultiTail](https://www.vanheusden.com/multitail/) によってコンソール上にログを表示＆追記を監視します。

上記設定のフォーマットは以下の通りです。

<pre class="cmd">
    logs: {
       (グループ名A): [
            ['(ファイルパス1)', (MultiTailへ渡すオプション引数1)],
            ['(ファイルパス2)', (MultiTailへ渡すオプション引数2)],
            ...
        ],
       (グループ名B): [
            ['(ファイルパス3)', (MultiTailへ渡すオプション引数3)],
            ...
        ...
 </pre>

グループはログリストをひとまとめにするもので、グループ名はコマンドから選択する際のヒントとなるものです。  
例えば冒頭の例で言うと、

<pre class="cmd">
$ lamp logs http
</pre>

とすると `http` グループで指定した２ファイルの中身を表示＆監視します。

<pre class="cmd">
$ lamp logs http app
</pre>

とすると `http` と `app` グループで指定したファイルが、画面を縦にスプリットされ表示されます。
また、グループ指定なし `lamp logs` を打つと、一番最初のグループのみ表示されます。

## 仕組み

オプション引数も含め、設定された値を以下のようなフォーマットで構成して単純に MultiTail へ渡しているだけです。
※詳細なオプションは [MultiTail 公式サイト](https://www.vanheusden.com/multitail/)を御覧ください。

<pre class="cmd">
multitail -s (縦分割数) (MultiTailへ渡すオプション引数1) (ファイルパス1) (MultiTailへ渡すオプション引数2) (ファイルパス2) ...
</pre>

例えば冒頭の例で言うとこうなります。

<pre class="cmd">
multitail -s 2 -cS apache /var/log/httpd/access_log -cS apache_errors -I /var/log/httpd/error_log -ci green /var/log/mysql/query.log
</pre>

※ Multitail 用に Apacheエラーログフォーマットの定義を追加しておきました。
MultiTailへ渡すオプションにて `['-cS', 'apache_errors']` として利用可能です。
