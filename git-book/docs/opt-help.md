###### ⚡ 共通オプション

# ヘルプ表示：`-h`, `--help`
----------------------------------------------------------------------

全てのコマンドで使用できます。
どんな `lamp` コマンドが打てるのかの一覧が確認できます。

`lamp -h` で全体のコマンド一覧が確認できます。  
`lamp xxx -h` などとすればそのコマンドのヘルプが出ます。

## 例
<pre class="cmd">
$ lamp -h

Usage: lamp|lm [command] [options]

Commands:
  lamp init [options]             初期化（.lampman/ ディレクトリ作成）
  lamp up [options]               LAMP起動（.lampman/docker-compose.yml 自動更新）
  lamp down                       LAMP終了
  lamp config                     設定ファイル(config.js)をエディタで開く
  lamp xoff                       PHP Xdebug を無効にする
  lamp xon                        PHP Xdebug を有効にする
  lamp reject [options]           コンテナ・ボリュームのリストから選択して削除（docker-compose管理外も対象）
  lamp rmi [options]              イメージを選択して削除
  lamp sweep [options]            全てのコンテナ、未ロックボリューム、<none>イメージ、不要ネットワークの一掃
  lamp logs                       ログファイル監視（グループ未指定なら最初の１つが表示）
  lamp status                     dockerコンテナ達の標準出力(logs)を監視する
  lamp mysql [service] [options]  MySQL操作（オプション未指定なら mysql クライアントが実行されます）
  lamp psql [service] [options]   PostgreSQL操作（オプション未指定なら psql クライアントが実行されます）
  lamp login [service] [options]  コンテナのコンソールにログインします
  lamp yaml [options]             YAMLの更新のみ、出力のみする
  lamp version [options]          バージョン表示
  lamp expose                     ngrok を使用して一時的に外部からアクセスできるようにする on lampman

Global options:
  --help, -h  ヘルプ表示  [boolean]
  --mode, -m  実行モードを指定  [default: "default"]
</pre>

※上記最後のコマンド `expose` は設定ファイル中の extra コマンドに登録されているものです。（カスタム追加できるコマンド設定です。後述）
