###### 📝 設定ファイル解説：config.js

# 設定ファイル詳説：起動時アクション設定
----------------------------------------------------------------------

## config.js 設定例
<pre class="cmd">
    /**
     * ---------------------------------------------------------------
     * 起動時アクション設定
     * ---------------------------------------------------------------
     */
    on_upped: [
        {
            // open MailDev on upped (win&mac only)
            type: 'open_browser',
            port: '1080',
        },
        {
            // open browser on upped (win&mac only)
            type: 'open_browser',
            schema: 'https',
            path: '/',
            // port: '',
            // container: 'lampman',
            // url: 'http://localhost:9981',
        },
        {
            type: 'run_command',
            command: 'gulp',
        },
        {
            // show message on upped
            type: 'show_message',
            message: 'hogehoge',
            style: 'primary', // primary|success|danger|warning|info|default
        },
        {
            // run extra command on upped
            type: 'run_extra_command',
            name: 'ab',
            // args: [],
        },
        {
            // run command on upped
            type: 'run_command',
            command: {
                win: 'dir',
                unix: 'ls -la',
            },
        },
    ],
</pre>

## `on_upped:`

`lamp up` 時に各種起動完了後に自動実行させる機能を記述しておけます。
複数定義しておくと、上から順番に実行されます。

- **type: 'show_message'**  
  コンソール画面にメッセージを枠付きで出力します。開発時の注意点などメモしておくと忘れなくていいです。
  + **message:**  
    ここにメッセージを指定してください。
  + **style:**  
    色を選択できます。以下のいずれかを指定してください。  
    `primary`  
    `success`  
    `danger`  
    `warning`  
    `info`  
    `default`  

- **type: 'open_browser'**  
  ホストOS側で規定のブラウザが立ち上がります。
  + **port:**  
    指定のポートへアクセスします。ただし、指定ポートが空いていない場合は自動的に外部ポート番号に変換して再度アクセスします。

  + **schema:**  
    `http` 、 `https` などを指定します。

  + **path:**  
    必要であればドメインのあとのURLパスを記述します。

  + **url:**  
    上記のようなURL指定方法ではなく、直接固定のURLを指定したいときはこちらで可能です。

  ※ `url:` や `schema` の指定がなければ自動的に `http://（Dockerホスト）` にアクセスします。

- **type: 'run_command'**  
  指定コマンドを実行します。
  + **command:**  
    コマンドを指定します。
    OS別にしたい場合はさらに下位に `win:`, `unix:` としてコマンドを記述してください。
  + **container:**  
    コンテナの中で実行したい場合はこちらも指定してください。実際のコンテナ名ではなく、 `lampman` `mysql_2` などのサービス名を指定します。
  + **args:**  
    引数が渡せるExtraコマンドであればこちらの指定も可能です。配列で指定してください。  
    例：
    ```
    args: ['--limit', '999']
    ```

- **type: 'run_extra_command'**  
  既にExtraコマンド設定で定義されたものを実行する場合はExtraコマンド名の指定だけでOKです。
  + **name:**  
    Extraコマンド名を指定してください。
  + **args:**  
    引数が渡せるExtraコマンドであればこちらの指定も可能です。配列で指定してください。  
    ※ `type: 'run_command'` と同様です。
