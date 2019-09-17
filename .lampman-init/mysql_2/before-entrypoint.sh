#!/bin/sh

# TimeZone set
# ------------
cp -p /usr/share/zoneinfo/Asia/Tokyo /etc/localtime
echo 'Asia/Tokyo' > /etc/timezone

# Set SQL mode to strict
# ----------------------
echo '\n[mysqld]' >> /etc/mysql/my.cnf
echo 'sql_mode=STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' >> /etc/mysql/my.cnf

# Copy dump file
# --------------
cp /mysql/dump.sql /docker-entrypoint-initdb.d

# Pass to true shell
# ------------------
sed -i 's/exec "$@"/echo "Entrypoint finish."\nexec "$@"/' /entrypoint.sh
exec /entrypoint.sh $@
