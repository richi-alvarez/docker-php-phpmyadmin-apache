#!/usr/bin/env bash

set -euo pipefail

LOCAL_SERVICE="${LOCAL_SERVICE:-local}"
MYSQL_SERVICE="${MYSQL_SERVICE:-mysql}"
WP_PATH="${WP_PATH:-/var/www/html}"
WP_URL="${WP_URL:-http://localhost:${PORT_LOCAL:-81}}"
WP_TITLE="${WP_TITLE:-Local Store}"
WP_ADMIN_USER="${WP_ADMIN_USER:-${ADMIN_USER:-admin}}"
WP_ADMIN_PASSWORD="${WP_ADMIN_PASSWORD:-${ADMIN_PASSWORD:-admin123}}"
WP_ADMIN_EMAIL="${WP_ADMIN_EMAIL:-${ADMIN_EMAIL:-admin@example.com}}"
DB_HOST="${DB_HOST:-mysql}"
DB_NAME="${DB_NAME:-wordpress}"
DB_USER="${DB_USER:-root}"
DB_PASSWORD="${DB_PASSWORD:-test}"
PLUGIN="${PLUGIN:-woocommerce}"
MAX_WAIT_SECONDS="${MAX_WAIT_SECONDS:-180}"

compose_cmd=(docker compose -f docker-compose.yml --env-file ./docker/api.env)

echo "[1/5] Levantando servicios requeridos (${MYSQL_SERVICE}, ${LOCAL_SERVICE})..."
"${compose_cmd[@]}" up -d --build "${MYSQL_SERVICE}" "${LOCAL_SERVICE}"

echo "[2/5] Esperando MySQL disponible..."
start_time=$(date +%s)
until "${compose_cmd[@]}" exec -T "${MYSQL_SERVICE}" mysqladmin ping -h localhost -uroot -ptest --silent >/dev/null 2>&1; do
  current_time=$(date +%s)
  elapsed=$((current_time - start_time))
  if [ "${elapsed}" -ge "${MAX_WAIT_SECONDS}" ]; then
    echo "Error: MySQL no estuvo listo en ${MAX_WAIT_SECONDS}s."
    exit 1
  fi
  sleep 3
done

echo "[3/7] Verificando WP-CLI en ${LOCAL_SERVICE}..."
start_time=$(date +%s)
until "${compose_cmd[@]}" exec -T "${LOCAL_SERVICE}" wp --info --allow-root >/dev/null 2>&1; do
  current_time=$(date +%s)
  elapsed=$((current_time - start_time))
  if [ "${elapsed}" -ge "${MAX_WAIT_SECONDS}" ]; then
    echo "Error: WP-CLI no estuvo disponible en ${MAX_WAIT_SECONDS}s."
    exit 1
  fi
  sleep 2
done

echo "[4/7] Descargando WordPress si no existe..."
if ! "${compose_cmd[@]}" exec -T "${LOCAL_SERVICE}" sh -lc 'test -f /var/www/html/wp-includes/version.php'; then
  "${compose_cmd[@]}" exec -T "${LOCAL_SERVICE}" wp core download --allow-root --path="${WP_PATH}" --force
fi

echo "[5/7] Configurando wp-config.php si no existe..."
if ! "${compose_cmd[@]}" exec -T "${LOCAL_SERVICE}" sh -lc 'test -f /var/www/html/wp-config.php'; then
  "${compose_cmd[@]}" exec -T "${LOCAL_SERVICE}" wp config create \
    --allow-root \
    --path="${WP_PATH}" \
    --dbname="${DB_NAME}" \
    --dbuser="${DB_USER}" \
    --dbpass="${DB_PASSWORD}" \
    --dbhost="${DB_HOST}" \
    --skip-check
fi

echo "[6/7] Instalando WordPress si aún no está instalado..."
if ! "${compose_cmd[@]}" exec -T "${LOCAL_SERVICE}" wp core is-installed --allow-root --path="${WP_PATH}" >/dev/null 2>&1; then
  "${compose_cmd[@]}" exec -T "${LOCAL_SERVICE}" wp core install \
    --allow-root \
    --path="${WP_PATH}" \
    --url="${WP_URL}" \
    --title="${WP_TITLE}" \
    --admin_user="${WP_ADMIN_USER}" \
    --admin_password="${WP_ADMIN_PASSWORD}" \
    --admin_email="${WP_ADMIN_EMAIL}" \
    --skip-email
fi

echo "[7/7] Instalando y activando plugin ${PLUGIN}..."
"${compose_cmd[@]}" exec -T "${LOCAL_SERVICE}" wp plugin install "${PLUGIN}" --activate --allow-root --path="${WP_PATH}"
"${compose_cmd[@]}" exec -T "${LOCAL_SERVICE}" wp plugin is-active "${PLUGIN}" --allow-root --path="${WP_PATH}"

echo "WooCommerce instalado y activo correctamente."
