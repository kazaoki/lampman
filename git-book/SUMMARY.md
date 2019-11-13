# Summary

- Lampman（ランプマン）
    * [概要](README.md)
    * [もう少し詳しく](docs/intro-detail.md)


- セットアップ
    * [動作要件](docs/require.md)
    * [lamp コマンドインストール](docs/install.md)


- 共通オプション
    * [-h, --help](docs/opt-help.md)
    * [-m, --mode](docs/opt-mode.md)


- セットアップコマンド
    * [lamp init](docs/cmd-init.md)


- コンテナ起動/終了コマンド
    * [lamp up](docs/cmd-up.md)
    * [lamp down](docs/cmd-down.md)


- 設定コマンド
    * [lamp config](docs/cmd-config.md)
    * [lamp xon/xoff](docs/cmd-xdebug.md)


- 掃除コマンド
    * [lamp reject](docs/cmd-reject.md)
    * [lamp rmi](docs/cmd-rmi.md)
    * [lamp sweep](docs/cmd-sweep.md)


- 監視コマンド
    * [lamp logs](docs/cmd-logs.md)
    * [lamp status](docs/cmd-status.md)


- DB操作コマンド
    * [lamp mysql](docs/cmd-mysql.md)
    * [lamp psql](docs/cmd-psql.md)


- 調査/その他コマンド
    * [lamp (引数なし)](docs/cmd-noargs.md)
    * [lamp login](docs/cmd-login.md)
    * [lamp yaml](docs/cmd-yaml.md)
    * [lamp version](docs/cmd-version.md)
    * [lamp (extraコマンド)](docs/cmd-extra.md)


- 設定ファイル詳説
  - [General settings：基本設定]()
  - [Lampman base container settings：Lampmanベースコンテナ設定]()
  - [MySQL container(s) settings：MySQLコンテナ設定]()
  - [PostgreSQL container(s) settings：PostgreSQLコンテナ設定]()
  - [Logs command settings：ログファイル設定]()
  - [Extra command settings：extraコマンド設定]()
  - [Add action on upped lampman：up時の自動実行設定]()
  - [その他shファイル]()


- 技術情報
  - [標準のLAMP仕様]()
  - [標準で使用しているDockerイメージ]()
  - [ディレクトリ構成サンプル]()
  - [本番用構成例]()
  - [その他]()


- その他
  - [必要なPHPバージョンが一覧にない場合]()
  - [コンテナ実行前にサーバに手入れしたい]()
