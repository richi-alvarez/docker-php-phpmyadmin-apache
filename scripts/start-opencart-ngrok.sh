#!/usr/bin/env bash
# filepath: ./scripts/start-prestashop-ngrok-only.sh
set -e

OPENCART_DIR="../www/opencart"

echo "🚀 Iniciando MySQL..."
docker-compose up -d mysql

echo "⏳ Esperando que MySQL esté listo..."
sleep 15

echo "🚀 Iniciando phpMyAdmin..."
docker-compose up -d phpmyadmin

echo "⏳ Esperando que phpMyAdmin esté listo..."
sleep 15

# Verificar si el directorio de OpenCart existe y está vacío
OPENCART_DIR="./www/opencart"
if [ ! -d "$OPENCART_DIR" ]; then
    echo "📁 Creando directorio OpenCart..."
    mkdir -p "$OPENCART_DIR"
fi

if [ -z "$(ls -A $OPENCART_DIR 2>/dev/null)" ]; then
    echo "📥 Descargando OpenCart..."
    # Descargar la última versión de OpenCart
    DOWNLOAD_URL=$(curl -s https://api.github.com/repos/opencart/opencart/releases/latest | grep "browser_download_url" | cut -d '"' -f 4)
    
    if [ -n "$DOWNLOAD_URL" ]; then
        curl -Lo /tmp/opencart.zip "$DOWNLOAD_URL"
        echo "📦 Extrayendo OpenCart..."
        unzip -q /tmp/opencart.zip -d /tmp/opencart
        
        # Mover archivos de upload a nuestro directorio
        UPLOAD_DIR=$(find /tmp/opencart -name "upload" -type d | head -1)
        if [ -n "$UPLOAD_DIR" ]; then
            cp -r "$UPLOAD_DIR"/* "$OPENCART_DIR/"
            echo "✅ OpenCart extraído a $OPENCART_DIR"

            # Copiar archivos de configuración
            echo "📄 Configurando archivos de configuración..."
            if [ -f "$OPENCART_DIR/config-dist.php" ]; then
                cp "$OPENCART_DIR/config-dist.php" "$OPENCART_DIR/config.php"
                echo "✅ config.php creado"
            else
                echo "⚠️  Advertencia: config-dist.php no encontrado"
            fi
            
            if [ -f "$OPENCART_DIR/admin/config-dist.php" ]; then
                cp "$OPENCART_DIR/admin/config-dist.php" "$OPENCART_DIR/admin/config.php"
                echo "✅ admin/config.php creado"
            else
                echo "⚠️  Advertencia: admin/config-dist.php no encontrado"
            fi
        else
            echo "❌ Error: No se encontró el directorio upload en el zip"
            exit 1
        fi
        
        # Limpiar archivos temporales
        rm -rf /tmp/opencart.zip /tmp/opencart
        
        # Dar permisos correctos
        #chmod -R 755 "$OPENCART_DIR"
        # Dar permisos de escritura a los archivos de configuración
        #chmod 666 "$OPENCART_DIR/config.php" 2>/dev/null || true
        #chmod 666 "$OPENCART_DIR/admin/config.php" 2>/dev/null || true
    else
        echo "❌ Error: No se pudo obtener la URL de descarga"
        exit 1
    fi
else
    echo "✅ OpenCart ya existe en $OPENCART_DIR, omitiendo instalación."
        # Verificar si los archivos de configuración existen, si no, crearlos
    if [ ! -f "$OPENCART_DIR/config.php" ] && [ -f "$OPENCART_DIR/config-dist.php" ]; then
        echo "📄 Creando config.php desde config-dist.php..."
        cp "$OPENCART_DIR/config-dist.php" "$OPENCART_DIR/config.php"
        #chmod 666 "$OPENCART_DIR/config.php"
    fi
    
    if [ ! -f "$OPENCART_DIR/admin/config.php" ] && [ -f "$OPENCART_DIR/admin/config-dist.php" ]; then
        echo "📄 Creando admin/config.php desde admin/config-dist.php..."
        cp "$OPENCART_DIR/admin/config-dist.php" "$OPENCART_DIR/admin/config.php"
        #chmod 666 "$OPENCART_DIR/admin/config.php"
    fi
fi

echo "🛒 Iniciando Opencart..."
docker-compose up -d opencart

echo "⏳ Esperando que Opencart esté listo..."
sleep 25

echo "🌐 Iniciando ngrok conectado a Opencart..."
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
echo "🏷️  Configurando Opencart para usar solo: $DOMAIN"

# echo "🔄 Reiniciando OpenCart para aplicar cambios..."
# docker-compose restart opencart

# echo "⏳ Esperando que OpenCart reinicie..."
# sleep 20


echo ""
echo "🎉 ¡OpenCart configurado exitosamente con ngrok!"
echo ""
echo "📋 URLs disponibles:"
echo "🛒 Tienda OpenCart:      $NGROK_URL"
echo "⚙️  Admin OpenCart:       $NGROK_URL/admin/"
echo "🌐 Ngrok Dashboard:      http://localhost:4042"
echo "🗄️  phpMyAdmin:          http://localhost:8089"
echo "🐳 Apache Local:         http://localhost:86"
echo "🛒 PrestaShop Local:     http://localhost:8082"
echo "📝 WordPress Local:      http://localhost:8083"
echo ""
echo "🔑 Credenciales Admin OpenCart:"
echo "   Usuario: admin"
echo "   Password: admin123"
echo "   Email: admin@epayco.com"
echo ""
echo "🔍 Para verificar el estado:"
echo "   docker-compose logs opencart"
echo "   docker-compose logs ngrok-opencart"