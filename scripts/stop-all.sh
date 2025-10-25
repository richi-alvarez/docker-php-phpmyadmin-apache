#!/usr/bin/env bash
# filepath: ./scripts/stop-all.sh
set -e

echo "🛑 Deteniendo todos los servicios..."
docker-compose down

echo "🧹 Limpiando contenedores huérfanos..."
docker-compose down --remove-orphans
docker volume rm $(docker volume ls -q)
echo "✅ Todos los servicios han sido detenidos"