
# lamp logs

## ログファイルを眺める

### `lamp logs`

`lampman` コンテナのファイルの中身をコンソールに出力し追記を監視します。
出力プログラムには [MultiTail](https://www.vanheusden.com/multitail/) を使用しています。（`lampman` コンテナの中で実行されるのでインストールは不要です）

以下、設定例ですが、`https`, `db` は自由に決めていただいてOKなグループ名です。
その中に監視したいファイル名と設定オプションがありますが、設定オプションは [MultiTailのドキュメント](https://www.vanheusden.com/multitail/examples.php) をご参考ください。
以下ですと、 `-cS` でフォーマット定義、 `-ci` でANSIカラーの指定をしています。

`config.js` 設定例：
```
...
    logs: {
        https: [
            ['/var/log/httpd/ssl_request_log', ['-cS', 'apache']],
            ['/var/log/httpd/ssl_error_log', ['-cS', 'apache_errors']],
        ],
        db: [
            ['/var/log/mysql/query.log', ['-ci', 'green']],
        ],
    },
...
```

オプション無しの場合、一番最初のグループのみ監視します。

### `lamp logs -a`<br>`lamp logs --all`
全てのグループを画面を割って表示します

### `lamp logs -s`<br>`lamp logs --select`
複数グループを定義している場合に選択肢が出るので、表示するグループを１つ選択してそれを表示します。

### MultiTailの簡単な操作説明

- ヘルプ: `h` or `F1`
- 履歴: `b` ※上下でスクロールする
- キーワード検索: `/`
- ログマーカーを付ける: `Enter`
- ウィンドウを抜ける, 終了: `q`

### 別のコンテナ内のログファイルも一緒に眺めたい場合

Lampmanで設定できるMySQLでは、クエリログを有効に設定すると `lampman` コンテナに `/bar/log/(mysql設定名)` にmysqlコンテナのログディレクトリが自動でマウントされるようになりますが、これ以外で `lampman` 本体以外のコンテナの中のファイルを `lamp logs` で眺める方法を Lampman 側では特に方法を用意していません。  
ですが、 `docker-compose.override.yml` に設定を追記して、`lampman` コンテナに該当のコンテナのディレクトリをマウントすることで比較的カンタンに対応できます。以下例です。

`docker-compose.override.yml` 設定例：
```
version: '2.2'
services:
  lampman:
    volumes_from:
      - centos
  centos:
    volumes:
      - 'centos_log:/centos_log'
volumes:
  centos_log:
    driver: local
    name: lampman-xxx-centos_log
```

これで `centos` コンテナ内の `/centos_log` ディレクトリが `lampman` コンテナにマウントされアクセスできるようになったので、設定に追記して完了です。

`config.js` 設定例：
```
...
    // project name
    project: 'lampman-xxx',
...
    logs: {
        https: [
            ['/var/log/httpd/ssl_request_log', ['-cS', 'apache']],
            ['/var/log/httpd/ssl_error_log', ['-cS', 'apache_errors']],
        ],
        centos: [
            ['/centos_log/error.log', ['-ci', 'red']],
        ],
    },
...
```

※ 上記の場合、`centos` コンテナで `/centos_log` を用意しておく必要はあります。（大抵はシンボリックリンクになると思いますが）
