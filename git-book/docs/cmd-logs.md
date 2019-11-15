
# lamp logs

## ログファイルを眺める

### `lamp logs`

`lampman` コンテナのファイルの中身をコンソールに出力し追記を監視します。
出力には [MultiTail](https://www.vanheusden.com/multitail/) を使用しています。

以下、`config.js` 設定例ですが、`https`, `db` は自由に決めていただいてOKなグループ名です。
その中に監視したいファイル名と設定オプションがありますが、設定オプションは [MultiTailのドキュメント](https://www.vanheusden.com/multitail/examples.php) をご参考ください。
以下ですと、 `-cS` でフォーマット定義、 `-ci` でANSIカラーの指定をしています。
```
    logs: {
        https: [
            ['/var/log/httpd/ssl_request_log', ['-cS', 'apache']],
            ['/var/log/httpd/ssl_error_log', ['-cS', 'apache_errors']],
        ],
        db: [
            ['/var/log/mysql/query.log', ['-ci', 'green']],
        ],
    },
```

オプション無しの場合、一番最初のグループのみ監視します。

### `lamp logs -a`<br>`lamp logs --all`
全てのグループを画面を割って表示します

### `lamp logs -s`<br>`lamp logs --select`
表示するグループを１つ選択してそれを表示します。

終了したい場合は `Ctrl+C` キーです。
