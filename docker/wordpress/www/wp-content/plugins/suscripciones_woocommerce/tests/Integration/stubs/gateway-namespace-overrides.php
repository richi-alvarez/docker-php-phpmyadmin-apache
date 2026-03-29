<?php

/**
 * Overrides de funciones en el namespace del Gateway.
 *
 * PHP resuelve llamadas a funciones sin prefijo "\" buscando primero en el
 * namespace del archivo que hace la llamada. Al definir estas funciones en
 * EpaycoSubscription\Woocommerce\Gateways, interceptamos las llamadas que
 * hace webhook() sin modificar el código del plugin.
 *
 * Comportamiento:
 *  - wp_safe_redirect / wp_redirect → guarda la URL y lanza WebhookExitSignal
 *  - wc_add_notice                  → guarda el aviso en el estado compartido
 *  - wc_get_order                   → retorna el pedido configurado por el test
 *  - wp_cache_get / wp_cache_set    → no-op (caché desactivada en tests)
 *  - sanitize_text_field / wp_unslash → versión mínima sin WP
 */

namespace EpaycoSubscription\Woocommerce\Gateways;

use EpaycoSubscription\Tests\Integration\Gateways\WebhookExitSignal;

// ---------------------------------------------------------------------------
// Redirecciones — captura la URL y señaliza la salida del webhook
// ---------------------------------------------------------------------------

function wp_safe_redirect(string $location, int $status = 302, string $x_redirect_by = 'WordPress'): bool
{
    $GLOBALS['_webhook_test_redirects'][] = $location;
    throw new WebhookExitSignal("redirect:$location");
}

function wp_redirect(string $location, int $status = 302, string $x_redirect_by = 'WordPress'): bool
{
    $GLOBALS['_webhook_test_redirects'][] = $location;
    throw new WebhookExitSignal("redirect:$location");
}

// ---------------------------------------------------------------------------
// Notificaciones — captura mensajes de error/éxito
// ---------------------------------------------------------------------------

function wc_add_notice(string $message, string $notice_type = 'success', array $data = []): void
{
    $GLOBALS['_webhook_test_notices'][] = [
        'message' => $message,
        'type'    => $notice_type,
    ];
}

// ---------------------------------------------------------------------------
// Pedidos — retorna el WC_Order inyectado por el test
// ---------------------------------------------------------------------------

function wc_get_order(mixed $order_id): mixed
{
    return $GLOBALS['_webhook_test_order'] ?? new \WC_Order((int) $order_id);
}

function wc_get_checkout_url(): string
{
    return 'http://example.com/checkout';
}

function get_woocommerce_currency(): string
{
    return 'COP';
}

// ---------------------------------------------------------------------------
// Caché de objetos — siempre miss para que el webhook no use datos cacheados
// ---------------------------------------------------------------------------

function wp_cache_get(string $key, string $group = '', bool $force = false, mixed &$found = null): mixed
{
    $found = false;
    return false;
}

function wp_cache_set(string $key, mixed $data, string $group = '', int $expire = 0): bool
{
    return true;
}

// ---------------------------------------------------------------------------
// WooCommerce Subscriptions — retorna lo que el test haya configurado
// ---------------------------------------------------------------------------

function wcs_get_subscriptions_for_order(mixed $order, array $args = []): array
{
    return $GLOBALS['_webhook_test_subscriptions'] ?? [];
}

// ---------------------------------------------------------------------------
// Sanitización — reimplementación mínima (sin WordPress)
// ---------------------------------------------------------------------------

function sanitize_text_field(mixed $str): string
{
    return is_null($str) ? '' : strip_tags(trim((string) $str));
}

function wp_unslash(mixed $value): mixed
{
    return is_array($value)
        ? array_map('\EpaycoSubscription\Woocommerce\Gateways\wp_unslash', $value)
        : stripslashes((string) $value);
}

// ---------------------------------------------------------------------------
// Helpers de WooCommerce — versiones mínimas
// ---------------------------------------------------------------------------

function get_permalink(mixed $post = 0): string
{
    return 'http://example.com/page/' . (int) $post;
}

function woocommerce_get_page_id(string $page): int
{
    return match ($page) {
        'checkout' => 1,
        'pay'      => 2,
        'shop'     => 3,
        default    => 0,
    };
}
