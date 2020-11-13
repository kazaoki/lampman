###### 🔧 設定コマンド

# PHP Xdebug有効/無効切り替え：`lamp xon`, `lamp xoff`
----------------------------------------------------------------------

以下コマンドは `lampman` コンテナの中で [PHP Xdebug](https://xdebug.org/) の有効/無効を切り替えます。[Apache](https://httpd.apache.org/) の再起動が行われますので、PHP上でなにか処理してるときなどに実行しない方が良いでしょう。  
オプションはありません。

### `lamp xon`

PHPのXdebugサーバを有効に切り替えます。

### `lamp xoff`

PHPのXdebugサーバを無効に切り替えます。

※切り替えの実態は `.lampman/lampman/php-xdebug-(on|off).sh` にあるシェルです。
