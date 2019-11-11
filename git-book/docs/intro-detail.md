もう少し詳しく
============

さて、これだけでは[PHPのビルトインウェブサーバ](https://www.php.net/manual/ja/features.commandline.webserver.php)とあまり変わらない気もしますね。

> - 公開ディレクトリは `/public_html` じゃなくて `/xxx` なんだけど  
> - PHPのバージョン変えたい  
> - MySQLどーやんの  
> - 他の docker サービスも使いたい  
> - 自作のカスタムイメージに差し替えたい  
> - VPSで本番したい  

はい、こんなところでしょうか。全部可能です。  
基本的には設定ディレクトリ `.lampman/` の中でごにょごにょすることで、ご希望のサーバ環境が用意できます。

まずは起動までの内部フローを知っておいてください。仕組みはシンプルです。

  1. プロジェクトフォルダごとに `.lampman/config.js` に設定を書く
  2. `lamp up` と打つと `.lampman/config.js` を元に `.lampman/docker-compose.yml` が自動生成/更新され、`.lampman/` を起点に内部で `docker-compose up -d` が実行される
  3. `docker-compose` は実行時に `.lampman/docker-compose.yml` に設定上書き用のymlファイル `.lampman/docker-compose.override.yml` をマージして起動を開始する。

要は `config.js` から `docker-compose.yml` を生成して `docker-compose` コマンドを叩いてるだけなんです。  
なので、 設定ファイルをいじるだけでは実現できない複雑なサーバ設定などは、 `docker-compose.override.yml` に追加コンテナやサーバの設定ファイル等をマウントする設定を書くなり、独自のDockerイメージを用意するなりすれば、LAMP構成に限らず理論的にはなんでもできる、というワケです。
この辺は [docker-compose公式](http://docs.docker.jp/compose/overview.html) を確認してください。

`docker-compose.override.yml` を駆使して特殊なサーバ構成をがんばって作ると Lampman 自体必要無い気もしてきますが、他にもこのLAMP構成を管理するための便利コマンドを用意しておりますので、是非ご活用ください。

以降、詳説になります。
