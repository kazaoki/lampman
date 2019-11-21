
# lamp init

## 設定ディレクトリ初期化

### `lamp init`
カレントディレクトリに `.lampman/` 設定ディレクトリが生成されます。

### `lamp init -s`<br>`lamp init --select`

追加のインストールオプションが表示されますので、ご希望があれば選択してください。

<pre class="cmd">
? セットアップしたい内容を選択してください。（スペースキーで複数選択可） »  
(*)  Lampman設定 - (proj)/.lampman/config.js
( )  MySQL設定
( )  PostgreSQL設定
( )  .envサンプル設定
( )  VSCode用Xdebug設定
</pre>

### `lamp init -p <プロジェクト名>`<br>`lamp init --project <プロジェクト名>`

プロジェクト名を英数字で指定可能です。未指定の場合は `lampman-proj` として設定ファイルに書き込まれますので、必要に応じて後で直してください。後述しますが、このプロジェクト名は生成されるコンテナやネットワークの接頭辞（頭に付く）となります。


### `lamp init -d <公開ディレクトリ名>`<br>`lamp init --public-dir <公開ディレクトリ名>`

ホストOS側のプロジェクトパスにての公開ディレクトリ名を指定可能です。未指定の場合は `public_html` として設定ファイルに書き込まれますが、必要に応じて設定ファイルを修正してください。
