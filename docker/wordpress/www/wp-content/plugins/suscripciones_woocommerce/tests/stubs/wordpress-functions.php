<?php

/**
 * Stubs de funciones de WordPress para pruebas unitarias.
 * Cada función replica el comportamiento mínimo necesario para que
 * las clases del plugin se carguen y ejecuten sin WordPress instalado.
 */

// --- Constantes globales ---
if (!defined('ABSPATH')) {
    define('ABSPATH', dirname(__DIR__, 2) . '/');
}
if (!defined('EPS_VERSION')) {
    define('EPS_VERSION', '6.5.3');
}
if (!defined('EPS_PLUGIN_FILE')) {
    define('EPS_PLUGIN_FILE', dirname(__DIR__, 2) . '/epayco-subscription.php');
}
if (!defined('EPS_PLUGIN_URL')) {
    define('EPS_PLUGIN_URL', 'http://example.com/wp-content/plugins/suscripciones_woocommerce/');
}
if (!defined('EPS_PLATFORM_NAME')) {
    define('EPS_PLATFORM_NAME', 'woocommerce');
}
if (!defined('ENT_COMPAT')) {
    define('ENT_COMPAT', 2);
}
// Constantes de resultado de $wpdb->get_results()
if (!defined('OBJECT'))   { define('OBJECT',   'OBJECT'); }
if (!defined('ARRAY_A'))  { define('ARRAY_A',  'ARRAY_A'); }
if (!defined('ARRAY_N'))  { define('ARRAY_N',  'ARRAY_N'); }
if (!defined('OBJECT_K')) { define('OBJECT_K', 'OBJECT_K'); }

// --- Opciones de WordPress ---
$GLOBALS['_wp_options'] = [];

if (!function_exists('get_option')) {
    function get_option(string $option, $default = false)
    {
        return $GLOBALS['_wp_options'][$option] ?? $default;
    }
}

if (!function_exists('update_option')) {
    function update_option(string $option, $value, $autoload = null): bool
    {
        $GLOBALS['_wp_options'][$option] = $value;
        return true;
    }
}

if (!function_exists('delete_option')) {
    function delete_option(string $option): bool
    {
        unset($GLOBALS['_wp_options'][$option]);
        return true;
    }
}

// --- Sanitización ---
if (!function_exists('sanitize_text_field')) {
    function sanitize_text_field($str): string
    {
        return is_null($str) ? '' : strip_tags(trim((string) $str));
    }
}

if (!function_exists('sanitize_file_name')) {
    function sanitize_file_name(string $filename): string
    {
        // Elimina caracteres no seguros (simulación simplificada)
        return preg_replace('/[^a-zA-Z0-9._\- ]/', '', $filename);
    }
}

if (!function_exists('sanitize_post')) {
    function sanitize_post($post, string $context = 'display')
    {
        return $post;
    }
}

if (!function_exists('wp_unslash')) {
    function wp_unslash($value)
    {
        return is_array($value) ? array_map('wp_unslash', $value) : stripslashes((string) $value);
    }
}

if (!function_exists('wp_kses_post')) {
    function wp_kses_post($data)
    {
        return $data;
    }
}

if (!function_exists('esc_html')) {
    function esc_html($text): string
    {
        return htmlspecialchars((string) $text, ENT_QUOTES, 'UTF-8');
    }
}

if (!function_exists('esc_url')) {
    function esc_url(string $url): string
    {
        return filter_var($url, FILTER_SANITIZE_URL) ?: '';
    }
}

if (!function_exists('map_deep')) {
    function map_deep($value, callable $callback)
    {
        if (is_array($value)) {
            return array_map(fn($item) => map_deep($item, $callback), $value);
        }
        if (is_object($value)) {
            foreach (get_object_vars($value) as $key => $val) {
                $value->$key = map_deep($val, $callback);
            }
            return $value;
        }
        return $callback($value);
    }
}

// --- Nonces ---
if (!function_exists('wp_verify_nonce')) {
    function wp_verify_nonce($nonce, $action = -1): int|false
    {
        // En tests siempre retorna válido
        return 1;
    }
}

if (!function_exists('wp_create_nonce')) {
    function wp_create_nonce($action = -1): string
    {
        return 'test_nonce_' . md5((string) $action);
    }
}

if (!function_exists('wp_nonce_url')) {
    function wp_nonce_url(string $actionurl, $action = -1, string $name = '_wpnonce'): string
    {
        return add_query_arg($name, wp_create_nonce($action), $actionurl);
    }
}

// --- URLs ---
if (!function_exists('home_url')) {
    function home_url(string $path = '', string $scheme = null): string
    {
        return 'http://example.com' . ($path ? '/' . ltrim($path, '/') : '');
    }
}

if (!function_exists('admin_url')) {
    function admin_url(string $path = '', string $scheme = 'admin'): string
    {
        return 'http://example.com/wp-admin/' . ltrim($path, '/');
    }
}

if (!function_exists('self_admin_url')) {
    function self_admin_url(string $path = ''): string
    {
        return admin_url($path);
    }
}

if (!function_exists('plugins_url')) {
    function plugins_url(string $path = '', string $plugin = ''): string
    {
        return 'http://example.com/wp-content/plugins/' . ltrim($path, '/');
    }
}

if (!function_exists('plugin_dir_url')) {
    function plugin_dir_url(string $file): string
    {
        return 'http://example.com/wp-content/plugins/suscripciones_woocommerce/';
    }
}

if (!function_exists('add_query_arg')) {
    function add_query_arg($key, $value = '', string $url = ''): string
    {
        if (is_array($key)) {
            $args = $key;
        } else {
            $args = [$key => $value];
        }
        $parsed = parse_url($url);
        $base   = ($parsed['scheme'] ?? 'http') . '://' . ($parsed['host'] ?? 'example.com') . ($parsed['path'] ?? '');
        parse_str($parsed['query'] ?? '', $existing);
        $merged = array_merge($existing, $args);
        return $base . '?' . http_build_query($merged);
    }
}

if (!function_exists('get_query_var')) {
    function get_query_var(string $var, $default = ''): string
    {
        return (string) $default;
    }
}

if (!function_exists('wc_get_checkout_url')) {
    function wc_get_checkout_url(): string
    {
        return 'http://example.com/checkout';
    }
}

// --- Hooks de WordPress ---
if (!function_exists('add_action')) {
    function add_action(string $hook, $callback, int $priority = 10, int $accepted_args = 1): bool
    {
        return true;
    }
}

if (!function_exists('add_filter')) {
    function add_filter(string $hook, $callback, int $priority = 10, int $accepted_args = 1): bool
    {
        return true;
    }
}

if (!function_exists('do_action')) {
    function do_action(string $hook, ...$args): void {}
}

if (!function_exists('apply_filters')) {
    function apply_filters(string $hook, $value, ...$args)
    {
        return $value;
    }
}

if (!function_exists('has_filter')) {
    function has_filter(string $hook, $callback = false): bool|int
    {
        return false;
    }
}

// --- Entorno ---
if (!function_exists('wp_get_environment_type')) {
    function wp_get_environment_type(): string
    {
        return 'production';
    }
}

if (!function_exists('is_admin')) {
    function is_admin(): bool
    {
        return false;
    }
}

if (!function_exists('current_user_can')) {
    function current_user_can(string $capability, ...$args): bool
    {
        return false;
    }
}

if (!function_exists('get_locale')) {
    function get_locale(): string
    {
        return 'es_CO';
    }
}

if (!function_exists('get_plugins')) {
    function get_plugins(string $plugin_folder = ''): array
    {
        return [];
    }
}

// --- i18n ---
if (!function_exists('__')) {
    function __(string $text, string $domain = 'default'): string
    {
        return $text;
    }
}

if (!function_exists('_e')) {
    function _e(string $text, string $domain = 'default'): void
    {
        echo $text;
    }
}

if (!function_exists('_x')) {
    function _x(string $text, string $context, string $domain = 'default'): string
    {
        return $text;
    }
}

if (!function_exists('load_textdomain')) {
    function load_textdomain(string $domain, string $mofile, string $locale = ''): bool
    {
        return true;
    }
}

if (!function_exists('unload_textdomain')) {
    function unload_textdomain(string $domain): bool
    {
        return true;
    }
}

if (!function_exists('get_file_data')) {
    function get_file_data(string $file, array $default_headers, string $context = ''): array
    {
        return array_fill_keys(array_keys($default_headers), '');
    }
}

// --- Redirecciones ---
if (!function_exists('wp_redirect')) {
    function wp_redirect(string $location, int $status = 302, string $x_redirect_by = 'WordPress'): bool
    {
        return true;
    }
}

if (!function_exists('wp_safe_redirect')) {
    function wp_safe_redirect(string $location, int $status = 302, string $x_redirect_by = 'WordPress'): bool
    {
        return true;
    }
}

// --- Notificaciones WooCommerce ---
if (!function_exists('wc_add_notice')) {
    function wc_add_notice(string $message, string $notice_type = 'success', array $data = []): void {}
}

if (!function_exists('wc_get_logger')) {
    function wc_get_logger()
    {
        static $logger = null;
        if ($logger === null) {
            $logger = new class {
                public function info(string $message, array $context = []): void {}
                public function error(string $message, array $context = []): void {}
                public function add(string $handle, string $message): void {}
            };
        }
        return $logger;
    }
}

// --- Meta de posts ---
$GLOBALS['_wp_post_meta'] = [];

if (!function_exists('update_post_meta')) {
    function update_post_meta(int $post_id, string $meta_key, $meta_value, $prev_value = ''): int|bool
    {
        $GLOBALS['_wp_post_meta'][$post_id][$meta_key] = $meta_value;
        return true;
    }
}

if (!function_exists('get_post_meta')) {
    function get_post_meta(int $post_id, string $key = '', bool $single = false)
    {
        if ($key) {
            $val = $GLOBALS['_wp_post_meta'][$post_id][$key] ?? '';
            return $single ? $val : [$val];
        }
        return $GLOBALS['_wp_post_meta'][$post_id] ?? [];
    }
}

// --- Pedidos WooCommerce ---
if (!function_exists('wc_get_order')) {
    function wc_get_order(mixed $order_id): mixed
    {
        return $GLOBALS['_webhook_test_order'] ?? new \WC_Order((int) $order_id);
    }
}

if (!function_exists('get_woocommerce_currency')) {
    function get_woocommerce_currency(): string
    {
        return 'COP';
    }
}

if (!function_exists('current_time')) {
    function current_time(string $type, bool $gmt = false): string|int
    {
        return match ($type) {
            'timestamp', 'U' => time(),
            default          => date('Y-m-d H:i:s'),
        };
    }
}

if (!function_exists('get_site_url')) {
    function get_site_url(int $blog_id = null, string $path = '', string $scheme = null): string
    {
        return 'http://example.com' . ($path ? '/' . ltrim($path, '/') : '');
    }
}

// --- WooCommerce Subscriptions helpers ---
if (!function_exists('wcs_order_contains_subscription')) {
    function wcs_order_contains_subscription($order, $order_type = 'parent'): bool
    {
        return false;
    }
}

if (!function_exists('wcs_get_subscriptions_for_order')) {
    function wcs_get_subscriptions_for_order($order, array $args = []): array
    {
        return [];
    }
}

if (!function_exists('wcs_get_subscription')) {
    function wcs_get_subscription($id)
    {
        return null;
    }
}

// --- Scripts y estilos ---
if (!function_exists('wp_enqueue_style')) {
    function wp_enqueue_style(string $handle, string $src = '', array $deps = [], $ver = false, string $media = 'all'): void {}
}

if (!function_exists('wp_enqueue_script')) {
    function wp_enqueue_script(string $handle, string $src = '', array $deps = [], $ver = false, bool $in_footer = false): void {}
}

if (!function_exists('wp_register_style')) {
    function wp_register_style(string $handle, $src, array $deps = [], $ver = false, string $media = 'all'): bool
    {
        return true;
    }
}

if (!function_exists('wp_register_script')) {
    function wp_register_script(string $handle, $src, array $deps = [], $ver = false, bool $in_footer = false): bool
    {
        return true;
    }
}

if (!function_exists('wp_localize_script')) {
    function wp_localize_script(string $handle, string $object_name, array $l10n): bool
    {
        return true;
    }
}
