
# 設定ファイル詳説：MySQLコンテナ設定

## config.js 設定例
<pre class="cmd">
    /**
     * ---------------------------------------------------------------
     * MySQLコンテナ設定
     * ---------------------------------------------------------------
     */
    mysql: {
        image:          'mysql:5.7',
        ports:          ['3306:3306'],
        database:       'test',
        user:           'test',
        password:       'test', // same root password
        charset:        'utf8mb4',
        collation:      'utf8mb4_general_ci',
        hosts:          ['main.db'],
        volume_locked:  false,
        query_log:      true,
        query_cache:    false,
        dump: {
            rotations:  3,
            filename:   'dump.sql',
        }
    },
    mysql_old: {
        image:          'mysql:5.7',
        ports:          ['3307:3306'],
        database:       'test',
        user:           'test',
        password:       'test', // same root password
        charset:        'utf8mb4',
        collation:      'utf8mb4_general_ci',
        hosts:          ['old.db'],
        volume_locked:  false,
        query_log:      false,
        query_cache:    false,
        dump: {
            rotations:  1,
            filename:   'dump.sql',
        }
    },
</pre>

## `mysql～`
