#!/usr/bin/env bash
# filepath: ./scripts/start-joomla-ngrok.sh
set -e

echo "🚀 Iniciando MySQL..."
docker-compose up -d mysql

echo "⏳ Esperando que MySQL esté listo..."
sleep 15

echo "🚀 Iniciando phpMyAdmin..."
docker-compose up -d phpmyadmin

echo "⏳ Esperando que phpMyAdmin esté listo..."
sleep 15

echo "🛒 Iniciando Joomla..."
docker-compose up -d joomla

echo "⏳ Esperando que Joomla esté listo..."
sleep 25

echo "🌐 Iniciando ngrok para Joomla..."
docker-compose up -d ngrok-joomla

echo "📡 Esperando la URL de ngrok (dashboard en http://localhost:4041)..."
sleep 10
# NGROK_URL=""
# for i in $(seq 1 30); do
#   NGROK_URL=$(curl -s http://localhost:4040/api/tunnels 2>/dev/null \
#     | grep -o '"public_url":"https://[^"]*' | cut -d'"' -f4 | head -1 || true)
#   if [ -n "$NGROK_URL" ]; then
#     echo "✅ URL de ngrok encontrada: $NGROK_URL"
#     break
#   fi
#   echo "  🔄 Intento $i/30..."
#   sleep 3
# done
get_ngrok_url() {
    local attempts=0
    local max_attempts=30
    local ngrok_url=""
    
    while [ $attempts -lt $max_attempts ]; do
        ngrok_url=$(curl -s http://localhost:4040/api/tunnels 2>/dev/null \
            | grep -o '"public_url":"https://[^"]*' | cut -d'"' -f4 | head -1 || true)
        
        if [ -n "$ngrok_url" ]; then
            echo "$ngrok_url"
            return 0
        fi
        
        attempts=$((attempts + 1))
        echo "  🔄 Intento $attempts/$max_attempts..."
        sleep 3
    done
    
    return 1
}
NGROK_URL=$(get_ngrok_url)
if [ -z "$NGROK_URL" ]; then
  echo "❌ Error: no se obtuvo la URL de ngrok."
  echo "📋 Logs de ngrok:"
  docker-compose logs --tail=20 ngrok-joomla
  exit 1
fi

echo "🏷️  URL configurada: $NGROK_URL"

DOMAIN=$(echo "$NGROK_URL" | sed 's|https://||; s|http://||')
echo "🏷️  Configurando Joomla para usar solo: $DOMAIN"

echo ""
echo "🎉 Joomla configurado exitosamente con ngrok!"
echo ""
echo "📋 URLs disponibles:"
echo "🌐 Joomla Sitio:      $NGROK_URL"
echo "⚙️  Joomla Admin:      $NGROK_URL/administrator"
echo "🌐 Ngrok Dashboard:      http://localhost:4042"
echo "🗄️  phpMyAdmin:          http://localhost:8089"
echo "🐳 Apache Local:         http://localhost:86"
echo "🛒 Joomla Local:     http://localhost:8082"