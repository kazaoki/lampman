###### 📝 設定ファイル解説：config.js

# 基本設定
----------------------------------------------------------------------

## config.js 設定例
<pre class="cmd">
...
    /**
     * ---------------------------------------------------------------
     * 基本設定
     * ---------------------------------------------------------------
     */

    // プロジェクト名
    project: 'lampman-proj',

    // docker-compose.yml のファイルバージョン
    // * docker-compose.override.ymlがあればそのversionと合わせる必要あり
    version: '2.2',

    // ネットワーク
    network: {
        name: 'default', // ネットワークを作成する場合。自動で頭にプロジェクト名が付く
        // external: 'lampman_default', // 既存ネットワークを指定する場合は実際の名前（頭にプロジェクト名が付いた状態）のものを指定
    },
...
</pre>

## // プロジェクト名

コンテナ名の頭につくようになりますので、半角英数字でわかりやすいものを設定してください。

## // docker-compose.yml のファイルバージョン

基本的に `2.2` としてください。
どうしても変更する際は `docker-compose.override.yml` の冒頭も同様に変更してください。尚、現在の Lampman では基本的に `2.2` 向けの出力しか対応していませんので、変更すると `docker-compose` で実行する際にエラーになる可能性が高いです。

## // ネットワーク

- `name` ... 所属するネットワークを作成する場合に指定してください。
- `external` ... 既に存在するネットワークに参加する場合は実際の名称を指定してください。