lamp コマンドインストール
==========

<pre class="cmd">
npm i lampman -g
</pre>

これでどこでも `lamp` コマンドが打てるようになります。４文字打つのが面倒な方用に `lm` でもOKなようにしておきました。
インストール済みの状態で上記コマンドを打つと最新バージョンになります。

※インストールエラーになる場合は、管理者権限にしたり `sudo` コマンドを頭につけてから実行してみてください。


## 例

<pre class="cmd">
$ npm i lampman -g
...

$ lamp version

  ╭───────────────────╮
  │ Lampman ver 1.0.0 │
  ├╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶┤
  │ mode: default     │
  ╘═══════════════════╛

<span class="comment">※ `lm version` でも同じです。</span>
</pre>

尚、Lampman のバージョンアップを行うには、上記と同様のコマンドを打てば自動的に本体のバージョンアップが行われます。
`lamp version` と打って正常にインストールされたか確認してください。