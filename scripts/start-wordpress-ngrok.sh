#!/usr/bin/env bash
# filepath: ./scripts/start-wordpress-ngrok.sh
set -e

echo "🚀 Iniciando MySQL..."
docker-compose up -d mysql

echo "⏳ Esperando que MySQL esté listo..."
sleep 15

echo "🚀 Iniciando phpMyAdmin..."
docker-compose up -d phpmyadmin

echo "⏳ Esperando que phpMyAdmin esté listo..."
sleep 15

echo "🛒 Iniciando Wordpress..."
docker-compose up -d wordpress

echo "⏳ Esperando que Wordpress esté listo..."
sleep 25

echo "🌐 Iniciando ngrok para WordPress..."
docker-compose up -d ngrok-wordpress

echo "📡 Esperando la URL de ngrok (dashboard en http://localhost:4041)..."
sleep 10

get_ngrok_url() {
    local attempts=0
    local max_attempts=30
    local ngrok_url=""
    
    while [ $attempts -lt $max_attempts ]; do
        ngrok_url=$(curl -s http://localhost:4041/api/tunnels 2>/dev/null \
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
#NGROK_URL='https://randy-best-rosa-rip.trycloudflare.com'
NGROK_URL=$(get_ngrok_url)
if [ -z "$NGROK_URL" ]; then
  echo "❌ Error: no se obtuvo la URL de ngrok."
  echo "📋 Logs de ngrok:"
  docker-compose logs --tail=20 ngrok-wordpress
  exit 1
fi

echo "🏷️  URL configurada: $NGROK_URL"

DOMAIN=$(echo "$NGROK_URL" | sed 's|https://||; s|http://||')
echo "🏷️  Configurando Wordpress para usar solo: $DOMAIN"

echo ""
echo "🎉 ¡WordPress configurado exitosamente con ngrok!"
echo ""
echo "📋 URLs disponibles:"
echo "🌐 WordPress Sitio:      $NGROK_URL"
echo "⚙️  WordPress Admin:      $NGROK_URL/wp-admin"
echo "🌐 Ngrok Dashboard:      http://localhost:4041"
echo "🗄️  phpMyAdmin:          http://localhost:8089"
echo "🛒 Wordpress Local:     http://localhost:8081"
echo ""
echo "🔑 Para configurar WordPress:"
echo "   1. Ve a: $NGROK_URL/wp-admin/install.php"
echo "   2. Sigue el asistente de instalación"
echo ""
echo "🔍 Para verificar el estado:"
echo "   docker-compose logs wordpress"
echo "   docker-compose logs ngrok-wordpress"