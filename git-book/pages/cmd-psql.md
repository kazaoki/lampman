###### 📚 DB操作コマンド

# PostgreSQL操作をする：`lamp psql`
----------------------------------------------------------------------

### `lamp psql [設定名]`

psqlクライアントに接続します。
`設定名` が未指定の場合で複数のpsql設定がある場合は選択肢が表示されますが、１つしか無い場合は省略可能です。

以下、設定ファイルの例です。

<pre class="cmd">
    postgresql: {
        image:         'postgres:9',
        ports:         ['5432:5432'],
        database:      'test',
        user:          'test',
        password:      'test', // same root password
        hosts:         ['pg-main.db'],
        volume_locked: false,
        dump: {
            rotations: 3,
            filename:  'dump.sql',
        }
    },
    postgresql_2: { <span class="comment">// 複数設定する場合「postgresql_～」として定義</span>
        image:         'postgres:9',
        ports:         ['5433:5432'],
        database:      'test',
        user:          'test',
        password:      'test', // same root password
        hosts:         ['pg-sub.db'],
        volume_locked: true,
        dump: {
            rotations: 3,
            filename:  'dump.sql.gz',
        }
    },
</pre>

この場合、起動後、コマンドラインから

<pre class="cmd">
$ lamp psql postgresql
</pre>
<pre class="cmd">
$ lamp psql postgresql_2
</pre>

と打てばそれぞれのpsqlクライアントに接続します。

※ちなみに複数のpsql設定を定義する場合はかならず設定名を「postgresql_～」としてください。


### `lamp psql -d`<br>`lamp psql --dump`

指定のPostgreSQLデータをダンプファイルにします。
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

- postresql -> `.lampnan/postresql/dump.sql`
- postresql_2 -> `.lampnan/postresql_2/dump.sql.gz`

となります。ちなみにダンプファイルの拡張子の最後を `.gz` にすれば自動的に圧縮されます。
`.gz` ファイルでもリストア可能ですので、容量が大きくなる場合は圧縮を利用するといいでしょう。

### `lamp psql -p <ダンプパス>`<br>`lamp psql --dump-path=<ダンプパス>`

ダンプファイルの保存先のディレクトリを一時的に変更したい場合は、これで指定してください。  
※保存ファイル名を指定するものではありません。

例）
<pre class="cmd">
$ lamp psql -d -p /mnt/backups/postresql_2/ postresql_2
-> /mnt/backups/postresql_2/dump.sql.gz
</pre>


### `lamp psql -n`<br>`lamp psql --no-rotate`

ファイルローテーションしないでダンプします。※ `-d` 時のみ

例）
<pre class="cmd">
$ lamp psql -d --no-rotate
$ lamp psql -d -n
$ lamp psql -dn
※全て同じ意味です
</pre>


### `lamp psql -r`<br>`lamp psql --restore`
最新のダンプファイルをリストアします。
ローテーションファイルは指定できません。

例）
<pre class="cmd">
$ lamp psql -r postgresql_2
</pre>

尚、`lamp up` した際などにpostgresqlコンテナが生成される時にダンプファイルのリストアが自動的に実行されます。
