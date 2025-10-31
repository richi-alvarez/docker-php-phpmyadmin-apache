#!/usr/bin/env bash
# filepath: ./scripts/start-with-ngrok-choice.sh
set -e

echo "🚀 ¿Qué servicio quieres exponer con ngrok?"
echo "1) PrestaShop"
echo "2) WordPress"
echo "3) OpenCart"
echo "4) Apache Local"
echo "5) Joomla"
echo "6) Magento"
echo "7) Todos los servicios (sin ngrok)"
echo ""
read -p "Selecciona una opción (1-5): " choice

case $choice in
  1)
    echo "🛑 Deteniendo todos los servicios..."
    docker-compose restart prestashop
    echo "✅ Todos los servicios han sido reseteados";;
  2)
    echo "🛑 Deteniendo todos los servicios..."
    docker-compose restart wordpress
    echo "✅ Todos los servicios han sido reseteados";;
  3)
    echo "🛑 Deteniendo todos los servicios..."
    docker-compose restart opencart
    echo "✅ Todos los servicios han sido reseteados";;
  4)
    echo "🛑 Deteniendo todos los servicios..."
    docker-compose restart local
    echo "✅ Todos los servicios han sido reseteados";;
  5)
    echo "🛑 Deteniendo todos los servicios..."
    docker-compose restart joomla
    echo "✅ Todos los servicios han sido reseteados";;
  6)
    echo "🛑 Deteniendo todos los servicios..."
    docker-compose restart magento
    echo "✅ Todos los servicios han sido reseteados";;
  7)
    echo "🛑 Deteniendo todos los servicios..."
    docker-compose restart
    echo "✅ Todos los servicios han sido reseteados";;
  *)
    echo "❌ Opción inválida"
    exit 1
    ;;
esac