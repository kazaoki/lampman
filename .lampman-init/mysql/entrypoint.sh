#!/bin/sh

# TimeZone set
# ------------
cp -p /usr/share/zoneinfo/Asia/Tokyo /etc/localtime
echo 'Asia/Tokyo' > /etc/timezone

# Set SQL mode to strict
# ----------------------
echo '\n[mysqld]' >> /etc/mysql/my.cnf
echo 'sql_mode=ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' >> /etc/mysql/my.cnf

# Set query log
# -------------------------
if [ $QUERY_LOGS = '1' ]; then
  echo 'general_log=ON' >> /etc/mysql/my.cnf
  echo "general_log_file=/var/log/$LAMPMAN_SERVICE/query.log" >> /etc/mysql/my.cnf
  touch /var/log/$LAMPMAN_SERVICE/query.log
  chown mysql:mysql /var/log/$LAMPMAN_SERVICE/query.log
fi

# Set query cache
# ---------------------------
if [ $QUERY_CACHE = '1' ]; then
  echo 'query_cache_limit=2M' >> /etc/mysql/my.cnf
  echo 'query_cache_size=64M' >> /etc/mysql/my.cnf
  echo 'query_cache_type=1' >> /etc/mysql/my.cnf
  echo 'event-scheduler=1' >> /etc/mysql/my.cnf
  echo "CREATE EVENT flush_query_cache ON SCHEDULE EVERY 1 DAY STARTS '2019-05-24 05:00:00' ENABLE DO FLUSH QUERY CACHE;" > /docker-entrypoint-initdb.d/flush-query-cache.sql
fi

# Set Max connections
# -------------------
echo 'max_connections=1000' >> /etc/mysql/my.cnf

# Add run shell before pass to main entrypoint.sh
# -----------------------------------------------
if [ -e /mysql/entrypoint-add.sh ]; then
  /mysql/entrypoint-add.sh
fi

# Pass to true shell
# ------------------
sed -i 's/exec "$@"/echo "Entrypoint finish."\nexec "$@"/' /entrypoint.sh
exec /entrypoint.sh $@
