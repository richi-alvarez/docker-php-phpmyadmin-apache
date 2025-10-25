#!/usr/bin/env bash
# filepath: ./scripts/start-with-ngrok-choice.sh
set -e

echo "🚀 ¿Qué servicio quieres exponer con ngrok?"
echo "1) PrestaShop"
echo "2) WordPress"
echo "3) Apache Local"
echo "4) Todos los servicios (sin ngrok)"
echo ""
read -p "Selecciona una opción (1-4): " choice

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
    echo "🐳 Configurando ngrok para Apache local..."
    docker-compose up -d --build
    ;;
  4)
    echo "🚀 Iniciando todos los servicios localmente..."
    docker-compose up -d mysql local prestashop wordpress phpmyadmin
    echo ""
    echo "✅ Todos los servicios iniciados:"
    echo "🐳 Apache Local:     http://localhost:86"
    echo "🛒 PrestaShop:       http://localhost:8082"
    echo "📝 WordPress:        http://localhost:8083"
    echo "🗄️  phpMyAdmin:      http://localhost:8089"
    ;;
  *)
    echo "❌ Opción inválida"
    exit 1
    ;;
esac