# Lampman（ランプマン）概要

## LAMP環境構築ツール
よくあるレンタルサーバの構成（**L**inux, **A**pache, **M**ySQL, **P**HP|**P**erl）を、頭文字を取ってLAMP（ランプ）構成などと呼んだりしますが、ゼロから自分でLAMPサーバを構築するとなると結構な作業で、ましてや案件ごとに環境を用意するのは容易なことではないです。そこで、これをサクッと自分の作業環境に構築できてしまうコマンドを作りました。（ソフトウェアの名称としては Lampman ですが、コマンドは `lamp` ですのでご注意ください。）

このコマンドの基本的な機能は、LAMP構成の `docker-compose.yml` ファイルを自動生成して [docker-compose](https://docs.docker.com/compose/) を実行することでローカルマシン上にLAMP環境を立ち上げるというものです。
そのため、**[Xampp](https://www.apachefriends.org/jp/index.html) で確認するよりも本番サーバに近い**環境を用意でき、**FTPで本番サーバに上げながら開発するよりも手軽で安全**です。

また、LAMPの基本機能やPHPバージョンの指定、DB接続情報やダンプファイルの自動ロードなど、設定ファイルを少し編集するだけである程度調整可能になっていますので、業務案件ごとに調整したLampman設定データと作業データとを一緒に [Git](https://git-scm.com/) 等で管理すれば、他の作業者も皆同じLAMP環境で開発できるのです。（素晴らしい！

あと、おまけ機能をたくさん用意してあるので開発時にいろいろ便利かと思います。欲しい機能がなかったら設定ファイルいじって自分でカスタムコマンドを追加することも可能です。

## とりあえず今すぐ試したい場合
※[Docker](https://www.docker.com/) 、 [Node.js](https://nodejs.org/en/)(v10以降) 、[Git](https://git-scm.com/) がインストール済みであることが前提です。

まず `lamp` コマンドが使えるよう、 [npm](https://www.npmjs.com/) でインストールします。必要に応じて頭に `sudo` 付けてください。
``` shell
$ npm i lampman -g
```

次に、実際に Lampman が設定済みのサンプルを用意しましたのでそれをクローンして、その中で `lamp up` を叩きましょう。
``` shell
$ git clone https://github.com/kazaoki/lampman-sample.git
$ cd lampman-sample/
$ lamp up
```

これだけです。  
つらつらとDockerコンテナが立ち上がる様子がコンソールに表示され、最終的にブラウザが自動で開き、各種情報が確認できると思います。エラーが出て立ち上がらない場合は、 `80` や `443` ポートがふさがってるのかもしれませんので開放してから再実行してみてください。  
尚、今立ち上げたコンテナを終了するには `lamp down` と打ってください。

`lamp config` と打つと、ご愛用のエディタで `.lampman/config.js` を自動で開きますので、設定ファイルをいろいろいじってみてもいいでしょう。修正したら保存して `lamp up` して反映してみてください。

また、 `.lampman/` ディレクトリには他にも編集可能なファイルがあり、この中に全ての Lampman 設定が格納されていますのでなんとなく眺めてみてください。

<pre style="line-height:1.3">
    lampman-sample/
        ├─ .git/
        │   └─ ...
        ├─ .lampman/
        │   ├─ config.js
        │   └─ ...
        └─ pulic_html/
            └─ index.php
</pre>

かなりシンプルな構成になっているはずです。  
いかがでしょうか。

<!-- 
[Docker](https://www.docker.com/) と [Node.js](https://nodejs.org/en/)(v10以降) が入っている環境で以下のコマンドを打ってください。ただし、初期設定のままですのでMySQLは起動せずApacheとPHPとメールサーバ程度となります。（これだとLA**M**PじゃなくLAPですが細かいことは気にしない 😉）

``` shell
$ mkdir -p proj_a/public_html
$ cd proj_a/
$ echo '<?php phpinfo();' > public_html/index.php
$ sudo npm i lampman -g
$ lamp init
$ lamp up
```
※Windows環境では `sudo` は不要です。  
※必要なDockerイメージが無ければ [Docker Hub](https://hub.docker.com/) から自動でダウンロードされます。  

ブラウザが立ち上がり、 [phpinfo()](https://www.php.net/manual/ja/function.phpinfo.php) の実行結果が表示されます。（途中、設定ファイルがエディタで自動で開いたり、ブラウザのセキュリティ警告が出たりするかもしれませんがスキップで。）  
エラーが出て立ち上がらない場合は、 `80` や `443` ポートがふさがってるのかもしれませんので開放してから再実行してみてください。  
尚、今立ち上げたコンテナを終了するには `lamp down` と打ってください。

## Lampmanが設定されたGitリポジトリをクローンしてLAMPを起動するまで

（`lamp`コマンドはインストール済みとして）既にLampmanがセットアップ済みのGitリポジトリがあれば、

``` shell
$ git clone https://xxx/proj_a.git
$ cd proj_a/
$ lamp up
```
これでもう、みんなとおんなじLAMP環境で、即、開発スタートなんです！  
😃 -->
