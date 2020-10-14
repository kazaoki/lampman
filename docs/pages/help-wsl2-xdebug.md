###### 😵 困ったとき

# WSL2環境でXDebugが機能しない場合
----------------------------------------------------------------------

2020-10-14 の時点で、WSL2環境上ではそのままではXDebugが正常に機能しないことがわかっています。
これはWSLやDocker側の不具合の可能性もありますので、一旦以下のような対応をすることで回避してください。

まず `docker-compose.override.yml` を以下のように書き、 `LAMPMAN_PHP_XDEBUG_HOST` を `${WSL_IP}` で上書きします。

<pre class="cmd">
version: '2.2'
services:
  lampman:
    environment:
      LAMPMAN_PHP_XDEBUG_HOST: '${WSL_IP}'
</pre>

そして WSL側のシェルで以下のコマンドを打ち、環境変数 `WSL_IP` がセットされるようにします。

<pre class="cmd">
echo 'export WSL_IP=$(hostname -I)' >> ~/.bashrc
source ~/.bashrc
</pre>

これで再度 `lamp up` してみてください。今度はうまくブレイクポイントで止まるはずです。（もちろん必要な各種設定はしてください）
  
本来は XDebug のホスト先は `host.docker.internal` となっており、Dockerが動いているWindowsホストのIPなのですが、WSL2環境では中間にWSL用のOS（Ubuntuなど）が挟まっているため、この中間OSのIPの指定が必要のようでした。上記の手順でそのIPに書き換えています。

※また、Lampman自体まだWSL2対応が完璧ではなく、コマンドが正常に終了せずに止まったり、なにかのプロセスがファイルを掴んで離さない（削除できない）等の問題も確認しております。
成熟を待ちましょう。
