###### 🤖 技術情報/カスタム

# Lampman自体をいじりたい人へ
----------------------------------------------------------------------

## ソースコード

GitHubに上がってますのでフォークするなりしてください。

https://github.com/kazaoki/lampman

## clone からタスクランナー起動まで

<pre class="cmd">
$ git clone https://github.com/kazaoki/lampman
$ cd lampman
$ npm i
$ lamp up
</pre>

`lamp up` すると起動後に gulp 走り出します。

`src/*.ts` をいじると自動的に `dist/*.js` にコンパイルされます。





## ドキュメント作成

ドキュメント作成には [gitbook-cli](https://github.com/GitbookIO/gitbook-cli) を使ってます。

<pre class="cmd">
$ npm i gitbook -g
$ cd lampman/gitbook
$ gitbook install
$ lamp gb
</pre>
Windowsだと `lamp gb` のあとに `lamp gbc` しないとmdファイル更新時にランナーこけます。

`git-book/*.md` をいじると自動的に `git-book/_book/*.html` にコンパイルされます。
