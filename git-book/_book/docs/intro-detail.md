# もう少し詳しく
----------------------------------------------------------------------

さて、これだけでは[PHPのビルトインウェブサーバ](https://www.php.net/manual/ja/features.commandline.webserver.php)とあまり変わらない気もしますね。

> - 公開ディレクトリは `/public_html` じゃなくて `/html` なんだけど...  
> - PHPのバージョン変えたい  
> - MySQLどーやんの  
> - 他の docker サービスも使いたい  
> - 自作のカスタムイメージに差し替えたい  
> - VPSで本番したい  

はい、こんなところでしょうか。全部可能です。  
基本的には設定ディレクトリ `.lampman/` の中でごにょごにょすることで、ご希望のサーバ環境が用意できます。

## Lampman設定から起動までの流れ

  1. `lamp init` と打つと作成される `.lampman/config.js` に、必要な設定を書く

  2. `lamp up` と打つと `.lampman/config.js` を元に `.lampman/docker-compose.yml` が自動生成/更新され、`.lampman/` を起点に内部で `docker-compose up -d` が実行されてサーバ達が起動し出す

これだけです。  
要は `config.js` から `docker-compose.yml` を生成して `docker-compose up` コマンドを裏で叩いてるだけなんです。なので、 `config.js` をいじるだけでは実現できない複雑なサーバ設定などは [Docker Compose](https://docs.docker.com/compose/) が追加で読み込む `docker-compose.override.yml` ファイルに追加コンテナやサーバの設定ファイル等をマウントする設定を書くなり、独自のDockerイメージを用意するなりすれば、LAMP構成に限らず理論的にどんなサーバも構築できる、というワケです。

ちなみに `docker-compose.override.yml` を駆使して特殊なサーバ構成をがんばって作ってると Lampman 自体必要無い気もしてきますが、他にもこのLAMP構成をラクに管理するための便利コマンドを用意しておりますので、是非ご活用ください。

以降、詳説になります。
