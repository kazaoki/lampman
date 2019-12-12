###### 💻 Lampman セットアップ

# lamp コマンドインストール
----------------------------------------------------------------------

<pre class="cmd">
npm i lampman -g
</pre>

これでどこでも `lamp` コマンドが打てるようになります。４文字打つのが面倒な方用に `lm` でもOKなようにしておきました。
インストール済みの状態で上記コマンドを打つと最新バージョンになります。

※インストールエラーになる場合は、管理者権限にしたり `sudo` コマンドを頭につけてから実行してみてください。


## 例
ご使用の開発環境に `lamp` コマンドをインストールしてバージョン確認します。
<pre class="cmd">
$ npm i lampman -g

<span class="comment">...（インストール実行）</span>

$ lamp version

  ╭───────────────────╮
  │ Lampman ver 1.0.0 │
  ├╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶┤
  │ mode: default     │
  ╘═══════════════════╛

<span class="comment">※ `lm version` でも同じです。</span>
</pre>

尚、Lampman のバージョンアップを行うには、上記と同様のコマンド `npm i lampman -g` を再度打てば自動的に本体のバージョンアップが行われます。
`lamp version` と打って正常にインストールされたか確認してください。