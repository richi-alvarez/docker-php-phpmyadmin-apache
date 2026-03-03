#!/usr/bin/env bash
# filepath: ./scripts/start-with-ngrok-choice.sh
set -e

echo "🚀 ¿Qué servicio quieres exponer con ngrok?"
echo "1) PrestaShop"
echo "2) WordPress"
echo "3) OpenCart"
echo "4) Apache Local"
echo "5) Joomla"
<<<<<<< HEAD
echo "6) Magento"
echo "7) Todos los servicios (sin ngrok)"
=======
echo "6) Todos los servicios (sin ngrok)"
>>>>>>> 4e42f22 (feat:se agrega virtuemart)
echo ""
read -p "Selecciona una opción (1-5): " choice

case $choice in
  1)
    echo "🛒 Configurando ngrok para PrestaShop..."
    ./scripts/start-ngrok-prestashop.sh
    ;;
  2)
    echo "📝 Configurando ngrok para WordPress..."
    ./scripts/start-wordpress-ngrok.sh
    ;;
  3)
    echo "🛒 Configurando ngrok para OpenCart..."
    ./scripts/start-opencart-ngrok.sh
    ;;
  4)
    echo "🐳 Configurando ngrok para Apache local..."
    ./scripts/start-ngrok-local.sh
    ;;
  5)
    echo "🐳 Configurando ngrok para Joomla local..."
    ./scripts/start-joomla-ngrok.sh
    ;;
  6)
<<<<<<< HEAD
    echo "🐳 Configurando ngrok para Magento local..."
    ./scripts/start-magento-ngrok.sh
    ;;
  7)
=======
>>>>>>> 4e42f22 (feat:se agrega virtuemart)
    echo "🚀 Iniciando todos los servicios localmente..."
    docker-compose up -d mysql local prestashop wordpress  magento phpmyadmin
    echo ""
    echo "✅ Todos los servicios iniciados:"
    echo "🐳 Apache Local:     http://localhost:86"
    echo "🛒 PrestaShop:       http://localhost:8082"
    echo "📝 WordPress:        http://localhost:8083"
    echo "🛒 OpenCart:         http://localhost:8084"
    echo "🗄️  phpMyAdmin:      http://localhost:8089"
    ;;
  *)
    echo "❌ Opción inválida"
    exit 1
    ;;
esac