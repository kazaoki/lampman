
# lamp reject

## コンテナ/ボリュームをリストから選択して削除

### `lamp reject`

コンテナまたはボリュームをリストから選択して強制削除することができます。
`config.js` で管理外のコンテナもリスト対象になります。

```
? 削除するコンテナ・ボリュームを選択してください。（スペースキーで複数選択可） »
( )   [CONTAINER] lampman-test-lampman
( )   [CONTAINER] lampman-test-phpenv
( )   [CONTAINER] lampman-test-mysql
( )   [VOLUME] a145fa9593755c9bf71165f8bf3abdf1ee87fc0ac9f3f671eeceb20e74f2d00b
( )   [VOLUME] lampman-test-mysql_data
...
```

### `lamp reject -l`<br>`lamp reject --locked`

通常はロック中のボリュームはリストに表示されてもグレーアウトして選択ができないようになっていますが、それを選択できるようにするオプションです。


### `lamp reject -f`<br>`lamp reject --force`

リストから選択可能なものすべてを、選択画面なしに強制的に削除します。  
そのため、 `lamp reject -lf` とすればロックボリュームも含めてコンテナ・ボリュームが全て一括削除されてしまいますのでご注意を。
