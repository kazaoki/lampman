###### 🔍 調査/その他コマンド

# 独自で設定したコマンドを実行する：`lamp (extraコマンド設定名)`
----------------------------------------------------------------------

### `lamp (extraコマンド設定名)`

`.lampman/config.js` に設定すると独自の `lamp` コマンドとして機能が実行できるものです。

設定のフォーマットは以下の通りです。
<pre class="cmd">
...
    extra: {
        {設定名1}: {
            command:   {実行するコマンド}
            container: {コンテナ側で実行する場合はコンテナ名}
            desc:      {ヘルプで表示する簡単な説明文}
        },
        {設定名2}: {
            ...
        },
        ...いくつでも設定可能
    }
...
</pre>

例えば以下のように設定できます。

### コンテナ内でコマンド実行

##### extraコマンド例：`lamp expose`
<pre class="cmd">
...
    extra: {
        expose: {
            command: 'ngrok http 80',
            container: 'lampman',
            desc: 'ngrok を使用して一時的に外部からアクセスできるようにする'
        },
    },
...
</pre>

### 指定URLでブラウザを開く

##### extraコマンド例：`lamp open`
<pre class="cmd">
...
    extra: {
        open: {
            command: {
                win: 'start https://localhost/info.php',
                unix: 'open https://localhost/info.php',
            },
            desc: 'ブラウザを立ち上げる'
        },
    },
...
</pre>

`container` を指定しない場合はホストOS側でのコマンド実行になります。  
また、Windows と macOS/Linux でコマンドが違う場合、上記のようにして分けることが可能です。

### コマンドの代わりに Node.js 関数を実行

##### extraコマンド例：`lamp envs`
<pre class="cmd">
...
    extra: {
        envs: {
            function: ()=>{
                console.log(process.env)
            },
            desc: 'ホストOS側環境変数を確認する'
        },
    },
...
</pre>

`command` の代わりに Node.js 関数が実行できます。
これはホストOS側でのみの実行になります。


### extraコマンドで引数を渡す

##### extraコマンド例：`lamp sum 12 34`

<pre class="cmd">
...
    extra: {
        sum: {
            function: (in1, in2)=>{
                console.log(parseInt(in1) + parseInt(in2))
            },
            desc: '引数1 + 引数2を計算します。'
        },
    },
...
</pre>

現在、引数を渡す場合は Node.js 関数のみになります。また、ハイフンが頭に付く引数は渡せません。
