# Lampman（ランプマン）

よくあるレンタルサーバの構成（**L**inux, **A**pache, **M**ySQL, **P**HP|**P**erl）をLAMP（ランプ）構成などと呼んだりしますが、これをサクッと自分の作業環境に構築できるコマンド `lamp` を開発し、名称をLampman（ランプマン） としました。
このコマンドは実際には内部でLAMP構成の `docker-compose.yml` ファイルを自動生成して [docker-compose](https://docs.docker.com/compose/) を実行しているだけです。
そのため、[Xampp](https://www.apachefriends.org/jp/index.html) で確認するよりは本番サーバに近い環境を用意でき、FTPで本番サーバに上げながら開発するよりも手軽で安全です。また、LAMPの基本機能やバージョンの指定、DB接続情報やダンプ自動ロードなど、ほぼ設定ファイルを少し編集するだけで用意できますので、作業データと一緒に [Git](https://git-scm.com/) 等で管理すれば他のクリエータとも開発環境の共有が容易になるというメリットもあります。

## ざっくりコマンドサンプル

```
$ cd proj-A/
$ lamp init
$ vi .lampman/config.js
$ lamp up
...
$ lamp down
```

`lamp init` は初回のみでOKです。



---

## Lampman導入の手順

`lamp` コマンドはインストールされており（後述）、 `proj-A/public_html/index.php` というプロジェクトフォルダと公開ファイルが用意されているとします。

```
$ cd proj-A/
$ lamp init
$ lamp up
```
ここでブラウザが起動します。



---

## 作業の流れサンプル


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
