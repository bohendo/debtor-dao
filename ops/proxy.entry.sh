#!/bin/sh

env

devcerts=/etc/letsencrypt/devcerts
mkdir -p $devcerts
mkdir -p /etc/certs
mkdir -p /var/www/letsencrypt
mkdir -p /var/www/debtordao

if [[ -f "/etc/letsencrypt/live/$DOMAINNAME/privkey.pem" ]]
then
  echo "Found letsencrypt certs for $DOMAINNAME, using those"
  ln -sf /etc/letsencrypt/live/$DOMAINNAME/privkey.pem /etc/certs/privkey.pem
  ln -sf /etc/letsencrypt/live/$DOMAINNAME/fullchain.pem /etc/certs/fullchain.pem

elif [[ "$DOMAINNAME" == "localhost" ]]
then
  echo "Developing locally, using self-signed certs"
  if [[ ! -f "$devcerts/site.crt" ]]
  then
    openssl req -x509 -newkey rsa:4096 -keyout $devcerts/site.key -out $devcerts/site.crt -days 365 -nodes -subj '/CN=localhost'
  fi
  ln -sf $devcerts/site.key /etc/certs/privkey.pem
  ln -sf $devcerts/site.crt /etc/certs/fullchain.pem

else
  echo "Couldn't find certs for $DOMAINNAME, using certbot to initialize those now.."
  certbot certonly --standalone -m $EMAIL --agree-tos --no-eff-email -d $DOMAINNAME -n
  [ $? -eq 0 ] || sleep 9999 # FREEZE! Don't pester eff so much we get throttled
  ln -sf /etc/letsencrypt/live/$DOMAINNAME/privkey.pem /etc/certs/privkey.pem
  ln -sf /etc/letsencrypt/live/$DOMAINNAME/fullchain.pem /etc/certs/fullchain.pem
  echo "Done initializing certs, starting nginx..."

fi

sed -i 's/$hostname/'"$DOMAINNAME"'/' /etc/nginx/nginx.conf

# periodically fork off & see if our certs need to be renewed
renewcerts() {
  while true
  do
    echo -n "Preparing to renew certs... "
    if [[ -d "/etc/letsencrypt/live/$DOMAINNAME" ]]
    then
      echo -n "Found certs to renew for $DOMAINNAME... "
      certbot renew --webroot -w /var/www/letsencrypt/ -n
      echo "Done!"
    fi
    sleep 48h
  done
}
renewcerts &

sleep 3 # give renewcerts a sec to do it's first check
echo "Entrypoint finished, executing nginx..."; echo
exec nginx
