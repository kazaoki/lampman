#!/bin/bash

# --------------------------------------------------------------------
# Additional command before server starts.
# --------------------------------------------------------------------

# -- Apache tuning
# cat - << EOS >> /etc/httpd/conf/httpd.conf
# <IfModule prefork.c>
#   StartServers     256
#   MinSpareServers  128
#   MaxSpareServers  256
#   ServerLimit      256
#   MaxClients       256
#   MaxRequestsPerChild  4000
# </IfModule>
# Timeout 60
# HostnameLookups Off
# EOS

# -- Real IP for logging
# sed -i "s/\%h /\%\{X-Forwarded-For\}i /g" /etc/httpd/conf/httpd.conf
# sed -i "s/\%h /\%\{X-Forwarded-For\}i /g" /etc/httpd/conf.d/ssl.conf

# # -- PHP tuning
# echo 'opcache.memory_consumption=128' >> /root/.anyenv/envs/phpenv/versions/7.3.6/etc/php.ini
# echo 'opcache.interned_strings_buffer=8' >> /root/.anyenv/envs/phpenv/versions/7.3.6/etc/php.ini
# echo 'opcache.max_accelerated_files=4000' >> /root/.anyenv/envs/phpenv/versions/7.3.6/etc/php.ini
# echo 'opcache.revalidate_freq=2' >> /root/.anyenv/envs/phpenv/versions/7.3.6/etc/php.ini
# echo 'opcache.fast_shutdown=1' >> /root/.anyenv/envs/phpenv/versions/7.3.6/etc/php.ini

# -- ltsv log for fluentd
sed -i "s/^CustomLog/#CustomLog/" /etc/httpd/conf.d/ssl.conf
sed -i 's/"%t %h %{SSL_PROTOCOL}x %{SSL_CIPHER}x/#/' /etc/httpd/conf.d/ssl.conf
sed -i "s/<\/VirtualHost>//" /etc/httpd/conf.d/ssl.conf
cat <<EOL >> /etc/httpd/conf.d/ssl.conf
LogFormat "domain:%V\thost:%h\tserver:%A\tident:%l\tuser:%u\ttime:%{%Y/%m/%d %H:%M:%S}t\tmethod:%m\tpath:%U%q\tprotocol:%H\tstatus:%>s\tsize:%b\treferer:%{Referer}i\tagent:%{User-Agent}i\tresponse_time:%D" apache_ltsv
CustomLog logs/ssl_request_log apache_ltsv
</VirtualHost>
EOL
