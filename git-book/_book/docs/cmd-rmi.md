
# lamp rmi

## Dockerイメージをリストから選択して削除

### `lamp rmi`

Dockerイメージを選択して削除できます。

```
? 削除するイメージを選択してください。（複数可） »  
Instructions:
    ↑/↓: Highlight option
    ←/→/[space]: Toggle selection
    a: Toggle all
    enter/return: Complete answer
( )   [IMAGE] kazaoki/lampman:latest (7d77b3d8f7ac) 748MB - 3 weeks ago
( )   [IMAGE] php:7.2.23-apache (daddc1037fdf) 410MB
( )   [IMAGE] lampman-test-prod_fluentd:latest (4eea5e9c94db) 55.2MB
( )   [IMAGE] mongo-express:latest (abacf7d7e150) 98.4MB
...
```


### `lamp rmi -p`<br>`lamp rmi --prune`

選択肢を出さず `<none>` 状態のイメージのみ全て削除します。
