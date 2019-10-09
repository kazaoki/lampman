
Lampman - LAMP構成のためのDockerコンテナビルダ
==================================================

**準備中！**
---------------------
**そろそろ `ver 1.0.0` いけそうです！**
<br><br><br><br><br><br><br><br><br><br><br><br><br>


ランプマン？
-----------
よくあるレンタルサーバの構成（**L**inux, **A**pache, **M**ySQL, **P**HP|**P**erl）をLAMP（ランプ）構成などと呼んだりしますが、これをサクッと自分の作業環境に構築するコマンドです。

一番シンプルな使い方
-----------

1. まず、プロジェクトディレクトリに移動して以下のコマンドを打ちます。※プロジェクトごと初回のみ

    ``` shell
    lamp init
    ```
    これによりプロジェクトディレクトリに `.lampman/` という設定用のディレクトリが作成されます。

2. 次に以下のコマンドを打つとサーバコンテナ達が起動します。

    ``` shell
    lamp up
    ```

3. 初期設定ではプロジェクトディレクトリの `public_html/` が公開ディレクトリとなっています。ブラウザーで [http://localhost](http://localhost) にアクセスして開発を開始してください。（Toolbox 環境の方は [http://192.168.99.100](http://192.168.99.100) など）

4.  開発が終わったらそのまま放っておいてもいいですが、以下のコマンドで起動させたサーバコンテナ達を削除することができます。

    ``` shell
    lamp down
    ```

**以上です。**

<br><br><br>



もう少し詳しく
-------

さて、これだけでは[PHPのビルトインウェブサーバ](https://www.php.net/manual/ja/features.commandline.webserver.php)と変わらないですね。

「`/public_html` じゃない」「PHPのバージョン変えたい」「MySQLどーやんの」「他の docker サービス使いたい」「VPSで本番したい」ということですよね、はい、全部できます。
基本的には設定ディレクトリ `.lampman/` の中でごにょごにょすることで、ご希望のサーバ環境が比較的かんたんに用意できます。

全体的な仕組みはこうです。

  1. `.lampman/config.js` に設定を書く
  2. `lamp` コマンド実行すると `.lampman/config.js` を元に `.lampman/docker-compose.yml` が生成/更新される
  3. `lamp up` でコンテナ起動する際は `.lampman/` を起点に内部で `docker-compose up -d` してるだけなので、設定上書き用のymlファイル `.lampman/docker-compose.override.yml` があればそれも読み込まれて起動する

そのため `.lampman/config.js` をいじるだけでは実現できないサーバ設定は、 `.lampman/docker-compose.override.yml` に追加コンテナやサーバの設定ファイル等をマウントする設定を書くなり、独自のDockerイメージを用意するなりすれば、理論的にはほぼご希望どおりのサーバ環境が用意できるでしょう。

以下、なが～いドキュメントです。ドキュメント各種へのアンカーリンク出しておきます。


- [動作要件](#動作要件)
- [インストール](#インストール)
- コマンド詳説
  - [lamp init](#lamp-init%e8%a8%ad%e5%ae%9a%e3%83%87%e3%82%a3%e3%83%ac%e3%82%af%e3%83%88%e3%83%aa%e5%88%9d%e6%9c%9f%e5%8c%96)
  - [-h, --help](#h---help%e3%83%98%e3%83%ab%e3%83%97%e8%a1%a8%e7%a4%ba)
  - [-m, --mode](#m-%e3%83%a2%e3%83%bc%e3%83%89%e5%90%8d---mode-%e3%83%a2%e3%83%bc%e3%83%89%e5%90%8d%e5%ae%9f%e8%a1%8c%e3%83%a2%e3%83%bc%e3%83%89%e3%82%92%e6%8c%87%e5%ae%9a)
    - [他の方法で実行モードを指定する](#他の方法で実行モードを指定する)
    - [ホストOS側の環境変数について](#ホストOS側の環境変数について)
  - [lamp up](#lamp-up%e3%82%b3%e3%83%b3%e3%83%86%e3%83%8a%e8%b5%b7%e5%8b%95)
  - [lamp down](#lamp-down%e3%82%b3%e3%83%b3%e3%83%86%e3%83%8a%e7%b5%82%e4%ba%86)
  - [lamp config](#lamp-config%e8%a8%ad%e5%ae%9a%e3%83%95%e3%82%a1%e3%82%a4%e3%83%ab%e3%82%92%e9%96%8b%e3%81%8f)
  - [lamp logs](#lamp-logs%e3%83%ad%e3%82%b0%e3%83%95%e3%82%a1%e3%82%a4%e3%83%ab%e3%82%92%e7%9c%ba%e3%82%81%e3%82%8b)
  - [lamp login](#lamp-login%e6%8c%87%e5%ae%9a%e3%81%ae%e3%82%b3%e3%83%b3%e3%83%86%e3%83%8a%e3%81%ab%e5%85%a5%e3%82%8b)
  - [lamp mysql](#lamp-mysqlmysql%e6%93%8d%e4%bd%9c%e3%82%92%e3%81%99%e3%82%8b)
  - [lamp psql](#lamp-psqlpostgresql%e6%93%8d%e4%bd%9c%e3%82%92%e3%81%99%e3%82%8b)
  - [lamp reject](#lamp-reject%e3%82%b3%e3%83%b3%e3%83%86%e3%83%8a%e3%83%9c%e3%83%aa%e3%83%a5%e3%83%bc%e3%83%a0%e3%82%92%e3%83%aa%e3%82%b9%e3%83%88%e3%81%8b%e3%82%89%e9%81%b8%e6%8a%9e%e3%81%97%e3%81%a6%e5%89%8a%e9%99%a4)
  - [lamp rmi](#lamp-rmi%e3%82%a4%e3%83%a1%e3%83%bc%e3%82%b8%e3%82%92%e3%83%aa%e3%82%b9%e3%83%88%e3%81%8b%e3%82%89%e9%81%b8%e6%8a%9e%e3%81%97%e3%81%a6%e5%89%8a%e9%99%a4)
  - [lamp sweep](#lamp-sweep%e5%85%a8%e3%81%a6%e3%81%ae%e3%82%b3%e3%83%b3%e3%83%86%e3%83%8a%e6%9c%aa%e3%83%ad%e3%83%83%e3%82%af%e3%83%9c%e3%83%aa%e3%83%a5%e3%83%bc%e3%83%a0ltnonegt%e3%82%a4%e3%83%a1%e3%83%bc%e3%82%b8%e4%b8%8d%e8%a6%81%e3%83%8d%e3%83%83%e3%83%88%e3%83%af%e3%83%bc%e3%82%af%e3%82%92%e4%b8%80%e6%8e%83%e3%81%99%e3%82%8b%e3%81%a4%e3%82%88%e3%81%84)
  - [lamp yamlout](#lamp-ymlout%e8%a8%ad%e5%ae%9a%e6%83%85%e5%a0%b1%e3%82%92yaml%e5%bd%a2%e5%bc%8f%e3%81%a7%e6%a8%99%e6%ba%96%e5%87%ba%e5%8a%9b%e3%81%ab%e5%87%ba%e5%8a%9b%e3%81%99%e3%82%8b)
  - [lamp web](#lamp-web%e7%8f%be%e5%9c%a8%e3%81%ae%e3%83%91%e3%82%b9%e3%81%a7%e3%83%93%e3%83%ab%e3%83%88%e3%82%a4%e3%83%b3php%e3%82%a6%e3%82%a7%e3%83%96%e3%82%b5%e3%83%bc%e3%83%90%e3%82%92%e4%b8%80%e6%99%82%e7%9a%84%e3%81%ab%e8%b5%b7%e5%8b%95%e3%81%99%e3%82%8b)
  - [lamp version](#lamp-versionlampman%e3%81%ae%e3%82%b3%e3%83%9e%e3%83%b3%e3%83%89%e3%83%90%e3%83%bc%e3%82%b8%e3%83%a7%e3%83%b3%e3%82%92%e8%a1%a8%e7%a4%ba%e3%81%99%e3%82%8b)
  - [lamp (extraコマンド)](#lamp-extra%e3%82%b3%e3%83%9e%e3%83%b3%e3%83%89%e8%a8%ad%e5%ae%9a%e3%81%97%e3%81%9f%e7%8b%ac%e8%87%aa%e3%81%ae%e3%82%b3%e3%83%9e%e3%83%b3%e3%83%89%e3%82%92%e5%ae%9f%e8%a1%8c%e3%81%99%e3%82%8b)
- 設定ファイル詳説
  - [General settings：基本設定](#configjs--general-settings-%e5%9f%ba%e6%9c%ac%e8%a8%ad%e5%ae%9a)
  - [Lampman base container settings：Lampmanベースコンテナ設定](#configjs--lampman-base-container-settings-lampman%e3%83%99%e3%83%bc%e3%82%b9%e3%82%b3%e3%83%b3%e3%83%86%e3%83%8a%e8%a8%ad%e5%ae%9a)
  - [MySQL container(s) settings：MySQLコンテナ設定](#configjs--mysql-containers-settings-mysql%e3%82%b3%e3%83%b3%e3%83%86%e3%83%8a%e8%a8%ad%e5%ae%9a)
  - [PostgreSQL container(s) settings：PostgreSQLコンテナ設定](#configjs--postgresql-containers-settings-postgresql%e3%82%b3%e3%83%b3%e3%83%86%e3%83%8a%e8%a8%ad%e5%ae%9a)
  - [Logs command settings：ログファイル設定](#configjs--logs-command-settings-%e3%83%ad%e3%82%b0%e3%83%95%e3%82%a1%e3%82%a4%e3%83%ab%e8%a8%ad%e5%ae%9a)
  - [Extra command settings：extraコマンド設定](#configjs--extra-command-settings-extra%e3%82%b3%e3%83%9e%e3%83%b3%e3%83%89%e8%a8%ad%e5%ae%9a)
  - [Add action on upped lampman：up時の自動実行設定](#configjs--add-action-on-upped-lampman-up%e6%99%82%e3%81%ae%e8%87%aa%e5%8b%95%e5%ae%9f%e8%a1%8c%e8%a8%ad%e5%ae%9a)
- 技術情報
  - [標準のLAMP仕様](#標準のLAMP仕様)
  - [標準で使用しているDockerイメージ](#標準で使用しているDockerイメージ)
  - [ディレクトリ構成サンプル](#ディレクトリ構成サンプル)
  - [本番用構成例](#本番用構成例)
  - [その他](#その他)
- その他
  - [必要なPHPバージョンが一覧にない場合](#必要なPHPバージョンが一覧にない場合)
  - [コンテナ実行前にサーバに手入れしたい](#コンテナ実行前にサーバに手入れしたい)


動作要件
-------

- [Docker](https://www.docker.com/)：なるべく最新版
  - Windows版 ... 😄
  - macOS版 ... 😄
  - Toolbox版 ... 😒
- [Node.js](https://nodejs.org/en/)：なるべく最新版
  - 12系で開発してます。10系で動くかは不明です・・。
- コマンドラインが打てる何か
  - おすすめ
    - [Visual Studio Code](https://azure.microsoft.com/ja-jp/products/visual-studio-code/)<small>（の中のコマンドパネル）</small>


ホストOS上にXamppとかPHPとかは不要です。必要なのは上記だけで、あとは各コンテナ内で対応します。



インストール
-----------

``` shell
npm i lampman -g
```

これでどこでも `lamp` コマンドが打てるようになります。４文字打つのが面倒なときは `lm` でもOKなようにしておきました。




`lamp init`：設定ディレクトリ初期化
--------------------------------

カレントディレクトリに `.lampman/` 設定ディレクトリが生成されます。

#### `lamp init -s`<br>`lamp init --setup`

追加のインストールオプションが表示されますので、ご希望があれば選択してください。

``` shell
? セットアップしたい内容を選択してください。（スペースキーで複数選択可） »  
(*)  Lampman設定 - (proj)/.lampman/config.js
( )  MySQL設定
( )  PostgreSQL設定
( )  .envサンプル設定
( )  VSCode用XDebug設定
```

`-h`, `--help`：ヘルプ表示
------------------------


`lamp init -h` などとすればそのコマンド機能のヘルプが出ます。  
`lamp -h` で全体のコマンド一覧が確認できます。




`-m <モード名>`, `--mode <モード名>`：実行モードを指定
-------------------------------------------------

実行モードの切り替えが可能で、すべてのコマンドに追加できるオプションです。

実行モードを指定した場合、対象の設定ディレクトリとコンテナ内の環境変数が変わります。これにより開発用と本番用と分けて管理したりできます。
尚、未指定の場合の実行モードは `default` となります。

| モード指定コマンド例         | 対象設定ディレクトリ | コンテナ内環境変数 `LAMPMAN_MODE` |
| ---------------------------- | -------------------- | --------------------------------- |
| `lamp (コマンド)`            | .lampman/            | default                           |
| `lamp (コマンド) -m test`    | .lampman-test/       | test                              |
| `lamp (コマンド) -m product` | .lampman-product/    | product                           |
| `lamp (コマンド) -m xxxxxx`  | .lampman-xxxxxx/     | xxxxxx                            |

例えば本番用の設定を新たに作りたい場合、以下のようにすると `.lampman-product/` ディレクトリが作成されます。

``` shell
lamp init -m product
```

#### 他の方法で実行モードを指定する

コマンドに `-m` `--mode` を記述しなくても実行モードを指定する方法が２つあります。

1. ホストOS上の環境変数 `LAMPMAN_MODE` に実行モードの文字列を設定しておく

    例えば `.bashrc` に以下のように記述しておきます。
    ``` shell
    export LAMPMAN_MODE=product
    ```
    ただし、こういった運用の場合、cron実行など `.bashrc` を読み込まずに実行するケースもあるので十分ご注意ください。

2. プロジェクトディレクトリに `.env` ファイルを用意しておく

    例えば以下のように記述しておきます。
    ``` shell
    LAMPMAN_MODE=product
    ```

    こうしておくことで、 `lamp` コマンドが `.env` を自動的に読み込んで環境変数を定義するため、実行モードが指定できます。

#### ホストOS側の環境変数について

ちなみに、ホストOS上の環境変数は設定ファイル中で参照できます。例えば環境変数 `LAMPMAN_MODE` なら、

- `.lampman/config.js` の中で `process.env.LAMPMAN_MODE`
- `.lampman/docker-compose.override.yml` の中で `"${LAMPMAN_MODE}"`

のように書くことで参照できるので、パスワードや環境による違いなどgit対象にしたくない情報は環境変数に逃がすと良いでしょう。（そのため `.env` はgitのコミット対象にすべきではありません）




`lamp up`：コンテナ起動
---------------------

`lamp down`：コンテナ終了
-----------------------

`lamp config`：設定ファイルを開く
------------------------------

`lamp logs`：ログファイルを眺める
------------------------------

`lamp login`：指定のコンテナに入る
------------------------------

`lamp mysql`：MySQL操作をする
---------------------------

`lamp psql`：PostgreSQL操作をする
-------------------------------

`lamp reject`：コンテナ/ボリュームをリストから選択して削除
----------------------------------------------------

`lamp rmi`：イメージをリストから選択して削除
---------------------------------------

`lamp sweep`：全てのコンテナ/未ロックボリューム/&lt;none&gt;イメージ/不要ネットワークを一掃する（つよい
--------------------------------------------------------------------------------------------

`lamp ymlout`：設定情報をYAML形式で標準出力に出力する
------------------------------------------------

`lamp web`：現在のパスでビルトインPHPウェブサーバを一時的に起動する
-----------------------------------------------------------

`lamp version`：Lampmanのコマンドバージョンを表示する
------------------------------------------------

`lamp (extraコマンド)`：設定した独自のコマンドを実行する
--------------------------------------------------




`config.js / General settings` ：基本設定
---------------------------------------
``` js
    /**
     * ---------------------------------------------------------------
     * General settings
     * ---------------------------------------------------------------
     */

    // project name
    project: 'lampman-test',

    // docker-compose file version
    // * docker-compose.override.ymlがあればそのversionと合わせる必要あり
    version: '2.2',

    // network
    network: {
        name: 'default', // ネットワークを作成する場合。自動で頭にプロジェクト名が付く
        // external: 'lampman_default', // 既存ネットワークを指定する場合は実際の名前（頭にプロジェクト名が付いた状態）のものを指定
    },
```
### `project:`
空白なしの半角英数字などでプロジェクト名を指定してください。Dockerコンテナ名の接頭辞等に使用されます。

### `version:`
composeファイルのバージョンを指定してください。基本的には `2.2` 固定でお願いします。それ以外を指定した場合、正常に機能しない場合があります。

### `network:`
ネットワーク設定を書きます。不要であればコメントアウトしてください。  
他のcomposeプロジェクトやコンテナへ向けてネットワークを共有したい場合は `name:` を設定することで新たなネットワークが作成されます。  
逆に、他のcomposeプロジェクトやコンテナで作成された既存のネットワークへ接続したい合は `external:` に実際のネットワーク名を設定することで接続されます。




`config.js / Lampman base container settings` ：Lampmanベースコンテナ設定
----------------------------------------------------------------------

``` js
    /**
     * ---------------------------------------------------------------
     * Lampman base container settings
     * ---------------------------------------------------------------
     */
    lampman: {
        image: 'kazaoki/lampman',
        login_path: '/var/www/html',

        // Apache
        apache: {
            start: true,
            ports: [
                '80:80',
                '443:443'
            ],
            mounts: [ // 公開ディレクトリに /var/www/html を割り当ててください。
                '../public_html:/var/www/html',
                // '../public_html:/home/user_a/public_html',
            ],
        },

        // PHP
        php: {
            image: 'kazaoki/phpenv:7.2.5', // ここにあるバージョンから → https://hub.docker.com/r/kazaoki/phpenv/tags
            // ↑ image 未指定なら標準のPHP使用
            error_report: __IS_DEFAULT__,
            xdebug_start: __IS_DEFAULT__,
            xdebug_host: '192.168.0.10',
            xdebug_port: 9000,
        },

        // maildev
        maildev: {
            start: __IS_DEFAULT__,
            ports: ['9981:1080'],
        },

        // postfix
        postfix: {
            start: __IS_DEFAULT__,
            // ports: [],
        },

        // sshd
        sshd: {
            start: true,
            ports: ['2222:22'],
            user: 'sshuser',
            pass: '123456', // or process.env.LAMPMAN_SSHD_PASS
            path: '/var/www/html',
        },
    },
```
<small>※`__IS_DEFAULT__` は実行モード未指定の際に `true` となる定数です。</small>

### `image:`
Lampmanコンテナで使用するDockerイメージです。基本的に `kazaoki/lampman` を指定します。
もし、ご自分でカスタムイメージを作成する場合は `kazaoki/lampman` をベースに構築されるといいかもです。

### `login_path:`
`lamp login` でコンテナにログインする初期パスです.

### `apache:`
[Apache](https://httpd.apache.org/) の設定です。
- `start:`        ... `true` で Apache を開始する
- `ports:`        ... 公開するポートを指定 -> `(ホストOS側ポート)`:`80`, `(ホストOS側ポート)`:`443`
- `mounts:`       ... マウントするディレクトリやファイルを指定 -> `(ホストOS側パス)`:`(コンテナ側パス)`

### `php:`
[PHP](https://www.php.net/) の設定です。
- `image:`        ... バージョンごとのPHPイメージを指定（[バージョン一覧](https://hub.docker.com/r/kazaoki/phpenv/tags)） ※未指定の場合、lampmanコンテナ側の古めのPHPが使われるので注意。
- `error_report:` ... `true` の場合、 `php.ini` の `display_errors` を `on` にする
- `xdebug_start:` ... Xdebug を開始する
- `xdebug_host:`  ... Xdebug から接続するホストOS側のIP
- `xdebug_port:`  ... Xdebug から接続するホストOS側のポート番号

### `maildev:`
[MailDev](https://github.com/djfarrelly/MailDev) の設定です。
- `start:`        ... `true` で MailDev を開始する
- `ports:`        ... 公開するポートを指定 -> `(ホストOS側ポート)`:`1080`

### `postfix:`
[Postfix](http://www.postfix.org) の設定です。
- `start:`        ... `true` で Postfix を開始する
- `ports:`        ... 公開するポートを指定 -> `(ホストOS側ポート)`:`(コンテナ側ポート)`

### `sshd:`
[OpenSSH](https://www.openssh.com/) の設定です。
- `start:`        ... `true` で OpenSSH を開始する
- `ports:`        ... 公開するポートを指定 -> `(ホストOS側ポート)`:`22`
- `user:`         ... SSHログインユーザー名を指定
- `pass:`         ... SSHログインパスワードを指定　※ `.env` に書いて `process.env.LAMPMAN_SSHD_PASS` 等で参照しても可
- `path:`         ... ログイン先のフルパスを指定




`config.js / MySQL container(s) settings` ：MySQLコンテナ設定
-----------------------------------------------------------

``` js
    /**
     * ---------------------------------------------------------------
     * MySQL container(s) settings
     * ---------------------------------------------------------------
     */
    mysql: {
        image:          'mysql:5.7',
        ports:          ['3306:3306'],
        database:       'test',
        user:           'test',
        password:       'test', // same root password
        charset:        'utf8mb4',
        collation:      'utf8mb4_unicode_ci',
        hosts:          ['main.db'],
        volume_locked:  false,
        query_log:      true,
        query_cache:    true,
        dump: {
            rotations:  3,
            filename:   'dump.sql',
        }
    },
```

- `image:`          ... Dockerイメージを指定（おすすめ：[DockerHubの公式MySQLイメージ](https://hub.docker.com/_/mysql)）
- `ports:`          ... 公開するポートを指定 -> `(ホストOS側ポート)`:`3306`
- `database:`       ... DB名を指定
- `user:`           ... ユーザー名を指定
- `password:`       ... パスワードを指定 ※rootパスワードもこれになる
- `charset:`        ... 文字コードセットを指定（`utf8`, `utf8mb4` など）
- `collation:`      ... コレーションを指定（`utf8mb4_unicode_ci`, `utf8mb4_general_ci` など）
- `hosts:`          ... コンテナ達の間でのみ参照できるホスト/ドメインを自由につけられる。
- `volume_locked:`  ... 作られるボリューム名の頭に `locked_` が付き、lampコマンドでは `lamp reject -f` でしか削除できなくなる
- `query_log:`      ... `true` でクエリログを出力、lampmanコンテナから参照できるようになる
- `query_cache:`    ... `true` でSQL結果を一時的にキャッシュするようになる。ただし、MySQL8からは無効。
- `dump.rotations:` ... `lamp mysql -d` でダンプファイルを作成する際の最大バックアップ数
- `dump.filename:`  ... ダンプファイル名を指定


尚、 `mysql_2` など、「mysql～」から始まる名称で設定を複製することで、複数のmysqlコンテナを立ち上げることができます。この場合、設定ディレクトリも同様に `.lampman/mysql_2/` に複製してください。

#### 複数設定例

``` js
    mysql57: {
        image: 'mysql:5.7',
        ...
    },
    mysql56: {
        image: 'mysql:5.6',
        ...
    },
    mysql8: {
        image: 'mysql:8.0.17',
        ...
    },
```




`config.js / PostgreSQL container(s) settings` ：PostgreSQLコンテナ設定
---------------------------------------------------------------------

``` js
    /**
     * ---------------------------------------------------------------
     * PostgreSQL container(s) settings
     * ---------------------------------------------------------------
     */
    postgresql: {
        image:         'postgres:9',
        ports:         ['5432:5432'],
        database:      'test',
        user:          'test',
        password:      'test', // same root password
        hosts:         ['sub.db'],
        volume_locked: true,
        dump: {
            rotations: 3,
            filename:  'dump.sql',
        }
    },
```

- `image:`          ... Dockerイメージを指定（おすすめ：[DockerHubの公式PostgreSQLイメージ](https://hub.docker.com/_/postgres)）
- `ports:`          ... 公開するポートを指定 -> `(ホストOS側ポート)`:`5432`
- `database:`       ... DB名を指定
- `user:`           ... ユーザー名を指定
- `password:`       ... パスワードを指定 ※rootパスワードもこれになる
- `hosts:`          ... コンテナ達の間でのみ参照できるホスト/ドメインを自由につけられる。
- `volume_locked:`  ... 作られるボリューム名の頭に `locked_` が付き、lampコマンドでは `lamp reject -f` でしか削除できなくなる
- `dump.rotations:` ... `lamp mysql -d` でダンプファイルを作成する際の最大バックアップ数
- `dump.filename:`  ... ダンプファイル名を指定


尚、 `postgresql_2` など、「postgresql～」から始まる名称で設定を複製することで、複数のpostgresqlコンテナを立ち上げることができます。この場合、設定ディレクトリも同様に `.lampman/postgresql_2/` に複製してください。

#### 複数設定例

``` js
    postgresql9: {
        image: 'postgres:9',
        ...
    },
    postgresql10: {
        image: 'postgres:10',
        ...
    },
    postgresql11: {
        image: 'postgres:11',
        ...
    },
    postgresql_pre: {
        image: 'postgres:12.0-alpine',
        ...
    },
```




`config.js / Logs command settings` ：ログファイル設定
---------------------------------------------------
``` js
    /**
     * ---------------------------------------------------------------
     * Logs command settings
     * ---------------------------------------------------------------
     */
    logs: {
        http: [
            ['/var/log/httpd/access_log', ['-cS', 'apache']],
            ['/var/log/httpd/error_log', ['-cS', 'apache_errors']],
        ],
        https: [
            ['/var/log/httpd/ssl_request_log', ['-cS', 'apache']],
            ['/var/log/httpd/ssl_error_log', ['-cS', 'apache_errors']],
        ],
        db: [
            ['/var/log/mysql/query.log', ['-ci', 'green']],
            // ['/var/log/mysql_2/query.log', ['-ci', 'blue']],
        ],
    },
```

__ここから__






`config.js / Extra command settings` ：extraコマンド設定
------------------------------------------------------


`config.js / Add action on upped lampman` ：up時の自動実行設定
---------------------------------------------------------------



標準のLAMP仕様
---------------------------------------------------------------


| Services/Apps                               | Status      | External ports | Version                                                    | Memo                                                        |
| ------------------------------------------- | ----------- | -------------- | ---------------------------------------------------------- | ----------------------------------------------------------- |
| Linux                                       | **Enabled** |                | CentOS 7.6                                                 |                                                             |
| Apache                                      | **Enabled** | 80, 443        |                                                            | `public_html/` is published                                 |
| MySQL                                       | disabled    | 3306           | [MySQL 5.6](https://hub.docker.com/_/mysql)                | with [Xdebug](https://xdebug.org/)                          |
| PostgreSQL                                  | disabled    | 5432           | [PostgreSQL 9.4](https://hub.docker.com/_/postgres)        |                                                             |
| PHP                                         | **Enabled** |                | [PHP 5.4.16](https://hub.docker.com/r/kazaoki/phpenv/tags) |                                                             |
| Perl/CGI                                    | disabled    |                | perl 5.16.3                                                |                                                             |
| [MailDev](https://danfarrelly.nyc/MailDev/) | **Enabled** | 9981           | MailDev 1.1.0                                              |                                                             |
| [Postfix](https://danfarrelly.nyc/MailDev/) | **Enabled** |                | Postfix 2.10                                               | All mail passing through Postfix is ​​relayed to `MailDev`. |

*You can easily specify PHP, MySQL, and PostgreSQL versions in the `.lampman/config.js`.  
*The actual version may be different.



標準で使用しているDockerイメージ
---------------------------------------------------------------

Internally, the container is started using docker-compose.  
Basically, the following image is used, but this can be changed to a self-made image etc. in the `config.js`.


| Images                                                                                              | Description                                                    |
| --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Docker Hub: `kazaoki/lampman`（未リンク）                                                           | LAMP base image: Linux, Apache, Postfix, MailDev               |
| [Docker Hub: `kazaoki/phpenv`](https://cloud.docker.com/u/kazaoki/repository/docker/kazaoki/phpenv) | This is a version-specific PHP container compiled with phpenv. |
| [Docker Hub: `mysql`](https://hub.docker.com/_/mysql)                                               | MySQL official image                                           |
| [Docker Hub: `postgres`](https://hub.docker.com/_/postgres)                                         | PostgreSQL official image                                      |




- 基本的に使用するDockerイメージは [Docker Hub](https://hub.docker.com/) で公開しているものを自動的にpullしてくるので、イメージビルドの必要はありません。（もちろんご自分で作ったDockerイメージを使用することも可能です）


ディレクトリ構成サンプル
---------------------------------------------------------------


<pre style="line-height:1.3">
    (project-dir)/
        │
        │  <i style="color:#888">// Version control, Task runner, etc.</i>
        ├─ .git/
        ├─ gulp.js
        ├─ package.json
        ├─ ...
        │
        │  <i style="color:#888">// Publish web root. (mount to /var/www/html)</i>
        ├─ pulic_html/
        │   ├─ index.php
        │   └─ ...
        │
        │  <i style="color:#888">// Lampman settings</i>
        └─ .lampman/
            ├─ lampman/
            │    ├─ before-starts.sh
            │    └─ entrypoint.sh
            ├─ mysql/
            │    ├─ before-entrypoint.sh
            │    └─ main.sql
            ├─ postgresql/
            │    ├─ before-entrypoint.sh
            │    └─ sub.sql
            ├─ config.js
            ├─ docker-compose.override.yml
            ├─ docker-compose.yml
            └─ README.md
</pre>



本番用構成例
---------------------------------------------------------------

- 機能制限
- セキュアdocker
- ログfluent


その他
---------------------------------------------------------------

### 必要なPHPバージョンが一覧にない場合
Lampman で設定できるPHPバージョン一覧  
https://hub.docker.com/r/kazaoki/phpenv/tags

対応バージョンは気まぐれに増えるので、しばらく待つか、[こちらからIssue投げていただければ](https://github.com/kazaoki/anyenv-bins/issues)気づいたときに対応します。
ただし、古いバージョン（5.3以下）はちゃんとコンパイルできない可能性が高いので、期待しないほうがいいかも・・。

### コンテナ実行時にサーバに手入れしたい
- `.lamman/lampman/entry-add.sh`

上記のファイルがあると思いますが、これはメインの `lampman` コンテナが起動した際に、各種サーバサービスが立ち上がる前に実行されるシェルスクリプトのファイルになります。初期ではこの中身は全てコメントアウトされており、何も実行しないファイルになっていますので、こちらをいじって直接サーバの中身を書き換えるなどが可能です。

また、初期では存在しませんが、 `mysql` や `postgresql` コンテナも同様ですので、以下のシェルスクリプトを新規で用意するだけでメインの `entrypoint.sh` が実行される前の処理を書くことができます。

- `.lamman/mysql/entry-add.sh`
- `.lamman/postgresql/entry-add.sh`


