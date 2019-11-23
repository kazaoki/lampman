
# 設定ファイル詳説：PostgreSQLコンテナ設定

## config.js 設定例
<pre class="cmd">
    /**
     * ---------------------------------------------------------------
     * PostgreSQLコンテナ設定
     * ---------------------------------------------------------------
     */
    postgresql: {
        image:         'postgres:9',
        ports:         ['5432:5432'],
        database:      'test',
        user:          'test',
        password:      'test', // same root password
        hosts:         ['sub.db'],
        volume_locked: false,
        dump: {
            rotations: 3,
            filename:  'dump.sql',
        }
    },
    postgresql_v8: {
        image:         'postgres:8',
        ports:         ['5433:5432'],
        database:      'test',
        user:          'test',
        password:      'test', // same root password
        hosts:         ['v8.db'],
        volume_locked: true,
        dump: {
            rotations: 0,
            filename:  'dump.sql',
        }
    },
</pre>

## `postgresql～`
