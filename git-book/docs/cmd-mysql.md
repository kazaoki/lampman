
# lamp mysql

## MySQL操作をする

### `lamp mysql [設定名]`

MySQLクライアントに接続します。
`設定名` が未指定の場合で複数のMySQL設定がある場合は選択肢が表示されますが、１つしか無い場合は省略可能です。

以下、設定ファイルの例を上げます。

```
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
        query_log:      false,
        query_cache:    false,
        dump: {
            rotations:  3,
            filename:   'dump.sql',
        }
    },
    mysql_sub: {
        image:          'mysql:5.6',
        ports:          ['3307:3306'],
        database:       'test',
        user:           'test',
        password:       'test', // same root password
        charset:        'utf8mb4',
        collation:      'utf8mb4_general_ci',
        hosts:          ['sub.db'],
        volume_locked:  false,
        query_log:      false,
        query_cache:    false,
        dump: {
            rotations:  5,
            filename:   'dump.sql.gz',
        }
    },
```

この場合、コマンドラインから

``` shell
$ lamp mysql mysql
```
``` shell
$ lamp mysql mysql_sub
```

と打てばそれぞれのMySQLクライアントに接続します。

※ちなみに複数のMySQL設定を定義する場合はかならず設定名を「mysql～」としてください。


### `lamp mysql -d`<br>`lamp mysql --dump`

指定のMySQLをダンプファイルにします。
この時、バックアップローテーション数やファイル名は設定ファイルで指定したものになります。
```
...
        dump: {
            rotations:  3,
            filename:   'dump.sql',
        }
...
```

標準の保存先は、 `.lampnan/(設定名)/(設定ダンプファイル名)` となります。
上記の設定例で言えば、

- mysql -> `.lampnan/mysql/dump.sql`
- mysql_sub -> `.lampnan/mysql_sub/dump.sql.gz`

となります。ちなみにダンプファイルの拡張子の最後を `.gz` にすれば自動的に圧縮されます。

### `lamp mysql -p <ファイルパス>`<br>`lamp mysql --file-path <ファイルパス>`

ダンプファイルの保存先を変更したい場合は、これで指定してください。

例）
``` shell
$ lamp mysql -d -p /mnt/backups/mysql mysql_sub
```


### `lamp mysql -n`<br>`lamp mysql --no-rotate`

ファイルローテーションしないでダンプします。※-d時のみ

例）
``` shell
$ lamp mysql -d --no-rotate
$ lamp mysql -d -n
$ lamp mysql -dn
※全て同じ意味です
```


### `lamp mysql -r`<br>`lamp mysql --restore`
最新のダンプファイルをリストアします。
ローテーションファイルは指定できません。

例）
``` shell
$ lamp mysql -r mysql_sub
```

尚、`lamp up` はダンプファイルのリストアも自動的に実行されます。
