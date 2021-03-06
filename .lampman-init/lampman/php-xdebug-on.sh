#!/bin/sh

phpini=$(cat /phpinipath)
xdebug_version=$(/root/.anyenv/envs/phpenv/shims/php --ri xdebug | grep -i version)

# for XDebug 2.x
if [[ $xdebug_version =~ \ 2\. ]]; then
  sed -i "/xdebug\.remote_enable/d" $phpini
  sed -i "/xdebug\.remote_autostart/d" $phpini
  sed -i "/xdebug\.remote_host/d" $phpini
  sed -i "/xdebug\.remote_port/d" $phpini
  echo 'xdebug.remote_enable = On' >> $phpini
  echo 'xdebug.remote_autostart = On' >> $phpini
  echo "xdebug.remote_host=$LAMPMAN_PHP_XDEBUG_HOST" >> $phpini
  echo "xdebug.remote_port=$LAMPMAN_PHP_XDEBUG_PORT" >> $phpini
fi

# for XDebug 3.x
if [[ $xdebug_version =~ \ 3\. ]]; then
  sed -i "/xdebug\.client_host/d" $phpini
  sed -i "/xdebug\.client_port/d" $phpini
  sed -i "/xdebug\.mode/d" $phpini
  sed -i "/xdebug\.start_with_request/d" $phpini
  echo "xdebug.client_host=$LAMPMAN_PHP_XDEBUG_HOST" >> $phpini
  echo "xdebug.client_port=$LAMPMAN_PHP_XDEBUG_PORT" >> $phpini
  echo "xdebug.mode = debug" >> $phpini
  echo "xdebug.start_with_request = yes" >> $phpini
fi

# restart httpd
/usr/sbin/httpd -k restart
