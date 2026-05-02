#!/bin/bash
cd /opt/app
git pull
docker compose up -d --build frontend
echo "=== Status ==="
docker ps -a
echo "=== Logs ==="
docker compose logs --tail=20 frontend
