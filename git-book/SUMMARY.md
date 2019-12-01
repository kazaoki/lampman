# Summary

- Lampman
- [概要](README.md)
- [もう少し詳しく](docs/intro-detail.md)


- 💻 Lampman セットアップ
    * [動作要件](docs/setup-require.md)
    * [lamp コマンドインストール](docs/setup-install.md)


- ⚡ 共通オプション
    * [-h, --help](docs/opt-help.md)
    * [-m, --mode](docs/opt-mode.md)


- 🔨 セットアップコマンド
    * [lamp init](docs/cmd-init.md)


- 🚩 コンテナ起動/終了コマンド
    * [lamp up](docs/cmd-up.md)
    * [lamp down](docs/cmd-down.md)


- 🔧 設定コマンド
    * [lamp config](docs/cmd-config.md)
    * [lamp xon, lamp xoff](docs/cmd-xdebug.md)


- ✨ 掃除コマンド
    * [lamp reject](docs/cmd-reject.md)
    * [lamp rmi](docs/cmd-rmi.md)
    * [lamp sweep](docs/cmd-sweep.md)


- 👀 監視コマンド
    * [lamp logs](docs/cmd-logs.md)
    * [lamp status](docs/cmd-status.md)


- 📚 DB操作コマンド
    * [lamp mysql](docs/cmd-mysql.md)
    * [lamp psql](docs/cmd-psql.md)


- 🔍 調査/その他コマンド
    * [lamp (オプション引数なし)](docs/cmd-noargs.md)
    * [lamp login](docs/cmd-login.md)
    * [lamp yaml](docs/cmd-yaml.md)
    * [lamp version](docs/cmd-version.md)
    * [lamp (extraコマンド)](docs/cmd-extra.md)


- 📝 設定ファイル解説：config.js
  - [基本設定](docs/conf-base.md)
  - [Lampmanコンテナ設定](docs/conf-lampman.md)
  - [MySQLコンテナ設定](docs/conf-mysql.md)
  - [PostgreSQLコンテナ設定](docs/conf-postgresql.md)
  - [ログコマンド設定](docs/conf-logs.md)
  - [Extraコマンド設定](docs/conf-extra.md)
  - [起動時アクション設定](docs/conf-upped.md)


- 👆 構成例
  - [コンテナ実行前にサーバに手入れしたい]()
  - [本番で使いたい]()
  - [localhostでDBしたい]()
  - [fluentでログしたい]()
  - [マウントせずgit cloneしたい]()


- 😵 困ったとき
  - [必要なPHPバージョンが一覧にない](docs/help-need-phpver.md)
  - [レンタルサーバに上げたら動かない](docs/help-error-prod.md)
  - [データベースが正常に復元しない](docs/help-db-restore.md)
  - [アクセス超遅いんだけど](docs/help-slowly.md)


- 🤖 技術情報/カスタム
  - [Dockerイメージについて](docs/tech-images.md)
  - [entrypoint.shについて](docs/tech-entrypoint.md)
  - [Lampman自体をいじりたい人へ](docs/tech-lampman-dev.md)
