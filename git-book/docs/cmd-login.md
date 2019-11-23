
# lamp login

## 指定のコンテナに入る

### `lamp login`

起動中の `lampman` コンテナにログインします。デフォルトでは `bash` でログインを試みます。

### `lamp login -s`<br>`lamp login --select`

ログインするコンテナを選択できます。設定ファイルで管理していないコンテナにも入れます。

### `lamp login -l <シェル指定>`<br>`lamp login --shell <シェル指定>`

ログインする際のデフォルトシェルを `bash` から変更します。

shでログインする例：
<pre class="cmd">
$ lamp login -l sh
</pre>

### `lamp login -p <ログインパス>`<br>`lamp login --path <ログインパス>`

ログインする際のパスを指定できます。尚、`lampman` コンテナのみ設定ファイルで事前に指定できます。（`config.lampman.login_path`）

`/tmp` にログインする例：
<pre class="cmd">
$ lamp login -p /tmp
</pre>
