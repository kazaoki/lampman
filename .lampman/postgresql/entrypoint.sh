#!/bin/sh

# TimeZone set
# ------------
cp -p /usr/share/zoneinfo/Asia/Tokyo /etc/localtime
echo 'Asia/Tokyo' > /etc/timezone

# Package update & lang setting
# -----------------------------
echo "ja_JP.UTF-8 UTF-8" >> /etc/locale.gen
echo "ja_JP.EUC-JP EUC-JP" >> /etc/locale.gen
/usr/sbin/locale-gen
export LANG=ja_JP.UTF-8
/usr/sbin/update-locale LANG=ja_JP.UTF-8

# Add run shell before pass to main entrypoint.sh
# -----------------------------------------------
if [ -e /postgresql/entrypoint-add.sh ]; then
  /postgresql/entrypoint-add.sh
fi

# Pass to main shell
# ------------------
sed -i 's/exec "$@"/touch \/tmp\/.container-loaded\nexec "$@"/' /docker-entrypoint.sh
exec /docker-entrypoint.sh $@
