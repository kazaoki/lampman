
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





もう少し詳しく
-------

さて、これだけでは[PHPのビルトインウェブサーバ](https://www.php.net/manual/ja/features.commandline.webserver.php)と変わらないですね。

「`/public_html` じゃない」「PHPのバージョン変えたい」「MySQLどーやんの」「他の docker サービス使いたい」「VPSで本番したい」ということですよね、はい、全部できます。
基本的には設定ディレクトリ `.lampman/` の中でごにょごにょすることで、ご希望のサーバ環境が比較的かんたんに用意できます。

全体的な仕組みはこうです。

  1. `.lampman/config.js` に設定を書く
  2. `lamp` コマンド実行すると `.lampman/config.js` を元に `.lampman/docker-compose.yml` が生成(更新)される
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
  - [lamp up](#)
  - [lamp down](#)
  - [lamp config](#)
  - [lamp logs](#)
  - [lamp login](#)
  - [lamp mysql](#)
  - [lamp psql](#)
  - [lamp reject](#)
  - [lamp rmi](#)
  - [lamp sweep](#)
  - [lamp yamlout](#)
  - [lamp web](#)
  - [lamp version](#)
  - [lamp (extraコマンド)](#)
- 設定ファイル詳説
  - [`config.js / General settings` ：基本設定](#configjs--general-settings-%e5%9f%ba%e6%9c%ac%e8%a8%ad%e5%ae%9a)
  - [`config.js / Lampman base container settings` ：Lampmanベースコンテナ設定](#configjs--lampman-base-container-settings-lampman%e3%83%99%e3%83%bc%e3%82%b9%e3%82%b3%e3%83%b3%e3%83%86%e3%83%8a%e8%a8%ad%e5%ae%9a)
  - [`config.js / MySQL container(s) settings` ：MySQLコンテナ設定](#configjs--mysql-containers-settings-mysql%e3%82%b3%e3%83%b3%e3%83%86%e3%83%8a%e8%a8%ad%e5%ae%9a)
  - [`config.js / PostgreSQL container(s) settings` ：PostgreSQLコンテナ設定](#configjs--postgresql-containers-settings-postgresql%e3%82%b3%e3%83%b3%e3%83%86%e3%83%8a%e8%a8%ad%e5%ae%9a)
  - [`config.js / Logs command settings` ：ログファイル設定](#configjs--logs-command-settings-%e3%83%ad%e3%82%b0%e3%83%95%e3%82%a1%e3%82%a4%e3%83%ab%e8%a8%ad%e5%ae%9a)
  - [`config.js / Extra command settings` ：extraコマンド設定](#configjs--extra-command-settings-extra%e3%82%b3%e3%83%9e%e3%83%b3%e3%83%89%e8%a8%ad%e5%ae%9a)
  - [`config.js / Add action on upped lampman` ：up起動時の自動実行設定](#configjs--add-action-on-upped-lampman-up%e8%b5%b7%e5%8b%95%e6%99%82%e3%81%ae%e8%87%aa%e5%8b%95%e5%ae%9f%e8%a1%8c%e8%a8%ad%e5%ae%9a)
- 技術情報
  - 標準のLAMP仕様
  - 標準で使用しているDockerイメージ
  - ディレクトリ構成サンプル

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

    npm i lampman -g

これでどこでも `lamp` コマンドが打てるようになります。４文字打つのが面倒なときは `lm` でもOKなようにしておきました。




`lamp init`：設定ディレクトリ初期化
--------------------------------

カレントディレクトリに `.lampman/` 設定ディレクトリが生成されます。

#### `lamp init -s`<br>`lamp init --setup`

追加のインストールオプションが表示されますので、ご希望があれば選択してください。

```
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

```
lamp init -m product
```

#### 他の方法で実行モードを指定する

コマンドに `-m` `--mode` を記述しなくても実行モードを指定する方法が２つあります。

1. ホストOS上の環境変数 `LAMPMAN_MODE` に実行モードの文字列を設定しておく

    例えば `.bashrc` に以下のように記述しておきます。
    ```
    export LAMPMAN_MODE=product
    ```
    ただし、こういった運用の場合、cron実行など `.bashrc` を読み込まずに実行するケースもあるので十分ご注意ください。

2. プロジェクトディレクトリに `.env` ファイルを用意しておく

    例えば以下のように記述しておきます。
    ```
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
```js
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
### project:
空白なしの半角英数字などでプロジェクト名を指定してください。Dockerコンテナ名の接頭辞等に使用されます。

### version:
composeファイルのバージョンを指定してください。基本的には `2.2` 固定でお願いします。それ以外を指定した場合、正常に機能しない場合があります。

### network:
ネットワーク設定を書きます。不要であればコメントアウトしてください。
他のcomposeプロジェクトやコンテナへ向けてネットワークを共有したい場合は `name:` を設定することで新たなネットワークが作成されます。
逆に、他のcomposeプロジェクトやコンテナで作成された既存のネットワークへ接続したい合は `external:` に実際のネットワーク名を設定することで接続されます。

`config.js / Lampman base container settings` ：Lampmanベースコンテナ設定
----------------------------------------------------------------------


`config.js / MySQL container(s) settings` ：MySQLコンテナ設定
-----------------------------------------------------------


`config.js / PostgreSQL container(s) settings` ：PostgreSQLコンテナ設定
---------------------------------------------------------------------


`config.js / Logs command settings` ：ログファイル設定
---------------------------------------------------


`config.js / Extra command settings` ：extraコマンド設定
------------------------------------------------------


`config.js / Add action on upped lampman` ：up起動時の自動実行設定
---------------------------------------------------------------









<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>


いいたいこと TODO:見出し直し
-------------------

- コマンド実行時、に設定ファイル `.lampman/config.js` を元に `.lampman/docker-compose.yml` ファイルを自動生成し [docker-compose](https://docs.docker.com/compose/) に渡して起動するというのが大筋の仕組みです。発想は単純ですが、設定を上書きできる追加ファイル `.lampman/docker-compose.override.yml` が直接書けるという docker-compose 標準の機能があるため、ものすごく自由度があり強力です。

- プロジェクトファイルと一緒に `.lampman/` ごと [Git](https://git-scm.com/)でコミット管理することで、共同作業者間で同じ開発サーバ環境が用意できるため非常に有用かと思います。

- 基本的に使用するDockerイメージは [Docker Hub](https://hub.docker.com/) で公開しているものを自動的にpullしてくるので、イメージビルドの必要はありません。（もちろんご自分で作ったDockerイメージを使用することも可能です）

<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>


























Initial LAMP environment
------------------------

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


Docker images to use
--------------------

Internally, the container is started using docker-compose.  
Basically, the following image is used, but this can be changed to a self-made image etc. in the `config.js`.


| Images                                                                                              | Description                                                    |
| --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Docker Hub: `kazaoki/lampman`（未リンク）                                                           | LAMP base image: Linux, Apache, Postfix, MailDev               |
| [Docker Hub: `kazaoki/phpenv`](https://cloud.docker.com/u/kazaoki/repository/docker/kazaoki/phpenv) | This is a version-specific PHP container compiled with phpenv. |
| [Docker Hub: `mysql`](https://hub.docker.com/_/mysql)                                               | MySQL official image                                           |
| [Docker Hub: `postgres`](https://hub.docker.com/_/postgres)                                         | PostgreSQL official image                                      |


Example project directory
-------------------------

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




Internal flow of `lamp up` command
----------------------------------

1. Auto update `.lammpman/docker-compose.yml` from `config.js`

2. `docker-compose up -d` is executed internally.  
   This loads `.lammpman / docker-compose.yml` and` .lammpman / docker-compose.override.yml`.

3. If a PHP version is specified, start the corresponding PHP version container.

4. If there is a MySQL setting, start the corresponding MySQL container.

5. If there is a PostgreSQL setting, start the corresponding PostgreSQL container.

6. Finally, the Lampman base image `kazaoki/lampman` is executed and various servers are started.


Install
-------

    npm i lampman -g

That's it.


`lamp` Command
--------------

| Command        | Description                                                                                                                                                                                                                              |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lamp init`    | Initialize                                                                                                                                                                                                                               |
| `lamp up`      | Start servers.<br>`lamp up -c` ... Start after forcibly deleting all other running containers. (Volume is kept)<br>`lamp up -cv` ... Start after forcibly deleting all other running containers and volumes. (Keep locked volume)        |
| `lamp down`    | Stop and delete servers.<br>`lamp down -v` ... Also delete related volumes. (Keep locked volume)                                                                                                                                         |
| `lamp mysql`   | MySQL operation (if no option is specified, the mysql client is executed)<br>`-d, --dump <to>` ... Dump (Output destination can be specified)<br>`-r, --restore` ... Restore. (Dump selection)<br>`-c, --cli` ... Enter the console.     |
| `lamp psql`    | PostgreSQL operation (if no option is specified, the psql client is executed)<br>`-d, --dump <to>` ... Dump (Output destination can be specified)<br>`-r, --restore` ... Restore. (Dump selection)<br>`-c, --cli` ... Enter the console. |
| `lamp logs`    | Error log monitoring<br>`-g, --group <name>` ... You can specify a log group name. The first one if not specified                                                                                                                        |
| `lamp ymlout`  | Standard output as setting data as yml (relative to project root)                                                                                                                                                                        |
| `lamp version` | Swho version                                                                                                                                                                                                                             |


### common options


| Option              | Description                                                                                                                                                                                         |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-m, --mode <mode>` | Execution mode can be specified.<br>If not specified, the `.lampman /` directory will be referenced. For example, if `-m product` is specified, the` .lampman-product / `directory will be created. |
| `-h, --help`        | Each help is displayed. ex: `lamp -h` `lamp mysql -h`                                                                                                                                               |





For production
--------------

You can create a `docker-compose.yml` for production in the project root with the following command:

    lamp product-yml

This is the same as the following command.

    lamp ymlout -m product > (project-dir)/docker-compose.yml

This command is registered as an extra command.

Extra commands
--------------

You can register additional commands with config.js. You can choose to run on the host side or on the container side.

Description of `config.js`
--------------------------
``` js
const __TRUE_ON_DEFAULT__ = 'default'===process.env.LAMPMAN_MODE;

/**
 * load modules
 */

 /**
 * export configs
 */
module.exports.config = {

    // Lampman
    lampman: {
        project: 'lampman-test',
        image: 'kazaoki/lampman',

...

```
