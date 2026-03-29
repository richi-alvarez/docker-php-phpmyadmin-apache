<?php

/**
 * Tests de integración con la API real de ePayco (sandbox).
 *
 * ¿Qué hace este archivo?
 *   Ejecuta el flujo completo de webhook() contra el sandbox de ePayco sin
 *   mockear los métodos que realizan llamadas HTTP. Solo se mockean los dos
 *   métodos que leen datos del objeto WC_Subscription de WooCommerce (que no
 *   está disponible fuera de WordPress):
 *     - paramsBilling()          → devuelve datos de cliente controlados
 *     - getPlansBySubscription() → devuelve un plan con ID fijo y reproducible
 *
 *   Llamadas HTTP reales que ocurren durante el test:
 *     1. epaycoSdk->customer->get(null)            (getEpaycoExisting — sin customer_id previo)
 *     2. epaycoSdk->customer->create(...)          (Customer::customerCreate)
 *     3. epaycoSdk->plan->get(TEST_PLAN_ID)        (getPlans)
 *     4. epaycoSdk->plan->create(...)              (plansCreate — si el plan no existe)
 *     5. epaycoSdk->plan->get(TEST_PLAN_ID)        (segunda llamada en validatePlan)
 *     6. epaycoSdk->subscriptions->create(...)     (subscriptionCreate)
 *     7. epaycoSdk->subscriptions->charge(...)     (subscriptionCharge)
 *
 * Configuración:
 *   Todas las credenciales y datos de prueba se definen como constantes en
 *   WebhookTestCase (WebhookIntegrationTest.php). Actualiza esas constantes
 *   para apuntar a tu propio sandbox.
 *
 * Ejecución:
 *   vendor/bin/phpunit --group real-api
 *
 * @group real-api
 */

namespace EpaycoSubscription\Tests\Integration\Gateways;

// Cargamos el caso base que define WebhookTestCase y todas las constantes.
require_once __DIR__ . '/EpaycoSuscriptionIntegrationTest.php';

// ---------------------------------------------------------------------------
// FakeSubscription — WC_Subscription con datos de prueba controlados
// ---------------------------------------------------------------------------

/**
 * Sustituto completo de WC_Subscription para los tests de API real.
 * Devuelve los datos de prueba definidos en las constantes de WebhookTestCase.
 *
 * Extiende \WC_Subscription (stub) para que instanceof \WC_Subscription sea
 * true, satisfaciendo la firma tipada de intervalAmount() y getTrialDays().
 */
class FakeSubscription extends \WC_Subscription
{
    private int $subId;

    public function __construct(int $id = 1)
    {
        $this->subId = $id;
    }

    // --- Identificación ---
    public function get_id(): int { return $this->subId; }

    // --- Totales y moneda ---
    public function get_total_discount(): float { return 0.0; }
    public function get_base_data(): array
    {
        return ['total' => (string) WebhookTestCase::TEST_PLAN_AMOUNT, 'total_tax' => '0'];
    }
    public function get_currency(): string { return WebhookTestCase::TEST_PLAN_CURRENCY; }
    public function get_total(): string    { return (string) WebhookTestCase::TEST_PLAN_AMOUNT; }

    // --- Productos ---
    public function get_items(): array
    {
        return [['name' => 'Plan-Woo', 'product_id' => '1001', 'quantity' => 1]];
    }

    // --- Facturación ---
    public function get_billing_period(): string    { return WebhookTestCase::TEST_PLAN_INTERVAL; }
    public function get_billing_interval(): string  { return (string) WebhookTestCase::TEST_PLAN_INTERVAL_COUNT; }
    public function get_billing_email(): string     { return WebhookTestCase::TEST_CUSTOMER_EMAIL; }
    public function get_billing_phone(): string     { return WebhookTestCase::TEST_CUSTOMER_PHONE; }
    public function get_billing_country(): string   { return WebhookTestCase::TEST_CUSTOMER_COUNTRY; }
    public function get_billing_city(): string      { return WebhookTestCase::TEST_CUSTOMER_CITY; }
    public function get_billing_address_1(): string { return WebhookTestCase::TEST_CUSTOMER_ADDRESS; }
    public function get_billing_address_2(): string { return ''; }

    // --- Envío (vacío → se usa el de facturación) ---
    public function get_shipping_country(): string  { return ''; }
    public function get_shipping_city(): string     { return ''; }
    public function get_shipping_address_1(): string { return ''; }
    public function get_shipping_address_2(): string { return ''; }

    // --- Fechas de período de prueba (sin trial) ---
    public function get_date(string $type = ''): string { return ''; }

    // --- Estado y metadatos ---
    public function update_status(string $status, string $note = ''): bool { return true; }
    public function add_order_note(string $note): int { return 0; }
    public function get_meta(string $key, bool $single = true): mixed { return ''; }
    public function update_meta_data(string $key, mixed $value): void {}
    public function delete_meta_data(string $key): void {}
    public function save(): int { return $this->subId; }
    public function payment_complete(string $transaction_id = ''): void {}
    public function payment_failed(): void {}
}

// ---------------------------------------------------------------------------
// WebhookRealApiTest — tests con API real
// ---------------------------------------------------------------------------

/**
 * @group real-api
 * @covers \EpaycoSubscription\Woocommerce\Gateways\EpaycoSuscription::webhook
 */
class WebhookRealApiTest extends WebhookTestCase
{
    // -----------------------------------------------------------------------
    // setUp específico del test real
    // -----------------------------------------------------------------------

    protected function setUp(): void
    {
        parent::setUp();

        $GLOBALS['_webhook_test_subscriptions'] = [new FakeSubscription(1)];
        $GLOBALS['_webhook_test_order']          = new \WC_Order((int) self::TEST_ORDER_ID);

        // Con FakeWpdb: encolar resultados esperados para las consultas del webhook.
        // Con $wpdb real (EPS_WP_BOOTSTRAP): la BD responde directamente, no hay cola.
        if ($this->wpdb instanceof FakeWpdb) {
            // 1. get_results([]) → sin cliente previo → se crea uno via API
            // 2. insert(1)       → inserción del nuevo cliente en BD
            // 3. insert(1)       → inserción de la suscripción en wp_epayco_subscription
            $this->wpdb->queueGetResults([]);
            $this->wpdb->queueInsert(1);
            $this->wpdb->queueInsert(1);
        }
    }

    // -----------------------------------------------------------------------
    // T-RA1: Flujo completo de webhook() con API real
    // -----------------------------------------------------------------------

    /**
     * Ejecuta el flujo completo de webhook() contra el sandbox de ePayco.
     *
     * Métodos con llamadas HTTP reales (NO mockeados):
     *   createCustomer, getPlans, validatePlan, plansCreate,
     *   subscriptionCreate, subscriptionCharge.
     *
     * Métodos mockeados (requieren WC_Subscription de WooCommerce):
     *   paramsBilling, getPlansBySubscription.
     *
     * La aserción verifica la ESTRUCTURA del resultado, no su valor específico,
     * porque el resultado depende del estado del sandbox en el momento del test.
     */
    public function test_real_api_flujo_completo_webhook(): void
    {
        // ── Verifica estado inicial de la orden (pendiente de pago) ──────────
        $orderAntes = $GLOBALS['_webhook_test_order'];
        $this->assertSame('pending', $orderAntes->get_status(),
            'La orden #' . self::TEST_ORDER_ID . ' debe iniciar en estado "pending" antes de procesar el pago');

        // ── Request con constantes de clase ───────────────────────────────────
        $_REQUEST = [
            'order_id'    => self::TEST_ORDER_ID,
            'epaycoToken' => self::EPAYCO_TOKEN,
            'name'        => self::TEST_ORDER_NAME,
            '_wpnonce'    => 'valid_nonce',
        ];

        $gateway = $this->buildGateway(['paramsBilling', 'getPlansBySubscription']);

        $gateway->method('paramsBilling')->willReturn([
            'name'          => 'Juan',
            'last_name'     => 'Perez',
            'email'         => self::TEST_CUSTOMER_EMAIL,
            'phone'         => self::TEST_CUSTOMER_PHONE,
            'country'       => self::TEST_CUSTOMER_COUNTRY,
            'city'          => self::TEST_CUSTOMER_CITY,
            'address'       => self::TEST_CUSTOMER_ADDRESS,
            'doc_number'    => self::TEST_CUSTOMER_DOC,
            'type_document' => self::TEST_CUSTOMER_DOC_TYPE,
        ]);

        // Plan con ID fijo → idempotente entre runs.
        // Si ya existe en sandbox, getPlans() lo reutiliza sin recrearlo.
        $gateway->method('getPlansBySubscription')->willReturn([[
            'id_plan'        => self::TEST_PLAN_ID,
            'name'           => self::TEST_PLAN_NAME,
            'description'    => self::TEST_PLAN_DESCRIPTION,
            'amount'         => self::TEST_PLAN_AMOUNT,
            'currency'       => self::TEST_PLAN_CURRENCY,
            'interval'       => self::TEST_PLAN_INTERVAL,
            'interval_count' => self::TEST_PLAN_INTERVAL_COUNT,
            'trial_days'     => self::TEST_PLAN_TRIAL_DAYS,
            'iva'            => 0,
            'ico'            => 0,
        ]]);

        $result = null;
        try {
            $result = $gateway->webhook();
        } catch (WebhookExitSignal $e) {
            $result = [
                'success'   => false,
                'ref_payco' => '',
                'url'       => '',
                'message'   => 'Redirect capturado: ' . $e->getRedirectUrl(),
            ];
        }

        $this->imprimirResultadoApi('webhook() completo', $result);

        // ── Recupera el estado final de la orden ──────────────────────────────
        // Con WordPress real: re-fetch desde BD para leer el estado persistido.
        // Con stubs: usar el registro en memoria creado por el stub de WC_Order.
        if (defined('EPS_WP_BOOTSTRAP')) {
            $orderDespues = wc_get_order((int) self::TEST_ORDER_ID);
            $estadoFinal  = $orderDespues ? $orderDespues->get_status() : 'no-encontrada';
        } else {
            $orderDespues = $GLOBALS['_wc_order_instances'][(int) self::TEST_ORDER_ID] ?? null;
            $estadoFinal  = $orderDespues ? $orderDespues->get_status() : 'no-instanciada';
        }

        $this->imprimirEstadoOrden(self::TEST_ORDER_ID, 'pending', $estadoFinal, $result);

        // ── Aserciones de estructura de respuesta ─────────────────────────────
        $this->assertIsArray($result,
            'webhook() debe retornar un array');
        $this->assertArrayHasKey('success', $result,
            'La respuesta debe incluir siempre la clave "success"');

        // ── Aserción de estado de la orden ────────────────────────────────────
        // Si el pago fue exitoso, el estado debe haber cambiado desde "pending".
        // Si falló (ej. token expirado), el webhook retorna error sin actualizar.
        if ($result['success'] === true) {
            $this->assertNotNull($orderDespues,
                'Debe existir una instancia WC_Order para la orden #' . self::TEST_ORDER_ID);
            $this->assertNotSame('pending', $estadoFinal,
                'El estado de la orden #' . self::TEST_ORDER_ID . ' debe haber cambiado desde "pending" tras un pago exitoso');
        } else {
            fwrite(STDERR, "\n[INFO] Pago no exitoso (sandbox/token) — estado de orden permanece: $estadoFinal\n");
        }
    }

    // -----------------------------------------------------------------------
    // T-RA2: createCustomer() llama a la API real
    // -----------------------------------------------------------------------

    /**
     * Verifica que createCustomer() llama a epaycoSdk->customer->create() y
     * siempre retorna un array con 'success' y 'customer_id'.
     */
    public function test_real_api_createCustomer_retorna_estructura(): void
    {
        if ($this->wpdb instanceof FakeWpdb) {
            $this->wpdb->queueGetResults([]);
            $this->wpdb->queueInsert(1);
        }

        $customerData = [
            'name'          => 'Juan',
            'last_name'     => 'Perez',
            'email'         => self::TEST_CUSTOMER_EMAIL,
            'phone'         => self::TEST_CUSTOMER_PHONE,
            'country'       => self::TEST_CUSTOMER_COUNTRY,
            'city'          => self::TEST_CUSTOMER_CITY,
            'address'       => self::TEST_CUSTOMER_ADDRESS,
            'doc_number'    => self::TEST_CUSTOMER_DOC,
            'type_document' => self::TEST_CUSTOMER_DOC_TYPE,
            'token_card'    => self::EPAYCO_TOKEN,
        ];

        $gateway = $this->buildGateway();
        $result  = $gateway->createCustomer($customerData, self::EPAYCO_TOKEN, self::TEST_ORDER_ID);

        $this->imprimirResultadoApi('createCustomer()', $result);

        $this->assertIsArray($result, 'createCustomer() debe retornar un array');
        $this->assertArrayHasKey('success', $result);
        $this->assertArrayHasKey('customer_id', $result);
    }

    // -----------------------------------------------------------------------
    // T-RA3: getPlans() consulta el plan en el sandbox de ePayco
    // -----------------------------------------------------------------------

    /**
     * Verifica que getPlans() consulta la API de ePayco y retorna un objeto
     * (plan encontrado) o false (plan no existe aún en sandbox).
     */
    public function test_real_api_getPlans_retorna_plan_o_false(): void
    {
        $plans = [[
            'id_plan'        => self::TEST_PLAN_ID,
            'name'           => self::TEST_PLAN_NAME,
            'description'    => self::TEST_PLAN_DESCRIPTION,
            'amount'         => self::TEST_PLAN_AMOUNT,
            'currency'       => self::TEST_PLAN_CURRENCY,
            'interval'       => self::TEST_PLAN_INTERVAL,
            'interval_count' => self::TEST_PLAN_INTERVAL_COUNT,
            'trial_days'     => self::TEST_PLAN_TRIAL_DAYS,
        ]];

        $gateway = $this->buildGateway();
        $result  = $gateway->getPlans($plans);

        $this->imprimirResultadoApi(
            'getPlans(' . self::TEST_PLAN_ID . ')',
            $result === false ? ['plan_existe' => false] : (array) $result
        );

        $this->assertTrue(
            $result === false || is_object($result),
            'getPlans() debe retornar un objeto stdClass o false'
        );
    }

    // -----------------------------------------------------------------------
    // Helpers
    // -----------------------------------------------------------------------

    private function imprimirResultadoApi(string $operacion, mixed $resultado): void
    {
        $linea = str_repeat('-', 55);
        fwrite(STDERR, "\n$linea\n");
        fwrite(STDERR, "[REAL API] $operacion\n");
        fwrite(STDERR, json_encode($resultado, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n");
        fwrite(STDERR, "$linea\n");
    }

    private function imprimirEstadoOrden(string $orderId, string $estadoInicial, string $estadoFinal, array $result): void
    {
        $linea  = str_repeat('=', 55);
        $flecha = $estadoInicial === $estadoFinal ? '(sin cambio)' : "→ $estadoFinal";
        fwrite(STDERR, "\n$linea\n");
        fwrite(STDERR, "[ORDEN #$orderId] Estado: $estadoInicial $flecha\n");
        fwrite(STDERR, "[PAGO]   success=" . ($result['success'] ? 'true' : 'false'));
        if (isset($result['ref_payco']) && $result['ref_payco']) {
            fwrite(STDERR, "  ref_payco=" . $result['ref_payco']);
        }
        if (isset($result['message']) && $result['message']) {
            fwrite(STDERR, "\n[MENSAJE] " . $result['message']);
        }
        fwrite(STDERR, "\n$linea\n");
    }
}
