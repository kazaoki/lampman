一番シンプルな使い方
=================

動作環境やインストール方法は後回しで、まずは雰囲気をどうそ。


1. まず `public_html/` があるプロジェクトディレクトリに移動して以下のコマンドを打ちます。

    ``` shell
    lamp init
    ```
    これによりプロジェクトディレクトリに `.lampman/` という設定用のディレクトリが作成されます。

2. 次に以下のコマンドを打つと、docker上でWebサーバがごそごそ起動します。

    ``` shell
    lamp up
    ```

3. 起動完了すると勝手にブラウザが開き [https://localhost](https://localhost) にアクセスされますので、`public_html/` にて開発を進めてください。（[Docker Toolbox](https://docs.docker.com/toolbox/toolbox_install_windows/) 環境の場合は [https://192.168.99.100](https://192.168.99.100) など）

4.  開発が終わったらそのまま放っておいてもいいですが、以下のコマンドで、起動させたサーバコンテナ達を終了させることができます。

    ``` shell
    lamp down
    ```

**基本は以上です。**

次回、続きからまた作業を開始したい場合は、このディレクトリ下位のどこからでも `lamp up` すれば同じくLAMPサーバ達が立ち上がります。※他のコンテナが邪魔して起動しない場合は `lamp up -f` で全消し＆起動（後述）

<br>

一応、上記のシンプルな構成のツリー図サンプルを掲示しておきます。基本はシンプルなのが一番です。

<pre class="cmd">
    (project-dir)/
        │
        │  <i class="comment">// Publish web root. (mount to /var/www/html)</i>
        ├─ pulic_html/
        │   ├─ index.php
        │   └─ ...
        │
        │  <i class="comment">// Lampman settings</i>
        └─ .lampman/
            ├─ lampman/
            │   └─ ...
            ├─ config.js
            ├─ docker-compose.override.yml
            └─ docker-compose.yml
</pre>

後述しますが、この `.lampman/` ごとプロジェクトディレクトリを [Git](https://git-scm.com/) で管理するのを強くお勧めします。
