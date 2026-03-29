<?php

/**
 * Bootstrap de WordPress para tests de integración con WooCommerce real.
 *
 * Diferencias con tests/bootstrap.php:
 *  - Carga wp-load.php → WC_Order, WC_Subscription y $wpdb son REALES
 *  - No carga stubs (WordPress los provee)
 *  - update_status() persiste en la BD; los inserts van a MySQL real
 *
 * Requisitos:
 *  - Ejecutar desde dentro del contenedor WordPress (make ssh-be)
 *  - Composer instalado (vendor/autoload.php presente)
 *
 * Uso:
 *  vendor/bin/phpunit --configuration phpunit.integration.xml
 */

// Señal para que los tests detecten que WordPress está cargado
define('EPS_WP_BOOTSTRAP', true);

// Namespace overrides (deben cargarse ANTES de que PHP compile el gateway)
require_once __DIR__ . '/Integration/stubs/gateway-namespace-overrides.php';

// Cargar WordPress completo
$wpLoad = dirname(__DIR__, 4) . '/wp-load.php';
if (!file_exists($wpLoad)) {
    echo "\n[ERROR] wp-load.php no encontrado en: $wpLoad\n";
    echo "Ejecuta los tests desde dentro del contenedor WordPress:\n";
    echo "  make ssh-be\n";
    echo "  cd wp-content/plugins/suscripciones_woocommerce\n";
    echo "  vendor/bin/phpunit --configuration phpunit.integration.xml\n\n";
    exit(1);
}

require_once $wpLoad;

// Autoloader del plugin (src/ vía PSR-4 + SDK ePayco)
$autoload = dirname(__DIR__) . '/vendor/autoload.php';
if (!file_exists($autoload)) {
    echo "\n[ERROR] vendor/autoload.php no encontrado. Ejecuta: composer install\n\n";
    exit(1);
}

require_once $autoload;

// Global de wpdb disponible
global $wpdb;
