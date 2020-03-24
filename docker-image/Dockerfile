FROM centos:7

RUN ln -sf /usr/share/zoneinfo/Asia/Tokyo /etc/localtime

RUN curl -sL https://rpm.nodesource.com/setup_12.x | bash - \
    && yum install -y epel-release \
    && yum update -y \
    && yum install -y \
        nodejs \
        git \
        nginx \
        httpd \
        mod_ssl \
        php \
        php-mbstring \
        php-mysql \
        php-pgsql \
        php-gd \
        php-xdebug \
        postfix \
        libc-client \
        libtidy \
        libpqxx \
        libmcrypt \
        libicu \
        bind-utils \
        gcc-c++ \
        multitail \
        sudo \
        cronie \
        logrotate \
        openssh-server \
        unzip \
    && rm -rf /var/cache/yum/* \
    && yum clean all

# -- phpenv setup
RUN git clone https://github.com/riywo/anyenv ~/.anyenv \
    && echo 'export PATH="$HOME/.anyenv/bin:$PATH"' >> ~/.bashrc \
    && /root/.anyenv/bin/anyenv install --force-init \
    && echo 'eval "$(anyenv init -)"' >> ~/.bashrc \
    && . ~/.bashrc && anyenv install phpenv

# -- maildev setup
RUN npm install maildev iconv -g --unsafe-perm

# -- Add utf-8 locle
RUN localedef -f UTF-8 -i ja_JP ja_JP

# -- ngrok setup
RUN cd /usr/bin \
    && curl https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-linux-amd64.zip | funzip > ngrok \
    && chmod +x ngrok

# -- permit for web log files
RUN chmod 0755 /var/log/httpd/ \
    && chmod 0755 /var/log/nginx/
