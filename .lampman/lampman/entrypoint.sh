#!/bin/bash

# # --------------------------------------------------------------------
# # general
# # --------------------------------------------------------------------
# echo ". /etc/bashrc" >> /root/.bashrc

# # --------------------------------------------------------------------
# # httpd mode
# # --------------------------------------------------------------------
# if [[ $GENIE_PROC == 'httpd' ]]; then
#   /usr/sbin/httpd
#   /loop.sh
#   exit 0
# fi

# # --------------------------------------------------------------------
# # mount mode is copy
# # --------------------------------------------------------------------
# if [[ $GENIE_CORE_DOCKER_MOUNT_MODE == 'copy' ]]; then
#   # -- dir copy
#   \cp -rpdfL /_/* /
# fi

# # --------------------------------------------------------------------
# # dlsync mode
# # --------------------------------------------------------------------
# if [[ $GENIE_PROC == 'dlsync' ]]; then
#   rm -f /tmp/mirror.cmd
#   if [[ $GENIE_TRANS_DLSYNC_REMOTE_CHARSET ]]; then
#     echo "set ftp:charset $GENIE_TRANS_DLSYNC_REMOTE_CHARSET" >> /tmp/mirror.cmd
#   fi
#   if [[ $GENIE_TRANS_DLSYNC_LOCAL_CHARSET ]]; then
#     echo "set file:charset $GENIE_TRANS_DLSYNC_LOCAL_CHARSET" >> /tmp/mirror.cmd
#   fi
#   echo "set ftp:list-options -a" >> /tmp/mirror.cmd
#   echo "set ssl:verify-certificate no" >> /tmp/mirror.cmd
#   # ref: https://hacknote.jp/archives/25366/
#   echo "set ftp:passive-mode on" >> /tmp/mirror.cmd
#   echo "set net:timeout 60" >> /tmp/mirror.cmd
#   echo "set net:max-retries 10" >> /tmp/mirror.cmd
#   echo "set net:reconnect-interval-base 10" >> /tmp/mirror.cmd
#   echo "set dns:max-retries 10" >> /tmp/mirror.cmd
#   echo "set dns:fatal-timeout 60" >> /tmp/mirror.cmd
#   echo "set net:limit-rate 13107200:13107200" >> /tmp/mirror.cmd
#   echo "open -u $GENIE_TRANS_DLSYNC_REMOTE_USER,$GENIE_TRANS_DLSYNC_REMOTE_PASS $GENIE_TRANS_DLSYNC_REMOTE_HOST" >> /tmp/mirror.cmd
#   echo "mirror $GENIE_TRANS_DLSYNC_LFTP_OPTION $GENIE_TRANS_DLSYNC_REMOTE_DIR /sync" >> /tmp/mirror.cmd
#   echo "close" >> /tmp/mirror.cmd
#   echo "quit" >> /tmp/mirror.cmd
#   echo "--------------------------------------------------------------"
#   cat /tmp/mirror.cmd
#   echo "--------------------------------------------------------------"
#   lftp -f /tmp/mirror.cmd
#   exit 0;
# fi

# # --------------------------------------------------------------------
# # entrypoint.sh started
# # --------------------------------------------------------------------
# echo 'entrypoint.sh setup start.' >> /var/log/entrypoint.log

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
  phpenv rehash
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


# --------------------------------------------------------------------
# Apache
# --------------------------------------------------------------------
# if [[ $GENIE_HTTP_APACHE_ENABLED ]]; then
# #   passenv_string=`set | grep -i '^GENIE_' | perl -pe 'while(<>){ chomp; $_=~ /([^\=]+)/; print "$1 "; }'`
# #   sed -i "/<__PASSENV__>/,/<\/__PASSENV__>/c\
# # \ \ # <__PASSENV__>\n\
# #   PassEnv $passenv_string\n\
# #   # </__PASSENV__>" /etc/httpd/conf/httpd.conf
# #   sed -i "s/DocumentRoot \"\/var\/www\/localhost\/htdocs\"/DocumentRoot \"\/var\/www\/html\"/" /etc/httpd/conf/httpd.conf
# #   sed -i "s/ScriptAlias \/cgi\-bin\//#ScriptAlias \/cgi\-bin\//" /etc/httpd/conf/httpd.conf
#   if [[ $GENIE_HTTP_APACHE_NO_LOG_REGEX ]]; then
#     sed -i "s/CustomLog \"logs\/access_log\" combined$/CustomLog \"logs\/access_log\" combined env\=\!nolog/" /etc/httpd/conf/httpd.conf
#     echo "SetEnvIfNoCase Request_URI \"$GENIE_HTTP_APACHE_NO_LOG_REGEX\" nolog" >> /etc/httpd/conf/httpd.conf
#     sed -i "s/\"%t %h %{SSL_PROTOCOL}x %{SSL_CIPHER}x \\\\\"%r\\\\\" %b\"/\"%t %h %{SSL_PROTOCOL}x %{SSL_CIPHER}x \\\\\"%r\\\\\" %b\" env\=\!nolog/" /etc/httpd/conf.d/ssl.conf
#   fi
#   if [[ $GENIE_HTTP_APACHE_REAL_IP_LOG_ENABLED ]]; then
#     sed -i "s/\%h /\%\{X-Forwarded-For\}i /g" /etc/httpd/conf/httpd.conf
#     sed -i "s/\%h /\%\{X-Forwarded-For\}i /g" /etc/httpd/conf.d/ssl.conf
#   fi
#   /usr/sbin/httpd
#   echo 'Apache setup done.' >> /var/log/entrypoint.log
# fi

sed -i "s/#ServerName www\.example\.com\:80/ServerName lampman\.localhost/" /etc/httpd/conf/httpd.conf



# # --------------------------------------------------------------------
# # Nginx
# # --------------------------------------------------------------------
# if [[ $GENIE_HTTP_NGINX_ENABLED ]]; then
#   if [[ $GENIE_HTTP_NGINX_HTTP_PORT ]]; then
#     sed -i "s/80 default_server/$GENIE_HTTP_NGINX_HTTP_PORT default_server/" /etc/nginx/nginx.conf
#   fi
#   /usr/sbin/nginx
#   echo 'Nginx setup done.' >> /var/log/entrypoint.log
# fi

# # --------------------------------------------------------------------
# # MailDev
# # --------------------------------------------------------------------
# if [[ $GENIE_MAIL_MAILDEV_ENABLED ]]; then
#   echo 'relayhost = 127.0.0.1:1025' >> /etc/postfix/main.cf
#   maildev -s 1025 -w 9981 $GENIE_MAIL_MAILDEV_OPTION_STRING &
# fi

# # --------------------------------------------------------------------
# # Postfix
# # --------------------------------------------------------------------
# if [[ $GENIE_MAIL_POSTFIX_ENABLED ]]; then
#   sed -i 's/inet_protocols = all/inet_protocols = ipv4/g' /etc/postfix/main.cf
#   if [[ $GENIE_MAIL_POSTFIX_FORCE_ENVELOPE != '' ]]; then
#     echo "canonical_classes = envelope_sender, envelope_recipient" >> /etc/postfix/main.cf
#     echo "canonical_maps = regexp:/etc/postfix/canonical.regexp" >> /etc/postfix/main.cf
#     echo "/^.+$/ $GENIE_POSTFIX_FORCE_ENVELOPE" >> /etc/postfix/canonical.regexp
#   fi
#   /usr/sbin/postfix start
#   echo 'Postfix setup done.' >> /var/log/entrypoint.log
# fi

# # --------------------------------------------------------------------
# # Fluentd
# # --------------------------------------------------------------------
# if [[ $GENIE_LOG_FLUENTD_ENABLED ]]; then
#   td-agent --config=$GENIE_LOG_FLUENTD_CONFIG_FILE &
# fi

# # --------------------------------------------------------------------
# # Copy directories other than /opt/
# # --------------------------------------------------------------------
# rsync -rltD --exclude /opt /genie/* /
# if [[ -d /genie/etc/httpd ]]; then
#   if [[ $GENIE_HTTP_APACHE_ENABLED ]]; then
#     /usr/sbin/httpd -k restart
#   fi
# fi
# if [[ -d /genie/etc/postfix ]]; then
#   if [[ $GENIE_MAIL_POSTFIX_ENABLED ]]; then
#     /usr/sbin/postfix reload
#   fi
# fi
# if [[ -d /genie/etc/nginx ]]; then
#   if [[ $GENIE_HTTP_NGINX_ENABLED ]]; then
#     /usr/sbin/nginx -s reload
#   fi
# fi



# --------------------------------------------------------------------
# Add host set to hosts file
# --------------------------------------------------------------------
for item in `echo $LAMPMAN_BIND_HOST | tr ',' ' '`
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
/usr/sbin/httpd -k start
echo 'lampman started.'

# -- Mail servers
if [[ $LAMPMAN_MAILDEV_START ]]; then

  # -- Postfix config change
  echo 'relayhost = 127.0.0.1:1025' >> /etc/postfix/main.cf
  sed -i 's/inet_protocols = all/inet_protocols = ipv4/g' /etc/postfix/main.cf

  # -- MailDev start
  maildev -s 1025 -w $LAMPMAN_MAILDEV_PORT &
fi

# -- Postfix start
/usr/sbin/postfix start

# --------------------------------------------------------------------
# daemon loop start
# --------------------------------------------------------------------
while true
do sleep 60
done
