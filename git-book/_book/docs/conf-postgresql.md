
# 設定ファイル詳説：PostgreSQLコンテナ設定

## config.js 設定例
<pre class="cmd">
...
    postgresql: {
        image:         'postgres:9',
        ports:         ['5432:5432'],
        database:      'pgdb01',
        user:          'user_g',
        password:      '123456789', // same root password
        hosts:         ['sub.db'],
        volume_locked: false,
        dump: {
            rotations: 3,
            filename:  'dump.sql',
        }
    },
    postgresql_v8: {
        image:         'postgres:8',
        ports:         ['5433:5432'],
        database:      'old-pgdb',
        user:          'user_g',
        password:      '123456789', // same root password
        hosts:         [
            'v8.db',
            'old-db.xxx.com',
        ],
        volume_locked: true,
        dump: {
            rotations: 0,
            filename:  'dump.sql',
        }
    },
...
</pre>

## `postgresql～:`

上記例では `postgresql` と `postgresql_v8` の２つが設定されており、Lampman 起動時に２つのPostgreSQLコンテナが立ち上がります。
PostgreSQLを複数設定したい場合は、このように `postgresql～` から始まるキー名で複数定義しておくことで、それぞれ別の設定でPostgreSQLコンテナが立ち上がります。

- **image:**  
  使用するPostgreSQLイメージを指定します。  
  [Docker Hub](https://hub.docker.com/) に上がっている[公式イメージ](https://hub.docker.com/_/postgres)でもローカルでビルドした自作のものでもOKです。  
  例：
  ```
  image: 'postgres:9',
  ```

- **ports:**  
  postgresqlに接続ポート指定をdocker 形式の文字列で指定できます。コンテナ側では `5432` ポートで起動しているので、`:`の左側にホスト側で受けたいポート番号を指定してください。  
  例：
  ```
  port: ['5432:5432'],
  ```

- **database:**  
  作成するデータベース名を指定してください。  
  例：
  ```
  database: 'db001',
  ```

- **user:**  
  作成するユーザー名を指定してください。  
  例：
  ```
  user: 'user123',
  ```

- **password:**  
  接続パスワードを指定してください。  
  例：
  ```
  password: '123456',
  ```
  または、設定ファイルに直接パスワードを書きたくない場合は、 `.env` ファイルや環境変数 `LAMPMAN_POSTGRESQL_PASSWORD` 等にセットしておき以下のようにすることも可能です。  
  例：
  ```
  password: process.env.LAMPMAN_POSTGRESQL_PASSWORD,
  ```

- **hosts:**  
  `lampman` から接続する際のホスト名を指定できます。実際のPostgreSQLサーバの接続先URLを指定することで、本番と同様の設定のまま接続できるようになる便利機能です。  
  例：
  ```
  hosts: [
      'main.db',
      'db-server.hogehoge.com'
  ],
  ```
  上記の例では、 `lampman` コンテナからPostgreSQL接続先に `main.db` または `dbserver.hogehoge.com` を指定することで Lampman で作成された postgresql コンテナに接続できるようになります。  
  （内部では hosts ファイルを書き換えて指定ホストをコンテナのIPに書き換えています）

- **volume_locked:**  
  **Lampman で管理する上で**ボリュームを削除されにくくすることができます。  
  Lampman のコマンドには `lamp up -f` や `lamp sweep` や `lamp reject` など、ボリュームを簡単に消してしまう強力なコマンドが多々あります。うっかり削除されては困るボリュームをロックすることで `lamp reject --locked` でしか削除できないようになります。（ボリューム名の頭に `locked_` が付きます）  
  `true` ... ボリュームをロックします。  
  `false` ... ボリュームをロックしません。  
  ※ただし、あくまで Lampman 側がそう認識するだけで、Docker 側では無関係に削除できてしまうので注意してください。  

- **dump:**  
  ダンプファイルについての設定です。
    + **rotations:**  
      ローテーション数を指定できます。例えば 3 とすると `dump.sql.1`, `dump.sql.2`, `dump.sql.3` までダンプファイルのバックアップがローテーションされて残ります。  
      例：
      ```
      rotations: 3,
      ```

    + **filename:**  
      ダンプされるファイル名を指定できます。出力先のパスはここでは指定できず `.lampman/(設定キー名)/*.sql` となります。（出力パスを指定したい場合は `lamp psql -d --dump-path=xxx` をご利用ください）  
      拡張子が `*.sql` であれば通常のSQLファイルとしてダンプされ、 `*.sql.gz` が指定されれば自動的に gunzip で圧縮されてダンプされます。  
      例：
      ```
      filename: 'dump.sql',
      ```
      ```
      filename: 'old-db.sql.gz',
      ```
      尚、このダンプファイルが存在している状態で `lamp psql -r` または `lamp up` を行うとダンプファイルからDBにデータがまるっとリストアされます。  
      ※ただし、`lamp up` 実行時に既に該当ボリュームが存在している場合はリストアしません。`lamp up -f` するとDBも全てクリアされリストアされます。
