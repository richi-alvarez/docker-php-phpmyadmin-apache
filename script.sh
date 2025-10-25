#!/bin/bash

# Esperar a que ngrok esté listo
echo "Esperando a que ngrok esté listo..."
sleep 10

# Obtener la URL de ngrok desde la API
NGROK_URL=""
for i in {1..30}; do
    NGROK_URL=$(curl -s http://localhost:4040/api/tunnels 2>/dev/null | grep -o '"public_url":"https://[^"]*' | cut -d'"' -f4 | head -1)
    
    if [[ -n "$NGROK_URL" ]]; then
        # Remover https:// para usar solo el dominio
        DOMAIN=$(echo $NGROK_URL | sed 's|https://||')
        echo "URL de ngrok encontrada: $NGROK_URL"
        echo "Dominio: $DOMAIN"
        break
    fi
    
    echo "Intentando obtener URL de ngrok... intento $i/30"
    sleep 5
done

if [[ -z "$NGROK_URL" ]]; then
    echo "Error: No se pudo obtener la URL de ngrok después de 30 intentos"
    exit 1
fi

# Actualizar la configuración de PrestaShop en la base de datos
echo "Actualizando configuración de PrestaShop..."

# Esperar a que la base de datos esté lista
sleep 5

docker-compose exec -T mysql mysql -u root -ptest prestashop << EOF
UPDATE ps_shop_url SET 
    domain = '$DOMAIN',
    domain_ssl = '$DOMAIN'
WHERE id_shop_url = 1;

UPDATE ps_configuration SET value = '$DOMAIN' WHERE name = 'PS_SHOP_DOMAIN';
UPDATE ps_configuration SET value = '$DOMAIN' WHERE name = 'PS_SHOP_DOMAIN_SSL';
UPDATE ps_configuration SET value = '1' WHERE name = 'PS_SSL_ENABLED';
UPDATE ps_configuration SET value = '1' WHERE name = 'PS_SSL_ENABLED_EVERYWHERE';

SELECT 'Configuración actualizada correctamente' as status;
EOF

# Limpiar caché de PrestaShop
echo "Limpiando caché de PrestaShop..."
docker-compose exec prestashop rm -rf var/cache/* app/cache/* 2>/dev/null || true

echo "Configuración completada. PrestaShop ahora usa: $NGROK_URL"
echo "Admin: $NGROK_URL/admin4577"
echo "Tienda: $NGROK_URL"