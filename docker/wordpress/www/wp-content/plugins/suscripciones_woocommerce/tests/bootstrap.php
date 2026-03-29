<?php

/**
 * Bootstrap para las pruebas unitarias del plugin
 * ePayco Subscriptions for WooCommerce.
 *
 * Orden de carga:
 *  1. Stubs de WooCommerce (clases base como WC_Payment_Gateway)
 *  2. Stubs de funciones de WordPress
 *  3. Autoloader de Composer (vendor + src/ del plugin vía PSR-4)
 */

// 1. Clases base de WooCommerce (deben existir antes del autoloader
//    porque AbstractGateway extends WC_Payment_Gateway)
require_once __DIR__ . '/stubs/woocommerce-stubs.php';

// 2. Funciones de WordPress
require_once __DIR__ . '/stubs/wordpress-functions.php';

// 3. Autoloader de Composer
$autoload = dirname(__DIR__) . '/vendor/autoload.php';

if (!file_exists($autoload)) {
    echo "\n[ERROR] vendor/autoload.php no encontrado.\n";
    echo "Ejecuta: composer install\n\n";
    exit(1);
}

require_once $autoload;

// 4. Establecer global $epaycosuscription que usa AbstractGateway.__construct
//    Evita errores al instanciar gateways en tests que no usen DI
$GLOBALS['epaycosuscription'] = null;
