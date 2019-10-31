# Lampman（ランプマン）

よくあるレンタルサーバの構成（**L**inux, **A**pache, **M**ySQL, **P**HP|**P**erl）をLAMP（ランプ）構成などと呼んだりしますが、これをサクッと自分の作業環境に構築できるようなコマンドラインツールを開発し、Lampman（ランプマン） と名付けました。

[Xampp](https://www.apachefriends.org/jp/index.html) で確認するよりは本番サーバに近い環境を用意でき、FTPで本番サーバに上げながら開発するよりも手軽で安全です。また、LAMPの基本機能やバージョンの指定、DB接続情報などを設定ファイルに書くだけですので、作業データと一緒に管理すれば他のクリエータとも開発環境の共有が容易です。


## 例

- LAMP環境を設定する -> `.lampman/config.js` いじる
- LAMP環境を開始する -> `lamp up`
- LAMP環境を破棄する -> `lamp down`

※このコマンド `lamp` は実際には内部で `docker-compose.yml` ファイルを自動生成して [docker-compose](https://docs.docker.com/compose/) を実行しているだけです。
