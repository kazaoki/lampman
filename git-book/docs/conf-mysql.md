
# 設定ファイル詳説：MySQLコンテナ設定

## config.js 設定例
<pre class="cmd">
...
    /**
     * ---------------------------------------------------------------
     * MySQLコンテナ設定
     * ---------------------------------------------------------------
     */
    mysql: {
        image:          'mysql:5.7',
        ports:          ['3306:3306'],
        database:       'db9999',
        user:           'hanakochan',
        password:       'XXXX', // same root password
        charset:        'utf8',
        collation:      'utf8_general_ci',
        hosts:          ['main.db'],
        volume_locked:  false,
        query_log:      true,
        query_cache:    false,
        dump: {
            rotations:  3,
            filename:   'dump.sql',
        }
    },
    mysql_old: {
        image:          'mysql:5.6',
        ports:          ['3307:3306'],
        database:       'db-002',
        user:           'tarou',
        password:       '123456789', // same root password
        charset:        'utf8mb4',
        collation:      'utf8mb4_general_ci',
        hosts:          ['old.db'],
        volume_locked:  true,
        query_log:      false,
        query_cache:    false,
        dump: {
            rotations:  1,
            filename:   'dump.sql.gz',
        }
    },
...
</pre>

## `mysql～:`

上記例では `mysql` と `mysql_old` の２つが設定されており、Lampman 起動時に２つのMySQLコンテナが立ち上がります。
MySQLを複数設定したい場合は、このように `mysql～` から始まるキー名で複数定義しておくことで、それぞれ別の設定でMySQLコンテナが立ち上がります。

- **image:**  
  使用するMySQLイメージを指定します。  
  [Docker Hub](https://hub.docker.com/) に上がっている[公式イメージ](https://hub.docker.com/_/mysql)でもローカルでビルドした自作のものでもOKです。  
  例：
  ```
  image: 'mysql:5.7',
  ```

- **ports:**  
  mysqlに接続ポート指定をDocker 形式の文字列で指定できます。コンテナ側では `3306` ポートで起動しているので、`:`の左側にホスト側で受けたいポート番号を指定してください。  
  例：
  ```
  port: ['3306:3306'],
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
  または、設定ファイルに直接パスワードを書きたくない場合は、 `.env` ファイルや環境変数 `LAMPMAN_MYSQL_PASSWORD` 等にセットしておき以下のようにすることも可能です。  
  例：
  ```
  password: process.env.LAMPMAN_MYSQL_PASSWORD,
  ```

- **charset:**  
  キャラセットを指定します。  
  例：
  ```
  charset: 'utf8mb4',
  ```

- **collation:**  
  コレーションを指定します。  
  例：
  ```
  collation: 'utf8mb4_general_ci',
  ```

- **hosts:**  
  `lampman` から接続する際のホスト名を指定できます。実際のMySQLサーバの接続先URLを指定することで、本番と同様の設定のまま接続できるようになる便利機能です。  
  例：
  ```
  hosts: [
      'main.db',
      'db-server.hogehoge.com'
  ],
  ```
  上記の例では、 `lampman` コンテナからMySQL接続先に `main.db` または `dbserver.hogehoge.com` を指定することで Lampman で作成された mysql コンテナに接続できるようになります。  
  （内部では hosts ファイルを書き換えて指定ホストをコンテナのIPに書き換えています）  
  ただし、 `localhost` は指定できません。

- **volume_locked:**  
  **Lampman で管理する上で**ボリュームを削除されにくくすることができます。  
  Lampman のコマンドには `lamp up -f` や `lamp sweep` や `lamp reject` など、ボリュームを簡単に消してしまう強力なコマンドが多々あります。うっかり削除されては困るボリュームをロックすることで `lamp reject --locked` でしか削除できないようになります。（ボリューム名の頭に `locked_` が付きます）  
  `true` ... ボリュームをロックします。  
  `false` ... ボリュームをロックしません。  
  ※ただし、あくまで Lampman 側がそう認識するだけで、Docker 側では無関係に削除できてしまうので注意してください。  

- **query_log:**  
  有効にするとMySQLのクエリログを `lampman` コンテナの `/var/log/(設定キー名)/query.log` に出力するようになります。  
  `true` ... クエリログを出力します。  
  `false` ... クエリログを出力しません。  

- **query_cache:**  
  MySQLのクエリキャッシュ機能を有効にできます。ただし、MySQL8からはこの機能は無くなったようですので有効にしないでください。  
  `true` ... クエリキャッシュを有効にします。
  `false` ... クエリキャッシュを有効にします。

- **dump:**  
  ダンプファイルについての設定です。
    + **rotations:**  
      ローテーション数を指定できます。例えば 3 とすると `dump.sql.1`, `dump.sql.2`, `dump.sql.3` までダンプファイルのバックアップがローテーションされて残ります。  
      例：
      ```
      rotations: 3,
      ```

    + **filename:**  
      ダンプされるファイル名を指定できます。出力先のパスはここでは指定できず `.lampman/(設定キー名)/*.sql` となります。（出力パスを指定したい場合は `lamp mysql -d --dump-path=xxx` をご利用ください）  
      拡張子が `*.sql` であれば通常のSQLファイルとしてダンプされ、 `*.sql.gz` が指定されれば自動的に gunzip で圧縮されてダンプされます。  
      例：
      ```
      filename: 'dump.sql',
      ```
      ```
      filename: 'old-db.sql.gz',
      ```
      尚、このダンプファイルが存在している状態で `lamp mysql -r` または `lamp up` を行うとダンプファイルからDBにデータがまるっとリストアされます。  
      ※ただし、`lamp up` 実行時に既に該当ボリュームが存在している場合はリストアしません。`lamp up -f` するとDBも全てクリアされリストアされます。
