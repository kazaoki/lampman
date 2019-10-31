
# lamp up

## コンテナ起動

### `lamp up`

オプション無しで実行すると、現在の `.lampman/config.js` を元に `.lampman/docker-compose.yml` が自動生成され、内部で `docker-compose` が実行されます。ただしこの時、フォアグラウンドモードではなくデーモンモードで機能しますので、ログ等は画面に流れません。  

機能的には以下とほぼ同等となります。
<pre class="cmd">
$ cd .lampman/
$ docker-compose up -d --project-name (プロジェクト名)
</pre>

再起動したい場合も同様のupコマンドでOKです。ymlが更新された必要なコンテナが再起動されます。（確実に全て更新したい場合は `down` してからか `-f, --flush`オプションを指定してください。後述）


### `lamp up -f`<br>`lamp up --flush`

既存のコンテナと未ロックボリュームを全て削除してキレイにしてから起動します。
ロックボリュームとは Lampman 独自の識別で `locked_` から始まるラベルを持つボリュームのことです。（後述）  
このコマンドは、コンテナが終了していようが起動していようがすっかりキレイに排除してから起動を試みるもので、ポート開放がうまくいかなかったり既存コンテナが邪魔してたりする可能性がある場合などにおすすめです。


### `lamp up -o <オプション文字列>`<br>`lamp up --docker-compose-options <オプション文字列>`

`docker-compose` コマンドに渡すオプションを文字列で指定可能です。
ただし、内部で使用している [Commander.js](https://www.npmjs.com/package/commander) の問題なのか、ハイフンの前にバックスラッシュを入れないとエラーになるようです。

```shell
$ lamp up -o "-t 300"      ... NG
$ lamp up -o "\-t 300"     ... OK
```

### `lamp up -D`

デーモンじゃなくフォアグラウンドで起動します。ログが確認できるようになりますので、うまくdockerが起動しない場合などに活用してください。

### `lamp up -n`<br>`lamp up--no-update`

`.lampman/docker-compose.yml` を更新せずに起動させることが可能です。設定ファイルを書き換えてしまったものの、以前のymlで起動を確認したい場合などにご指定ください。

