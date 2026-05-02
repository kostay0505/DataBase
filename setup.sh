#!/bin/bash
set -e

echo "=== Notes App Setup ==="

# Install git
apt install -y git

# Clone repo
if [ -d /opt/app ]; then
  cd /opt/app && git pull
else
  git clone https://github.com/kostay0505/DataBase.git /opt/app
fi

cd /opt/app

# Create .env if not exists
if [ ! -f .env ]; then
  cp .env.example .env
  echo ""
  echo ">>> Создан .env файл. Позже заполни TRILIUM_TOKEN."
fi

# Start Trilium
docker compose up -d trilium

echo ""
echo "=== Готово! ==="
echo "Trilium запущен на порту 8080"
echo "Открой в браузере: http://$(curl -s ifconfig.me):8080"
echo ""
echo "Зайди в Trilium → Menu → Options → ETAPI → Create token"
echo "Затем добавь токен в /opt/app/.env как TRILIUM_TOKEN=..."
