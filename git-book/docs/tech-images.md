
# 技術情報：Dockerイメージについて

## [`kazaoki/lampman`](https://hub.docker.com/repository/docker/kazaoki/lampman) イメージの仕様


| Services/Apps                               | External ports | Version                                             | 備考                                                        |
| ------------------------------------------- | -------------- | ----------------------------------------------------| ----------------------------------------------------------- |
| Linux                                       |                | [CentOS](https://www.centos.org/) 7.6               |                                                             |
| Apache                                      | 80, 443        |                                                     | デフォルトでは `public_html/` が公開ディレクトリです。            |
| PHP                                         |                | [PHP](https://www.php.net/) 5.4.16                  | OSに組み込まれているPHPです。このバージョンは古いので使用はおすすめしません。 |
| Perl/CGI                                    |                | [perl](https://www.perl.org/) 5.16.3                |                                                             |
| [MailDev](https://danfarrelly.nyc/MailDev/) | 9981           | [MailDev](https://github.com/maildev/maildev) 1.1.0 | sendmailに飛んできたメールをキャッチしてブラウザから中身を確認できるツールです。|
| [Postfix](http://www.postfix.org/)          |                | [Postfix](http://www.postfix.org/) 2.10             | メールの送信処理に必要です。（MailDevに飛ばすのにも使用します）     |


※１サービス１イメージが推奨のDockerですが、LAMP構成を１つの大きなサービスとして１つのイメージにまとめています。

## その他に使用されるDockerイメージ

| Images                                                           | Description                                                    |
| -----------------------------------------------------------------| -------------------------------------------------------------- |
| [`kazaoki/phpenv`](https://hub.docker.com/r/kazaoki/phpenv/tags) | バージョンごとのイメージを DockerHub に用意していますので、 `config.js` ではここにあるバージョンを指定してください。（本体のlampmanコンテナには phpenv が入っており、PHPバージョンごとに差分のみのイメージになります） |
| [`mysql`](https://hub.docker.com/_/mysql)                        | MySQL の公式イメージです。                                        |
| [`postgres`](https://hub.docker.com/_/postgres)                  | PostgreSQL の公式イメージです。                                   |

※ちなみに、イメージ名は `config.js` で変更できるので、自作カスタムのイメージに差し替え可能です。
