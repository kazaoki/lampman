###### 😵 困ったとき

# データベースが正常に復元しない
----------------------------------------------------------------------

以下を確認してみてください。

- ボリュームロック（`volume_locked`）してないか → `lamp reject --locked` で該当DBを削除してから試してみる
- ダンプファイルが壊れていないか（正常にリストアできていたダンプファイルと比較） → `lamp up -D` で起動時のログを確認する。（DockerのGUIツール使って出力を確認してもいいですね）
- DBのDockerイメージのバージョンに対応したダンプファイルか
- 本当にリストアできていないのか（`lamp mysql` などして中身見る）
- DBコンテナ起動時に実行されるシェル `.lampman/mysql/entrypoint.sh` などで、おかしな設定をしていないか
