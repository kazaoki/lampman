# Lampman（ランプマン）概要

## LAMP環境構築ツール
よくあるレンタルサーバの構成（**L**inux, **A**pache, **M**ySQL, **P**HP|**P**erl）を、頭文字を取ってLAMP（ランプ）構成などと呼んだりしますが、ゼロからLAMPサーバを構築するとなると結構な作業で、ましてや案件ごとに環境を用意するのは容易なことではないです。そこで、これをサクッと自分の作業環境に構築できてしまうコマンドを作ってみました。

名称は Lampman ですが、コマンドは `lamp` ですのご注意ください。
このコマンドは実際には内部でLAMP構成の `docker-compose.yml` ファイルを自動生成して [docker-compose](https://docs.docker.com/compose/) を実行しているだけです。
そのため、[Xampp](https://www.apachefriends.org/jp/index.html) で確認するよりも本番サーバに近い環境を用意でき、FTPで本番サーバに上げながら開発するよりも手軽で安全です。また、LAMPの基本機能やPHPバージョンの指定、DB接続情報やダンプファイルの自動ロードなど、ある程度なら設定ファイルを少し編集するだけで調整可能になっていますので、作業データと一緒に [Git](https://git-scm.com/) 等で管理すれば他のクリエータとも同じ開発環境を共有できます。

あと、おまけ機能をたくさん用意してあるので開発時にいろいろ便利かと思います。欲しい機能がなかったら設定ファイルいじって自分で追加することも可能です。

## とりあえず今すぐ試したい場合

[Docker](https://www.docker.com/) と [Node.js](https://nodejs.org/en/)(v10以降) が入っている環境で以下のコマンド打てばLAMPサーバが起動します。　

``` shell
$ mkdir -p proj_a/public_html
$ cd proj_a/
$ echo '<?php phpinfo();' > public_html/index.php
$ sudo npm i lampman -g
$ lamp init
$ lamp up
```
※Windows環境では `sudo` は不要です。  
※初回は必要なDockerイメージが [Docker Hub](https://hub.docker.com/) からダウンロードされます。  

ブラウザが立ち上がり、 [phpinfo()](https://www.php.net/manual/ja/function.phpinfo.php) の実行結果が表示されます。（途中、設定ファイルがエディタで自動で開いたり、ブラウザのセキュリティ警告が出たりするかもしれません）  
終了するには `lamp down`、次回の起動時のコマンドは `lamp up` または `lamp up -f` （既存コンテナ＆ボリューム一掃）などとすればOKです。
