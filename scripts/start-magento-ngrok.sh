#!/usr/bin/env bash
# filepath: ./scripts/start-magento-ngrok.sh
set -e

# Cargar variables del archivo ./docker/api.env
export $(grep -v '^#' ./docker/magento/api.env | xargs)

MAGENTO_DIR="."
TIMEOUT=300
OPENSEARCH_URL="http://localhost:$OPENSEARCH_PORT"

echo "🚀 Iniciando MySQL..."
#docker-compose up -d mysql
docker compose -f ./docker/mysql/docker-compose.yml up -d mysql

echo "⏳ Esperando que MySQL esté listo..."
# Función para esperar MySQL
wait_for_mysql_and_db() {
  local host=$1
  local user=$2
  local pass=$3
  local db=$4
  local timeout=${5:-300}
  local elapsed=0

  echo "⏳ Esperando que el contenedor MySQL esté healthy..."
  while [ "$(docker inspect --format='{{.State.Health.Status}}' $(docker compose -f ./docker/mysql/docker-compose.yml ps -q mysql))" != "healthy" ]; do
    sleep 5
    elapsed=$((elapsed + 5))
    if [ $elapsed -ge $timeout ]; then
      echo "Timeout esperando que MySQL esté healthy"
      exit 1
    fi
    echo "Esperando que MySQL esté healthy... ($elapsed/$timeout)"
  done
  echo "✅ MySQL está healthy!"

  echo "🔎 Validando conexión a la base de datos '$db' en $host usuario $user..."
  #if mysql -h"$host" -u"$user" -p"$pass" -e "USE $db; SELECT 1;" >/dev/null 2>&1; then
  if docker compose -f ./docker/mysql/docker-compose.yml exec mysql mysql -u"$user" -p"$pass" -e "USE $db; SELECT 1;" >/dev/null 2>&1; then 
    echo "✅ Conexión exitosa a la base de datos '$db' en $host"
  else
    echo "❌ Error: No se pudo conectar a la base de datos '$db' en $host"
    exit 1
  fi
}

# Uso de la función:
wait_for_mysql_and_db "$MAGENTO_DB_HOST" "$MAGENTO_DB_USER" "$MAGENTO_DB_PASSWORD" "$MAGENTO_DB_NAME" "$TIMEOUT"
#sleep 10

echo "🚀 Iniciando phpMyAdmin..."
#docker-compose up -d phpmyadmin
docker compose -f ./docker/phpmyadmin/docker-compose.yml up -d phpmyadmin

echo "⏳ Esperando que phpMyAdmin esté listo..."
sleep 3

echo "🚀 Iniciando OpenSearch..."
#docker-compose up -d opensearch
docker compose -f ./docker/magento/docker-compose.yml up -d opensearch
# Función para esperar
wait_for_opensearch_and_check() {
  local url=$1
  local timeout=${2:-300}
  local elapsed=0

  echo "⏳ Esperando que OpenSearch esté listo en $url ..."
  until curl -s "$url/_cluster/health" | grep -q '"status":"yellow"\|"status":"green"'; do
    sleep 5
    elapsed=$((elapsed + 5))
    if [ $elapsed -ge $timeout ]; then
      echo "❌ Timeout esperando servicio OpenSearch en $url"
      curl -s "$url/_cluster/health"
      exit 1
    fi
    echo "  🔄 Esperando OpenSearch... ($elapsed/$timeout)"
  done

  echo "🔎 Validando conexión a OpenSearch..."
  if curl -s "$url" | grep -q '"cluster_name"'; then
    echo "✅ Conexión exitosa a OpenSearch en $url"
  else
    echo "❌ Error: No se pudo conectar correctamente a OpenSearch en $url"
    exit 1
  fi
}

# Uso:
wait_for_opensearch_and_check "$OPENSEARCH_URL" "$TIMEOUT"
#sleep 10

DOMAIN=$(echo "$MAGENTO_URL" | sed 's|https://||; s|http://||')

echo "🏷️  Configurando Magento para usar: $MAGENTO_URL"

echo "🔧 Instalando y configurando Magento..."
echo "🛒 Iniciando contenedor Magento..."
#docker compose --env-file ./docker/api.env up -d magento
docker compose -f ./docker/magento/docker-compose.yml --env-file ./docker/api.env up -d magento --build
#echo "⏳ Esperando que Magento esté listo..."
sleep 10
# Verificar si Magento ya está instalado
# Espera hasta que el servicio magento esté corriendo y listo
echo "mangeto dir $MAGENTO_DIR"
# Instalar Magento solo si no existe
if [ -n "$MAGENTO_PUBLIC_KEY" ] && [ -n "$MAGENTO_PRIVATE_KEY" ]; then
  if [ -z "$(ls -A $MAGENTO_DIR/app/code)" ]; then
  echo "crear proyecto de magento dentro del contenedor"
    #Ejecutar comandos dentro del contenedor de Magento
    docker exec -i magento bash -s <<EOF
    cd /var/www/html
    echo "Instalando Magento en $MAGENTO_DIR ..."
    composer config --global http-basic.repo.magento.com $MAGENTO_PUBLIC_KEY $MAGENTO_PRIVATE_KEY
    composer create-project --repository-url=https://repo.magento.com/ \
      magento/project-community-edition=$MAGENTO_VERSION $MAGENTO_DIR \
      --prefer-dist --no-progress --no-interaction --ignore-platform-reqs
    
    # Ajustar permisos
    chown -R www-data:www-data $MAGENTO_DIR
    # Permisos para carpetas clave
    #find "$MAGENTO_DIR"/var "$MAGENTO_DIR"/pub "$MAGENTO_DIR"/generated -type d -exec chmod 775 {} \;
    #find "$MAGENTO_DIR"/var "$MAGENTO_DIR"/pub "$MAGENTO_DIR"/generated -type f -exec chmod 664 {} \;
    echo "✅ Magento descargado correctamente."
    # Clonar módulo Epayco desde la rama develop
    #echo "Clonando módulo Epayco desde la rama develop..."
    #git clone --branch develop https://github.com/epayco/magento2.x.git /tmp/epayco
    #git clone --branch develop https://github.com/epayco/plugin_epayco_magento_agregador.git /tmp/epayco
    # Crear carpeta destino si no existe
    mkdir -p "$MAGENTO_DIR/app/code"
    # Copiar contenido del módulo
    # cp -r /tmp/epayco/* "$MAGENTO_DIR/app/code/"

    # Ajustar permisos
    chown -R www-data:www-data "$MAGENTO_DIR/app/code/"
    echo "✅ Módulo Epayco clonado correctamente."
    # Instalar Magento
    cd $MAGENTO_DIR
    #find var generated vendor pub/static pub/media app/etc -type f -exec chmod g+w {} +
    #find var generated vendor pub/static pub/media app/etc -type d -exec chmod g+ws {} +
    find var generated vendor app/etc -type f -exec chmod g+w {} +
    find var generated vendor app/etc -type d -exec chmod g+ws {} +
    chown -R :www-data . # Ubuntu
    chmod u+x bin/magento
    bin/magento setup:install \
      --base-url=$MAGENTO_URL \
      --db-host=$MAGENTO_DB_HOST \
      --db-name=$MAGENTO_DB_NAME \
      --db-user=$MAGENTO_DB_USER \
      --db-password=$MAGENTO_DB_PASSWORD \
      --admin-firstname=$ADMIN_FIRSTNAME \
      --admin-lastname=$ADMIN_LASTNAME \
      --admin-email=$ADMIN_EMAIL \
      --admin-user=$ADMIN_USER \
      --admin-password=$ADMIN_PASSWORD \
      --language=$LANGUAGE \
      --currency=$CURRENCY \
      --timezone=America/Chicago \
      --use-rewrites=1 \
      --search-engine=opensearch \
      --opensearch-host=$OPENSEARCH_HOST \
      --opensearch-port=$OPENSEARCH_PORT \
      --opensearch-index-prefix=magento2 \
      --opensearch-timeout=15
    # --search-engine=elasticsearch7 \
    # --elasticsearch-host=$ELASTICSEARCH_HOST \
    # --elasticsearch-port=9200 \
    # --elasticsearch-index-prefix=magento2 \
    # --elasticsearch-timeout=15

  # ✅ CORREGIDO: Sample Data se instala correctamente con Composer
    echo '📦 Instalando Sample Data...'
    composer config repositories.magento composer https://repo.magento.com/
    composer require magento/module-bundle-sample-data magento/module-widget-sample-data magento/module-theme-sample-data magento/module-catalog-sample-data magento/module-customer-sample-data magento/module-cms-sample-data magento/module-catalog-rule-sample-data magento/module-sales-rule-sample-data magento/module-review-sample-data magento/module-tax-sample-data magento/module-sales-sample-data magento/module-grouped-product-sample-data magento/module-downloadable-sample-data magento/module-msrp-sample-data magento/module-configurable-sample-data --no-update || true
    composer update || true
    bin/magento setup:upgrade || true #Activar Sample data
    bin/magento sampledata:deploy
    bin/magento module:disable Magento_AdminAdobeImsTwoFactorAuth  Magento_TwoFactorAuth
    #bin/magento sampledata:deploy
    #php bin/magento module:enable PagoEpayco_Payco
    # 1. Actualiza el esquema y datos de la base de datos
    bin/magento setup:upgrade
    # 2. Establece el modo de desarrollo (antes de compilar)
    bin/magento deploy:mode:set developer
    # 3. Compila las dependencias (di container)
    bin/magento setup:di:compile
    # 4. Genera contenido estático (CSS, JS, etc.)
    bin/magento setup:static-content:deploy -f
    # 5. Limpia caché para aplicar cambios
    bin/magento cache:clean
    bin/magento cache:flush
    # 6. Reindexa los datos
    bin/magento indexer:reindex
    # 7. Muestra la URL del panel de administración
    bin/magento info:adminuri
    #bin/magento cron:run
EOF
  else
    echo "Magento ya existe en $MAGENTO_DIR, omitiendo instalación."
    
     #Ejecutar comandos dentro del contenedor de Magento
    docker exec -i magento bash -s <<EOF
        cd /var/www/html
        # Instalar Magento
        bin/magento setup:install \
            --base-url=$MAGENTO_URL \
            --db-host=$MAGENTO_DB_HOST \
            --db-name=$MAGENTO_DB_NAME \
            --db-user=$MAGENTO_DB_USER \
            --db-password=$MAGENTO_DB_PASSWORD \
            --admin-firstname=$ADMIN_FIRSTNAME \
            --admin-lastname=$ADMIN_LASTNAME \
            --admin-email=$ADMIN_EMAIL \
            --admin-user=$ADMIN_USER \
            --admin-password=$ADMIN_PASSWORD \
            --language=$LANGUAGE \
            --currency=$CURRENCY \
            --timezone=America/Chicago \
            --use-rewrites=1 \
            --search-engine=opensearch \
            --opensearch-host=$OPENSEARCH_HOST \
            --opensearch-port=$OPENSEARCH_PORT \
            --opensearch-index-prefix=magento2 \
            --opensearch-timeout=15 
          #  --cleanup-database
        
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
    # # Actualizar URLs en la base de datos
    # docker-compose exec -T mysql mysql -u root -ptest magento -e "
    #     UPDATE core_config_data SET value = '$MAGENTO_URL/' WHERE path = 'web/unsecure/base_url';
    #     UPDATE core_config_data SET value = '$MAGENTO_URL/' WHERE path = 'web/secure/base_url';
    # "
    
    # # Limpiar caché
    # docker-compose exec -T magento bash -c "
    #     cd /var/www/html
    #     bin/magento cache:clean
    #     bin/magento cache:flush
    # "
EOF
    echo "⏳ Esperando que Magento reinicie..."
    sleep 10
  fi
else
  echo "No se pasaron keys de Magento Marketplace, omitiendo instalación."
fi
echo "🔄 Corriendo logs de Magento..."
docker logs -f magento
  CRON_LOG="$MAGENTO_DIR/var/log/magento.cron.log"

  # Crear log de cron
  mkdir -p $MAGENTO_DIR/var/log
  touch $CRON_LOG
  chown -R www-data:www-data $MAGENTO_DIR/var/log

  # Verificar que bin/magento existe y es ejecutable
  if [ ! -f "$MAGENTO_DIR/bin/magento" ]; then
      echo "Error: bin/magento no encontrado. Asegúrate de que Magento esté instalado."
      exit 1
  fi
  chmod +x $MAGENTO_DIR/bin/magento
  echo "magento instalado correctamente."

# Obtener URI del admin
ADMIN_URI=$(docker-compose exec -T magento bash -c "cd /var/www/html && bin/magento info:adminuri 2>/dev/null | grep -o '/admin_[a-zA-Z0-9]*' || echo '/admin'" | tr -d '\r')

echo ""
echo "🎉 ¡Magento configurado exitosamente con ngrok!"
echo ""
echo "📋 URLs disponibles:"
echo "🛒 Tienda Magento:       $MAGENTO_URL"
echo "⚙️  Admin Magento:        $MAGENTO_URL$ADMIN_URI"
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