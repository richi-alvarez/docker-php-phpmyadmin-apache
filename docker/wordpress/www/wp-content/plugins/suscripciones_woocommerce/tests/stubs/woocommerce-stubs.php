<?php

/**
 * Stubs de clases de WooCommerce y del plugin para pruebas unitarias.
 * Proveen las implementaciones mínimas necesarias para que las clases
 * del plugin puedan cargarse y ejecutarse sin WooCommerce instalado.
 */

// ---------------------------------------------------------------------------
// WC_Payment_Gateway
// ---------------------------------------------------------------------------
if (!class_exists('WC_Payment_Gateway')) {
    abstract class WC_Payment_Gateway
    {
        public string $id          = '';
        public string $title       = '';
        public string $description = '';
        public bool   $has_fields  = false;
        public array  $supports    = [];
        public array  $settings    = [];
        public array  $form_fields = [];

        /**
         * Simula el comportamiento real de WC: carga los settings desde la
         * opción de WordPress "woocommerce_{id}_settings".  Esto permite que
         * los tests de integración inyecten credenciales de prueba sin
         * modificar el código de producción.
         */
        public function init_settings(): void
        {
            $this->settings = get_option("woocommerce_{$this->id}_settings") ?: [];
        }

        public function get_option(string $key, $default = ''): mixed
        {
            return $this->settings[$key] ?? $default;
        }

        public function update_option(string $key, $value): bool
        {
            $this->settings[$key] = $value;
            return true;
        }

        public function is_available(): bool
        {
            return true;
        }

        public function init_form_fields(): void {}
    }
}

// ---------------------------------------------------------------------------
// WC_Logger
// ---------------------------------------------------------------------------
if (!class_exists('WC_Logger')) {
    class WC_Logger
    {
        public function info(string $message, array $context = []): void {}
        public function error(string $message, array $context = []): void {}
        public function warning(string $message, array $context = []): void {}
        public function add(string $handle, string $message): void {}
    }
}

// ---------------------------------------------------------------------------
// WC_Subscription
// ---------------------------------------------------------------------------
if (!class_exists('WC_Subscription')) {
    class WC_Subscription
    {
        private int   $id   = 0;
        private array $meta = [];

        public function __construct(int $id = 0)
        {
            $this->id = $id;
        }

        public function get_id(): int
        {
            return $this->id;
        }

        public function delete_meta_data(string $key): void
        {
            unset($this->meta[$key]);
        }

        public function update_meta_data(string $key, mixed $value): void
        {
            $this->meta[$key] = $value;
        }

        public function get_meta(string $key, bool $single = true): mixed
        {
            return $this->meta[$key] ?? '';
        }

        public function save(): int
        {
            return $this->id;
        }

        public function update_status(string $status, string $note = ''): bool { return true; }
        public function add_order_note(string $note): int { return 0; }
        public function payment_complete(string $transaction_id = ''): void {}
        public function payment_failed(): void {}

        // --- Métodos de facturación y envío ---
        public function get_billing_email(): string    { return ''; }
        public function get_billing_phone(): string    { return ''; }
        public function get_billing_country(): string  { return ''; }
        public function get_billing_city(): string     { return ''; }
        public function get_billing_address_1(): string { return ''; }
        public function get_billing_address_2(): string { return ''; }
        public function get_shipping_country(): string  { return ''; }
        public function get_shipping_city(): string     { return ''; }
        public function get_shipping_address_1(): string { return ''; }
        public function get_shipping_address_2(): string { return ''; }

        // --- Totales y moneda ---
        public function get_total(): string            { return '0'; }
        public function get_total_discount(): float    { return 0.0; }
        public function get_currency(): string         { return 'COP'; }
        public function get_base_data(): array         { return ['total' => '0', 'total_tax' => '0']; }

        // --- Productos ---
        public function get_items(): array             { return []; }

        // --- Período de facturación ---
        public function get_billing_period(): string   { return 'month'; }
        public function get_billing_interval(): string { return '1'; }

        // --- Fechas ---
        public function get_date(string $type = ''): string { return ''; }
    }
}

// ---------------------------------------------------------------------------
// WC_Order (stub mínimo)
// ---------------------------------------------------------------------------
if (!class_exists('WC_Order')) {
    class WC_Order
    {
        /** Accesible como propiedad pública (compatible con $order->id en paramsBilling). */
        public int    $id        = 1;
        public string $order_key = 'wc_key_test';

        private string $status = 'pending';
        private array  $meta   = [];

        public function __construct(int $id = 1)
        {
            $this->id = $id;
            // Registra cada instancia por ID para que los tests puedan
            // recuperar el objeto creado internamente por webhook().
            $GLOBALS['_wc_order_instances'][$id] = $this;
        }

        public function get_id(): int
        {
            return $this->id;
        }

        public function get_status(): string
        {
            return $this->status;
        }

        public function update_status(string $new_status, string $note = ''): bool
        {
            $this->status = $new_status;
            return true;
        }

        public function get_checkout_payment_url(bool $on_checkout = false): string
        {
            return 'http://example.com/checkout/order-pay/' . $this->id;
        }

        public function get_checkout_order_received_url(): string
        {
            return 'http://example.com/checkout/order-received/' . $this->id;
        }

        public function get_meta(string $key, bool $single = true): mixed
        {
            return $this->meta[$key] ?? '';
        }

        public function update_meta_data(string $key, mixed $value): void
        {
            $this->meta[$key] = $value;
        }

        public function get_billing_first_name(): string { return 'Test'; }
        public function get_billing_last_name(): string  { return 'User'; }
        public function get_billing_email(): string      { return 'test@example.com'; }
        public function get_billing_phone(): string      { return '0000000000'; }
        public function get_billing_country(): string    { return 'CO'; }
        public function get_billing_city(): string       { return 'Bogotá'; }
        public function get_billing_address_1(): string  { return 'Calle 1'; }
        public function get_billing_address_2(): string  { return ''; }
        public function get_data(): array                { return []; }
        public function add_order_note(string $note, int $is_customer_note = 0, bool $added_by_user = false): int { return 0; }
        public function add_meta_data(string $key, mixed $value, bool $unique = false): int { return 0; }
        public function save(): int { return $this->id; }
    }
}

// ---------------------------------------------------------------------------
// WC() — función global de WooCommerce
// ---------------------------------------------------------------------------
if (!function_exists('WC')) {
    /**
     * Retorna un singleton con session y cart disponibles.
     * Los tests pueden manipular WC()->session directamente.
     */
    function WC(): object
    {
        static $instance = null;

        if ($instance === null) {
            $instance = new class {
                public ?object $session = null;
                public object  $cart;

                public function __construct()
                {
                    // Sesión disponible por defecto
                    $this->session = new class {
                        private array $data = [];

                        public function get(string $key): mixed
                        {
                            return $this->data[$key] ?? null;
                        }

                        public function set(string $key, mixed $value): void
                        {
                            $this->data[$key] = $value;
                        }
                    };

                    $this->cart = new class {
                        public function empty_cart(): void {}
                    };
                }
            };
        }

        return $instance;
    }
}
