#!/bin/bash
cd /opt/app
git pull
echo "=== Current notes/page.tsx line 10 ==="
sed -n '9,11p' frontend/app/notes/page.tsx
docker compose build --no-cache frontend
docker compose up -d frontend
echo "=== Status ==="
docker ps -a
