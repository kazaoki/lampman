
# lamp （オプション引数なし）

## Dockerの登録・ステータス確認

### `lamp`

Dockerのイメージ、ボリューム、コンテナを一括で表示します。  
具体的には、Dockerコマンドで以下を実行した結果を見やすくフォーマット化した感じです。

- `docker images`
- `docker volume ls`
- `docker ps -a`

### 実行例
```
$ lamp

  [Images]
  ╭──────────────────────────────────────────────────────────────────────────────────────────────╮
  │ REPOSITORY                TAG                 IMAGE ID            CREATED             SIZE   │
  ├╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶┤
  │ kazaoki/lampman           latest              b28c278923e8        4 weeks ago         747MB  │
  │ kazaoki/phpenv            7.2.5               5d542724d063        7 weeks ago         261MB  │
  │ mysql                     latest              62a9f311b99c        3 months ago        445MB  │
  │ postgres                  9                   f5548544c480        3 months ago        230MB  │
  │ kazaoki/phpenv            7.3.6               a48b266fa359        5 months ago        262MB  │
  ╘══════════════════════════════════════════════════════════════════════════════════════════════╛

  [Volumes]
  ╭──────────────────────────────────────────────────────────────────────────────────────────────╮
  │ VOLUME NAME                                                        DRIVER              SCOPE │
  ├╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶┤
  │ 550eea2cbcb121c2a42437da1b16eb636fd1e52e795d7842d47b03b4bf96b94a   local               local │
  │ lampman-test-postgresql_2_data                                     local               local │
  │ locked_lampman-test-postgresql_data                                local               local │
  ╘══════════════════════════════════════════════════════════════════════════════════════════════╛

  [Containers]
  ╭────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
  │ NAMES                      ID                     IMAGE                  STATUS                     PORTS                  │
  ├╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶╶┤
  │ lampman-test-lampman       2a50907847aa           kazaoki/lampman        Up 17 minutes              0.0.0.0:80->80/tcp     │
  │                                                                                                     0.0.0.0:443->443/tcp   │
  │                                                                                                     0.0.0.0:2222->22/tcp   │
  │                                                                                                     0.0.0.0:9981->1080/tcp │
  │ lampman-test-mysql_2       f251449787ac           mysql:5.5              Up 17 minutes              0.0.0.0:3307->3306/tcp │
  │ lampman-test-phpenv        f93117eeff34           kazaoki/phpenv:5.6.22  Exited (0) 17 minutes ago                         │
  │ lampman-test-postgresql    51ba4154d7cb           postgres:9             Up 17 minutes              0.0.0.0:5432->5432/tcp │
  │ lampman-test-mysql         ada1fca19d0f           mysql:5.7              Up 17 minutes              0.0.0.0:3306->3306/tcp │
  │                                                                                                     33060/tcp              │
  │ lampman-test-postgresql_2  7a99bbb6bc4a           kazaoki/postgres-bigm  Up 17 minutes              0.0.0.0:5433->5432/tcp │
  ╘════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╛
```
