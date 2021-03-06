###### 📚 DB操作コマンド

# MySQL操作をする：`lamp mysql`
----------------------------------------------------------------------

### `lamp mysql [設定名]`

MySQLクライアントに接続します。
`設定名` が未指定の場合で複数のMySQL設定がある場合は選択肢が表示されますが、１つしか無い場合は省略可能です。

以下、設定ファイルの例です。

<pre class="cmd">
    mysql: {
        image:          'mysql:5.7',
        ports:          ['3306:3306'],
        database:       'test',
        user:           'test',
        password:       'test', // same root password
        charset:        'utf8mb4',
        collation:      'utf8mb4_general_ci',
        hosts:          ['my-main.db'],
        volume_locked:  false,
        query_log:      false,
        query_cache:    false,
        dump: {
            rotations:  3,
            filename:   'dump.sql',
        }
    },
    mysql_sub: { <span class="comment">// 複数設定する場合「mysql_～」として定義</span>
        image:          'mysql:5.6',
        ports:          ['3307:3306'],
        database:       'test',
        user:           'test',
        password:       'test', // same root password
        charset:        'utf8mb4',
        collation:      'utf8mb4_general_ci',
        hosts:          ['my-sub.db'],
        volume_locked:  false,
        query_log:      false,
        query_cache:    false,
        dump: {
            rotations:  5,
            filename:   'dump.sql.gz',
        }
    },
</pre>

この場合、起動後、コマンドラインから

<pre class="cmd">
$ lamp mysql mysql
</pre>
<pre class="cmd">
$ lamp mysql mysql_sub
</pre>

と打てばそれぞれのMySQLクライアントに接続します。

※ちなみに複数のMySQL設定を定義する場合はかならず設定名を「mysql_～」としてください。


### `lamp mysql -d`<br>`lamp mysql --dump`

指定のMySQLデータをダンプファイルにします。
この時、バックアップローテーション数やファイル名は設定ファイルで指定したものになります。
<pre class="cmd">
...
        dump: {
            rotations:  3,
            filename:   'dump.sql',
        }
...
</pre>

標準の保存先は、 `.lampnan/(設定名)/(設定ダンプファイル名)` となります。
上記の設定例で言えば、

- mysql -> `.lampnan/mysql/dump.sql`
- mysql_sub -> `.lampnan/mysql_sub/dump.sql.gz`

となります。ちなみにダンプファイルの拡張子の最後を `.gz` にすれば自動的に圧縮されます。
`.gz` ファイルでもリストア可能ですので、容量が大きくなる場合は圧縮を利用するといいでしょう。

### `lamp mysql -p <ダンプパス>`<br>`lamp mysql --dump-path=<ダンプパス>`

ダンプファイルの保存先のディレクトリを一時的に変更したい場合は、これで指定してください。  
※保存ファイル名を指定するものではありません。

例）
<pre class="cmd">
$ lamp mysql -d -p /mnt/backups/mysql_sub/ mysql_sub
-> /mnt/backups/mysql_sub/dump.sql.gz
</pre>


### `lamp mysql -n`<br>`lamp mysql --no-rotate`

ファイルローテーションしないでダンプします。※ `-d` 時のみ

例）
<pre class="cmd">
$ lamp mysql -d --no-rotate
$ lamp mysql -d -n
$ lamp mysql -dn
※全て同じ意味です
</pre>


### `lamp mysql -r`<br>`lamp mysql --restore`
最新のダンプファイルをリストアします。
ローテーションファイルは指定できません。

例）
<pre class="cmd">
$ lamp mysql -r mysql_sub
</pre>

尚、`lamp up` した際などにmysqlコンテナが生成される時にダンプファイルのリストアが自動的に実行されます。
