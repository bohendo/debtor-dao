FROM alpine:3.6

RUN apk add --update --no-cache openssl certbot nginx iputils && \
    openssl dhparam -out /etc/ssl/dhparam.pem 2048 && \
    ln -fs /dev/stdout /var/log/nginx/access.log && \
    ln -fs /dev/stderr /var/log/nginx/error.log

COPY ./ops/proxy.conf /etc/nginx/nginx.conf
COPY ./ops/proxy.entry.sh /root/entry.sh
COPY ./build/index.html /var/www/debtor-dao/
COPY ./build/bundle.js /var/www/debtor-dao/

ENTRYPOINT ["sh", "/root/entry.sh"]
