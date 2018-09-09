FROM alpine:3.6

RUN apk add --update --no-cache openssl certbot nginx iputils && \
    openssl dhparam -out /etc/ssl/dhparam.pem 2048 && \
    ln -fs /dev/stdout /var/log/nginx/access.log && \
    ln -fs /dev/stderr /var/log/nginx/error.log

COPY ./ops/proxy.conf /etc/nginx/nginx.conf
COPY ./ops/proxy.entry.sh /root/entry.sh
COPY ./build/public /var/www/debtordao/

ENTRYPOINT ["sh", "/root/entry.sh"]
