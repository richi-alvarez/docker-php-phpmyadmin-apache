<?php

/**
 * @since             1.0.0
 * @package           epayco-subscriptions-for-woocommerce
 *
 * @wordpress-plugin
 * Plugin Name:       ePayco Subscriptions for WooCommerce
 * Description:       Plugin ePayco Subscription
 * Version:           6.5.3
 * Author:            ePayco
 * Text Domain:       epayco-subscriptions-for-woocommerce
 * Author URI:
 * License:           GPLv2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Domain Path:       /languages
 *
 * @package EpaycoSubscription
 */



if (!defined('ABSPATH')) {
    exit;
}

if (!defined('EPAYCO_SUBSCRIPTION_SE_VERSION')) {
    define('EPAYCO_SUBSCRIPTION_SE_VERSION', '3.0.1');
}
define('EPAYCO_PLUGIN_SUSCRIPCIONES_URL', plugin_dir_url(__FILE__));

if (! defined('EPAYCO_PLUGIN_PATH')) {
    define('EPAYCO_PLUGIN_PATH', plugin_dir_path(__FILE__));
}


defined('EPS_PLUGIN_FILE') || define('EPS_PLUGIN_FILE', __FILE__);
//require_once dirname(__FILE__) . '/vendor/autoload.php';
require_once dirname(__FILE__) . '/src/Startup.php';

if (!EpaycoSubscription\Woocommerce\Startup::available()) {
    return false;
}

use Automattic\WooCommerce\Blocks\Payments\PaymentMethodRegistry;
use Automattic\WooCommerce\Utilities\FeaturesUtil;
use EpaycoSubscription\Woocommerce\WoocommerceEpaycoSubscription;

require_once dirname(__FILE__) . '/vendor/autoload.php';

add_action('before_woocommerce_init', function () {
    if (class_exists(FeaturesUtil::class)) {
        FeaturesUtil::declare_compatibility('custom_order_tables', __FILE__);
    }

    if (class_exists(FeaturesUtil::class)) {
        FeaturesUtil::declare_compatibility('cart_checkout_blocks', __FILE__);
    }
});
if (!class_exists('WoocommerceEpaycoSubscription')) {
    $GLOBALS['epaycosuscription'] = new WoocommerceEpaycoSubscription();
}


register_activation_hook(__FILE__, 'eps_register_activate');
register_deactivation_hook(__FILE__, 'eps_disable_plugin');
add_filter('upgrader_post_install', function (bool $response, array $hookExtra): bool {
    if (($hookExtra['plugin'] ?? '') !== plugin_basename(__FILE__)) {
        return $response;
    }
    update_option('_eps_execute_after_update', 1);
    return $response;
}, 10, 2);

function eps_register_activate()
{
    update_option('_eps_execute_activate', 1);
}

function eps_disable_plugin(): void
{
    //$GLOBALS['epaycosuscription']->disablePlugin();
}

//add_action('plugins_loaded', 'register_epayco_suscription_order_status');
//add_filter('wc_order_statuses', 'add_epayco_suscription_to_order_statuses');
//add_action('admin_head', 'styling_admin_suscription_order_list');
//add_action('woocommerce_checkout_update_order_meta', 'some_custom_checkout_field_update_order_meta');
function epaycosubscription_woocommerce_addon_settings_link( $links ) {
    array_push( $links, '<a href="admin.php?page=wc-settings&tab=checkout&section=woo-epaycosubscription">' . __( 'Configuración' ) . '</a>' );
    return $links;
}

add_filter( "plugin_action_links_".plugin_basename( __FILE__ ),'epaycosubscription_woocommerce_addon_settings_link' );
function register_epayco_suscription_order_status()
{
    register_post_status('wc-epayco-failed', array(
        'label' => 'ePayco Pago Fallido',
        'public' => true,
        'show_in_admin_status_list' => true,
        'show_in_admin_all_list' => true,
        'exclude_from_search' => false,
        /* translators: %s representa la cantidad de pedidos con estado "ePayco Pago Fallido" */
        'label_count' => _n_noop(
            'ePayco Pago Fallido <span class="count">(%s)</span>',
            'ePayco Pago Fallido <span class="count">(%s)</span>',
            'epayco-subscriptions-for-woocommerce'
        )
    ));

    register_post_status('wc-epayco_failed', array(
        'label' => 'ePayco Pago Fallido Prueba',
        'public' => true,
        'show_in_admin_status_list' => true,
        'show_in_admin_all_list' => true,
        'exclude_from_search' => false,
        /* translators: %s representa la cantidad de pedidos con estado "ePayco Pago Fallido Prueba" */
        'label_count' => _n_noop(
            'ePayco Pago Fallido Prueba <span class="count">(%s)</span>',
            'ePayco Pago Fallido Prueba <span class="count">(%s)</span>',
            'epayco-subscriptions-for-woocommerce'
        )
    ));

    register_post_status('wc-epayco-cancelled', array(
        'label' => 'ePayco Pago Cancelado',
        'public' => true,
        'show_in_admin_status_list' => true,
        'show_in_admin_all_list' => true,
        'exclude_from_search' => false,
        /* translators: %s representa la cantidad de pedidos con estado "ePayco Pago Cancelado" */
        'label_count' => _n_noop(
            'ePayco Pago Cancelado <span class="count">(%s)</span>',
            'ePayco Pago Cancelado <span class="count">(%s)</span>',
            'epayco-subscriptions-for-woocommerce'
        )
    ));

    register_post_status('wc-epayco_cancelled', array(
        'label' => 'ePayco Pago Cancelado Prueba',
        'public' => true,
        'show_in_admin_status_list' => true,
        'show_in_admin_all_list' => true,
        'exclude_from_search' => false,
        /* translators: %s representa la cantidad de pedidos con estado "ePayco Pago Cancelado Prueba" */
        'label_count' => _n_noop(
            'ePayco Pago Cancelado Prueba <span class="count">(%s)</span>',
            'ePayco Pago Cancelado Prueba <span class="count">(%s)</span>',
            'epayco-subscriptions-for-woocommerce'
        )
    ));

    register_post_status('wc-epayco-on-hold', array(
        'label' => 'ePayco Pago Pendiente',
        'public' => true,
        'show_in_admin_status_list' => true,
        'show_in_admin_all_list' => true,
        'exclude_from_search' => false,
        /* translators: %s representa la cantidad de pedidos con estado "ePayco Pago Pendiente" */
        'label_count' => _n_noop(
            'ePayco Pago Pendiente <span class="count">(%s)</span>',
            'ePayco Pago Pendiente <span class="count">(%s)</span>',
            'epayco-subscriptions-for-woocommerce'
        )
    ));

    register_post_status('wc-epayco_on_hold', array(
        'label' => 'ePayco Pago Pendiente Prueba',
        'public' => true,
        'show_in_admin_status_list' => true,
        'show_in_admin_all_list' => true,
        'exclude_from_search' => false,
        /* translators: %s representa la cantidad de pedidos con estado "ePayco Pago Pendiente Prueba" */
        'label_count' => _n_noop(
            'ePayco Pago Pendiente Prueba <span class="count">(%s)</span>',
            'ePayco Pago Pendiente Prueba <span class="count">(%s)</span>',
            'epayco-subscriptions-for-woocommerce'
        )
    ));

    register_post_status('wc-epayco-processing', array(
        'label' => 'ePayco Procesando Pago',
        'public' => true,
        'show_in_admin_status_list' => true,
        'show_in_admin_all_list' => true,
        'exclude_from_search' => false,
        /* translators: %s representa la cantidad de pedidos con estado "ePayco Procesando Pago" */
        'label_count' => _n_noop(
            'ePayco Procesando Pago <span class="count">(%s)</span>',
            'ePayco Procesando Pago <span class="count">(%s)</span>',
            'epayco-subscriptions-for-woocommerce'
        )
    ));

    register_post_status('wc-epayco_processing', array(
        'label' => 'ePayco Procesando Pago Prueba',
        'public' => true,
        'show_in_admin_status_list' => true,
        'show_in_admin_all_list' => true,
        'exclude_from_search' => false,
        /* translators: %s representa la cantidad de pedidos con estado "ePayco Procesando Pago Prueba" */
        'label_count' => _n_noop(
            'ePayco Procesando Pago Prueba<span class="count">(%s)</span>',
            'ePayco Procesando Pago Prueba<span class="count">(%s)</span>',
            'epayco-subscriptions-for-woocommerce'
        )
    ));

    register_post_status('wc-processing', array(
        'label' => 'Procesando',
        'public' => true,
        'show_in_admin_status_list' => true,
        'show_in_admin_all_list' => true,
        'exclude_from_search' => false,
        /* translators: %s representa la cantidad de pedidos con estado "ePayco Pago Cancelado Prueba" */
        'label_count' => _n_noop('Procesando<span class="count">(%s)</span>', 'Procesando<span class="count">(%s)</span>', 'epayco-subscriptions-for-woocommerce')
    ));

    register_post_status('wc-processing_test', array(
        'label' => 'Procesando Prueba',
        'public' => true,
        'show_in_admin_status_list' => true,
        'show_in_admin_all_list' => true,
        'exclude_from_search' => false,
        /* translators: %s representa la cantidad de pedidos con estado "Procesando Prueba" */
        'label_count' => _n_noop('Procesando Prueba<span class="count">(%s)</span>', 'Procesando Prueba<span class="count">(%s)</span>', 'epayco-subscriptions-for-woocommerce')
    ));

    register_post_status('wc-epayco-completed', array(
        'label' => 'ePayco Pago Completado',
        'public' => true,
        'show_in_admin_status_list' => true,
        'show_in_admin_all_list' => true,
        'exclude_from_search' => false,
        /* translators: %s representa la cantidad de pedidos con estado "ePayco Pago Completado" */
        'label_count' => _n_noop('ePayco Pago Completado <span class="count">(%s)</span>', 'ePayco Pago Completado <span class="count">(%s)</span>', 'epayco-subscriptions-for-woocommerce')
    ));

    register_post_status('wc-epayco_completed', array(
        'label' => 'ePayco Pago Completado Prueba',
        'public' => true,
        'show_in_admin_status_list' => true,
        'show_in_admin_all_list' => true,
        'exclude_from_search' => false,
        /* translators: %s representa la cantidad de pedidos con estado "ePayco Pago Completado Prueba" */
        'label_count' => _n_noop('ePayco Pago Completado Prueba <span class="count">(%s)</span>', 'ePayco Pago Completado Prueba <span class="count">(%s)</span>', 'epayco-subscriptions-for-woocommerce')
    ));

    register_post_status('wc-completed', array(
        'label' => 'Completado',
        'public' => true,
        'show_in_admin_status_list' => true,
        'show_in_admin_all_list' => true,
        'exclude_from_search' => false,
        /* translators: %s representa la cantidad de pedidos con estado "Completado" */
        'label_count' => _n_noop('Completado<span class="count">(%s)</span>', 'Completado<span class="count">(%s)</span>', 'epayco-subscriptions-for-woocommerce')
    ));

    register_post_status('wc-completed_test', array(
        'label' => 'Completado Prueba',
        'public' => true,
        'show_in_admin_status_list' => true,
        'show_in_admin_all_list' => true,
        'exclude_from_search' => false,
        /* translators: %s representa la cantidad de pedidos con estado "Completado Prueba" */
        'label_count' => _n_noop('Completado Prueba<span class="count">(%s)</span>', 'Completado Prueba<span class="count">(%s)</span>', 'epayco-subscriptions-for-woocommerce')
    ));
}

function add_epayco_suscription_to_order_statuses($order_statuses)
{
    $new_order_statuses = array();
    $epayco_order = get_option('epayco_order_status');
    $testMode = $epayco_order == true ? "true" : "false";
    foreach ($order_statuses as $key => $status) {
        $new_order_statuses[$key] = $status;
        if ('wc-cancelled' === $key) {
            if ($testMode == "true") {
                $new_order_statuses['wc-epayco_cancelled'] = 'ePayco Pago Cancelado Prueba';
            } else {
                $new_order_statuses['wc-epayco-cancelled'] = 'ePayco Pago Cancelado';
            }
        }

        if ('wc-failed' === $key) {
            if ($testMode == "true") {
                $new_order_statuses['wc-epayco_failed'] = 'ePayco Pago Fallido Prueba';
            } else {
                $new_order_statuses['wc-epayco-failed'] = 'ePayco Pago Fallido';
            }
        }

        if ('wc-on-hold' === $key) {
            if ($testMode == "true") {
                $new_order_statuses['wc-epayco_on_hold'] = 'ePayco Pago Pendiente Prueba';
            } else {
                $new_order_statuses['wc-epayco-on-hold'] = 'ePayco Pago Pendiente';
            }
        }

        if ('wc-processing' === $key) {
            if ($testMode == "true") {
                $new_order_statuses['wc-epayco_processing'] = 'ePayco Pago Procesando Prueba';
            } else {
                $new_order_statuses['wc-epayco-processing'] = 'ePayco Pago Procesando';
            }
        } else {
            if ($testMode == "true") {
                $new_order_statuses['wc-processing_test'] = 'Procesando Prueba';
            } else {
                $new_order_statuses['wc-processing'] = 'Procesando';
            }
        }

        if ('wc-completed' === $key) {
            if ($testMode == "true") {
                $new_order_statuses['wc-epayco_completed'] = 'ePayco Pago Completado Prueba';
            } else {
                $new_order_statuses['wc-epayco-completed'] = 'ePayco Pago Completado';
            }
        } else {
            if ($testMode == "true") {
                $new_order_statuses['wc-completed_test'] = 'Completado Prueba';
            } else {
                $new_order_statuses['wc-completed'] = 'Completado';
            }
        }
    }
    return $new_order_statuses;
}

function styling_admin_suscription_order_list()
{
    global $pagenow, $post;
    if ($pagenow != 'edit.php') return; // Exit
    if (get_post_type($post->ID) != 'shop_order') return; // Exit
    // HERE we set your custom status
    $epayco_order = get_option('epayco_order_status');
    $testMode = $epayco_order == true ? "true" : "false";
    if ($testMode == "true") {
        $order_status_failed = 'epayco_failed';
        $order_status_on_hold = 'epayco_on_hold';
        $order_status_processing = 'epayco_processing';
        $order_status_processing_ = 'processing_test';
        $order_status_completed = 'epayco_completed';
        $order_status_cancelled = 'epayco_cancelled';
        $order_status_completed_ = 'completed_test';
    } else {
        $order_status_failed = 'epayco-failed';
        $order_status_on_hold = 'epayco-on-hold';
        $order_status_processing = 'epayco-processing';
        $order_status_processing_ = 'processing';
        $order_status_completed = 'epayco-completed';
        $order_status_cancelled = 'epayco-cancelled';
        $order_status_completed_ = 'completed';
    }
?>

    <style>
        .order-status.status-<?php echo esc_attr(sanitize_title($order_status_failed)); ?> {
            background: #eba3a3;
            color: #761919;
        }

        .order-status.status-<?php echo esc_attr(sanitize_title($order_status_on_hold)); ?> {
            background: #f8dda7;
            color: #94660c;
        }

        .order-status.status-<?php echo esc_attr(sanitize_title($order_status_processing)); ?> {
            background: #c8d7e1;
            color: #2e4453;
        }

        .order-status.status-<?php echo esc_attr(sanitize_title($order_status_processing_)); ?> {
            background: #c8d7e1;
            color: #2e4453;
        }

        .order-status.status-<?php echo esc_attr(sanitize_title($order_status_completed)); ?> {
            background: #d7f8a7;
            color: #0c942b;
        }

        .order-status.status-<?php echo esc_attr(sanitize_title($order_status_completed_)); ?> {
            background: #d7f8a7;
            color: #0c942b;
        }

        .order-status.status-<?php echo esc_attr(sanitize_title($order_status_cancelled)); ?> {
            background: #eba3a3;
            color: #761919;
        }
    </style>


<?php
}

function activate_subscription_epayco()
{
    global $wpdb;

    $table_subscription_epayco = $wpdb->prefix . 'epayco_subscription';
    $table_plan_epayco = $wpdb->prefix . 'epayco_plans';
    $table_setings_epayco = $wpdb->prefix . 'epayco_setings';
    $charset_collate = $wpdb->get_charset_collate();



    // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQL.InterpolatedNotPrepared
    if ($wpdb->get_var("SHOW TABLES LIKE '{$table_subscription_epayco}'") !== $table_subscription_epayco) {
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';

        $sql = "CREATE TABLE {$table_subscription_epayco} (
            id MEDIUMINT(9) NOT NULL AUTO_INCREMENT,
            order_id INT(10) NOT NULL,
            ref_payco VARCHAR(60) NOT NULL,
            PRIMARY KEY (id)
        ) " . $wpdb->get_charset_collate() . ";";

        $sql3 = "CREATE TABLE IF NOT EXISTS $table_setings_epayco (
            id INT NOT NULL AUTO_INCREMENT,
            id_payco TEXT NULL,
            customer_id TEXT NULL,
            token_id TEXT NULL,
            email TEXT NULL,
            PRIMARY KEY (id)
        ) $charset_collate;";

        dbDelta($sql);
        dbDelta($sql2);
        dbDelta($sql3);
    }

    add_option('subscription_epayco_se_redirect', true);
}

function some_custom_checkout_field_update_order_meta($order_id)
{


    if (!empty($_POST['recipient_address']) && isset($_POST['recipient_nonce']) && wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['recipient_nonce'])), 'save_recipient_data')) {
        add_post_meta($order_id, 'recipient_address', sanitize_text_field(wp_unslash($_POST['recipient_address'])));
    }
    if (!empty($_POST['recipient_phone_number']) && isset($_POST['recipient_nonce']) && wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['recipient_nonce'])), 'save_recipient_data')) {
        update_post_meta($order_id, 'recipient_phone_number', sanitize_text_field(wp_unslash($_POST['recipient_phone_number'])));
    }
}

register_activation_hook(__FILE__, 'activate_subscription_epayco');

add_action('woocommerce_set_additional_field_value', function ($key, $value, $group, $wc_object) {
    if ('epayco/billing_type_document' === $key) {
        $wc_object->update_meta_data('_epayco_billing_type_document', $value, true);
    }
    if ('epayco/billing_dni' === $key) {
        $wc_object->update_meta_data('_epayco_billing_dni', $value, true);
    }
}, 10, 4);

add_action('woocommerce_init', function () {

    woocommerce_register_additional_checkout_field(
        array(
            'id'          => 'epayco/billing_type_document',
            'label'       => __('Tipo de documento', 'epayco-subscriptions-for-woocommerce'), // Corregido
            'placeholder' => 'Seleccionar tipo de documento',
            'location'    => 'contact',
            'type'        => 'select',
            'required'    => true,
            'class'       => ['custom-field-class'],
            'default'     => 'CC',
            'options'     => [
                // ['value' => 'Seleccionar', 'label' => __('Seleccione el tipo de documento', 'epayco-subscriptions-for-woocommerce')],
                ['value' => 'CC', 'label' => __('Cédula de ciudadanía', 'epayco-subscriptions-for-woocommerce')], // Corregido
                ['value' => 'CE', 'label' => __('Cédula de extranjería', 'epayco-subscriptions-for-woocommerce')], // Corregido
                ['value' => 'PPN', 'label' => __('Pasaporte', 'epayco-subscriptions-for-woocommerce')], // Corregido
                ['value' => 'SSN', 'label' => __('Número de seguridad social', 'epayco-subscriptions-for-woocommerce')], // Corregido
                ['value' => 'LIC', 'label' => __('Licencia de conducción', 'epayco-subscriptions-for-woocommerce')], // Corregido
                ['value' => 'NIT', 'label' => __('(NIT) Número de identificación tributaria', 'epayco-subscriptions-for-woocommerce')], // Corregido
                ['value' => 'TI', 'label' => __('Tarjeta de identidad', 'epayco-subscriptions-for-woocommerce')], // Corregido
                ['value' => 'DNI', 'label' => __('Documento nacional de identificación', 'epayco-subscriptions-for-woocommerce')] // Corregido
            ]
        )
    );


    woocommerce_register_additional_checkout_field(
        array(
            'id'          => 'epayco/billing_dni',
            'label'       => __('Ingrese el número de documento', 'epayco-subscriptions-for-woocommerce'),
            'location'    => 'contact',
            'type'        => 'text',
            'required'    => true,
            'class'       => ['custom-field-class']
        )
    );
});

add_action('woocommerce_checkout_update_order_meta', function ($order_id) {
    if (!empty($_POST['epayco_billing_type_document']) && isset($_POST['_wpnonce']) && wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['_wpnonce'])), 'woocommerce-process_checkout')) {
        update_post_meta($order_id, '_epayco_billing_type_document', sanitize_text_field(wp_unslash($_POST['epayco_billing_type_document'])));
    }
    if (!empty($_POST['epayco_billing_dni']) && isset($_POST['_wpnonce']) && wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['_wpnonce'])), 'woocommerce-process_checkout')) {
        update_post_meta($order_id, '_epayco_billing_dni', sanitize_text_field(wp_unslash($_POST['epayco_billing_dni'])));
    }
});

function epayco_enqueue_styles()
{
    if (!function_exists('plugins_url') || !function_exists('wp_enqueue_style')) {
        return; // Ensure WordPress functions are available
    }

    // Define the base path for plugin assets
    $plugin_url = plugins_url('assets/css/', EPS_PLUGIN_FILE);

    // Enqueue styles with explicit versions to avoid caching issues
    $plugin_url_base = plugins_url('assets/', __FILE__);


    wp_enqueue_style('epayco-animate', $plugin_url_base . 'animate.min.css', array(), '4.1.1');
    wp_enqueue_style('epayco-fontawesome', $plugin_url_base . 'fontawesome-all.css', array(), '5.15.4');
    wp_enqueue_style('epayco-bootstrap-slider', $plugin_url_base . 'bootstrap-slider.min.css', array(), '10.4.2');
    // wp_enqueue_style('epayco-style', $plugin_url . 'style.css', array(), '1.0');
    // wp_enqueue_style('epayco-general', $plugin_url . 'general.min.css', array(), '1.0');
    // wp_enqueue_style('epayco-card-style', $plugin_url . 'card-js.min.css', array(), '1.0');
    // wp_enqueue_style('epayco-cardsjs', $plugin_url . 'cardsjs.min.css', array(), '1.0');
}
add_action('wp_enqueue_scripts', 'epayco_enqueue_styles', 9999);


// Enqueue the script properly in WordPress
function enqueue_epayco_scripts()
{
    wp_enqueue_script('jquery'); // Usa la versión de WordPress
}
add_action('wp_enqueue_scripts', 'enqueue_epayco_scripts');


// Enqueue the script properly in WordPress
function enqueue_epayco_epaycojs_script()
{
    if (!function_exists('wp_enqueue_script') || !function_exists('esc_url')) {
        return; // Ensure WordPress functions are available
    }
    $epaycojs = plugins_url('assets/js/epayco.js', __FILE__); // Define the variable
    wp_enqueue_script('epayco-js', esc_url($epaycojs), array(), '1.0.0', true); // Set version to avoid caching issues
}
add_action('wp_enqueue_scripts', 'enqueue_epayco_epaycojs_script');

add_filter('wp_get_attachment_image_src', function ($image, $attachment_id, $size, $icon) {
    if ($attachment_id === 0) {
        // URL de la imagen externa
        $external_logo = plugin_dir_url(__FILE__) . 'assets/images/comercio.png';
        return [$external_logo, 90, 90, false];
    }
    return $image;
}, 10, 4);

add_filter('wp_get_attachment_image_src', function ($image, $attachment_id, $size, $icon) {
    if ($attachment_id === 1) {
        // URL de la imagen externa
        $external_logo2 = 'https://msecure.epayco.co/img/credit-cards/disable.png';
        return [$external_logo2, 90, 90, false];
    }
    return $image;
}, 10, 4);

add_filter('wp_get_attachment_image_src', function ($image, $attachment_id, $size, $icon) {
    if ($attachment_id === 2) {
        // URL de la imagen externa
        $external_logo3 = 'https://multimedia.epayco.co/plugins-sdks/logo-negro-epayco.png';
        return [$external_logo3, 90, 90, false];
    }
    return $image;
}, 10, 4);

add_filter('wp_get_attachment_image_src', function ($image, $attachment_id, $size, $icon) {
    if ($attachment_id === 3) {
        // URL de la imagen externa
        $external_logo4 = 'https://msecure.epayco.co/img/reloj.png';
        return [$external_logo4, 60, 60, false];
    }
    return $image;
}, 10, 4);

add_filter('wp_get_attachment_image_src', function ($image, $attachment_id, $size, $icon) {
    if ($attachment_id === 4) {
        // URL de la imagen externa
        $external_logo5 = 'https://secure.epayco.co/img/new_epayco_white.png';
        return [$external_logo5, 90, 90, false];
    }
    return $image;
}, 10, 4);

function epayco_suscripcion_cron_job_deactivation()
{
    //eliminar por completo cualquier tarea programada
    wp_clear_scheduled_hook('woocommerc_epayco_suscripcion_cron_hook');
    //desprograma la accion
    as_unschedule_action('woocommerce_epayco_suscripcion_cleanup_draft_orders');
    //se toma el tiempo de la proxima ejecucion
    $timestamp = wp_next_scheduled('woocommerce_epayco_suscripcion_cleanup_draft_orders');
    // Si se encuentra una hora programada para este evento; la desprograma
    if ($timestamp) {
        wp_unschedule_event($timestamp, 'woocommerce_epayco_suscripcion_cleanup_draft_orders');
    }
}
register_deactivation_hook(__FILE__, 'epayco_suscripcion_cron_job_deactivation');