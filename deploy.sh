#!/bin/bash
set -e

APP_NAME="quit-smoking-app"
REPO="https://github.com/zhezhu0304/quit-smoking-app.git"
DEPLOY_DIR="/var/www/$APP_NAME"

echo "==> 安装 Nginx..."
apt update -y && apt install -y nginx

echo "==> 安装 Node.js 20..."
if ! command -v node &>/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt install -y nodejs
fi

echo "==> 克隆/更新代码..."
if [ -d "$DEPLOY_DIR/.git" ]; then
  cd "$DEPLOY_DIR" && git pull
else
  rm -rf "$DEPLOY_DIR"
  git clone "$REPO" "$DEPLOY_DIR"
  cd "$DEPLOY_DIR"
fi

echo "==> 安装依赖并构建..."
npm ci
npm run build

echo "==> 配置 Nginx..."
cat > /etc/nginx/sites-available/$APP_NAME <<'NGINX'
server {
    listen 8001;
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

ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

echo "==> 部署完成！访问 http://$(curl -s ifconfig.me):8001"
