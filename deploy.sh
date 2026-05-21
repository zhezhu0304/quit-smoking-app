#!/bin/bash
set -e

APP_NAME="quit-smoking-app"
DEPLOY_DIR="${DEPLOY_PATH:-/var/www/quit-smoking-app}"

echo "==> Creating directory..."
mkdir -p "$DEPLOY_DIR/dist"

echo "==> Syncing files..."
rsync -av --delete dist/ "$DEPLOY_DIR/dist/"

echo "==> Configuring Nginx..."
sudo tee /etc/nginx/sites-available/$APP_NAME > /dev/null <<'NGINX'
server {
    listen 80;
    server_name _;
    root /var/www/quit-smoking-app/dist;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
    gzip_min_length 1000;
}
NGINX

sudo ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

echo "==> Deployment complete!"
