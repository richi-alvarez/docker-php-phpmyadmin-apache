#!/usr/bin/env bash
# filepath: ./scripts/start-wordpress-ngrok.sh
set -e

echo "🚀 Iniciando MySQL..."
docker-compose up -d mysql

echo "⏳ Esperando que MySQL esté listo..."
sleep 15

echo "🛒 Iniciando Wordpress..."
docker-compose up -d wordpress

echo "⏳ Esperando que Wordpress esté listo..."
sleep 25

echo "🌐 Iniciando ngrok para WordPress..."
docker-compose up -d ngrok

echo "📡 Esperando la URL de ngrok (dashboard en http://localhost:4041)..."
sleep 10
NGROK_URL=""
for i in $(seq 1 30); do
  NGROK_URL=$(curl -s http://localhost:4040/api/tunnels 2>/dev/null \
    | grep -o '"public_url":"https://[^"]*' | cut -d'"' -f4 | head -1 || true)
  if [ -n "$NGROK_URL" ]; then
    echo "✅ URL de ngrok encontrada: $NGROK_URL"
    break
  fi
  echo "  🔄 Intento $i/30..."
  sleep 3
done

if [ -z "$NGROK_URL" ]; then
  echo "❌ Error: no se obtuvo la URL de ngrok."
  echo "📋 Logs de ngrok:"
  docker-compose logs --tail=20 ngrok-wordpress
  exit 1
fi

echo "🏷️  URL configurada: $NGROK_URL"

DOMAIN=$(echo "$NGROK_URL" | sed 's|https://||; s|http://||')
echo "🏷️  Configurando Wordpress para usar solo: $DOMAIN"

echo "🔧 Actualizando URLs en la base de datos de WordPress..."
# docker-compose exec -T mysql mysql -u root -ptest wordpress <<SQL || { echo "❌ Error actualizando DB"; exit 1; }
# UPDATE wp_options SET option_value = '${NGROK_URL}' WHERE option_name = 'home';
# UPDATE wp_options SET option_value = '${NGROK_URL}' WHERE option_name = 'siteurl';
# SELECT CONCAT('WordPress configurado para: ', '${NGROK_URL}') as resultado;
# SQL


echo "🔄 Reiniciando WordPress para aplicar cambios..."
docker-compose restart wordpress

echo "⏳ Esperando que WordPress reinicie..."
sleep 15

echo ""
echo "🎉 ¡WordPress configurado exitosamente con ngrok!"
echo ""
echo "📋 URLs disponibles:"
echo "🌐 WordPress Sitio:      $NGROK_URL"
echo "⚙️  WordPress Admin:      $NGROK_URL/wp-admin"
echo "🌐 Ngrok Dashboard:      http://localhost:4041"
echo "🗄️  phpMyAdmin:          http://localhost:8089"
echo "🐳 Apache Local:         http://localhost:86"
echo "🛒 PrestaShop Local:     http://localhost:8082"
echo ""
echo "🔑 Para configurar WordPress:"
echo "   1. Ve a: $NGROK_URL/wp-admin/install.php"
echo "   2. Sigue el asistente de instalación"
echo ""
echo "🔍 Para verificar el estado:"
echo "   docker-compose logs wordpress"
echo "   docker-compose logs ngrok-wordpress"