
# Lampman（ランプマン）概要
----------------------------------------------------------------------

<div class="text-right">for Lampman version {{ book.version }}</div>

## LAMP環境構築ツール
よくあるレンタルサーバの構成（**L**inux, **A**pache, **M**ySQL, **P**HP|**P**erl）を、頭文字を取ってLAMP（ランプ）構成などと呼んだりしますが、ゼロから自分でLAMPサーバを構築するとなると結構な作業で、ましてや案件ごとに環境を用意するのは容易なことではないです。そこで、これをサクッと自分の作業環境に構築できてしまうコマンドを作りました。（ソフトウェアの名称としては Lampman ですが、コマンドは `lamp` ですのでご注意ください。）

このコマンドの基本的な機能は、設定ファイルとコマンド実行により、LAMP構成用の `docker-compose.yml` を裏で自動生成して [docker-compose](https://docs.docker.com/compose/) を実行することでローカルマシン上にLAMP環境を立ち上げるというものです。
そのため、**[Xampp](https://www.apachefriends.org/jp/index.html) で確認するよりも本番サーバに近い**環境を用意でき、**FTPで本番サーバに上げながら開発するよりも手軽で安全**です。

また、LAMPの基本機能やPHPバージョンの指定、DB接続情報やダンプファイルの自動ロードなど、よくあるLAMP設定/操作が設定ファイルを少し編集するだけである程度調整可能になっていますので、業務案件ごとに調整したLampman設定データと作業データとを一緒に [Git](https://git-scm.com/) 等で管理すれば、他の作業者も皆同じLAMP環境で開発できるのです。（素晴らしい！

あと、おまけ機能をたくさん用意してあるので開発時にいろいろ便利かと思います。欲しい機能がなかったら設定ファイルいじって自分でカスタムコマンドを追加することも可能です。

## とりあえず今すぐ試したい場合
※[Node.js](https://nodejs.org/en/)(v10以降) 、[Git](https://git-scm.com/) 、[Docker](https://www.docker.com/) 、[Docker Compose](https://docs.docker.com/compose/install/) がインストール済みであることが前提です。

まず `lamp` コマンドが使えるよう、 [npm](https://www.npmjs.com/) でインストールします。必要に応じて頭に `sudo` 付けてください。
<pre class="cmd">
$ npm i lampman -g
</pre>

次に、実際に Lampman が設定済みのサンプルを用意しましたのでそれをクローンして、その中で `lamp up` を叩きましょう。
<pre class="cmd">
$ git clone https://github.com/kazaoki/lampman-sample.git
$ cd lampman-sample/
$ lamp up
</pre>

これだけです。  
つらつらとDockerコンテナが立ち上がる様子がコンソールに表示され、おまけで最後にブラウザが自動で開き、各種情報が確認できると思います。エラーが出て立ち上がらない場合は、 `80` や `443` ポートがふさがってるのかもしれませんので開放してから再実行してみてください。  
尚、今立ち上げたコンテナを終了するには `lamp down` と打ってください。

また、`lamp config` と打つと、ご愛用のエディタが `.lampman/config.js` を自動で開きますので、この設定ファイルをいろいろいじってみてもいいでしょう。修正したら保存して `lamp up` することでコンテナが反映しますので試してみてください。

ちなみに、 `.lampman/` ディレクトリには他にも編集可能なファイルがあり、この中に全ての Lampman 設定が格納されていますのでなんとなく眺めてみてください。

<pre class="cmd">
    lampman-sample/
        │
        ├─ .git/
        │   └─ ...
        │
        ├─ .lampman/
        │   ├─ config.js
        │   └─ ...
        │
        └─ pulic_html/
            └─ index.php
</pre>

上記図は重要な部分のみの簡略表示ですが、かなりシンプルな構成ということがわかるかと思います。  
いかがでしょうか。
