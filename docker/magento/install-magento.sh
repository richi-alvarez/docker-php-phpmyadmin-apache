#!/bin/bash
set -e
# Cargar variables del archivo ./docker/api.env
export $(grep -v '^#' api.env | xargs)

MAGENTO_DIR="/var/www/html"
TIMEOUT=300  # Timeout en segundos para esperar servicios
ELASTICSEARCH_HOST="elasticsearch"
ELASTICSEARCH_URL="http://elasticsearch:9200"
OPENSEARCH_HOST="opensearch"
OPENSEARCH_URL="http://opensearch:9200"

# Función para esperar MySQL
wait_for_mysql() {
  local host=$1
  local user=$2
  local pass=$3
  local elapsed=0
  echo "Esperando MySQL en $host ..."
  until mysql -h"$host" -u"$user" -p"$pass" -e "SELECT 1;" >/dev/null 2>&1; do
    sleep 5
    elapsed=$((elapsed + 5))
    if [ $elapsed -ge $TIMEOUT ]; then
      echo "Timeout esperando MySQL"
      exit 1
    fi
  done
  echo "MySQL listo!"
}

# Función para esperar
wait_for_servicesearch() {
  local url=$1
  local elapsed=0
  echo "Esperando en $url ..."
  until curl -s $url/_cluster/health | grep -q '"status":"yellow"\|"status":"green"'; do    sleep 5
    elapsed=$((elapsed + 5))
    if [ $elapsed -ge $TIMEOUT ]; then
      echo "Timeout esperando servicio"
      exit 1
    fi
  done
  echo "servicio listo!"
}

# ======================
# Uso
# ======================
echo "Verificando servicios..."
# Esperar MySQL con dockerize
echo "Esperando que Elasticsearch esté listo..."
#dockerize -wait tcp://$DB_HOST:3306 -timeout ${TIMEOUT}s
#wait_for_mysql $MAGENTO_DB_HOST $MAGENTO_DB_NAME $MAGENTO_DB_PASSWORD
wait_for_servicesearch "$OPENSEARCH_URL"
#wait_for_servicesearch "$OPENSEARCH_URL"

# Instalar Magento solo si no existe
if [ -n "$MAGENTO_PUBLIC_KEY" ] && [ -n "$MAGENTO_PRIVATE_KEY" ]; then
  if [ -z "$(ls -A $MAGENTO_DIR)" ]; then
    echo "Instalando Magento en $MAGENTO_DIR ..."
    composer config --global http-basic.repo.magento.com $MAGENTO_PUBLIC_KEY $MAGENTO_PRIVATE_KEY
    composer create-project --repository-url=https://repo.magento.com/ \
      magento/project-community-edition=2.4.7 $MAGENTO_DIR \
      --prefer-dist --no-progress --no-interaction --ignore-platform-reqs

    # Ajustar permisos
    chown -R www-data:www-data $MAGENTO_DIR
    # Permisos para carpetas clave
    find "$MAGENTO_DIR"/var "$MAGENTO_DIR"/pub "$MAGENTO_DIR"/generated -type d -exec chmod 775 {} \;
    find "$MAGENTO_DIR"/var "$MAGENTO_DIR"/pub "$MAGENTO_DIR"/generated -type f -exec chmod 664 {} \;
    
    # Clonar módulo Epayco desde la rama develop
    echo "Clonando módulo Epayco desde la rama develop..."
    git clone --branch develop https://github.com/epayco/magento2.x.git /tmp/epayco
    
    # Crear carpeta destino si no existe
    mkdir -p "$MAGENTO_DIR/app/code"
    # Copiar contenido del módulo
    cp -r /tmp/epayco/* "$MAGENTO_DIR/app/code/"

    # Ajustar permisos
    chown -R www-data:www-data "$MAGENTO_DIR/app/code/"

    # Instalar Magento
    cd $MAGENTO_DIR
    find var generated vendor pub/static pub/media app/etc -type f -exec chmod g+w {} +
    find var generated vendor pub/static pub/media app/etc -type d -exec chmod g+ws {} +
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
      --opensearch-port=9200 \
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
    php bin/magento module:enable PagoEpayco_Payco
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
  else
    echo "Magento ya existe en $MAGENTO_DIR, omitiendo instalación."
  fi
else
  echo "No se pasaron keys de Magento Marketplace, omitiendo instalación."
fi

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
# Crear cron job de Magento
#cat > /etc/cron.d/magento-cron <<EOL
#*/1 * * * * www-data cd $MAGENTO_DIR && php bin/magento cron:run | grep -v 'Ran jobs by schedule' >> $CRON_LOG 2>&1
#EOL
#chmod 0644 /etc/cron.d/magento-cron

# Iniciar cron del sistema
#service cron start

# Loop de debug para ver errores del cron en tiempo real
# (
#   while true; do
#       sleep 60
#       echo "===== Últimos 20 registros del cron de Magento ====="
#       tail -n 20 $CRON_LOG
#   done
# ) &

# while true; do
#   su -s /bin/bash www-data -c "php $MAGENTO_DIR/bin/magento cron:run"
#   sleep 60
# done

# Iniciar Apache en primer plano
apache2-foreground