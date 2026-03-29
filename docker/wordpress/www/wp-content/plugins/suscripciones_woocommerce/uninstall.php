<?php

if (!defined('WP_UNINSTALL_PLUGIN')) {
    die;
}

global $wpdb;
$table_subscription_epayco = $wpdb->prefix . 'epayco_subscription';

// Ejecutar la consulta eliminando `prepare()`, ya que no es necesario
// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.NotPrepared
require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
dbDelta("DROP TABLE IF EXISTS {$table_subscription_epayco}");

