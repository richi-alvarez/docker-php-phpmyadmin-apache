#!/usr/bin/env bash
# filepath: ./scripts/start-prestashop-ngrok-only.sh
set -e

echo "🚀 Iniciando MySQL..."
docker-compose up -d mysql

echo "⏳ Esperando que MySQL esté listo..."
sleep 15

echo "🚀 Iniciando phpMyAdmin..."
docker-compose up -d phpmyadmin

echo "⏳ Esperando que phpMyAdmin esté listo..."
sleep 15

echo "🛒 Iniciando PrestaShop..."
docker-compose up -d prestashop

echo "⏳ Esperando que PrestaShop esté listo..."
sleep 25

echo "🌐 Iniciando ngrok conectado a PrestaShop..."
docker-compose up -d ngrok

echo "📡 Obteniendo URL de ngrok..."
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
  docker-compose logs --tail=20 ngrok
  exit 1
fi

DOMAIN=$(echo "$NGROK_URL" | sed 's|https://||; s|http://||')
echo "🏷️  Configurando PrestaShop para usar solo: $DOMAIN"

echo "🔧 Actualizando configuración en la base de datos..."
docker-compose exec -T mysql mysql -u root -ptest prestashop <<SQL
UPDATE ps_shop_url SET domain = '${DOMAIN}', domain_ssl = '${DOMAIN}' WHERE id_shop_url = 1;
UPDATE ps_configuration SET value = '${DOMAIN}' WHERE name = 'PS_SHOP_DOMAIN';
UPDATE ps_configuration SET value = '${DOMAIN}' WHERE name = 'PS_SHOP_DOMAIN_SSL';
UPDATE ps_configuration SET value = '1' WHERE name = 'PS_SSL_ENABLED';
UPDATE ps_configuration SET value = '1' WHERE name = 'PS_SSL_ENABLED_EVERYWHERE';
SELECT CONCAT('PrestaShop configurado para: ', '${DOMAIN}') as resultado;
SQL

echo "🧹 Limpiando caché de PrestaShop..."
docker-compose exec prestashop rm -rf var/cache/* app/cache/* 2>/dev/null || true

echo "🔄 Reiniciando PrestaShop..."
docker-compose restart prestashop

echo "⏳ Esperando que PrestaShop reinicie..."
#sleep 15

echo ""
echo "🎉 ¡PrestaShop configurado para funcionar SOLO a través de ngrok!"
echo ""
echo "📋 URLs disponibles:"
echo "🛒 Tienda PrestaShop:    $NGROK_URL"
echo "⚙️  Admin PrestaShop:     $NGROK_URL/admin4577"
echo "🌐 Ngrok Dashboard:      http://localhost:4043"
echo "🗄️  phpMyAdmin:          http://localhost:8089"
echo "🐳 Apache Local:         http://localhost:8083"
echo ""
echo "❌ PrestaShop NO está disponible en localhost:8083 (solo via ngrok)"
echo ""
echo "🔑 Credenciales Admin:"
echo "   Email: admin@example.com"
echo "   Password: Sistemas1305"

#wordpress:6.9.1
#woocommerce:10.5.0
#cloudflare
