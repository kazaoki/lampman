###### 🔧 設定コマンド

# PHP Xdebug有効/無効切り替え：`lamp xon`, `lamp xoff`
----------------------------------------------------------------------

以下コマンドは `lampman` コンテナの中で [Apache](https://httpd.apache.org/) の再起動が行われます。
オプションはありません。

### `lamp xon`

PHPのXdebugサーバを有効に切り替えます。

### `lamp xoff`

PHPのXdebugサーバを無効に切り替えます。

※切り替えの実態は `.lampman/lampman/php-xdebug-(on|off).sh` にあるシェルです。
