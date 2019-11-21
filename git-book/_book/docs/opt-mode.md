
# `-m <モード名>`, `--mode <モード名>`

## 実行モードを指定

全てのコマンドで使用できます。  
実行モードの切り替えが可能で、すべてのコマンドに追加できるオプションです。

実行モードを指定した場合、対象の設定ディレクトリとコンテナ内の環境変数が変わります。これにより開発用と本番用と分けて管理したりできます。
尚、未指定の場合の実行モードは `default` となります。

| モード指定コマンド例           | 対象設定ディレクトリ | コンテナ内環境変数 |
| --------------------------- | -------------------- | ------------------- |
| `lamp (コマンド)`            | .lampman/            | LAMPMAN_MODE=default |
| `lamp -m test (コマンド)`    | .lampman-test/       | LAMPMAN_MODE=test    |
| `lamp -m product (コマンド)` | .lampman-product/    | LAMPMAN_MODE=product |
| `lamp -m xxxxxx (コマンド)`  | .lampman-xxxxxx/     | LAMPMAN_MODE=xxxxxx  |

例えば本番用の設定を新たに作りたい場合、以下のようにすると `.lampman-product/` ディレクトリに設定がセットアップされますのでその中で本番用の設定を書いていきます。

### 例
<pre class="cmd">
$ lamp -m product init
（.lampman-product/ディレクトリが作成されるのでここに本番設定してく）

$ lamp -m product up
（本番モードでLAMP立ち上げ）
</pre>

### 他の方法で実行モードを指定する

コマンドに `-m`, `--mode` を記述しなくても実行モードが指定できる方法が２つあります。

#### 1. ホストOS上の環境変数 `LAMPMAN_MODE` に実行モードの文字列を設定しておく

例えばユーザーディレクトリの `.bashrc` に以下のように記述して環境変数を設定しておきます。（Linuxなど）
``` shell
export LAMPMAN_MODE=product
```
これで `lamp up` と打てば `product` モードでLAMPが立ち上がります。  
ただしこの指定方法の場合、cron実行などで `.bashrc` を読み込まないケースもあるので十分ご注意ください。

#### 2. プロジェクトディレクトリに `.env` ファイルを用意しておく

例えば以下のように記述しておきます。
``` shell
LAMPMAN_MODE=product
```

こうしておくことで、 `lamp` コマンドが `.env` を自動的に読み込んで環境変数を定義するため、実行モードが指定できます。
こちらの方がおすすめですが、 `.env` は環境別のパスワードなども記載されることもあるので git のコミット対象にしないようご注意ください。

### ホストOS側の環境変数を設定中で使う

ちなみに、ホストOS上の環境変数は設定ファイル中で参照できます。例えば環境変数 `LAMPMAN_MODE` なら、

- `.lampman/config.js` の中では `process.env.LAMPMAN_MODE`
- `.lampman/docker-compose.override.yml` の中では `"${LAMPMAN_MODE}"`

のように書くことで参照できるので、パスワードや環境による違いなど、設定ファイルをgitコミット対象にしたくない情報は環境変数に逃がすと良いでしょう。
