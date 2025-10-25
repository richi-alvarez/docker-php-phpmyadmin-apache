#!/usr/bin/env bash
# filepath: ./scripts/logs.sh

if [ -z "$1" ]; then
    echo "📋 Mostrando logs de todos los servicios..."
    docker-compose logs -f
else
    echo "📋 Mostrando logs de: $1"
    docker-compose logs -f "$1"
fi