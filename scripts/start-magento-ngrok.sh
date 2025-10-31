#!/usr/bin/env bash
# filepath: ./scripts/start-magento-ngrok.sh
set -e

MAGENTO_DIR="./www/magento"
TIMEOUT=300
OPENSEARCH_HOST="opensearch"
OPENSEARCH_URL="http://opensearch:9200"
MAGENTO_PUBLIC_KEY="46adb569231bbe871cfcd67936ba0291"
MAGENTO_PRIVATE_KEY="7fa9b6a6205e70767d45a31aab94765e"

echo "🚀 Iniciando MySQL..."
docker-compose up -d mysql

echo "⏳ Esperando que MySQL esté listo..."
sleep 15

echo "🚀 Iniciando phpMyAdmin..."
docker-compose up -d phpmyadmin

echo "⏳ Esperando que phpMyAdmin esté listo..."
sleep 15

echo "🚀 Iniciando OpenSearch..."
docker-compose up -d opensearch

echo "⏳ Esperando que OpenSearch esté listo..."
sleep 30

# Verificar si el directorio de Magento existe
if [ ! -d "$MAGENTO_DIR" ]; then
    echo "📁 Creando directorio Magento..."
    mkdir -p "$MAGENTO_DIR"
fi

# Instalar Magento solo si no existe
if [ -n "$MAGENTO_PUBLIC_KEY" ] && [ -n "$MAGENTO_PRIVATE_KEY" ]; then
    if [ -z "$(ls -A $MAGENTO_DIR 2>/dev/null)" ]; then
        echo "📥 Instalando Magento en $MAGENTO_DIR..."
        
        # Configurar composer con credenciales de Magento
        #composer config --global http-basic.repo.magento.com "$MAGENTO_PUBLIC_KEY" "$MAGENTO_PRIVATE_KEY"
        # Crear proyecto Magento
        #composer create-project --repository-url=https://repo.magento.com/ \
        #    magento/project-community-edition=2.4.7 "$MAGENTO_DIR" \
        #    --prefer-dist --no-progress --no-interaction --ignore-platform-reqs
        
        # Descargar desde GitHub (versión open source)
        MAGENTO_VERSION="2.4.7"
        curl -L "https://github.com/magento/magento2/archive/refs/tags/${MAGENTO_VERSION}.tar.gz" -o /tmp/magento.tar.gz
        
        echo "📦 Extrayendo Magento..."
        tar -xzf /tmp/magento.tar.gz -C /tmp/
        
        # Mover archivos
        cp -r "/tmp/magento2-${MAGENTO_VERSION}/"* "$MAGENTO_DIR/"
        
        # Limpiar
        rm -f /tmp/magento.tar.gz
        rm -rf "/tmp/magento2-${MAGENTO_VERSION}"

        echo "✅ Magento descargado en $MAGENTO_DIR"
    else
        echo "✅ Magento ya existe en $MAGENTO_DIR, omitiendo descarga."
    fi
else
    echo "❌ No se proporcionaron las claves de Magento Marketplace"
    exit 1
fi

echo "🛒 Iniciando contenedor Magento..."
docker-compose up -d magento

echo "⏳ Esperando que Magento esté listo..."
sleep 30

echo "🌐 Iniciando ngrok conectado a Magento..."
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

echo "🏷️  Configurando Magento para usar: $NGROK_URL"

# Verificar si Magento ya está instalado
if [ ! -f "$MAGENTO_DIR/app/etc/env.php" ]; then
    echo "🔧 Instalando y configurando Magento..."
    
    # Ejecutar comandos dentro del contenedor de Magento
    docker-compose exec -T magento bash -c "
        cd /var/www/html

        # ✅ CORREGIDO: Instalar Composer primero
        echo '📦 Instalando Composer...'
        curl -sS https://getcomposer.org/installer | php
        mv composer.phar /usr/local/bin/composer
        chmod +x /usr/local/bin/composer
        
        # ✅ CORREGIDO: 'composer' en lugar de 'conposer'
        echo '📦 Instalando dependencias con Composer...'
        composer config --global http-basic.repo.magento.com '$MAGENTO_PUBLIC_KEY' '$MAGENTO_PRIVATE_KEY'
        composer install --no-dev --optimize-autoloader

        # Establecer permisos
        find var generated vendor pub/static pub/media app/etc -type f -exec chmod g+w {} + 2>/dev/null || true
        find var generated vendor pub/static pub/media app/etc -type d -exec chmod g+ws {} + 2>/dev/null || true
        chown -R www-data:www-data . 2>/dev/null || true
        chmod u+x bin/magento
        
        # Instalar Magento
        bin/magento setup:install \
            --base-url=$NGROK_URL/ \
            --db-host=mysql \
            --db-name=magento \
            --db-user=root \
            --db-password=test \
            --admin-firstname=Ricardo \
            --admin-lastname=Saldarriaga \
            --admin-email=admin@epayco.com \
            --admin-user=admin \
            --admin-password=admin123 \
            --language=es_CO \
            --currency=COP \
            --timezone=America/Bogota \
            --use-rewrites=1 \
            --search-engine=opensearch \
            --opensearch-host=$OPENSEARCH_HOST \
            --opensearch-port=9200 \
            --opensearch-index-prefix=magento2 \
            --opensearch-timeout=15 \
            --cleanup-database
        
        # Desactivar módulos de autenticación de dos factores
        bin/magento module:disable Magento_AdminAdobeImsTwoFactorAuth Magento_TwoFactorAuth
        
        # Configurar modo desarrollador y optimizar
        bin/magento setup:upgrade
        bin/magento deploy:mode:set developer
        bin/magento setup:di:compile
        bin/magento setup:static-content:deploy -f es_CO en_US
        bin/magento cache:clean
        bin/magento cache:flush
        bin/magento indexer:reindex
        
        # Mostrar URI del admin
        bin/magento info:adminuri
    "
    
    echo "✅ Magento instalado y configurado"
else
    echo "✅ Magento ya está instalado, actualizando URLs..."
    
    # Actualizar URLs en la base de datos
    docker-compose exec -T mysql mysql -u root -ptest magento -e "
        UPDATE core_config_data SET value = '$NGROK_URL/' WHERE path = 'web/unsecure/base_url';
        UPDATE core_config_data SET value = '$NGROK_URL/' WHERE path = 'web/secure/base_url';
    "
    
    # Limpiar caché
    docker-compose exec -T magento bash -c "
        cd /var/www/html
        bin/magento cache:clean
        bin/magento cache:flush
    "
fi

echo "🔄 Reiniciando Magento para aplicar cambios..."
docker-compose restart magento

echo "⏳ Esperando que Magento reinicie..."
sleep 20

echo "🔍 Verificando que Magento responda..."
for i in $(seq 1 15); do
    if docker-compose exec -T magento curl -f -s http://localhost/ > /dev/null 2>&1; then
        echo "✅ Magento está respondiendo"
        break
    fi
    echo "  🔄 Esperando Magento... intento $i/15"
    sleep 5
done

# Obtener URI del admin
ADMIN_URI=$(docker-compose exec -T magento bash -c "cd /var/www/html && bin/magento info:adminuri 2>/dev/null | grep -o '/admin_[a-zA-Z0-9]*' || echo '/admin'" | tr -d '\r')

echo ""
echo "🎉 ¡Magento configurado exitosamente con ngrok!"
echo ""
echo "📋 URLs disponibles:"
echo "🛒 Tienda Magento:       $NGROK_URL"
echo "⚙️  Admin Magento:        $NGROK_URL$ADMIN_URI"
echo "🌐 Ngrok Dashboard:       http://localhost:4041"
echo "🗄️  phpMyAdmin:           http://localhost:8089"
echo "🐳 Apache Local:          http://localhost:86"
echo "🛒 PrestaShop Local:      http://localhost:8082"
echo "📝 WordPress Local:       http://localhost:8083"
echo "🛒 OpenCart Local:        http://localhost:8084"
echo ""
echo "🔑 Credenciales Admin Magento:"
echo "   Usuario: admin"
echo "   Password: admin123"
echo "   Email: admin@epayco.com"
echo ""
echo "🔍 Para verificar el estado:"
echo "   docker-compose logs magento"
echo "   docker-compose logs ngrok-magento"
echo "   docker-compose logs opensearch"