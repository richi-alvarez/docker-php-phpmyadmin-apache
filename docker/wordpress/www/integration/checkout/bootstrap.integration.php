<?php

declare(strict_types=1);

$useRealWooIntegration = getenv('RUN_WC_REAL_INTEGRATION') === '1';

if ($useRealWooIntegration) {
    $wpLoadPath = getenv('WP_LOAD_PATH') ?: dirname(__DIR__) . '/wp-load.php';
    if (file_exists($wpLoadPath)) {
        require_once $wpLoadPath;
    }
}

if (!defined('ABSPATH')) {
    define('ABSPATH', __DIR__);
}

if (!class_exists('WP_Error')) {
    class WP_Error
    {
        private string $message;

        public function __construct(string $code = '', string $message = '')
        {
            $this->message = $message;
        }

        public function get_error_message()
        {
            return $this->message;
        }
    }
}

if (!function_exists('is_wp_error')) {
    function is_wp_error($value)
    {
        return $value instanceof WP_Error;
    }
}

if (!function_exists('wp_remote_get')) {
    function wp_remote_get($url)
    {
        $timeout = (int) (getenv('INTEGRATION_TIMEOUT') ?: 15);
        $context = stream_context_create([
            'http' => [
                'method' => 'GET',
                'timeout' => $timeout,
                'ignore_errors' => true,
            ],
        ]);

        $body = @file_get_contents($url, false, $context);
        if ($body === false) {
            return new WP_Error('http_request_failed', 'Unable to reach endpoint');
        }

        $statusCode = 200;
        $headers = $http_response_header ?? [];
        foreach ($headers as $headerLine) {
            if (stripos($headerLine, 'HTTP/') === 0 && preg_match('/\s(\d{3})\s/', $headerLine, $matches)) {
                $statusCode = (int) $matches[1];
                break;
            }
        }

        return [
            'body' => $body,
            'response' => ['code' => $statusCode],
        ];
    }
}

if (!function_exists('wp_remote_retrieve_body')) {
    function wp_remote_retrieve_body($response)
    {
        if (is_array($response) && isset($response['body'])) {
            return $response['body'];
        }

        return '';
    }
}

if (!function_exists('wp_remote_retrieve_response_code')) {
    function wp_remote_retrieve_response_code($response)
    {
        if (is_array($response) && isset($response['response']['code'])) {
            return (int) $response['response']['code'];
        }

        return 0;
    }
}

if (!class_exists('WC_Logger')) {
    class WC_Logger
    {
        public function add($source, $message)
        {
            $GLOBALS['wc_logs'][] = ['source' => $source, 'message' => $message];
        }
    }
}

if (!class_exists('WC_Payment_Gateway')) {
    class WC_Payment_Gateway
    {
        public array $settings = [];

        public function get_option($key)
        {
            return $this->settings[$key] ?? 0;
        }
    }
}

$pluginClassesPath = dirname(__DIR__, 2) . '/wp-content/plugins/Plugin_ePayco_WooCommerce/classes/';
if (!defined('EPAYCO_PLUGIN_CLASS_PATH')) {
    define('EPAYCO_PLUGIN_CLASS_PATH', $pluginClassesPath);
}
if (!defined('EPAYCO_PLUGIN_URL')) {
    define('EPAYCO_PLUGIN_URL', 'https://example.test/plugin/');
}
if (!defined('WC_VERSION')) {
    define('WC_VERSION', '8.0.0');
}

if (!class_exists('WC_Gateway_Epayco')) {
    require_once $pluginClassesPath . 'class-wc-gateway-epayco.php';
}