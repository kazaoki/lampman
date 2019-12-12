###### 😵 困ったとき

# アクセス超遅いんだけど
----------------------------------------------------------------------

`lamp init` した初期状態ですと設定が開発向けになっているため動作が非常に遅くなっています。以下の項目を確認してください。

- PHPエラー出力を無効にする `config.js: lampman -> php -> error_report = false`
- PHP Xdebugを無効にする `config.js: lampman -> php -> xdebug_start = false`
- MySQLのクエリログを無効にする `config.js: lampman -> mysql -> query_log = false`


尚、Xdebugを一時的に有効/無効にしたい場合は `lm xon` / `lm xoff` コマンド打てば即反映します。ブラウザで何度かリロードすると速度が違ってるのを体感できると思います。

