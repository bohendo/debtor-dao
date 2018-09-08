#!/usr/bin/env bash

########################################
# Development-specific environment variables

project=debtordao
proxy_image="${project}_proxy"

NODE_ENV="development"
DOMAINNAME="localhost"
EMAIL="noreply@example.com"

ETH_PROVIDER="https://localhost:8545"

########################################

cat -> /tmp/compose.yml <<EOF
version: '3.4'

volumes:
  letsencrypt:
  devcerts:

services:

  proxy:
    image: $proxy_image
    deploy:
      mode: global
    depends_on:
      - core
    volumes:
      - letsencrypt:/etc/letsencrypt
      - devcerts:/etc/letsencrypt/devcerts
    environment:
      - DOMAINNAME=$DOMAINNAME
      - EMAIL=$EMAIL
    ports:
      - "80:80"
      - "443:443"
EOF

docker stack deploy -c /tmp/compose.yml $project
rm /tmp/compose.yml
