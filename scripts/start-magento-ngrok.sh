#!/usr/bin/env bash
# filepath: ./scripts/start-magento-ngrok.sh
set -e

# Cargar variables del archivo ./docker/api.env
export $(grep -v '^#' ./docker/api.env | xargs)

MAGENTO_DIR="./www/magento"
TIMEOUT=300
OPENSEARCH_HOST="opensearch"
OPENSEARCH_URL="http://opensearch:9200"

echo "🚀 Iniciando MySQL..."
docker-compose up -d mysql

echo "⏳ Esperando que MySQL esté listo..."
sleep 10

echo "🚀 Iniciando phpMyAdmin..."
docker-compose up -d phpmyadmin

echo "⏳ Esperando que phpMyAdmin esté listo..."
sleep 10

echo "🚀 Iniciando OpenSearch..."
docker-compose up -d opensearch

echo "⏳ Esperando que OpenSearch esté listo..."
sleep 10

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
        curl -L "https://github.com/magento/magento2/archive/refs/tags/${MAGENTO_VERSION}.tar.gz" -o /tmp/magento.tar.gz

        echo "📦 Extrayendo Magento..."
        tar -xzf /tmp/magento.tar.gz -C /tmp/
        
        # Mover archivos
        cp -r "/tmp/magento2-${MAGENTO_VERSION}/"* "$MAGENTO_DIR/"
        
        # Limpiar
        rm -f /tmp/magento.tar.gz
        rm -rf "/tmp/magento2-${MAGENTO_VERSION}"

        echo "✅ Magento descargado en $MAGENTO_DIR"

        # Clonar módulo Epayco desde la rama develop
        #echo "Clonando módulo Epayco desde la rama develop..."
        #git clone --branch develop https://github.com/epayco/magento2.x.git /tmp/epayco
        
        # Crear carpeta destino si no existe
        mkdir -p "$MAGENTO_DIR/app/code"
        # Copiar contenido del módulo
        #cp -r /tmp/epayco/* "$MAGENTO_DIR/app/code/"

        #rm -f /tmp/epayco -rf
    
    else
        echo "✅ Magento ya existe en $MAGENTO_DIR, omitiendo descarga."
    fi
else
    echo "❌ No se proporcionaron las claves de Magento Marketplace"
    exit 1
fi

echo "🛒 Iniciando contenedor Magento..."
docker compose --env-file ./docker/api.env up -d magento
echo "⏳ Esperando que Magento esté listo..."
sleep 10

#echo "🌐 Iniciando ngrok conectado a Magento..."
#docker-compose up -d ngrok-magento

echo "📡 Obteniendo URL de ngrok..."
sleep 5

get_ngrok_url() {
    local attempts=0
    local max_attempts=30
    local ngrok_url=""
    
    while [ $attempts -lt $max_attempts ]; do
        ngrok_url=$(curl -s http://localhost:4045/api/tunnels 2>/dev/null \
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
# NGROK_URL=$(get_ngrok_url)

# if [ -z "$NGROK_URL" ]; then
#   echo "❌ Error: no se obtuvo la URL de ngrok."
#   echo "📋 Logs de ngrok:"
#   docker-compose logs --tail=20 ngrok-magento
#   exit 1
# fi
NGROK_URL="http://localhost:$PORT_LOCAL"
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

        # ✅ CORREGIDO: Sample Data se instala correctamente con Composer
        echo '📦 Instalando Sample Data...'
        composer config repositories.magento composer https://repo.magento.com/
        composer require magento/module-bundle-sample-data magento/module-widget-sample-data magento/module-theme-sample-data magento/module-catalog-sample-data magento/module-customer-sample-data magento/module-cms-sample-data magento/module-catalog-rule-sample-data magento/module-sales-rule-sample-data magento/module-review-sample-data magento/module-tax-sample-data magento/module-sales-sample-data magento/module-grouped-product-sample-data magento/module-downloadable-sample-data magento/module-msrp-sample-data magento/module-configurable-sample-data --no-update || true
        composer update || true
        bin/magento setup:upgrade || true #Activar Sample data
        bin/magento sampledata:deploy
        
        #bin/magento module:enable PagoEpayco_Payco
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
sleep 10

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
echo "🌐 Ngrok Dashboard:       http://localhost:4045"
echo "🗄️  phpMyAdmin:           http://localhost:8089"
echo "🛒 Magento Local:        http://localhost:$PORT_LOCAL"
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