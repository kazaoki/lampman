###### 💻 Lampman セットアップ

# 動作要件
----------------------------------------------------------------------

- [Docker](https://www.docker.com/)：なるべく最新版（推奨はしませんが一応 Toolbox版 でも機能します）
- [Docker Compose](https://docs.docker.com/compose/)：なるべく最新版
- [Node.js](https://nodejs.org/en/)：なるべく最新版
  - 12系で開発してますが10系でも動くようです。
  - Lampman をインストール/アップデートするための `npm` コマンドが含まれます。
- コマンドラインが打てる何か（なんでもいいです
  - おすすめ
    - [Visual Studio Code](https://azure.microsoft.com/ja-jp/products/visual-studio-code/)<small>（の中のコマンドパネル）</small>
- [Git](https://git-scm.com/)
    - Lampmanの設定ファイルをバージョン管理する場合に必要です。必須ではありませんがあったほうが安心です。

ホストOS上に [Xampp](https://www.apachefriends.org/jp/index.html) とか [PHP](https://www.php.net/) とかは不要です。必要なのは上記だけで、あとは各コンテナ内で対応します。
