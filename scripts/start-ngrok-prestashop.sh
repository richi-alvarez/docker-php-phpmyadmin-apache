#!/usr/bin/env bash
# filepath: ./scripts/start-prestashop-ngrok-only.sh
set -e

echo "🚀 Iniciando MySQL..."
docker-compose up -d mysql

echo "⏳ Esperando que MySQL esté listo..."
sleep 10

echo "🚀 Iniciando phpMyAdmin..."
docker-compose up -d phpmyadmin

echo "⏳ Esperando que phpMyAdmin esté listo..."
sleep 10

echo "🛒 Iniciando PrestaShop..."
docker-compose up -d prestashop

echo "⏳ Esperando que PrestaShop esté listo..."
sleep 10

# echo "🌐 Iniciando ngrok conectado a PrestaShop..."
# docker-compose up -d ngrok-prestashop

echo "📡 Obteniendo URL de ngrok..."
sleep 10

# Función para obtener URL de ngrok
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
# Función para actualizar PrestaShop con nueva URL
update_prestashop_domain() {
    local new_url="$1"
    local domain=$(echo "$new_url" | sed 's|https://||; s|http://||')
    
    echo "🔧 Actualizando PrestaShop para usar: $domain"
    
    docker-compose exec -T mysql mysql -u root -ptest prestashop <<SQL
UPDATE ps_shop_url SET domain = '${domain}', domain_ssl = '${domain}' WHERE id_shop_url = 1;
UPDATE ps_configuration SET value = '${domain}' WHERE name = 'PS_SHOP_DOMAIN';
UPDATE ps_configuration SET value = '${domain}' WHERE name = 'PS_SHOP_DOMAIN_SSL';
UPDATE ps_configuration SET value = '1' WHERE name = 'PS_SSL_ENABLED';
UPDATE ps_configuration SET value = '1' WHERE name = 'PS_SSL_ENABLED_EVERYWHERE';
SELECT CONCAT('PrestaShop configurado para: ', '${domain}') as resultado;
SQL
    
    echo "🧹 Limpiando caché..."
    docker-compose exec prestashop rm -rf var/cache/* app/cache/* 2>/dev/null || true
}

# Obtener URL inicial
# NGROK_URL=$(get_ngrok_url)
# if [ -z "$NGROK_URL" ]; then
#     echo "❌ Error: no se obtuvo la URL de ngrok."
#     echo "📋 Logs de ngrok:"
#     docker-compose logs --tail=20 ngrok-prestashop
#     exit 1
# fi
NGROK_URL="https://dangerous-amp-journalism-ing.trycloudflare.com"
echo "✅ URL inicial de ngrok encontrada: $NGROK_URL"

# Actualizar PrestaShop con URL inicial
update_prestashop_domain "$NGROK_URL"

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