
# Lampman: 一瞬でLAMP環境を立ち上げる`lamp` コマンド

## `lamp` コマンドインストール

```
$ npm i lampman -g
```

## サンプル

```
$ mkdir public_html
$ echo "Hello Lampman" > public_html/index.php
$ lamp init
$ lamp up
```

`.lampman/docker-compose.yml` が生成され、[Docker Compose](https://docs.docker.com/compose/install/) が走り出して、ブラウザが勝手に開きます。

## ドキュメント

設定方法や機能などは別途ドキュメントページを用意しております。

[https://kazaoki.github.io/lampman/](https://kazaoki.github.io/lampman/)

## ライセンス
Apache License 2.0

## 作成者
[カザオキラボ](https://kazaoki.jp/)
