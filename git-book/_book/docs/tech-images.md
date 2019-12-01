###### 🤖 技術情報/カスタム

# Dockerイメージについて
----------------------------------------------------------------------

## [`kazaoki/lampman`](https://hub.docker.com/repository/docker/kazaoki/lampman) イメージの仕様

Lampman がメインで使用するLAMPサーバの母体となるコンテナのイメージです。[Docker Hub](https://hub.docker.com/repository/docker/kazaoki/lampman) に上がっているのでビルドの必要はありません。

| Services/Apps                               | External ports | Version                                             | 備考                                                        |
| ------------------------------------------- | -------------- | ----------------------------------------------------| ----------------------------------------------------------- |
| Linux                                       |                | [CentOS](https://www.centos.org/) 7.6               |                                                             |
| Apache                                      | 80, 443        |                                                     | `/var/www/html`がドキュメントルートになります                    |
| PHP                                         |                | [PHP](https://www.php.net/) 5.4.16                  | OSに組み込まれているPHPです。このバージョンは古いので使用はおすすめしません。 |
| Perl/CGI                                    |                | [perl](https://www.perl.org/) 5.16.3                | 標準で拡張子 `.cgi` でCGIとして実行可能な Apache 設定になっています。   |
| [MailDev](https://danfarrelly.nyc/MailDev/) | 1080           | [MailDev](https://github.com/maildev/maildev) 1.1.0 | sendmail に飛んできたメールをキャッチしてブラウザで中身を確認できるツールです。|
| [Postfix](http://www.postfix.org/)          |                | [Postfix](http://www.postfix.org/) 2.10             | メールの送信処理に必要です。（MailDevに飛ばすのにも使用します）     |

※Dockerイメージをビルドする際に取り込むファイル（ADD,COPY等）は一切無いので、[Dockerfile](https://hub.docker.com/r/kazaoki/lampman/dockerfile) のみで構築可能です。  
※１サービス１イメージが推奨のDockerですが、LAMP構成を１つの大きなサービスとして１つのイメージにまとめています。（ので、結構でかいです。700MB以上あります）

## その他に使用されるDockerイメージ

| Images                                                           | Description                                                    |
| -----------------------------------------------------------------| -------------------------------------------------------------- |
| [`kazaoki/phpenv`](https://hub.docker.com/r/kazaoki/phpenv/tags) | `config.js` でPHPのバージョンを指定すると、ここにあるイメージが追加でダウンロードされて `lampman` コンテナにマウントされます。そして初期起動時に内部でphpenvによるバージョンの切り替えが行われるという仕組みです。 |
| [`mysql`](https://hub.docker.com/_/mysql)                        | MySQL の公式イメージです。                                        |
| [`postgres`](https://hub.docker.com/_/postgres)                  | PostgreSQL の公式イメージです。                                   |

※ただし、使用されるイメージは `config.js` で全て自由に変更できるので、自作カスタムのイメージに差し替え可能です。

例：MySQL の設定に MariaDB のイメージを指定する
<pre class="cmd">
...
    mysql: {
        image:          'mariadb:10.4',
        ports:          ['3306:3306'],
        ...
</pre>
