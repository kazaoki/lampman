
Lampman - 一瞬でLAMP環境を立ち上げるコマンドラインツール `lamp`
==================================================

**準備中！**
---------------------
**そろそろ `ver 1.0.0` いけそうです！**
<br><br><br><br><br><br><br><br><br><br><br><br><br>


ランプマン？
==========

よくあるレンタルサーバの構成（**L**inux, **A**pache, **M**ySQL, **P**HP|**P**erl）をLAMP（ランプ）構成などと呼んだりしますが、これをサクッと自分の作業環境（WindowsやmacOS）に構築するコマンドラインツールです。

[XAMPP](https://www.apachefriends.org/jp/index.html) で確認するよりは本番サーバに近い環境を用意でき、FTPで本番サーバに上げながら開発するよりも手軽で安全です。また、LAMPの機能やPHP/DBバージョンの情報を設定ファイルに書くだけですのでカンタンですし、設定データは全てプロジェクト内にファイルとして存在しているので、他のクリエータとも開発環境の共有が容易です。

<br><br><br>




一番シンプルな使い方
=================

動作環境やインストール方法は後回しで、まずは雰囲気をどうそ。


1. まず `public_html/` があるプロジェクトディレクトリに移動して以下のコマンドを打ちます。

    ``` shell
    lamp init
    ```
    これによりプロジェクトディレクトリに `.lampman/` という設定用のディレクトリが作成されます。

2. 次に以下のコマンドを打つと、docker上でWebサーバがごそごそ起動します。

    ``` shell
    lamp up
    ```

3. 起動完了すると勝手にブラウザが開き [https://localhost](https://localhost) にアクセスされますので、`public_html/` にて開発を進めてください。（[Docker Toolbox](https://docs.docker.com/toolbox/toolbox_install_windows/) 環境の場合は [https://192.168.99.100](https://192.168.99.100) など）

4.  開発が終わったらそのまま放っておいてもいいですが、以下のコマンドで、起動させたサーバコンテナ達を終了させることができます。

    ``` shell
    lamp down
    ```

**基本は以上です。**

次回、続きからまた作業を開始したい場合は、このディレクトリ下位のどこからでも `lamp up` すれば同じくLAMPサーバ達が立ち上がります。※他のコンテナが邪魔して起動しない場合は `lamp up -f` で全消し＆起動（後述）

<br>

一応、上記のシンプルな構成のツリー図サンプルを掲示しておきます。基本はシンプルなのが一番です。

<pre style="line-height:1.3">
    (project-dir)/
        │
        │  <i style="color:#888">// Publish web root. (mount to /var/www/html)</i>
        ├─ pulic_html/
        │   ├─ index.php
        │   └─ ...
        │
        │  <i style="color:#888">// Lampman settings</i>
        └─ .lampman/
            ├─ lampman/
            │   └─ ...
            ├─ config.js
            ├─ docker-compose.override.yml
            └─ docker-compose.yml
</pre>

後述しますが、この `.lampman/` ごとプロジェクトディレクトリを [Git](https://git-scm.com/) で管理するのを強くお勧めします。

<br><br><br>




もう少し詳しく
============

さて、これだけでは[PHPのビルトインウェブサーバ](https://www.php.net/manual/ja/features.commandline.webserver.php)とあまり変わらないですね。

「`/public_html` じゃない」「PHPのバージョン変えたい」「MySQLどーやんの」「他の docker サービス使いたい」「VPSで本番したい」こんなところでしょうか、はい、全部できます。
基本的には設定ディレクトリ `.lampman/` の中でごにょごにょすることで、ご希望のサーバ環境が比較的かんたんに用意できます。

まずは全体のシンプルな仕組みを知っておいてください。

  1. プロジェクトフォルダごとに `.lampman/config.js` に設定を書く
  2. `lamp` コマンド実行すると `.lampman/config.js` を元に `.lampman/docker-compose.yml` が自動生成/更新される
  3. `lamp up` と打つと `.lampman/` を起点に内部で `docker-compose up -d` が実行される（`.lampman/docker-compose.yml` と設定上書き用のymlファイル `.lampman/docker-compose.override.yml` が読み込まれる）

要は `config.js` から `docker-compose.yml` を生成して `docker-compose` コマンドを叩いてるだけなんです。  
なので、 設定ファイルをいじるだけでは実現できない複雑なサーバ設定などは、 `.lampman/docker-compose.override.yml` に追加コンテナやサーバの設定ファイル等をマウントする設定を書くなり、独自のDockerイメージを用意するなりすれば、理論的にはなんでもできる、というワケです。

ただ、それだけではなく、DBをカンタンにセットアップしたりPHPデバッグが楽にするなど、Web開発に関する便利機能がコマンドに付いていますので、是非ご活用ください。


以下、なが～いドキュメントです。ドキュメント各種へのアンカーリンク出しておきます。

---

- [動作要件](#動作要件)
- [インストール](#インストール)
- コマンド詳説
  - 共通オプション
    - [-h, --help](#h---help%e3%83%98%e3%83%ab%e3%83%97%e8%a1%a8%e7%a4%ba) <small style="color:#aaa">... ヘルプ表示</small>
    - [-m, --mode](#m-%e3%83%a2%e3%83%bc%e3%83%89%e5%90%8d---mode-%e3%83%a2%e3%83%bc%e3%83%89%e5%90%8d%e5%ae%9f%e8%a1%8c%e3%83%a2%e3%83%bc%e3%83%89%e3%82%92%e6%8c%87%e5%ae%9a) <small style="color:#aaa"> ... モード切替</small>
      + [他の方法で実行モードを指定する](#他の方法で実行モードを指定する)
      + [ホストOS側の環境変数について](#ホストOS側の環境変数について)
  - セットアップ
    - [lamp init](#lamp-init%e8%a8%ad%e5%ae%9a%e3%83%87%e3%82%a3%e3%83%ac%e3%82%af%e3%83%88%e3%83%aa%e5%88%9d%e6%9c%9f%e5%8c%96) <small style="color:#aaa"> ... 初期セットアップ</small>
  - コンテナ起動/終了
    - [lamp up](#lamp-up%e3%82%b3%e3%83%b3%e3%83%86%e3%83%8a%e8%b5%b7%e5%8b%95) <small style="color:#aaa"> ... Lampman起動</small>
    - [lamp down](#lamp-down%e3%82%b3%e3%83%b3%e3%83%86%e3%83%8a%e7%b5%82%e4%ba%86) <small style="color:#aaa"> ... Lampman終了</small>
  - 設定
    - [lamp config](#lamp-config%e8%a8%ad%e5%ae%9a%e3%83%95%e3%82%a1%e3%82%a4%e3%83%ab%e3%82%92%e9%96%8b%e3%81%8f) <small style="color:#aaa"> ... 標準エディタで設定ファイルを開く</small>
    - lamp xon/xoff <small style="color:#aaa"> ... PHP Xdebug の有効/無効を切り替える</small>
  - コンテナ掃除
    - [lamp reject](#lamp-reject%e3%82%b3%e3%83%b3%e3%83%86%e3%83%8a%e3%83%9c%e3%83%aa%e3%83%a5%e3%83%bc%e3%83%a0%e3%82%92%e3%83%aa%e3%82%b9%e3%83%88%e3%81%8b%e3%82%89%e9%81%b8%e6%8a%9e%e3%81%97%e3%81%a6%e5%89%8a%e9%99%a4) <small style="color:#aaa"> ... コンテナ・ボリュームを選択して削除</small>
    - [lamp rmi](#lamp-rmi%e3%82%a4%e3%83%a1%e3%83%bc%e3%82%b8%e3%82%92%e3%83%aa%e3%82%b9%e3%83%88%e3%81%8b%e3%82%89%e9%81%b8%e6%8a%9e%e3%81%97%e3%81%a6%e5%89%8a%e9%99%a4) <small style="color:#aaa"> ... イメージを選択して削除</small>
    - [lamp sweep](#lamp-sweep%e5%85%a8%e3%81%a6%e3%81%ae%e3%82%b3%e3%83%b3%e3%83%86%e3%83%8a%e6%9c%aa%e3%83%ad%e3%83%83%e3%82%af%e3%83%9c%e3%83%aa%e3%83%a5%e3%83%bc%e3%83%a0ltnonegt%e3%82%a4%e3%83%a1%e3%83%bc%e3%82%b8%e4%b8%8d%e8%a6%81%e3%83%8d%e3%83%83%e3%83%88%e3%83%af%e3%83%bc%e3%82%af%e3%82%92%e4%b8%80%e6%8e%83%e3%81%99%e3%82%8b%e3%81%a4%e3%82%88%e3%81%84) <small style="color:#aaa"> ... 全てのコンテナ、未ロックボリューム、<none>イメージ、不要ネットワークの一掃</small>
  - 監視
    - [lamp logs](#lamp-logs%e3%83%ad%e3%82%b0%e3%83%95%e3%82%a1%e3%82%a4%e3%83%ab%e3%82%92%e7%9c%ba%e3%82%81%e3%82%8b) <small style="color:#aaa"> ... ログファイル監視</small>
    - lamp status <small style="color:#aaa"> ... コンテナ達の標準出力を監視</small>
  - DB操作
    - [lamp mysql](#lamp-mysqlmysql%e6%93%8d%e4%bd%9c%e3%82%92%e3%81%99%e3%82%8b) <small style="color:#aaa"> ... MySQL操作（SQLコンソール、ダンプ、リストア等）</small>
    - [lamp psql](#lamp-psqlpostgresql%e6%93%8d%e4%bd%9c%e3%82%92%e3%81%99%e3%82%8b) <small style="color:#aaa"> ... PostgreSQL操作（SQLコンソール、ダンプ、リストア等）</small>
  - 調査/その他
    - [lamp (引数なし)](#lamp-login%e6%8c%87%e5%ae%9a%e3%81%ae%e3%82%b3%e3%83%b3%e3%83%86%e3%83%8a%e3%81%ab%e5%85%a5%e3%82%8b) <small style="color:#aaa"> ... dockerの状況を一括出力</small>
    - [lamp login](#lamp-login%e6%8c%87%e5%ae%9a%e3%81%ae%e3%82%b3%e3%83%b3%e3%83%86%e3%83%8a%e3%81%ab%e5%85%a5%e3%82%8b) <small style="color:#aaa"> ... 指定のコンテナにログイン</small>
    - [lamp yaml](#lamp-yml%e8%a8%ad%e5%ae%9a%e6%83%85%e5%a0%b1%e3%82%92yaml%e5%bd%a2%e5%bc%8f%e3%81%a7%e6%a8%99%e6%ba%96%e5%87%ba%e5%8a%9b%e3%81%ab%e5%87%ba%e5%8a%9b%e3%81%99%e3%82%8b) <small style="color:#aaa"> ... YAML操作（生成/更新、標準出力など）</small>
    - [lamp version](#lamp-versionlampman%e3%81%ae%e3%82%b3%e3%83%9e%e3%83%b3%e3%83%89%e3%83%90%e3%83%bc%e3%82%b8%e3%83%a7%e3%83%b3%e3%82%92%e8%a1%a8%e7%a4%ba%e3%81%99%e3%82%8b) <small style="color:#aaa"> ... バージョン確認</small>
    - [lamp (extraコマンド)](#lamp-extra%e3%82%b3%e3%83%9e%e3%83%b3%e3%83%89%e8%a8%ad%e5%ae%9a%e3%81%97%e3%81%9f%e7%8b%ac%e8%87%aa%e3%81%ae%e3%82%b3%e3%83%9e%e3%83%b3%e3%83%89%e3%82%92%e5%ae%9f%e8%a1%8c%e3%81%99%e3%82%8b) <small style="color:#aaa"> ... 独自に設定可能なコマンド</small>
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
---


<br><br><br>


動作要件
=======

- [Docker](https://www.docker.com/)：なるべく最新版
  - Windows版 ... 😄
  - macOS版 ... 😄
  - Linux版 ... 😄
  - Toolbox版(Win/Mac) ... 😒
- [Node.js](https://nodejs.org/en/)：なるべく最新版
  - 12系で開発してます。10系でも多分動きます。
- コマンドラインが打てる何か
  - おすすめ
    - [Visual Studio Code](https://azure.microsoft.com/ja-jp/products/visual-studio-code/)<small>（の中のコマンドパネル）</small>


ホストOS上にXamppとかPHPとかは不要です。必要なのは上記だけで、あとは各コンテナ内で対応します。


<br><br><br>


`lamp` コマンドインストール
==========

``` shell
npm i lampman -g
```

これでどこでも `lamp` コマンドが打てるようになります。４文字打つのが面倒なときは `lm` でもOKなようにしておきました。
インストール済みの状態で上記コマンドを打つと最新バージョンになります。

例）

```shell
$ npm i lampman -g
...

$ lamp version

  ╒═══════════════════╕
  │ Lampman ver 1.0.0 │
  ├-------------------┤
  │ mode: default     │
  ╘═══════════════════╛

※ `lm version` でも同じです。
```


<br><br><br>


共通オプション
===========

### `-h`, `--help`：ヘルプ表示

全てのコマンドで使用できます。

`lamp init -h` などとすればそのコマンド機能のヘルプが出ます。  
`lamp -h` で全体のコマンド一覧が確認できます。




### `-m <モード名>`, `--mode <モード名>`：実行モードを指定

全てのコマンドで使用できます。  
実行モードの切り替えが可能で、すべてのコマンドに追加できるオプションです。

実行モードを指定した場合、対象の設定ディレクトリとコンテナ内の環境変数が変わります。これにより開発用と本番用と分けて管理したりできます。
尚、未指定の場合の実行モードは `default` となります。

| モード指定コマンド例         | 対象設定ディレクトリ | コンテナ内環境変数 |
| ---------------------------- | -------------------- | ------------------- |
| `lamp (コマンド)`            | .lampman/            | LAMPMAN_MODE=default |
| `lamp -m test (コマンド)`    | .lampman-test/       | LAMPMAN_MODE=test    |
| `lamp -m product (コマンド)` | .lampman-product/    | LAMPMAN_MODE=product |
| `lamp -m xxxxxx (コマンド)`  | .lampman-xxxxxx/     | LAMPMAN_MODE=xxxxxx  |

例えば本番用の設定を新たに作りたい場合、以下のようにすると `.lampman-product/` ディレクトリに設定がセットアップされますのでその中で本番用の設定を書いていきます。

``` shell
$ lamp -m product init
$ lamp -m product up
$ lamp -m product down
```

### 他の方法で実行モードを指定する

コマンドに `-m` や `--mode` を記述しなくても実行モードが指定できる方法が２つあります。

#### 1. ホストOS上の環境変数 `LAMPMAN_MODE` に実行モードの文字列を設定しておく

例えば `.bashrc` に以下のように記述しておきます。
``` shell
export LAMPMAN_MODE=product
```
ただし、こういった運用の場合、cron実行など `.bashrc` を読み込まないケースもあるので十分ご注意ください。

#### 2. プロジェクトディレクトリに `.env` ファイルを用意しておく

例えば以下のように記述しておきます。
``` shell
LAMPMAN_MODE=product
```

こうしておくことで、 `lamp` コマンドが `.env` を自動的に読み込んで環境変数を定義するため、実行モードが指定できます。
こちらの方がおすすめですが、 `.env` は環境別のパスワードなども記載されることもあるので git のコミット対象にしないようご注意ください。

### ホストOS側の環境変数について

ちなみに、ホストOS上の環境変数は設定ファイル中で参照できます。例えば環境変数 `LAMPMAN_MODE` なら、

- `.lampman/config.js` の中では `process.env.LAMPMAN_MODE`
- `.lampman/docker-compose.override.yml` の中では `"${LAMPMAN_MODE}"`

のように書くことで参照できるので、パスワードや環境による違いなどgit対象にしたくない情報は環境変数に逃がすと良いでしょう。


<br><br><br>

セットアップ
========

`lamp init`：設定ディレクトリ初期化
--------------------------------

### `lamp init`
カレントディレクトリに `.lampman/` 設定ディレクトリが生成されます。

### `lamp init -s`<br>`lamp init --select`

追加のインストールオプションが表示されますので、ご希望があれば選択してください。

``` shell
? セットアップしたい内容を選択してください。（スペースキーで複数選択可） »  
(*)  Lampman設定 - (proj)/.lampman/config.js
( )  MySQL設定
( )  PostgreSQL設定
( )  .envサンプル設定
( )  VSCode用Xdebug設定
```

### `lamp init -p <プロジェクト名>`<br>`lamp init --project <プロジェクト名>`

プロジェクト名を英数字で指定可能です。未指定の場合は `lampman-proj` として設定ファイルに書き込まれますので、必要に応じて後で直してください。後述しますが、このプロジェクト名は生成されるコンテナやネットワークの接頭辞（頭に付く）となります。


### `lamp init -d <公開ディレクトリ名>`<br>`lamp init --public-dir <公開ディレクトリ名>`

ホストOS側のプロジェクトパスにての公開ディレクトリ名を指定可能です。未指定の場合は `public_html` として設定ファイルに書き込まれますが、多段階層の場合など必要に応じて手動で直してください。


<br><br><br>


`lamp up`：コンテナ起動
=====================

`lamp up`
---------

オプション無しで実行すると、現在の `.lampman/config.js` を元に `.lampman/docker-compose.yml` が自動生成され、内部で docker-compose が実行されます。ただしこの時、フォアグラウンドモードではなくデーモンモードで機能しますので、ログ等は画面に流れません。  
機能的には以下とほぼ同等となります。
```shell
$ cd .lampman/
$ docker-compose up -d --project-name (プロジェクト名)
```

再起動したい場合も同様のupコマンドでOKです。ymlが更新された必要なコンテナが再起動されます。（確実に全て更新したい場合は `down` してからか `-f, --flush`オプションを指定してください。後述）


### `lamp up -f`<br>`lamp up --flush`

既存のコンテナと未ロックボリュームを全て削除してキレイにしてから起動します。
ロックボリュームとは Lampman 独自の識別で `locked_` から始まるラベルを持つボリュームのことです。（後述）  
このコマンドは、コンテナが終了していようが起動していようがすっかりキレイに排除してから起動を試みるもので、ポート開放がうまくいかなかったり既存コンテナが邪魔してたりする可能性がある場合などにおすすめです。


### `lamp up -o <オプション文字列>`<br>`lamp up --docker-compose-options <オプション文字列>`

docker-compose コマンドに渡すオプションを文字列で指定可能です。
ただし、内部で使用している [Commander.js](https://www.npmjs.com/package/commander) の問題なのか、ハイフンの前にバックスラッシュ入れないとエラーになります。

```shell
$ lamp up -o "-t 300"      ... NG
$ lamp up -o "\-t 300"     ... OK
```

### `lamp up -D`

デーモンじゃなくフォアグラウンドで起動します。ログが確認できるようになりますので、うまくdockerが起動しない場合などに活用してください。

### `lamp up -n`<br>`lamp up--no-update`

`.lampman/docker-compose.yml` を更新せずに起動させることが可能です。設定ファイルを書き換えてしまったものの、以前のymlで起動を確認したい場合などにご指定ください。



`lamp down`：コンテナ終了
=======================

`lamp config`：設定ファイルを開く
=======================

`lamp logs`：ログファイルを眺める
=======================

`lamp login`：指定のコンテナに入る
=======================

`lamp mysql`：MySQL操作をする
=======================

`lamp psql`：PostgreSQL操作をする
=======================

`lamp reject`：コンテナ/ボリュームをリストから選択して削除
=======================

`lamp rmi`：イメージをリストから選択して削除
=======================

`lamp sweep`：全てのコンテナ/未ロックボリューム/&lt;none&gt;イメージ/不要ネットワークを一掃する（つよい
=======================

`lamp ymlout`：設定情報をYAML形式で標準出力に出力する
=======================

`lamp web`：現在のパスでビルトインPHPウェブサーバを一時的に起動する
=======================

`lamp version`：Lampmanのコマンドバージョンを表示する
=======================

`lamp (extraコマンド)`：設定した独自のコマンドを実行する
=======================




`config.js / General settings`<br>基本設定
=========================================

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




`config.js / Lampman base container settings`<br>Lampmanベースコンテナ設定
======================================================================

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




`config.js / MySQL container(s) settings`<br>MySQLコンテナ設定
======================================================================

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




`config.js / PostgreSQL container(s) settings`<br>PostgreSQLコンテナ設定
=====================================================================

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




`config.js / Logs command settings`<br>ログファイル設定
===================================================

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






`config.js / Extra command settings`<br>extraコマンド設定
======================================================


`config.js / Add action on upped lampman`<br>up時の自動実行設定
============================================================

<br><br><br>


標準のLAMP仕様
=============


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


<br><br><br>

標準で使用しているDockerイメージ
============================

Internally, the container is started using docker-compose.  
Basically, the following image is used, but this can be changed to a self-made image etc. in the `config.js`.


| Images                                                                                              | Description                                                    |
| --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Docker Hub: `kazaoki/lampman`（未リンク）                                                           | LAMP base image: Linux, Apache, Postfix, MailDev               |
| [Docker Hub: `kazaoki/phpenv`](https://cloud.docker.com/u/kazaoki/repository/docker/kazaoki/phpenv) | This is a version-specific PHP container compiled with phpenv. |
| [Docker Hub: `mysql`](https://hub.docker.com/_/mysql)                                               | MySQL official image                                           |
| [Docker Hub: `postgres`](https://hub.docker.com/_/postgres)                                         | PostgreSQL official image                                      |




- 基本的に使用するDockerイメージは [Docker Hub](https://hub.docker.com/) で公開しているものを自動的にpullしてくるので、イメージビルドの必要はありません。（もちろんご自分で作ったDockerイメージを使用することも可能です）


<br><br><br>

ディレクトリ構成サンプル
======================


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


<br><br><br>

本番用構成例
===========

- 機能制限
- セキュアdocker
- ログfluent


<br><br><br>


Lampmanで動くのに本番サーバで動かないとき
====================================

Dockerはあくまで擬似的なLinuxコンテナですので、ホストOS側のファイルシステムの違いなどが影響して本番サーバと異なる挙動をするケースが多々あります。Lampmanで動いてるから**本番UPは１時間あれば十分だわー**などと思っていると、**おおいにハマる**のでご注意ください。  
以下、ヒントです。

- .`htaccess` でそのサーバ専用の何かをしなくちゃいけない（PHPハンドラーの設定や、Optionsディレクティブの設定など）
- PHPエラーで"クラスが見つからない"と出るのは、クラス名の大文字/小文字を間違っている可能性がある（Windowsホスト上だと大文字/小文字の区別無くてもエラーにならない模様）
- DB接続情報が正しいか再度確認を。サーバによっては `localhost` だとダメで、 `127.0.0.1` にする必要があるところもある。
- ajaxなどが304エラーを返す場合は、サーバ側セキュリティ設定でWAFが効いてる可能性があるので無効にするなど。
- ファイルアップロードの機能がある場合、パーミッション0600で保存されてしまうことがあるので、0644等になるように修正


<br><br><br>

その他
=====

### 必要なPHPバージョンが一覧にない場合
Lampman で設定できるPHPバージョン一覧  
https://hub.docker.com/r/kazaoki/phpenv/tags

対応バージョンは気まぐれに増えるので、しばらく待つか、[こちらからIssue投げていただければ](https://github.com/kazaoki/anyenv-bins/issues)気づいたときに対応します。
ただし、古いバージョン（5.3以下）はちゃんとコンパイルできない可能性が高いので、期待しないほうがいいかも・・。

### コンテナ実行時にサーバに手入れしたい
- `.lamman/lampman/entrypoint-add.sh`

上記のファイルがあると思いますが、これはメインの `lampman` コンテナが起動した際に、各種サーバサービスが立ち上がる直前に実行されるシェルスクリプトを書いておくことができます。初期ではこの中身は全てコメントアウトされており、何も実行しないファイルになっていますので、こちらをいじって直接サーバの中身を書き換えるなどが可能です。

また、初期では存在しませんが、 `mysql` や `postgresql` コンテナも同様ですので、以下のシェルスクリプトを新規で用意するだけでメインの `entrypoint.sh` が実行される前の処理を書くことができます。

- `.lamman/mysql/entrypoint-add.sh`
- `.lamman/postgresql/entrypoint-add.sh`


運用例
---------------------------------------------------------------

```shell
$ mkdir proj-a
$ cd proj
$ mkdir html
$ echo '<?php phpinfo() ?>' >> html/index.php
$ lm init -d html -p proj-a

(MySQL接続情報を設定ファイルに設定...)

$ git init
$ git add -A
$ git commit -m '[ADD] lampman initialize'
$ lm up -f
$ lm logs

(開発を進める...)

$ lm mysql -d
$ lm sweep -f
$ git add -A
$ git commit -m '[ADD] php developed, and mysql dumped.'
```

`.lampman/` ディレクトリごと git コミット対象にすると、他のユーザーや別の環境でほぼ同様の動作確認環境が構築できます。（ファイルシステムの違いによる挙動の違いはでてきますが・・）

