#!/usr/bin/env bash
# filepath: ./scripts/stop-all.sh
set -e

echo "🛑 Deteniendo todos los servicios..."
docker-compose down
docker-compose up -d prestashop
echo "✅ Todos los servicios han sido reseteados"