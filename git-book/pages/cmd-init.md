###### 🔨 セットアップコマンド

# 設定ディレクトリ初期化：`lamp init`
----------------------------------------------------------------------


### `lamp init`
インストールオプションの選択が表示されますので、ご希望の項目を選択して決定するとカレントディレクトリに `.lampman/` 設定ディレクトリが生成され、必要な設定ファイルが作成されます。

例： 
<pre class="cmd">
$ lamp init

? セットアップしたい内容を選択してください。（スペースキーで複数選択可） »  
(*)  Lampman設定 - (proj)/.lampman/config.js
( )  MySQL設定
( )  PostgreSQL設定
( )  .envサンプル設定
( )  VSCode用Xdebug設定
</pre>

### `lamp init -f`<br>`lamp init --force`
インストールオプションの選択を出さずに、必要最低限の設定で `.lampman/` 設定ディレクトリが作成されます。


### `lamp init -p <プロジェクト名>`<br>`lamp init --project=<プロジェクト名>`

プロジェクト名を英数字で指定可能です。未指定の場合は `lampman-proj` として設定ファイルに書き込まれますので、必要に応じて後で直してください。このプロジェクト名は生成されるコンテナやネットワークの接頭辞（頭に付く）となります。


### `lamp init -d <公開ディレクトリ>`<br>`lamp init --public-dir=<公開ディレクトリ>`

ホストOS側のプロジェクトパスにての公開ディレクトリを指定可能です。未指定の場合は `public_html` として設定ファイルに書き込まれますが、必要に応じて設定ファイルを修正してください。


### `lamp init -r`<br>`lamp init --reset-entrypoint-shell`

Lampmanバージョン1.0.17以降、それまでの `entrypoint.sh` では起動が完了しなくなりますので、このファイルの更新用コマンドです。  
Lampman及び各DBコンテナの `entrypoint.sh` を標準のもので上書きを行います。以下、更新対象のファイルです。

- `.lampman/lampman/entrypoint.sh`
- `.lampman/mysql/entrypoint.sh`
- `.lampman/psql/entrypoint.sh`

コマンドを実行すると対象ファイルの確認が出ますので、`yes` を選択するとそれぞれ対応する標準の `entrypoint.sh` で上書き更新されます。
