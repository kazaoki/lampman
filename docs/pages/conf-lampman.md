###### 📝 設定ファイル解説：config.js

# Lampmanコンテナ設定
----------------------------------------------------------------------

## config.js 設定例
<pre class="cmd">
...
    /**
     * ---------------------------------------------------------------
     * Lampmanコンテナ設定
     * ---------------------------------------------------------------
     */
    lampman: {
        image: 'kazaoki/lampman',
        login_path: '/var/www/html',

        // Apache
        apache: {
            start: true,
            ports: [
                '80:80',
                '443:443'
            ],
            mounts: [ // 公開ディレクトリに /var/www/html を割り当ててください。
                '../public_html:/var/www/html',
                // '../public_html:/home/user_a/public_html',
            ],
            rewrite_log: false, // or 1-8, true=8
        },

        // PHP
        php: {
            image: 'kazaoki/phpenv:7.2.5', // ここにあるバージョンから → https://hub.docker.com/r/kazaoki/phpenv/tags
            // ↑ コメントアウトするとlampman標準のPHP使用(5.4とか)
            error_report: true, // 本番環境の場合は必ずfalseに。
            xdebug_start: true, // 本番環境の場合は必ずfalseに。
            xdebug_host: 'host.docker.internal',
            xdebug_port: 9000,
        },

        // maildev
        maildev: {
            start: true,
            ports: ['9981:1080'],
        },

        // postfix
        postfix: {
            start: true,
            // ports: [],
        },

        // sshd
        sshd: {
            start: true,
            ports: ['2222:22'],
            user: 'sshuser',
            pass: '123456', // or process.env.LAMPMAN_SSHD_PASS
            path: '/var/www/html',
        },
    },
...
</pre>

## image:

メインの `lampman` コンテナとなるDockerイメージを指定します。
`kazaoki/lampman` は以下で一般公開されているイメージですので、フォークなどして独自のイメージを作成してご利用いただいてもOKです。

  - [`kazaoki/lampman` Dockerfile @ GitHub](https://github.com/kazaoki/lampman/blob/master/docker-image/Dockerfile)
  - [`kazaoki/lampman` @ Docker Hub](https://hub.docker.com/repository/docker/kazaoki/lampman)

## login_path:

`lamp login` でログインする際の初期のパス設定です。

## // Apache
Webサーバ [Apache](https://httpd.apache.org/) の設定をします。
- **start:**  
  `true` ... Apache を起動します  
  `false` ... Apache を起動しません  

- **ports:**  
  Apacheに通すポートを Docker 形式の文字列で複数指定できます。  
  ```
  (ホストOS側ポート):(コンテナ側ポート)
  ```

- **mounts:**  
  `lampman` コンテナの中にマウントしたいホストOS側のディレクトリを Docker 形式の文字列で複数指定できます。  
  ```
  (ホストOS側パス):(コンテナ側パス)
  ```
  尚、ホストOS側パスは相対パスで書くとプロジェクトパスからの相対となります。
  また、Web公開の場合は必ず `/var/www/html` に公開ディレクトリをマウントするようにしましょう。

- **rewrite_log:**  
  mod_rewrite のログファイル設定です。うまくリライトされない場合などに便利です。  
  `false` ... ログファイルを出力しません。  
  `1`～`8` ... レベル1～8のログファイルを出力します  
  `true` ... レベル8のログファイルを出力します

## // PHP
- **image:**  
  未指定（コメントアウト）の場合は、lampmanコンテナ標準のPHPバージョンが使用されます。（php5.4など）  
  PHPバージョンを指定したい場合は、以下から専用のDockerコンテナを指定する必要があります。（phpenvで構築したイメージ集です）  
  [https://hub.docker.com/r/kazaoki/phpenv/tags](https://hub.docker.com/r/kazaoki/phpenv/tags)   
  例：
  ```
  image: 'kazaoki/phpenv:7.2.5',
  ```
  もし該当のバージョンがなかったら、[GithubのIssue](https://github.com/kazaoki/anyenv-bins/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc)にリクエスト出してもらえれば可能な限り用意します。

- **error_report:**  
  `true` ... PHPのエラーレポートを有効にします。  
  `false` ... PHPのエラーレポートを無効にします。

- **xdebug_start:**  
  `true` ... コンテナ起動時にXdebugを開始します。コンテナ起動後は `lamp xoff` で停止できます。  
  `false` ... コンテナ起動時にはXdebugを開始しません。コンテナ起動後は `lamp xon` で開始できます。

- **xdebug_host:**  
  xDebug用のクライアント側のIPを指定します。
  例：
  ```
  xdebug_host: 'host.docker.internal',
  ```

- **xdebug_port:**  
  xDebug用のクライアント側のポート番号を指定します。
  例：
  ```
  xdebug_port: 9000,
  ```

## // maildev
[MailDev](https://github.com/maildev/maildev) はsendmailを利用して送信されるメールを捕獲してブラウザで確認するためのツールです。起動しておくと実際のメールアドレスには届かず、専用の画面でのみメールの内容が確認ができるようになるので、メール送信プログラム等の確認ができます。

- **start:**  
  `true` ... Maildev を起動します  
  `false` ... Maildev を起動しません  

- **ports:**  
  MailDevにアクセスするためのポート指定をDocker 形式の文字列で指定できます。コンテナ側では `1080` ポートで起動しているので、`:`の左側にホスト側で受けたいポート番号を指定してください。  
  例：
  ```
  ports: ['9981:1080'],
  ```

  この例の場合、ブラウザから [http://localhost:9981](http://localhost:9981) などどしてアクセスすれば MailDev 画面が開きます。
  SSL通信ではないので、外部を通る回線などの場合はご注意ください。

## // postfix
メールサーバ [Postfix](http://www.postfix.org/) の設定です。MailDevを使用したい場合は必ず起動してください。

- **start:**  
  `true` ... Postfix を起動します  
  `false` ... Postfix を起動しません  

- **ports:**  
  もし MailDev を使用せず、通常のメールサーバとして利用したい場合で、外から接続したい場合にポート指定をDocker 形式の文字列で指定できます。  
  例：
  ```
  ports: ['25:25', '587:587'],
  ```
  ただし、Lampmanの設定ファイルからはこの内蔵している Postfix サーバを細く設定できません。 別途設定ファイルを用意し、 `docker-compose.override.yml` 等でマウントする方法が考えられます。

## // sshd
SSHサーバ [OpenSSH](https://www.openssh.com/) の設定です。コンテナの中に直接アクセスできてしまうので、不要であれば設定しない方がいいでしょう。  
※ユーザーID=1000 の 1アカウント のみ設定が可能です。  
- **start:**  
  `true` ... sshd を起動します  
  `false` ... sshd を起動しません  

- **ports:**  
  外から接続するポート指定をDocker 形式の文字列で指定できます。コンテナ側では `22` ポートで起動しているので、`:`の左側にホスト側で受けたいポート番号を指定してください。  
  例：
  ```
  ports: ['2222:22'],
  ```
  尚、ホストOS側でファイアウォールを導入していても、ここで指定したポートはそのまま通ってしまう場合がありましたので、十分にご注意ください。

- **user:**  
  接続ユーザー名です。ここで指定したユーザー名は、ユーザーID=1000として追加されます。  
  例：
  ```
  user: 'sshuser',
  ```

- **pass:**  
  接続パスワードです。  
  例：
  ```
  pass: '123456',
  ```
  または、設定ファイルに直接パスワードを書きたくない場合は、 `.env` ファイルや環境変数 `LAMPMAN_SSHD_PASS` 等にセットしておき以下のようにすることも可能です。  
  例：
  ```
  pass: process.env.LAMPMAN_SSHD_PASS,
  ```

- **path:**  
  ログイン成功した際の着地するパスです。
  特に chroot やアクセス制限等は標準ではかかっていませんので、ご注意ください。  
  例：
  ```
  path: '/var/www/html',
  ```
