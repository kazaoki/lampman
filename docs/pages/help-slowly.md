###### 😵 困ったとき

# アクセス超遅いんだけど
----------------------------------------------------------------------

`lamp init` した初期状態ですと設定が開発向けになっているため動作が非常に遅くなっています。以下の項目を確認してください。

- PHPエラー出力を無効にする `config.js: lampman -> php -> error_report = false`
- PHP Xdebugを無効にする `config.js: lampman -> php -> xdebug_start = false`
- MySQLのクエリログを無効にする `config.js: lampman -> mysql -> query_log = false`

尚、Xdebugを一時的に有効/無効にしたい場合は `lm xon` / `lm xoff` コマンド打てば即反映します。体感がかなり違うので、状況によって使い分けましょう。

ちなみに、Linuxファイルシステムで起動すると（当然ですが）早くなります。  
最近流行りの <a href="https://docs.microsoft.com/ja-jp/windows/wsl/install-win10" target="_blank">WSL</a> 等の場合、 `/mnt/` 以下ではなく、`//wsl$` のようなLinuxのファイルシステム下に置くと爆速になります。
