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
# httpd -k graceful

# # -- PHP tuning
# echo 'opcache.memory_consumption=128' >> /root/.anyenv/envs/phpenv/versions/7.3.6/etc/php.ini
# echo 'opcache.interned_strings_buffer=8' >> /root/.anyenv/envs/phpenv/versions/7.3.6/etc/php.ini
# echo 'opcache.max_accelerated_files=4000' >> /root/.anyenv/envs/phpenv/versions/7.3.6/etc/php.ini
# echo 'opcache.revalidate_freq=2' >> /root/.anyenv/envs/phpenv/versions/7.3.6/etc/php.ini
# echo 'opcache.fast_shutdown=1' >> /root/.anyenv/envs/phpenv/versions/7.3.6/etc/php.ini
# httpd -k graceful

# -- etc...

