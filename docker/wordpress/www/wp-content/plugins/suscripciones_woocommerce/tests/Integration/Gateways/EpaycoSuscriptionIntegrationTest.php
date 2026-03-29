<?php

/**
 * Pruebas de integración para EpaycoSuscription
 *
 * Cubre los métodos públicos principales de:
 *   src/Gateways/EpaycoSuscription.php
 *
 * Métodos cubiertos:
 *   - webhook()
 *   - process_payment()
 *   - createToken()
 *   - createCustomer()
 *   - customerCreate()
 *   - getPlans()
 *
 * Técnica (namespace function override):
 *   webhook() llama a wp_redirect / wc_add_notice sin prefijo "\".
 *   gateway-namespace-overrides.php los redefine en el namespace del gateway
 *   para capturar avisos y lanzar WebhookExitSignal en lugar de redirigir.
 *
 * Mocks parciales:
 *   Se mockean únicamente los métodos que hacen llamadas HTTP reales
 *   (ePayco API) o lectura de BD. El código de producción de cada método
 *   bajo test se ejecuta sin modificar.
 */

namespace EpaycoSubscription\Tests\Integration\Gateways;

// Overrides de namespace deben cargarse ANTES de que PHP compile el gateway.
require_once dirname(__DIR__) . '/stubs/gateway-namespace-overrides.php';

use EpaycoSubscription\Woocommerce\Configs\Store;
use EpaycoSubscription\Woocommerce\Gateways\AbstractGateway;
use EpaycoSubscription\Woocommerce\Gateways\EpaycoSuscription;
use EpaycoSubscription\Woocommerce\Helpers;
use EpaycoSubscription\Woocommerce\Helpers\Url;
use EpaycoSubscription\Woocommerce\Hooks;
use EpaycoSubscription\Woocommerce\Hooks\Admin;
use EpaycoSubscription\Woocommerce\Hooks\Checkout;
use EpaycoSubscription\Woocommerce\Hooks\Endpoints;
use EpaycoSubscription\Woocommerce\Hooks\Gateway;
use EpaycoSubscription\Woocommerce\WoocommerceEpaycoSubscription;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use ReflectionClass;

// ---------------------------------------------------------------------------
// WebhookExitSignal
// ---------------------------------------------------------------------------

/**
 * Lanzada por las versiones de namespace de wp_redirect() / wp_safe_redirect().
 * Extiende \Error (no \Exception) para que el bloque catch(Exception) del
 * propio webhook() no la capture; el test la recibe directamente.
 */
class WebhookExitSignal extends \Error
{
    public function getRedirectUrl(): string
    {
        return str_replace('redirect:', '', $this->getMessage());
    }
}

// ---------------------------------------------------------------------------
// FakeWpdb
// ---------------------------------------------------------------------------

/**
 * Reemplazo controlado de $wpdb.
 * Permite encolar resultados para insert(), get_row() y get_results()
 * y registra todas las llamadas para realizar aserciones.
 */
class FakeWpdb
{
    public string  $prefix     = 'wp_';
    public ?string $last_error = null;

    private array $insertQueue     = [];
    private int   $insertCount     = 0;
    private array $getRowQueue     = [];
    private int   $getRowCount     = 0;
    private array $getResultsQueue = [];
    private int   $getResultsCount = 0;

    public array $insertCalls     = [];
    public array $getRowCalls     = [];
    public array $getResultsCalls = [];

    public function queueInsert(bool|int $result): void
    {
        $this->insertQueue[] = $result;
    }

    public function queueGetRow(mixed $result): void
    {
        $this->getRowQueue[] = $result;
    }

    public function queueGetResults(array $result): void
    {
        $this->getResultsQueue[] = $result;
    }

    public function insert(string $table, array $data, mixed $format = null): int|false
    {
        $this->insertCalls[] = ['table' => $table, 'data' => $data];
        $result = $this->insertQueue[$this->insertCount] ?? 1;
        $this->insertCount++;
        return $result === false ? false : 1;
    }

    public function get_row(string $query, string $output = 'OBJECT', int $y = 0): mixed
    {
        $this->getRowCalls[] = $query;
        $result = $this->getRowQueue[$this->getRowCount] ?? null;
        $this->getRowCount++;
        return $result;
    }

    public function get_results(string $query, string $output = 'OBJECT'): array
    {
        $this->getResultsCalls[] = $query;
        $result = $this->getResultsQueue[$this->getResultsCount] ?? [];
        $this->getResultsCount++;
        return $result;
    }

    public function prepare(string $query, mixed ...$args): string
    {
        $i = 0;
        return preg_replace_callback('/%[sd]/', function () use (&$i, $args) {
            return "'" . addslashes((string) ($args[$i++] ?? '')) . "'";
        }, $query);
    }
}

// ---------------------------------------------------------------------------
// WebhookTestCase  — caso base compartido
// ---------------------------------------------------------------------------

abstract class WebhookTestCase extends TestCase
{
    // -----------------------------------------------------------------------
    // Configuración de credenciales y datos de prueba
    // Actualiza estos valores para apuntar a tu sandbox de ePayco.
    // -----------------------------------------------------------------------

    /** API Key pública del comercio (dashboard ePayco → Credenciales → PUBLIC_KEY). */
    const EPAYCO_API_KEY     = 'c07cda3a7218670d57dfa55bc9270a5d';

    /** Llave privada del comercio (dashboard ePayco → Credenciales → PRIVATE_KEY). */
    const EPAYCO_PRIVATE_KEY = 'ba44593ceebfa75c59dfcf510098bab7';

    /** ID del cliente/comercio (dashboard ePayco → Credenciales → P_CUST_ID_CLIENTE). */
    const EPAYCO_CUST_ID     = '630339';

    /**
     * Token de tarjeta en formato base64 (card data → ePayco createToken).
     * Codifica: number=4575623182290326, exp_month=12, exp_year=2029, cvc=316.
     * Reemplaza este valor con el token actualizado del sandbox cuando sea necesario.
     */
    const EPAYCO_TOKEN       = 'eyJuYW1lIjoiUmljYXJkbyBTYWxkYXJyaWFnYSIsIm51bWJlciI6IjQ1NzU2MjMxODIyOTAzMjYiLCJlbWFpbCI6InJpY2FyZG8uc2E1ODdzZ2FAZXBheWNvLmNvbXEiLCJleHBfbW9udGgiOiIxMiIsImV4cF95ZWFyIjoiMjAyOSIsImN2YyI6IjMxNiJ9';

    /** ID de la orden WooCommerce usada en los tests. */
    const TEST_ORDER_ID      = '25';

    /** Nombre del comprador que llega en $_REQUEST['name']. */
    const TEST_ORDER_NAME    = 'Juan Perez';

    // --- Plan de suscripción ------------------------------------------------

    /** Identificador único del plan en ePayco (minúsculas, sin espacios). */
    const TEST_PLAN_ID             = 'woo_int_test_mensual';

    /** Nombre legible del plan. */
    const TEST_PLAN_NAME           = 'Plan Integracion Test Mensual';

    /** Descripción del plan. */
    const TEST_PLAN_DESCRIPTION    = 'Plan de prueba para tests de integracion';

    /** Monto del plan en la moneda configurada. */
    const TEST_PLAN_AMOUNT         = 10000;

    /** Moneda del plan (COP, USD…). */
    const TEST_PLAN_CURRENCY       = 'COP';

    /** Período de cobro: month | year | week | day. */
    const TEST_PLAN_INTERVAL       = 'month';

    /** Cantidad de períodos entre cobros (ej: 1 = cada mes, 3 = cada trimestre). */
    const TEST_PLAN_INTERVAL_COUNT = 1;

    /** Días de período de prueba (0 = sin trial). */
    const TEST_PLAN_TRIAL_DAYS     = 0;

    // --- Datos del cliente --------------------------------------------------

    /** Email del cliente de prueba. */
    const TEST_CUSTOMER_EMAIL    = 'integrac777@epayco.test';

    /** Teléfono del cliente. */
    const TEST_CUSTOMER_PHONE    = '3001234567';

    /** Código de país ISO 3166-1 alpha-2. */
    const TEST_CUSTOMER_COUNTRY  = 'CO';

    /** Ciudad del cliente. */
    const TEST_CUSTOMER_CITY     = 'Bogota';

    /** Dirección del cliente. */
    const TEST_CUSTOMER_ADDRESS  = 'Calle 1 # 2-3';

    /** Número de documento de identidad. */
    const TEST_CUSTOMER_DOC      = '12345678';

    /** Tipo de documento: CC | CE | NIT | PPN | SSN | LIC | TI | DNI. */
    const TEST_CUSTOMER_DOC_TYPE = 'CC';

    // -----------------------------------------------------------------------

    protected FakeWpdb   $wpdb;
    protected MockObject $epsMock;

    // -----------------------------------------------------------------------
    // setUp / tearDown
    // -----------------------------------------------------------------------

    protected function setUp(): void
    {
        parent::setUp();

        $_REQUEST = [];

        $GLOBALS['_webhook_test_redirects']     = [];
        $GLOBALS['_webhook_test_notices']       = [];
        $GLOBALS['_webhook_test_order']         = null;
        $GLOBALS['_webhook_test_subscriptions'] = [];

        // Con WordPress real (EPS_WP_BOOTSTRAP): usar $wpdb real para persistir en BD.
        // Sin WordPress (stubs): usar FakeWpdb con resultados controlados.
        if (defined('EPS_WP_BOOTSTRAP')) {
            global $wpdb;
            $this->wpdb = $wpdb;
        } else {
            $this->wpdb      = new FakeWpdb();
            $GLOBALS['wpdb'] = $this->wpdb;
        }

        $testSettings = [
            'apiKey'        => self::EPAYCO_API_KEY,
            'privateKey'    => self::EPAYCO_PRIVATE_KEY,
            'custIdCliente' => self::EPAYCO_CUST_ID,
            'environment'   => false,
        ];
        $GLOBALS['_wp_options']['woocommerce__settings']                       = $testSettings;
        $GLOBALS['_wp_options']['woocommerce_woo-epaycosubscription_settings'] = $testSettings;

        $this->epsMock                = $this->buildFakeEpaycosuscription();
        $GLOBALS['epaycosuscription'] = $this->epsMock;

        ob_start();
    }

    protected function tearDown(): void
    {
        parent::tearDown();

        $_REQUEST = [];
        unset(
            $GLOBALS['epaycosuscription'],
            $GLOBALS['_webhook_test_order'],
            $GLOBALS['_webhook_test_subscriptions'],
            $GLOBALS['_webhook_test_redirects'],
            $GLOBALS['_webhook_test_notices'],
            $GLOBALS['_wp_options']['woocommerce__settings'],
            $GLOBALS['_wp_options']['woocommerce_woo-epaycosubscription_settings'],
        );

        unset($GLOBALS['_wc_order_instances']);

        if (ob_get_level() > 0) {
            ob_end_clean();
        }
    }

    // -----------------------------------------------------------------------
    // Helpers de construcción
    // -----------------------------------------------------------------------

    /**
     * Construye un mock de WoocommerceEpaycoSubscription con todas las
     * propiedades tipadas necesarias (Hooks, Helpers, Store).
     */
    protected function buildFakeEpaycosuscription(): MockObject
    {
        $gatewayHook  = $this->mockNoCtor(Gateway::class);
        $adminHook    = $this->mockNoCtor(Admin::class);
        $checkoutHook = $this->mockNoCtor(Checkout::class);
        $endpoints    = $this->mockNoCtor(Endpoints::class);

        /** @var Hooks&MockObject $hooksMock */
        $hooksMock = $this->mockNoCtor(Hooks::class);
        $hooksMock->gateway   = $gatewayHook;
        $hooksMock->admin     = $adminHook;
        $hooksMock->checkout  = $checkoutHook;
        $hooksMock->endpoints = $endpoints;

        $urlMock = $this->mockNoCtor(Url::class);

        /** @var Helpers&MockObject $helpersMock */
        $helpersMock = $this->mockNoCtor(Helpers::class);
        $helpersMock->url = $urlMock;

        $storeMock = $this->mockNoCtor(Store::class);
        $storeMock->method('getGatewayTitle')->willReturn('ePayco Suscripciones');

        /** @var WoocommerceEpaycoSubscription&MockObject $epsMock */
        $epsMock = $this->mockNoCtor(WoocommerceEpaycoSubscription::class);
        $epsMock->hooks       = $hooksMock;
        $epsMock->helpers     = $helpersMock;
        $epsMock->storeConfig = $storeMock;

        return $epsMock;
    }

    /**
     * Construye una instancia de EpaycoSuscription para tests.
     *
     * Sin $onlyMethods: instancia real sin constructor (todos los métodos reales).
     * Con $onlyMethods: mock parcial — solo los métodos listados son sustituidos.
     *
     * @param string[] $onlyMethods
     */
    protected function buildGateway(array $onlyMethods = []): EpaycoSuscription
    {
        if (empty($onlyMethods)) {
            $gateway = (new ReflectionClass(EpaycoSuscription::class))
                ->newInstanceWithoutConstructor();
        } else {
            $gateway = $this->getMockBuilder(EpaycoSuscription::class)
                ->disableOriginalConstructor()
                ->onlyMethods($onlyMethods)
                ->getMock();
        }

        $this->injectDependencies($gateway);

        return $gateway;
    }

    /**
     * Inyecta dependencias comunes (epaycosuscription + epaycoSdk real + propiedades).
     */
    protected function injectDependencies(EpaycoSuscription $gateway): void
    {
        $absRef  = new ReflectionClass(AbstractGateway::class);
        $epsProp = $absRef->getProperty('epaycosuscription');
        $epsProp->setValue($gateway, $this->epsMock);

        $ref     = new ReflectionClass(EpaycoSuscription::class);
        $sdkProp = $ref->getProperty('epaycoSdk');
        $sdkProp->setValue($gateway, new \Epayco\Epayco([
            'apiKey'     => self::EPAYCO_API_KEY,
            'privateKey' => self::EPAYCO_PRIVATE_KEY,
            'lenguage'   => 'ES',
            'test'       => true,
        ]));

        $gateway->custIdCliente = self::EPAYCO_CUST_ID;
        $gateway->logger        = null;
        $gateway->settings      = [
            'apiKey'        => self::EPAYCO_API_KEY,
            'privateKey'    => self::EPAYCO_PRIVATE_KEY,
            'custIdCliente' => self::EPAYCO_CUST_ID,
        ];
    }

    /**
     * Reemplaza el epaycoSdk inyectado con un SDK falso controlable.
     * Útil para tests de métodos que llaman directamente al SDK
     * sin pasar por los tests de API real.
     */
    protected function injectFakeSdk(EpaycoSuscription $gateway, object $fakeSdk): void
    {
        $ref     = new ReflectionClass(EpaycoSuscription::class);
        $sdkProp = $ref->getProperty('epaycoSdk');
        $sdkProp->setValue($gateway, $fakeSdk);
    }

    /**
     * Construye un SDK falso con token->create() configurado.
     * Extiende \Epayco\Epayco para satisfacer la propiedad tipada $epaycoSdk.
     */
    protected function buildFakeSdkWithToken(string $tokenId = 'tok_fake_123', bool $status = true): \Epayco\Epayco
    {
        return new class($tokenId, $status) extends \Epayco\Epayco {
            public function __construct(string $tokenId, bool $status)
            {
                $id = $tokenId;
                $st = $status;
                $this->token = new class($id, $st) {
                    public function __construct(private string $id, private bool $status) {}

                    public function create(array $data): \stdClass
                    {
                        $result         = new \stdClass();
                        $result->status = $this->status;
                        $result->id     = $this->id;
                        return $result;
                    }
                };
            }
        };
    }

    /**
     * Construye un SDK falso con customer->create() configurado.
     * Extiende \Epayco\Epayco para satisfacer la propiedad tipada $epaycoSdk.
     */
    protected function buildFakeSdkWithCustomer(string $customerId = 'cust_fake_789', bool $status = true): \Epayco\Epayco
    {
        return new class($customerId, $status) extends \Epayco\Epayco {
            public function __construct(string $customerId, bool $status)
            {
                $cid = $customerId;
                $st  = $status;
                $this->customer = new class($cid, $st) {
                    public function __construct(private string $customerId, private bool $status) {}

                    public function create(array $data): \stdClass
                    {
                        $result               = new \stdClass();
                        $result->status       = $this->status;
                        $result->data         = new \stdClass();
                        $result->data->status = $this->status ? 'active' : 'error';
                        $result->data->customerId = $this->customerId;
                        return $result;
                    }

                    public function get(mixed $id): \stdClass
                    {
                        return (object)['status' => false];
                    }

                    public function addNewToken(array $data): \stdClass
                    {
                        return (object)['status' => true];
                    }
                };
            }
        };
    }

    /**
     * Construye un SDK falso con plan->get() configurado.
     * Extiende \Epayco\Epayco para satisfacer la propiedad tipada $epaycoSdk.
     */
    protected function buildFakeSdkWithPlan(bool $planExists = true, string $planId = 'woo_int_test_mensual'): \Epayco\Epayco
    {
        return new class($planExists, $planId) extends \Epayco\Epayco {
            public function __construct(bool $planExists, string $planId)
            {
                $exists = $planExists;
                $id     = $planId;
                $this->plan = new class($exists, $id) {
                    public function __construct(private bool $exists, private string $planId) {}

                    public function get(string $id): \stdClass
                    {
                        if ($this->exists) {
                            $result           = new \stdClass();
                            $result->status   = true;
                            $result->data     = new \stdClass();
                            $result->data->id = $this->planId;
                            return $result;
                        }
                        return (object)['status' => false];
                    }

                    public function create(array $data): \stdClass
                    {
                        return (object)['status' => true, 'data' => (object)['id' => $this->planId]];
                    }
                };
            }
        };
    }

    /** Retorna un token falso como objeto stdClass. */
    protected function fakeToken(string $id = 'tok_test_123'): \stdClass
    {
        $t         = new \stdClass();
        $t->status = true;
        $t->id     = $id;
        return $t;
    }

    /** Crea un mock PHPUnit sin llamar al constructor original. */
    protected function mockNoCtor(string $class): MockObject
    {
        return $this->getMockBuilder($class)
            ->disableOriginalConstructor()
            ->getMock();
    }

    /** Devuelve los avisos capturados por el stub de wc_add_notice(). */
    protected function capturedNotices(): array
    {
        return $GLOBALS['_webhook_test_notices'] ?? [];
    }

    /** Devuelve las URLs de redirección capturadas por el stub de wp_redirect(). */
    protected function capturedRedirects(): array
    {
        return $GLOBALS['_webhook_test_redirects'] ?? [];
    }

    /**
     * Métodos de EpaycoSuscription que llaman a APIs externas o BD
     * y que se mockean en la mayoría de los tests de webhook().
     */
    protected function externalMethods(): array
    {
        return [
            'paramsBilling',
            'createCustomer',
            'createToken',
            'getUrlNotify',
            'getPlansBySubscription',
            'getPlans',
            'validatePlan',
        ];
    }

    /** Devuelve un array de customerData válido para inyectar en paramsBilling(). */
    protected function fakeCustomerData(string $email = 'juan@example.com'): array
    {
        return [
            'name'          => 'Juan',
            'last_name'     => 'Pérez',
            'email'         => $email,
            'phone'         => '3001234567',
            'country'       => 'CO',
            'city'          => 'Bogotá',
            'address'       => 'Calle 1 # 2-3',
            'doc_number'    => '12345678',
            'type_document' => 'CC',
        ];
    }

    /** Configura $_REQUEST con parámetros básicos de webhook. */
    protected function setRequest(array $params = []): void
    {
        $_REQUEST = array_merge([
            'order_id'    => self::TEST_ORDER_ID,
            'epaycoToken' => self::EPAYCO_TOKEN,
            'name'        => self::TEST_ORDER_NAME,
            '_wpnonce'    => 'valid_nonce',
        ], $params);
    }
}

// ---------------------------------------------------------------------------
// EpaycoSuscriptionIntegrationTest
// ---------------------------------------------------------------------------

/**
 * @covers \EpaycoSubscription\Woocommerce\Gateways\EpaycoSuscription::webhook
 * @covers \EpaycoSubscription\Woocommerce\Gateways\EpaycoSuscription::process_payment
 * @covers \EpaycoSubscription\Woocommerce\Gateways\EpaycoSuscription::createToken
 * @covers \EpaycoSubscription\Woocommerce\Gateways\EpaycoSuscription::createCustomer
 * @covers \EpaycoSubscription\Woocommerce\Gateways\EpaycoSuscription::customerCreate
 * @covers \EpaycoSubscription\Woocommerce\Gateways\EpaycoSuscription::getPlans
 */
class EpaycoSuscriptionIntegrationTest extends WebhookTestCase
{
    // =======================================================================
    // webhook()
    // =======================================================================

    // -----------------------------------------------------------------------
    // T1: Suscripciones vacías → paramsBilling llama a wp_redirect (señal)
    // -----------------------------------------------------------------------

    /**
     * Cuando la lista de suscripciones del pedido está vacía,
     * paramsBilling() (código real) llama a wp_redirect(),
     * que en el override de namespace lanza WebhookExitSignal.
     * createToken se mockea para que webhook() llegue hasta paramsBilling().
     */
    public function test_webhook_suscripciones_vacias_lanza_exit_signal(): void
    {
        $GLOBALS['_webhook_test_subscriptions'] = [];
        $GLOBALS['_webhook_test_order']         = new \WC_Order(self::TEST_ORDER_ID);

        $this->setRequest(['order_id' => self::TEST_ORDER_ID]);
        $gateway = $this->buildGateway(['createToken']);
        $gateway->method('createToken')->willReturn($this->fakeToken());

        $this->expectException(WebhookExitSignal::class);
        $gateway->webhook();
    }

    /**
     * El aviso de error debe registrarse antes del redireccionamiento.
     */
    public function test_webhook_suscripciones_vacias_registra_aviso_error(): void
    {
        $GLOBALS['_webhook_test_subscriptions'] = [];
        $GLOBALS['_webhook_test_order']         = new \WC_Order(self::TEST_ORDER_ID);

        $this->setRequest(['order_id' => self::TEST_ORDER_ID]);
        $gateway = $this->buildGateway(['createToken']);
        $gateway->method('createToken')->willReturn($this->fakeToken());

        try {
            $gateway->webhook();
        } catch (WebhookExitSignal) {
            // esperada
        }

        $notices = $this->capturedNotices();
        $this->assertNotEmpty($notices, 'Debe registrarse un aviso de error');
        $this->assertSame('error', $notices[0]['type']);
    }

    // -----------------------------------------------------------------------
    // T2: validatePlan exitoso → webhook retorna success=true
    // -----------------------------------------------------------------------

    public function test_webhook_validate_plan_exitoso_retorna_success_true(): void
    {
        $expected = [
            'success'   => true,
            'ref_payco' => 'REF_TEST_001',
            'url'       => 'http://example.com/checkout/order-received/1',
            'message'   => '',
        ];

        $GLOBALS['_webhook_test_order'] = new \WC_Order(self::TEST_ORDER_ID);
        $this->setRequest(['order_id' => self::TEST_ORDER_ID]);

        $gateway = $this->buildGateway($this->externalMethods());
        $gateway->method('createToken')->willReturn($this->fakeToken());
        $gateway->method('paramsBilling')->willReturn($this->fakeCustomerData());
        $gateway->method('createCustomer')->willReturn(['customer_id' => 'CUST_001']);
        $gateway->method('getUrlNotify')->willReturn('http://example.com/notify');
        $gateway->method('getPlansBySubscription')->willReturn(['plan_key' => []]);
        $gateway->method('getPlans')->willReturn(null);
        $gateway->method('validatePlan')->willReturn($expected);

        $result = $gateway->webhook();

        $this->assertTrue($result['success']);
        $this->assertSame('REF_TEST_001', $result['ref_payco']);
    }

    // -----------------------------------------------------------------------
    // T3: validatePlan retorna failure → webhook propaga el fallo
    // -----------------------------------------------------------------------

    public function test_webhook_validate_plan_fallido_retorna_success_false(): void
    {
        $failure = [
            'success'   => false,
            'ref_payco' => '',
            'url'       => '',
            'message'   => 'Tarjeta rechazada por el banco',
        ];

        $GLOBALS['_webhook_test_order'] = new \WC_Order(self::TEST_ORDER_ID);
        $this->setRequest(['order_id' => self::TEST_ORDER_ID]);

        $gateway = $this->buildGateway($this->externalMethods());
        $gateway->method('createToken')->willReturn($this->fakeToken());
        $gateway->method('paramsBilling')->willReturn($this->fakeCustomerData('fail@test.com'));
        $gateway->method('createCustomer')->willReturn(['customer_id' => 'CUST_002']);
        $gateway->method('getUrlNotify')->willReturn('http://example.com/notify');
        $gateway->method('getPlansBySubscription')->willReturn([]);
        $gateway->method('getPlans')->willReturn(null);
        $gateway->method('validatePlan')->willReturn($failure);

        $result = $gateway->webhook();

        $this->assertFalse($result['success']);
        $this->assertSame('Tarjeta rechazada por el banco', $result['message']);
        $this->assertSame('', $result['ref_payco']);
    }

    // -----------------------------------------------------------------------
    // T4: Excepción inesperada → webhook la captura y retorna success=false
    // -----------------------------------------------------------------------

    public function test_webhook_excepcion_en_validate_plan_retorna_failure_array(): void
    {
        $GLOBALS['_webhook_test_order'] = new \WC_Order(self::TEST_ORDER_ID);
        $this->setRequest(['order_id' => self::TEST_ORDER_ID]);

        $gateway = $this->buildGateway($this->externalMethods());
        $gateway->method('createToken')->willReturn($this->fakeToken());
        $gateway->method('paramsBilling')->willReturn($this->fakeCustomerData('err@test.com'));
        $gateway->method('createCustomer')->willReturn(['customer_id' => 'CUST_003']);
        $gateway->method('getUrlNotify')->willReturn('http://example.com/notify');
        $gateway->method('getPlansBySubscription')->willReturn([]);
        $gateway->method('getPlans')->willReturn(null);
        $gateway->method('validatePlan')
            ->willThrowException(new \Exception('Error inesperado del servidor'));

        $result = $gateway->webhook();

        $this->assertFalse($result['success']);
        $this->assertStringContainsString('Error inesperado del servidor', $result['message']);
        $this->assertNotEmpty($result['url'],
            'La URL en el resultado de error debe ser la URL de pago de la orden');
        $this->assertArrayNotHasKey('ref_payco', $result,
            'El bloque catch no incluye ref_payco en el resultado de error');
    }

    // -----------------------------------------------------------------------
    // T5: createCustomer retorna cliente existente → se usa su customer_id
    // -----------------------------------------------------------------------

    public function test_webhook_createCustomer_existente_usa_customer_id_previo(): void
    {
        $GLOBALS['_webhook_test_order'] = new \WC_Order(self::TEST_ORDER_ID);
        $this->setRequest(['order_id' => self::TEST_ORDER_ID]);

        $gateway = $this->buildGateway($this->externalMethods());
        $gateway->method('createToken')->willReturn($this->fakeToken('tok_exist'));
        $gateway->method('paramsBilling')->willReturn($this->fakeCustomerData('exist@test.com'));
        $gateway->method('createCustomer')->willReturn(['customer_id' => 'EXISTING_CUST_777']);
        $gateway->method('getUrlNotify')->willReturn('http://example.com/notify');
        $gateway->method('getPlansBySubscription')->willReturn(['plan1' => []]);
        $gateway->method('getPlans')->willReturn(null);
        $gateway->method('validatePlan')->willReturn([
            'success'   => true,
            'ref_payco' => 'REF_EXIST',
            'url'       => 'http://example.com/checkout/order-received/4',
            'message'   => '',
        ]);

        $result = $gateway->webhook();

        $this->assertTrue($result['success']);
        $this->assertSame('REF_EXIST', $result['ref_payco']);
    }

    // -----------------------------------------------------------------------
    // T6: getPlans retorna plan existente → validatePlan se invoca una vez
    // -----------------------------------------------------------------------

    public function test_webhook_getPlans_con_plan_existente_llama_validatePlan(): void
    {
        $existingPlan = [['id_plan' => 'epayco_plan_abc', 'name' => 'Plan Mensual']];

        $GLOBALS['_webhook_test_order'] = new \WC_Order(self::TEST_ORDER_ID);
        $this->setRequest(['order_id' => self::TEST_ORDER_ID]);

        $gateway = $this->buildGateway($this->externalMethods());
        $gateway->method('createToken')->willReturn($this->fakeToken('tok_plan'));
        $gateway->method('paramsBilling')->willReturn($this->fakeCustomerData('plan@test.com'));
        $gateway->method('createCustomer')->willReturn(['customer_id' => 'C_PLAN']);
        $gateway->method('getUrlNotify')->willReturn('http://example.com/notify');
        $gateway->method('getPlansBySubscription')->willReturn(['key' => ['amount' => 50000]]);
        $gateway->method('getPlans')->willReturn($existingPlan);

        $gateway->expects($this->once())
            ->method('validatePlan')
            ->willReturn([
                'success'   => true,
                'ref_payco' => 'REF_PLAN_OK',
                'url'       => 'http://example.com/checkout/order-received/5',
                'message'   => '',
            ]);

        $result = $gateway->webhook();

        $this->assertTrue($result['success']);
    }

    // -----------------------------------------------------------------------
    // T7: webhook devuelve array con las claves esperadas
    // -----------------------------------------------------------------------

    public function test_webhook_retorna_array_con_claves_requeridas(): void
    {
        $GLOBALS['_webhook_test_order'] = new \WC_Order(self::TEST_ORDER_ID);
        $this->setRequest(['order_id' => self::TEST_ORDER_ID]);

        $gateway = $this->buildGateway($this->externalMethods());
        $gateway->method('createToken')->willReturn($this->fakeToken('tok_keys'));
        $gateway->method('paramsBilling')->willReturn($this->fakeCustomerData('keys@test.com'));
        $gateway->method('createCustomer')->willReturn(['customer_id' => 'C_KEYS']);
        $gateway->method('getUrlNotify')->willReturn('http://example.com/notify');
        $gateway->method('getPlansBySubscription')->willReturn([]);
        $gateway->method('getPlans')->willReturn(null);
        $gateway->method('validatePlan')->willReturn([
            'success'   => true,
            'ref_payco' => 'REF_KEYS',
            'url'       => 'http://example.com/checkout/order-received/6',
            'message'   => 'OK',
        ]);

        $result = $gateway->webhook();

        $this->assertIsArray($result);
        $this->assertArrayHasKey('success', $result);
        $this->assertArrayHasKey('ref_payco', $result);
    }

    // -----------------------------------------------------------------------
    // T8: El token del request se pasa como token_card a createCustomer
    // -----------------------------------------------------------------------

    public function test_webhook_token_del_request_se_pasa_como_token_card(): void
    {
        $GLOBALS['_webhook_test_order'] = new \WC_Order(self::TEST_ORDER_ID);
        $this->setRequest(['order_id' => self::TEST_ORDER_ID, 'epaycoToken' => self::EPAYCO_TOKEN]);

        $capturedCustomerData = null;

        $gateway = $this->buildGateway($this->externalMethods());
        $gateway->method('createToken')->willReturn($this->fakeToken('tok_processed'));
        $gateway->method('paramsBilling')->willReturn($this->fakeCustomerData('tok@test.com'));
        $gateway->method('createCustomer')
            ->willReturnCallback(function ($customerData) use (&$capturedCustomerData) {
                $capturedCustomerData = $customerData;
                return ['customer_id' => 'C_TOK'];
            });
        $gateway->method('getUrlNotify')->willReturn('http://example.com/notify');
        $gateway->method('getPlansBySubscription')->willReturn([]);
        $gateway->method('getPlans')->willReturn(null);
        $gateway->method('validatePlan')->willReturn([
            'success'   => true,
            'ref_payco' => 'REF_TOK',
            'url'       => '',
            'message'   => '',
        ]);

        $gateway->webhook();

        $this->assertNotNull($capturedCustomerData);
        $this->assertSame('tok_processed', $capturedCustomerData['token_card'],
            'El id del token procesado debe llegar en customerData[token_card]');
    }

    // -----------------------------------------------------------------------
    // T9: Llamadas sucesivas son independientes entre sí
    // -----------------------------------------------------------------------

    public function test_webhook_llamadas_sucesivas_son_independientes(): void
    {
        for ($i = 1; $i <= 2; $i++) {
            $GLOBALS['_webhook_test_notices']       = [];
            $GLOBALS['_webhook_test_order']         = new \WC_Order($i);
            $GLOBALS['_webhook_test_subscriptions'] = [];

            $this->setRequest(['order_id' => (string) $i]);
            $gateway = $this->buildGateway($this->externalMethods());
            $gateway->method('createToken')->willReturn($this->fakeToken("tok_$i"));
            $gateway->method('paramsBilling')->willReturn($this->fakeCustomerData("user$i@test.com"));
            $gateway->method('createCustomer')->willReturn(['customer_id' => "C_$i"]);
            $gateway->method('getUrlNotify')->willReturn('http://example.com/notify');
            $gateway->method('getPlansBySubscription')->willReturn([]);
            $gateway->method('getPlans')->willReturn(null);
            $gateway->method('validatePlan')->willReturn([
                'success'   => true,
                'ref_payco' => "REF_$i",
                'url'       => '',
                'message'   => '',
            ]);

            $result = $gateway->webhook();

            $this->assertTrue($result['success'], "Llamada #$i debe ser exitosa");
            $this->assertSame("REF_$i", $result['ref_payco']);
        }
    }

    // -----------------------------------------------------------------------
    // T10: Token inválido → webhook retorna error sin llegar a paramsBilling
    // -----------------------------------------------------------------------

    /**
     * Cuando createToken retorna null (token no pudo procesarse),
     * webhook() debe retornar inmediatamente con success=false
     * sin intentar crear el cliente ni el plan.
     */
    public function test_webhook_token_invalido_retorna_error_sin_continuar(): void
    {
        $GLOBALS['_webhook_test_order'] = new \WC_Order(self::TEST_ORDER_ID);
        $this->setRequest(['order_id' => self::TEST_ORDER_ID, 'epaycoToken' => self::EPAYCO_TOKEN]);

        // Token con status=false: el webhook retorna error antes de paramsBilling
        $invalidToken         = new \stdClass();
        $invalidToken->status = false;
        $invalidToken->message = 'Token inválido o expirado';

        $gateway = $this->buildGateway($this->externalMethods());
        $gateway->method('createToken')->willReturn($invalidToken);

        // paramsBilling NO debe llamarse si el token falla
        $gateway->expects($this->never())->method('paramsBilling');
        $gateway->expects($this->never())->method('createCustomer');
        $gateway->expects($this->never())->method('validatePlan');

        $result = $gateway->webhook();

        $this->assertFalse($result['success']);
        $this->assertArrayHasKey('message', $result);
    }

    // -----------------------------------------------------------------------
    // T11: Excepción en paramsBilling → webhook la captura y retorna failure
    // -----------------------------------------------------------------------

    public function test_webhook_excepcion_en_paramsBilling_retorna_failure(): void
    {
        $GLOBALS['_webhook_test_order'] = new \WC_Order(self::TEST_ORDER_ID);
        $this->setRequest(['order_id' => self::TEST_ORDER_ID]);

        $gateway = $this->buildGateway($this->externalMethods());
        $gateway->method('createToken')->willReturn($this->fakeToken());
        $gateway->method('paramsBilling')
            ->willThrowException(new \Exception('Error en datos de facturación'));

        $gateway->method('createCustomer')->willReturn(null);
        $gateway->method('getUrlNotify')->willReturn('');
        $gateway->method('getPlansBySubscription')->willReturn([]);
        $gateway->method('getPlans')->willReturn(null);
        $gateway->method('validatePlan')->willReturn(['success' => false, 'ref_payco' => '', 'url' => '', 'message' => '']);

        $result = $gateway->webhook();

        $this->assertFalse($result['success']);
        $this->assertStringContainsString('Error en datos de facturación', $result['message']);
    }

    // =======================================================================
    // process_payment()
    // =======================================================================

    /**
     * Cuando la orden existe, process_payment() retorna 'success' con la URL
     * de pago de la orden.
     */
    public function test_process_payment_retorna_success_con_redirect_url(): void
    {
        $orderId = self::TEST_ORDER_ID;
        $GLOBALS['_webhook_test_order'] = new \WC_Order($orderId);

        $gateway = $this->buildGateway();
        $result  = $gateway->process_payment($orderId);

        $this->assertSame('success', $result['result'],
            'process_payment() debe retornar result=success cuando la orden existe');
        $this->assertNotEmpty($result['redirect'],
            'process_payment() debe retornar una URL de redirect no vacía');
        $this->assertStringContainsString((string) $orderId, $result['redirect'],
            'La URL de redirect debe contener el ID de la orden');
    }

    /**
     * process_payment() retorna el array con las claves mínimas requeridas
     * por WooCommerce.
     */
    public function test_process_payment_retorna_claves_requeridas_por_woocommerce(): void
    {
        $GLOBALS['_webhook_test_order'] = new \WC_Order(1);

        $gateway = $this->buildGateway();
        $result  = $gateway->process_payment(1);

        $this->assertIsArray($result);
        $this->assertArrayHasKey('result', $result);
        $this->assertArrayHasKey('redirect', $result);
    }

    // =======================================================================
    // createToken()
    // =======================================================================

    /**
     * Cuando se llama con null y no hay datos en php://input,
     * createToken() retorna null.
     */
    public function test_createToken_con_null_sin_input_retorna_null(): void
    {
        $gateway = $this->buildGateway();
        $result  = $gateway->createToken(null);

        $this->assertNull($result,
            'createToken(null) debe retornar null cuando php://input está vacío');
    }

    /**
     * Cuando se llama con un string que no es base64 válido en modo estricto,
     * createToken() retorna null.
     */
    public function test_createToken_con_base64_invalido_retorna_null(): void
    {
        $gateway = $this->buildGateway();
        // Este string tiene caracteres que hacen que strict base64_decode falle
        $result = $gateway->createToken('!!!not-valid-base64!!!');

        $this->assertNull($result,
            'createToken() con base64 inválido debe retornar null');
    }

    /**
     * Cuando se llama con datos de tarjeta codificados en base64 válido,
     * createToken() llama al SDK y retorna el objeto token.
     */
    public function test_createToken_con_datos_validos_llama_sdk_y_retorna_token(): void
    {
        $cardData = [
            'number'    => '4111111111111111',
            'exp_year'  => '2025',
            'exp_month' => '12',
            'cvv'       => '123',
        ];
        $base64Encoded = base64_encode(json_encode($cardData));

        $gateway = $this->buildGateway();
        $this->injectFakeSdk($gateway, $this->buildFakeSdkWithToken('tok_sdk_created'));

        $result = $gateway->createToken($base64Encoded);

        $this->assertNotNull($result,
            'createToken() con datos de tarjeta válidos debe retornar un objeto token');
        $this->assertTrue($result->status,
            'El token retornado debe tener status=true');
        $this->assertSame('tok_sdk_created', $result->id,
            'El id del token debe coincidir con el retornado por el SDK');
    }

    // =======================================================================
    // customerCreate()
    // =======================================================================

    /**
     * customerCreate() llama al SDK con los datos del cliente y retorna
     * el objeto retornado por el SDK.
     */
    public function test_customerCreate_llama_sdk_y_retorna_objeto_cliente(): void
    {
        $gateway = $this->buildGateway();
        $this->injectFakeSdk($gateway, $this->buildFakeSdkWithCustomer('cust_sdk_001'));

        $data = [
            'token_card' => 'tok_test',
            'name'       => 'Juan',
            'last_name'  => 'Perez',
            'email'      => 'juan@example.com',
            'phone'      => '3001234567',
            'city'       => 'Bogota',
            'address'    => 'Calle 1',
        ];

        $result = $gateway->customerCreate($data);

        $this->assertIsObject($result,
            'customerCreate() debe retornar el objeto retornado por el SDK');
        $this->assertTrue($result->status,
            'El resultado debe tener status=true cuando el SDK responde exitosamente');
        $this->assertSame('cust_sdk_001', $result->data->customerId,
            'El customerId debe coincidir con el retornado por el SDK');
    }

    /**
     * Cuando el SDK lanza una excepción, customerCreate() la relanza.
     */
    public function test_customerCreate_cuando_sdk_lanza_excepcion_la_relanza(): void
    {
        $gateway = $this->buildGateway();

        $sdk = new class extends \Epayco\Epayco {
            public function __construct()
            {
                $this->customer = new class {
                    public function create(array $data): never
                    {
                        throw new \Exception('SDK connection failed');
                    }
                };
            }
        };
        $this->injectFakeSdk($gateway, $sdk);

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('SDK connection failed');

        $gateway->customerCreate([
            'token_card' => 'tok',
            'name'       => 'Juan',
            'last_name'  => 'Perez',
            'email'      => 'juan@example.com',
            'phone'      => '3001234567',
            'city'       => 'Bogota',
            'address'    => 'Calle 1',
        ]);
    }

    // =======================================================================
    // getPlans()
    // =======================================================================

    /**
     * Cuando el SDK retorna un plan con status=true,
     * getPlans() retorna el objeto del plan.
     */
    public function test_getPlans_cuando_plan_existe_retorna_objeto_plan(): void
    {
        $gateway = $this->buildGateway();
        $this->injectFakeSdk($gateway, $this->buildFakeSdkWithPlan(true, self::TEST_PLAN_ID));

        $plans = [['id_plan' => self::TEST_PLAN_ID, 'name' => self::TEST_PLAN_NAME]];

        $result = $gateway->getPlans($plans);

        $this->assertIsObject($result,
            'getPlans() debe retornar un objeto cuando el plan existe en ePayco');
        $this->assertTrue($result->status,
            'El plan retornado debe tener status=true');
    }

    /**
     * Cuando el SDK retorna status=false para el plan,
     * getPlans() retorna false.
     */
    public function test_getPlans_cuando_plan_no_existe_retorna_false(): void
    {
        $gateway = $this->buildGateway();
        $this->injectFakeSdk($gateway, $this->buildFakeSdkWithPlan(false));

        $plans = [['id_plan' => 'plan_que_no_existe', 'name' => 'Plan Inexistente']];

        $result = $gateway->getPlans($plans);

        $this->assertFalse($result,
            'getPlans() debe retornar false cuando el plan no existe en ePayco');
    }
}
