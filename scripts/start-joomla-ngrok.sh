#!/usr/bin/env bash
# filepath: ./scripts/start-joomla-ngrok.sh
set -e

<<<<<<< HEAD
JOOMLA_DIR="./www/joomla"

echo "🚀 Iniciando MySQL..."
docker-compose up -d mysql-joomla

echo "⏳ Esperando que MySQL esté listo..."
sleep 10
=======
echo "🚀 Iniciando MySQL..."
docker-compose up -d mysql

echo "⏳ Esperando que MySQL esté listo..."
sleep 15
>>>>>>> 4e42f22 (feat:se agrega virtuemart)

echo "🚀 Iniciando phpMyAdmin..."
docker-compose up -d phpmyadmin

echo "⏳ Esperando que phpMyAdmin esté listo..."
<<<<<<< HEAD
sleep 10

# Verificar si el directorio de Joomla existe
if [ ! -d "$JOOMLA_DIR" ]; then
    echo "📁 Creando directorio Joomla..."
    mkdir -p "$JOOMLA_DIR"
fi

# Instalar Magento solo si no existe
if [ -z "$(ls -A $JOOMLA_DIR 2>/dev/null)" ]; then
    echo "📥 Instalando Magento en $JOOMLA_DIR..."

    JOOMLA_VERSION="5.4.1"
    curl -L "https://github.com/joomla/joomla-cms/archive/refs/tags/${JOOMLA_VERSION}.tar.gz" -o /tmp/joomla.tar.gz

    echo "📦 Extrayendo Joomla..."
    tar -xzf /tmp/joomla.tar.gz -C /tmp/

    # Mover archivos
    cp -r "/tmp/joomla-cms-${JOOMLA_VERSION}/"* "$JOOMLA_DIR/"

    # Limpiar
    rm -f /tmp/joomla.tar.gz
    rm -rf "/tmp/joomla-cms-${JOOMLA_VERSION}"
fi
=======
sleep 15
>>>>>>> 4e42f22 (feat:se agrega virtuemart)

echo "🛒 Iniciando Joomla..."
docker-compose up -d joomla

echo "⏳ Esperando que Joomla esté listo..."
<<<<<<< HEAD
sleep 10

#echo "🌐 Iniciando ngrok para Joomla..."
#docker-compose up -d ngrok-joomla

echo "📡 Esperando la URL de ngrok (dashboard en http://localhost:4044)..."

get_ngrok_url() {
    local attempts=0
    local max_attempts=30
    local ngrok_url=""
    
    while [ $attempts -lt $max_attempts ]; do
        ngrok_url=$(curl -s http://localhost:4044/api/tunnels 2>/dev/null \
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
#NGROK_URL="https://yea-commerce-screenshot-packing.trycloudflare.com"
=======
sleep 25

echo "🌐 Iniciando ngrok para Joomla..."
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
  docker-compose logs --tail=20 ngrok
  exit 1
fi
>>>>>>> 4e42f22 (feat:se agrega virtuemart)

echo "🏷️  URL configurada: $NGROK_URL"

DOMAIN=$(echo "$NGROK_URL" | sed 's|https://||; s|http://||')
echo "🏷️  Configurando Joomla para usar solo: $DOMAIN"

<<<<<<< HEAD
# Verificar si Joomla ya está instalado
if [ ! -f "$JOOMLA_DIR/configuration.php" ]; then
    echo "🔧 Instalando y configurando Joomla..."

    # Ejecutar comando de instalación de Joomla
    docker-compose exec -T joomla bash -c "
    cd /var/www/html

    #instalar paquetes necesarios
    composer install
    #php cli/install.php --db-type mysqli --db-host mysql --db-user root --db-pass test --db-name joomla --admin-user admin --admin-pass admin123 --admin-email admin@example.com
    npm ci
    # Configurar el dominio en la base de datos
    #mysql -u root -ptest joomla << EOF
    #    UPDATE jos_sites SET domain = '$DOMAIN' WHERE id = 1;
    #EOF
"
else
    echo "✅ Joomla ya está instalado. Actualizando configuración del dominio..."

    # Actualizar configuración del dominio en la base de datos
#     docker-compose exec -T mysql-joomla mysql -u root -ptest joomla << EOF
# UPDATE jos_sites SET domain = '$DOMAIN' WHERE id = 1;
# EOF
fi

=======
>>>>>>> 4e42f22 (feat:se agrega virtuemart)
echo ""
echo "🎉 Joomla configurado exitosamente con ngrok!"
echo ""
echo "📋 URLs disponibles:"
echo "🌐 Joomla Sitio:      $NGROK_URL"
echo "⚙️  Joomla Admin:      $NGROK_URL/administrator"
<<<<<<< HEAD
echo "🌐 Ngrok Dashboard:      http://localhost:4044"
echo "🗄️  phpMyAdmin:          http://localhost:8089"
=======
echo "🌐 Ngrok Dashboard:      http://localhost:4041"
echo "🗄️  phpMyAdmin:          http://localhost:8089"
echo "🐳 Apache Local:         http://localhost:86"
>>>>>>> 4e42f22 (feat:se agrega virtuemart)
echo "🛒 Joomla Local:     http://localhost:8082"