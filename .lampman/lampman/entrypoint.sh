#!/bin/bash

# # --------------------------------------------------------------------
# # sshd setup
# # --------------------------------------------------------------------
# if [[ $GENIE_TRANS_SSHD_ENABLED ]]; then
#   genie_pass=`echo $GENIE_TRANS_SSHD_LOGIN_PASS | openssl passwd -1 -stdin`
#   useradd $GENIE_TRANS_SSHD_LOGIN_USER -d $GENIE_TRANS_SSHD_LOGIN_PATH -M -l -R / -G docker -p $genie_pass
#   ssh-keygen -A
#   /usr/sbin/sshd -D -f /etc/ssh/sshd_config &
# fi

# --------------------------------------------------------------------
# php version container setup
# --------------------------------------------------------------------
phpini=/etc/php.ini
if [[ $LAMPMAN_PHP_PHPENV_IMAGE != '' ]]; then
  echo 'export PATH="$PATH:$PHPENV_ROOT/versions/${LAMPMAN_PHP_PHPENV_VERSION}/bin"' >> ~/.bashrc
  . ~/.bashrc
  phpenv global $LAMPMAN_PHP_PHPENV_VERSION
  \cp -f $PHPENV_ROOT/versions/$LAMPMAN_PHP_PHPENV_VERSION/httpd_modules/*.so* /etc/httpd/modules/
  \cp -f $PHPENV_ROOT/versions/$LAMPMAN_PHP_PHPENV_VERSION/lib64_modules/*.so* /usr/local/lib64/
  phpini=$PHPENV_ROOT/versions/$LAMPMAN_PHP_PHPENV_VERSION/etc/php.ini
  # -- php7 config
  if expr $LAMPMAN_PHP_PHPENV_VERSION : "^7" > /dev/null; then
    sed -i "s/LoadModule\ php5_module\ modules\/libphp5.so/LoadModule\ php7_module\ modules\/libphp7.so/" /etc/httpd/conf.modules.d/10-php.conf
  fi
fi
if [[ $LAMPMAN_PHP_ERROR_REPORT == 1 ]]; then
  sed -i "s/^display_errors\ \=\ Off/display_errors\ \=\ On/" $phpini
fi
echo "[Date]" >> $phpini
echo "date.timezone = \"Asia/Tokyo\"" >> $phpini
sed -i "/xdebug\.remote_enable/d" $phpini
sed -i "/xdebug\.remote_autostart/d" $phpini
sed -i "/xdebug\.remote_host/d" $phpini
sed -i "/xdebug\.remote_port/d" $phpini
if [[ $LAMPMAN_PHP_XDEBUG_HOST != '' ]]; then
  echo 'xdebug.remote_enable = On' >> $phpini
  echo 'xdebug.remote_autostart = On' >> $phpini
  echo "xdebug.remote_host=$LAMPMAN_PHP_XDEBUG_HOST" >> $phpini
  if [[ $LAMPMAN_PHP_XDEBUG_PORT != '' ]]; then
    echo "xdebug.remote_port=$LAMPMAN_PHP_XDEBUG_PORT" >> $phpini
  fi
else
  echo 'xdebug.remote_enable = Off' >> $phpini
  echo 'xdebug.remote_autostart = Off' >> $phpini
  echo 'xdebug.var_display_max_children = -1' >> $phpini
  echo 'xdebug.var_display_max_data = -1' >> $phpini
  echo 'xdebug.var_display_max_depth = -1' >> $phpini
fi
sed -i "s/^variables_order .*$/variables_order = \"EGPCS\"/" $phpini
echo $phpini > /phpinipath

# --------------------------------------------------------------------
# Apache
# --------------------------------------------------------------------
if [[ $LAMPMAN_APACHE_START ]]; then
  sed -i "s/ScriptAlias \/cgi\-bin\//#ScriptAlias \/cgi\-bin\//" /etc/httpd/conf/httpd.conf
  sed -i "s/CustomLog \"logs\/access_log\" combined$/CustomLog \"logs\/access_log\" combined env\=\!nolog/" /etc/httpd/conf/httpd.conf
  echo "SetEnvIfNoCase Request_URI \"\.(gif|jpg|jpeg|jpe|png|css|js|ico|woff|woff2|map)$\" nolog" >> /etc/httpd/conf/httpd.conf
  sed -i "s/\"%t %h %{SSL_PROTOCOL}x %{SSL_CIPHER}x \\\\\"%r\\\\\" %b\"/\"%t %h %{SSL_PROTOCOL}x %{SSL_CIPHER}x \\\\\"%r\\\\\" %b\" env\=\!nolog/" /etc/httpd/conf.d/ssl.conf
  # sed -i "s/\%h /\%\{X-Forwarded-For\}i /g" /etc/httpd/conf/httpd.conf
  # sed -i "s/\%h /\%\{X-Forwarded-For\}i /g" /etc/httpd/conf.d/ssl.conf
  sed -i "s/#ServerName www\.example\.com\:80/ServerName lampman\.localhost/" /etc/httpd/conf/httpd.conf
  sed -i "s/#AddHandler cgi-script \.cgi/AddHandler cgi-script .cgi/" /etc/httpd/conf/httpd.conf
  cat <<EOL >> /etc/httpd/conf/httpd.conf

<Directory "/var/www/html">
  Options FollowSymLinks ExecCGI
  AllowOverride All
  Require all granted
</Directory>
EOL
fi

# # --------------------------------------------------------------------
# # Fluentd
# # --------------------------------------------------------------------
# if [[ $GENIE_LOG_FLUENTD_ENABLED ]]; then
#   td-agent --config=$GENIE_LOG_FLUENTD_CONFIG_FILE &
# fi

# --------------------------------------------------------------------
# Add multitail config
# --------------------------------------------------------------------
cat <<EOL >> /etc/multitail.conf
### Apache Error log custom scheme
colorscheme:apache_errors
cs_re:magenta:line [0-9]+
cs_re:green:\[|\]
cs_re:yellow:^\[.+\]
cs_re:blue:in .*
cs_re:green:PHP [a-zA-Z ]*\:?
cs_re:blue:, referer.*
cs_re:green:\] [a-zA-Z0-9]+:
cs_re:red:.*
EOL

# --------------------------------------------------------------------
# Add host set to hosts file
# --------------------------------------------------------------------
for item in `echo $LAMPMAN_BIND_HOSTS | tr ',' ' '`
do
  value=(`echo $item | xargs | tr ':' ' '`)
  host=${value[0]}
  service=${value[1]}
  ip=`dig $service +short`
  if [[ $ip ]]; then
    echo "${ip} ${host}" >> /etc/hosts
  fi
done

# --------------------------------------------------------------------
# Add run shell before servers start
# --------------------------------------------------------------------
if [ -e /lampman/before-starts.sh ]; then
  /lampman/before-starts.sh
fi

# --------------------------------------------------------------------
# start servers
# --------------------------------------------------------------------

# -- Apache2 start
if [[ $LAMPMAN_APACHE_START ]]; then
  /usr/sbin/httpd -k start
  echo 'lampman started.'
fi

# -- Mail servers
if [[ $LAMPMAN_MAILDEV_START ]]; then

  # -- Postfix config change
  echo 'relayhost = 127.0.0.1:1025' >> /etc/postfix/main.cf
  sed -i 's/inet_protocols = all/inet_protocols = ipv4/g' /etc/postfix/main.cf

  # -- MailDev start
  maildev -s 1025 -w 1080 &
fi

# -- Postfix start
if [[ $LAMPMAN_POSTFIX_START ]]; then
  /usr/sbin/postfix start
fi

echo 'lampman started.'

# --------------------------------------------------------------------
# daemon loop start
# --------------------------------------------------------------------
while true
do sleep 60
done
