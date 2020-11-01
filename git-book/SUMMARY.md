# Summary

- Lampman
- [概要](README.md)
- [もう少し詳しく](pages/intro-detail.md)


- 💻 Lampman セットアップ
    * [動作要件](pages/setup-require.md)
    * [lamp コマンドインストール](pages/setup-install.md)


- ⚡ 共通オプション
    * [-h, --help](pages/opt-help.md)
    * [-m, --mode](pages/opt-mode.md)


- 🔨 セットアップコマンド
    * [lamp init](pages/cmd-init.md)


- 🚩 コンテナ起動/終了コマンド
    * [lamp up](pages/cmd-up.md)
    * [lamp down](pages/cmd-down.md)


- 🔧 設定コマンド
    * [lamp config](pages/cmd-config.md)
    * [lamp xon, lamp xoff](pages/cmd-xdebug.md)


- ✨ 掃除コマンド
    * [lamp reject](pages/cmd-reject.md)
    * [lamp rmi](pages/cmd-rmi.md)
    * [lamp sweep](pages/cmd-sweep.md)


- 👀 監視コマンド
    * [lamp logs](pages/cmd-logs.md)
    * [lamp status](pages/cmd-status.md)


- 📚 DB操作コマンド
    * [lamp mysql](pages/cmd-mysql.md)
    * [lamp psql](pages/cmd-psql.md)


- 🔍 調査/その他コマンド
    * [lamp (オプション引数なし)](pages/cmd-noargs.md)
    * [lamp login](pages/cmd-login.md)
    * [lamp yaml](pages/cmd-yaml.md)
    * [lamp version](pages/cmd-version.md)
    * [lamp (extraコマンド)](pages/cmd-extra.md)


- 📝 設定ファイル解説：config.js
  - [基本設定](pages/conf-base.md)
  - [Lampmanコンテナ設定](pages/conf-lampman.md)
  - [MySQLコンテナ設定](pages/conf-mysql.md)
  - [PostgreSQLコンテナ設定](pages/conf-postgresql.md)
  - [ログコマンド設定](pages/conf-logs.md)
  - [Extraコマンド設定](pages/conf-extra.md)
  - [起動時アクション設定](pages/conf-upped.md)


<!--
- 👆 構成例
  - [コンテナ実行前にサーバに手入れしたい]()
  - [本番で使いたい]()
  - [localhostでDBしたい]()
  - [fluentでログしたい]()
  - [マウントせずgit cloneしたい]()
-->


- 😵 困ったとき
  - [必要なPHPバージョンが一覧にない](pages/help-need-phpver.md)
  - [レンタルサーバに上げたら動かない](pages/help-error-prod.md)
  - [データベースが正常に復元しない](pages/help-db-restore.md)
  - [アクセス超遅いんだけど](pages/help-slowly.md)
  - [WSL2環境でXDebugが機能しない](pages/help-wsl2-xdebug.md)


- 🤖 技術情報/カスタム
  - [Dockerイメージについて](pages/tech-images.md)
  - [entrypoint-add.shについて](pages/tech-entrypoint-add.md)
  - [Lampman自体をいじりたい人へ](pages/tech-lampman-dev.md)
