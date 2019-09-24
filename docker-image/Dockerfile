FROM centos:7

RUN curl -sL https://rpm.nodesource.com/setup_12.x | bash - \
    && yum install -y epel-release \
    && yum update -y \
    && yum install -y \
        nodejs \
        git \
        nginx \
        httpd \
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
