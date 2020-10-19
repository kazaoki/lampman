FROM kazaoki/lampman:latest

RUN yum install -y \
        perl-Data-Dumper \
        perl-Email-MIME \
        perl-Email-Sender \
        perl-XML-TreePP \
        perl-DateTime-Format-HTTP \
        perl-DBI \
        perl-DBD-Pg \
        perl-DBD-MySQL \
        perl-GD-Barcode \
        perl-Digest-MD5 \
    && rm -rf /var/cache/yum/* \
    && yum clean all
