# `-h`, `--help`

## ヘルプ表示

全てのコマンドで使用できます。
どんな `lamp` コマンドが打てるのかの一覧が確認できます。

`lamp init -h` などとすればそのコマンド機能のヘルプが出ます。  
`lamp -h` で全体のコマンド一覧が確認できます。

## 例
<pre class="cmd">
$ lamp -h

Usage: lamp [options] [command]

Options:
  -m, --mode &lt;mode&gt;                 実行モードを指定できます。（標準は default ）
  -h, --help                        ヘルプを表示します。

Commands:
  init [options]                    初期化（.lampman/ ディレクトリ作成）
  up [options]                      LAMP起動（.lampman/docker-compose.yml 自動更新）
  down                              LAMP終了
  config                            設定ファイル(config.js)をエディタで開く
  xoff                              PHP Xdebug を無効にする
  xon                               PHP Xdebug を有効にする
  reject [options]                  コンテナ・ボリュームのリストから選択して削除（docker-compose管理外も対象）
  rmi [options]                     イメージを選択して削除
  sweep [options]                   全てのコンテナ、未ロックボリューム、&lt;none&gt;イメージ、不要ネットワークの一掃
  logs [options] [groups...]        ログファイル監視（グループ未指定なら最初の１つが表示）
  status                            dockerコンテナ達の標準出力(logs)を監視する
  mysql [options] [container-name]  MySQL操作（オプション未指定なら mysql クライアントが実行されます）
  psql [options] [container-name]   PostgreSQL操作（オプション未指定なら psql クライアントが実行されます）
  login [options] [container-name]  コンテナのコンソールにログインします
  yaml [options]                    YAMLの更新のみ、出力のみする
  version [options]                 バージョン表示
  expose                            ngrok を使用して一時的に外部からアクセスできるようにする on lampman
</pre>

※上記最後のコマンド `expose` は設定ファイル中の extra コマンドに登録されているものです。
