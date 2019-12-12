###### 🤖 技術情報/カスタム

# Lampman自体をいじりたい人へ
----------------------------------------------------------------------

## ソースコード

GitHubに上がってますので煮るなり焼くなりフォークするなりしてください。

https://github.com/kazaoki/lampman

## clone からタスクランナー起動まで

<pre class="cmd">
$ git clone https://github.com/kazaoki/lampman
$ cd lampman
$ npm i
$ lamp up -f
</pre>

`lamp up` するとブラウザ起動後に `gulp` が実行され自動コンパイルが走り出します。（`src/*.ts` をいじると自動的に `dist/*.js` にコンパイルされます）


## ドキュメント作成用のタスクランナー

ドキュメント作成には [gitbook-cli](https://github.com/GitbookIO/gitbook-cli) を使ってます。

<pre class="cmd">
$ npm i gitbook -g
$ cd lampman/gitbook
$ gitbook install
$ lamp gb
</pre>

`lamp gb` するとブラウザ起動後に自動コンパイルが走り出します。（`git-book/*.md` をいじると自動的に `fit-book/*.html` にコンパイルされますが、これは一時的なファイルでコミット対象ではありません）  
※また、Windowsだと `lamp gb` のあとに `lamp gbc` しないとmdファイル更新時にランナーこけます。  

正式なビルドは以下のコマンドを実行してください。 `docs/` に生成されます。

<pre class="cmd">
$ lamp gbb
</pre>
