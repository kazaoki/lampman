###### 🔍 調査/その他コマンド

# YAMLの更新のみ、出力のみする：`lamp yaml`
----------------------------------------------------------------------

### `lamp yaml`

オプション無しの場合は何もしません。

### `lamp yaml -b`<br>`lamp yaml --build`

現在の `.lampman/conifg.js` を基に `.lampman/docker-compose.yml` ファイルを生成します。（既に存在している場合は更新します）  
ただし、以前と同様の設定内容の場合は更新されず、「no changes」とコンソールに表示されます。（この場合、 `.lampman/docker-compose.yml` 冒頭に記載されている更新日時も変更されません）

### `lamp yaml -o`<br>`lamp yaml --out`

`.lampman/docker-compose.yml` に書き出すのではなく、標準出力にYAMLデータを出力します。
このYAMLデータは、 `.lampman/config.js` で設定されている情報と、 `.lampman/docker-compose.override.yml` の内容が一つにマージされたものになります。  
また、このコマンドが実行されたパスをベースに `.lampman/` への相対パスが正しく設定されます。

そのため、例えば本番サーバで使用する単一の `docker-compose.yml` ファイルが作成可能です。例えば以下のようになります。

<pre class="cmd">
$ cd ~/proj
$ lamp --mode product yaml --out > ./docker-compose.yml
</pre>

上記の例ですと、 `proj/docker-compose.yml` が生成され、このファイルから `proj/.lampman-product/`へ各種データが参照されるようになります。  
この状態であれば `lamp` コマンドが実行できない環境でも `docker-compose` コマンドさえ実行できれば、以下のコマンドで本番環境が走り出します。

<pre class="cmd">
$ cd ~/proj
$ docker-compose up -d
</pre>
