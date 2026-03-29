<?php

/**
 * Pruebas unitarias para EpaycoSuscription.php
 *
 * Cubren toda la lógica de negocio del gateway sin hacer llamadas HTTP
 * ni cargar WordPress/WooCommerce real. Las dependencias externas
 * (SDK de ePayco, WC_Subscription, WC_Order) se inyectan como dobles de prueba.
 *
 * @covers \EpaycoSubscription\Woocommerce\Gateways\EpaycoSuscription
 */

namespace EpaycoSubscription\Tests\Unit\Gateways;

use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\MockObject\MockObject;
use EpaycoSubscription\Woocommerce\Gateways\EpaycoSuscription;
use EpaycoSubscription\Woocommerce\Gateways\AbstractGateway;
use EpaycoSubscription\Woocommerce\WoocommerceEpaycoSubscription;
use EpaycoSubscription\Woocommerce\Hooks;
use EpaycoSubscription\Woocommerce\Helpers;
use EpaycoSubscription\Woocommerce\Configs\Store;

class EpaycoSuscriptionTest extends TestCase
{
    // -----------------------------------------------------------------------
    // Helpers de construcción
    // -----------------------------------------------------------------------

    /**
     * Construye una instancia de EpaycoSuscription sin ejecutar el constructor.
     * Inyecta todas las dependencias necesarias vía reflexión.
     *
     * @param  string[] $onlyMethods Métodos a mockear. Vacío → todos reales.
     * @return EpaycoSuscription|MockObject
     */
    private function buildGateway(array $onlyMethods = [])
    {
        if (empty($onlyMethods)) {
            $rc      = new \ReflectionClass(EpaycoSuscription::class);
            $gateway = $rc->newInstanceWithoutConstructor();
        } else {
            $gateway = $this->getMockBuilder(EpaycoSuscription::class)
                ->disableOriginalConstructor()
                ->onlyMethods($onlyMethods)
                ->getMock();
        }

        // Propiedades de WC_Payment_Gateway
        $gateway->id       = EpaycoSuscription::ID;
        $gateway->settings = [];
        $gateway->order_key = '';

        // Propiedades públicas de EpaycoSuscription
        $gateway->custIdCliente = '';
        $gateway->logger        = null;

        // epaycosuscription (typed property en AbstractGateway)
        $epsMock = $this->buildEpsMock();
        $absProp = (new \ReflectionClass(AbstractGateway::class))->getProperty('epaycosuscription');
        $absProp->setAccessible(true);
        $absProp->setValue($gateway, $epsMock);

        return $gateway;
    }

    /**
     * Igual que buildGateway() pero además inyecta un mock del SDK de ePayco
     * y devuelve [gateway, sdkMock] para que el test configure respuestas.
     *
     * @param  string[] $onlyMethods
     * @return array{0: EpaycoSuscription|MockObject, 1: MockObject}
     */
    private function buildGatewayWithSdk(array $onlyMethods = []): array
    {
        $gateway = $this->buildGateway($onlyMethods);

        $sdkMock = $this->getMockBuilder(\Epayco\Epayco::class)
            ->disableOriginalConstructor()
            ->getMock();

        $sdkProp = (new \ReflectionClass(EpaycoSuscription::class))->getProperty('epaycoSdk');
        $sdkProp->setAccessible(true);
        $sdkProp->setValue($gateway, $sdkMock);

        return [$gateway, $sdkMock];
    }

    /**
     * Crea un mock de WC_Subscription con los métodos especificados.
     *
     * @param  array<string, mixed> $returnValues  método => valor de retorno
     * @return \WC_Subscription&MockObject
     */
    private function buildSubscription(array $returnValues = []): \WC_Subscription
    {
        $methods = array_keys($returnValues);
        $stub    = empty($methods)
            ? $this->createStub(\WC_Subscription::class)
            : $this->getMockBuilder(\WC_Subscription::class)
                ->disableOriginalConstructor()
                ->onlyMethods($methods)
                ->getMock();

        foreach ($returnValues as $method => $value) {
            $stub->method($method)->willReturn($value);
        }

        return $stub;
    }

    /**
     * Crea un mock mínimo del contenedor principal del plugin.
     */
    private function buildEpsMock(): WoocommerceEpaycoSubscription
    {
        // Hooks y sub-mocks
        $endpointsMock = $this->createMock(Hooks\Endpoints::class);
        $gatewayMock   = $this->createMock(Hooks\Gateway::class);
        $adminMock     = $this->createMock(Hooks\Admin::class);
        $checkoutMock  = $this->createMock(Hooks\Checkout::class);
        $scriptsMock   = $this->createMock(Hooks\Scripts::class);
        $templateMock  = $this->createMock(Hooks\Template::class);
        $pluginMock    = $this->createMock(Hooks\Plugin::class);
        $optionsMock   = $this->createMock(Hooks\Options::class);
        $blocksMock    = $this->createMock(Hooks\Blocks::class);

        $hooksMock = $this->getMockBuilder(Hooks::class)
            ->disableOriginalConstructor()
            ->getMock();
        $hooksMock->endpoints = $endpointsMock;
        $hooksMock->gateway   = $gatewayMock;
        $hooksMock->admin     = $adminMock;
        $hooksMock->checkout  = $checkoutMock;
        $hooksMock->scripts   = $scriptsMock;
        $hooksMock->template  = $templateMock;
        $hooksMock->plugin    = $pluginMock;
        $hooksMock->options   = $optionsMock;
        $hooksMock->blocks    = $blocksMock;

        // Helpers
        $urlMock = $this->createMock(Helpers\Url::class);

        $helpersMock = $this->getMockBuilder(Helpers::class)
            ->disableOriginalConstructor()
            ->getMock();
        $helpersMock->url = $urlMock;

        // Store
        $storeMock = $this->getMockBuilder(Store::class)
            ->disableOriginalConstructor()
            ->getMock();
        $storeMock->method('getGatewayTitle')->willReturn('ePayco Suscripciones');

        // Plugin principal
        $epsMock = $this->getMockBuilder(WoocommerceEpaycoSubscription::class)
            ->disableOriginalConstructor()
            ->getMock();
        $epsMock->hooks       = $hooksMock;
        $epsMock->helpers     = $helpersMock;
        $epsMock->storeConfig = $storeMock;

        return $epsMock;
    }

    // -----------------------------------------------------------------------
    // Constantes de clase
    // -----------------------------------------------------------------------

    public function test_constante_ID(): void
    {
        $this->assertSame('woo-epaycosubscription', EpaycoSuscription::ID);
    }

    public function test_constante_CHECKOUT_NAME(): void
    {
        $this->assertSame('checkout-subscription', EpaycoSuscription::CHECKOUT_NAME);
    }

    public function test_constante_WEBHOOK_API_NAME(): void
    {
        $this->assertSame('WC_WooEpaycoSuscription_Gateway', EpaycoSuscription::WEBHOOK_API_NAME);
    }

    public function test_constante_WEBHOOK_API_NAME_VALIDATION(): void
    {
        $this->assertSame('WC_WooEpaycoSuscription_Validation', EpaycoSuscription::WEBHOOK_API_NAME_VALIDATION);
    }

    public function test_constante_LOG_SOURCE(): void
    {
        $this->assertSame('EpaycoSuscription_Gateway', EpaycoSuscription::LOG_SOURCE);
    }

    // -----------------------------------------------------------------------
    // getCheckoutName()
    // -----------------------------------------------------------------------

    public function test_getCheckoutName_retorna_checkout_subscription(): void
    {
        $gateway = $this->buildGateway();
        $this->assertSame('checkout-subscription', $gateway->getCheckoutName());
    }

    // -----------------------------------------------------------------------
    // getPaymentFieldsParams()
    // -----------------------------------------------------------------------

    public function test_getPaymentFieldsParams_retorna_array_vacio(): void
    {
        $gateway = $this->buildGateway();
        $this->assertSame([], $gateway->getPaymentFieldsParams());
    }

    // -----------------------------------------------------------------------
    // cleanCharacters()
    // -----------------------------------------------------------------------

    public function test_cleanCharacters_reemplaza_espacios_con_guion(): void
    {
        $gateway = $this->buildGateway();
        $this->assertSame('Plan-Mensual', $gateway->cleanCharacters('Plan Mensual'));
    }

    public function test_cleanCharacters_elimina_caracteres_especiales(): void
    {
        $gateway = $this->buildGateway();
        $this->assertSame('PlanMensual', $gateway->cleanCharacters('Plan@Mensual!'));
    }

    public function test_cleanCharacters_conserva_alfanumericos_y_guiones(): void
    {
        $gateway = $this->buildGateway();
        $this->assertSame('Plan-123-ABC', $gateway->cleanCharacters('Plan-123-ABC'));
    }

    // -----------------------------------------------------------------------
    // getPlan()
    // -----------------------------------------------------------------------

    public function test_getPlan_concatena_nombres_de_productos(): void
    {
        $gateway  = $this->buildGateway();
        $products = [
            ['name' => 'Plan Básico', 'product_id' => '10', 'quantity' => 1],
        ];
        $result = $gateway->getPlan($products);
        $this->assertStringContainsString('Plan', $result['name']);
    }

    public function test_getPlan_concatena_ids_de_productos(): void
    {
        $gateway  = $this->buildGateway();
        $products = [
            ['name' => 'Plan A', 'product_id' => '42', 'quantity' => 1],
        ];
        $result = $gateway->getPlan($products);
        $this->assertStringContainsString('42', $result['id']);
    }

    public function test_getPlan_concatena_cantidades_de_productos(): void
    {
        $gateway  = $this->buildGateway();
        $products = [
            ['name' => 'Plan A', 'product_id' => '1', 'quantity' => 2],
            ['name' => 'Plan B', 'product_id' => '2', 'quantity' => 3],
        ];
        $result = $gateway->getPlan($products);
        // El código concatena string: 0 . "2" . "3" = "023"
        $this->assertStringContainsString('2', (string) $result['quantity']);
        $this->assertStringContainsString('3', (string) $result['quantity']);
    }

    // -----------------------------------------------------------------------
    // getUrlNotify()
    // -----------------------------------------------------------------------

    public function test_getUrlNotify_contiene_nombre_del_webhook(): void
    {
        $gateway = $this->buildGateway();
        $url     = $gateway->getUrlNotify('99');
        $this->assertStringContainsString('WC_WooEpaycoSuscription_Gateway', $url);
    }

    public function test_getUrlNotify_contiene_el_order_id(): void
    {
        $gateway = $this->buildGateway();
        $url     = $gateway->getUrlNotify('99');
        $this->assertStringContainsString('99', $url);
    }

    public function test_getUrlNotify_contiene_parametro_confirmation(): void
    {
        $gateway = $this->buildGateway();
        $url     = $gateway->getUrlNotify('1');
        $this->assertStringContainsString('confirmation=1', $url);
    }

    // -----------------------------------------------------------------------
    // intervalAmount()
    // -----------------------------------------------------------------------

    public function test_intervalAmount_retorna_periodo_de_facturacion(): void
    {
        $gateway      = $this->buildGateway();
        $subscription = $this->buildSubscription([
            'get_billing_period'   => 'month',
            'get_total'            => '50000',
            'get_billing_interval' => '1',
        ]);

        $result = $gateway->intervalAmount($subscription);

        $this->assertSame('month', $result['interval']);
    }

    public function test_intervalAmount_retorna_cantidad_de_intervalos(): void
    {
        $gateway      = $this->buildGateway();
        $subscription = $this->buildSubscription([
            'get_billing_period'   => 'year',
            'get_total'            => '100000',
            'get_billing_interval' => '3',
        ]);

        $result = $gateway->intervalAmount($subscription);

        $this->assertSame('3', $result['interval_count']);
    }

    public function test_intervalAmount_retorna_monto_total(): void
    {
        $gateway      = $this->buildGateway();
        $subscription = $this->buildSubscription([
            'get_billing_period'   => 'month',
            'get_total'            => '75000',
            'get_billing_interval' => '1',
        ]);

        $result = $gateway->intervalAmount($subscription);

        $this->assertSame('75000', $result['amount']);
    }

    // -----------------------------------------------------------------------
    // getTrialDays()
    // -----------------------------------------------------------------------

    public function test_getTrialDays_retorna_cero_cuando_no_hay_trial(): void
    {
        $gateway      = $this->buildGateway();
        $subscription = $this->buildSubscription([
            'get_date' => '',
        ]);

        $result = $gateway->getTrialDays($subscription);

        $this->assertSame('0', $result);
    }

    public function test_getTrialDays_calcula_dias_cuando_hay_trial_end(): void
    {
        $gateway = $this->buildGateway();

        $sub = $this->getMockBuilder(\WC_Subscription::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['get_date'])
            ->getMock();

        // 30 días de trial
        $sub->method('get_date')->willReturnCallback(function (string $type): string {
            return match ($type) {
                'start'     => '2026-01-01',
                'trial_end' => '2026-01-31',
                default     => '',
            };
        });

        $days = (float) $gateway->getTrialDays($sub);

        $this->assertGreaterThan(0, $days, 'Los días de trial deben ser mayores a 0');
        $this->assertLessThanOrEqual(31, $days, 'No deben superar los días del mes');
    }

    // -----------------------------------------------------------------------
    // paramsBilling()
    // -----------------------------------------------------------------------

    public function test_paramsBilling_divide_nombre_completo_en_nombre_y_apellido(): void
    {
        $gateway = $this->buildGateway();
        $order   = new \WC_Order(1);
        $sub     = $this->buildSubscription([
            'get_billing_email'    => 'a@b.com',
            'get_billing_phone'    => '123',
            'get_billing_country'  => 'CO',
            'get_billing_city'     => 'Bogota',
            'get_billing_address_1' => 'Calle 1',
            'get_billing_address_2' => '',
            'get_shipping_country' => '',
            'get_shipping_city'    => '',
            'get_shipping_address_1' => '',
            'get_shipping_address_2' => '',
        ]);

        $result = $gateway->paramsBilling([$sub], $order, 'Juan Perez');

        $this->assertSame('Juan', $result['name']);
        $this->assertSame('Perez', $result['last_name']);
    }

    public function test_paramsBilling_nombre_unico_se_duplica_en_last_name(): void
    {
        $gateway = $this->buildGateway();
        $order   = new \WC_Order(1);
        $sub     = $this->buildSubscription([
            'get_billing_email'    => 'a@b.com',
            'get_billing_phone'    => '123',
            'get_billing_country'  => 'CO',
            'get_billing_city'     => 'Bogota',
            'get_billing_address_1' => 'Calle 1',
            'get_billing_address_2' => '',
            'get_shipping_country' => '',
            'get_shipping_city'    => '',
            'get_shipping_address_1' => '',
            'get_shipping_address_2' => '',
        ]);

        $result = $gateway->paramsBilling([$sub], $order, 'Juan');

        $this->assertSame('Juan', $result['name']);
        $this->assertSame('Juan', $result['last_name']);
    }

    public function test_paramsBilling_usa_shipping_country_si_esta_disponible(): void
    {
        $gateway = $this->buildGateway();
        $order   = new \WC_Order(1);
        $sub     = $this->buildSubscription([
            'get_billing_email'    => 'a@b.com',
            'get_billing_phone'    => '123',
            'get_billing_country'  => 'CO',
            'get_billing_city'     => 'Bogota',
            'get_billing_address_1' => 'Calle 1',
            'get_billing_address_2' => '',
            'get_shipping_country' => 'MX',
            'get_shipping_city'    => 'CDMX',
            'get_shipping_address_1' => 'Av. Reforma',
            'get_shipping_address_2' => '',
        ]);

        $result = $gateway->paramsBilling([$sub], $order, 'Test User');

        $this->assertSame('MX', $result['country']);
        $this->assertSame('CDMX', $result['city']);
        $this->assertStringContainsString('Av. Reforma', $result['address']);
    }

    public function test_paramsBilling_usa_billing_country_cuando_shipping_vacio(): void
    {
        $gateway = $this->buildGateway();
        $order   = new \WC_Order(1);
        $sub     = $this->buildSubscription([
            'get_billing_email'    => 'a@b.com',
            'get_billing_phone'    => '123',
            'get_billing_country'  => 'CO',
            'get_billing_city'     => 'Bogota',
            'get_billing_address_1' => 'Carrera 10',
            'get_billing_address_2' => '',
            'get_shipping_country' => '',
            'get_shipping_city'    => '',
            'get_shipping_address_1' => '',
            'get_shipping_address_2' => '',
        ]);

        $result = $gateway->paramsBilling([$sub], $order, 'Test User');

        $this->assertSame('CO', $result['country']);
        $this->assertSame('Bogota', $result['city']);
        $this->assertStringContainsString('Carrera 10', $result['address']);
    }

    public function test_paramsBilling_retorna_email_y_telefono_de_la_suscripcion(): void
    {
        $gateway = $this->buildGateway();
        $order   = new \WC_Order(1);
        $sub     = $this->buildSubscription([
            'get_billing_email'    => 'cliente@epayco.test',
            'get_billing_phone'    => '3219876543',
            'get_billing_country'  => 'CO',
            'get_billing_city'     => 'Cali',
            'get_billing_address_1' => 'Av. 3N',
            'get_billing_address_2' => '',
            'get_shipping_country' => '',
            'get_shipping_city'    => '',
            'get_shipping_address_1' => '',
            'get_shipping_address_2' => '',
        ]);

        $result = $gateway->paramsBilling([$sub], $order, 'Test User');

        $this->assertSame('cliente@epayco.test', $result['email']);
        $this->assertSame('3219876543', $result['phone']);
    }

    // -----------------------------------------------------------------------
    // getPlansBySubscription()
    // -----------------------------------------------------------------------

    public function test_getPlansBySubscription_retorna_array_con_un_plan(): void
    {
        $gateway = $this->buildGateway();
        $sub     = $this->buildSubscription([
            'get_total_discount'   => 0.0,
            'get_base_data'        => ['total' => '10000', 'total_tax' => '0'],
            'get_currency'         => 'COP',
            'get_items'            => [['name' => 'Plan Mensual', 'product_id' => '5', 'quantity' => 1]],
            'get_billing_period'   => 'month',
            'get_total'            => '10000',
            'get_billing_interval' => '1',
            'get_date'             => '',
        ]);

        $result = $gateway->getPlansBySubscription([$sub]);

        $this->assertIsArray($result);
        $this->assertCount(1, $result);
    }

    public function test_getPlansBySubscription_plan_contiene_claves_requeridas(): void
    {
        $gateway = $this->buildGateway();
        $sub     = $this->buildSubscription([
            'get_total_discount'   => 0.0,
            'get_base_data'        => ['total' => '10000', 'total_tax' => '0'],
            'get_currency'         => 'COP',
            'get_items'            => [['name' => 'Plan Mensual', 'product_id' => '5', 'quantity' => 1]],
            'get_billing_period'   => 'month',
            'get_total'            => '10000',
            'get_billing_interval' => '1',
            'get_date'             => '',
        ]);

        $plan = $gateway->getPlansBySubscription([$sub])[0];

        foreach (['id_plan', 'name', 'description', 'currency', 'amount', 'interval', 'interval_count', 'trial_days'] as $key) {
            $this->assertArrayHasKey($key, $plan, "El plan debe tener la clave '$key'");
        }
    }

    public function test_getPlansBySubscription_id_plan_normalizado_en_minusculas(): void
    {
        $gateway = $this->buildGateway();
        $sub     = $this->buildSubscription([
            'get_total_discount'   => 0.0,
            'get_base_data'        => ['total' => '5000', 'total_tax' => '0'],
            'get_currency'         => 'COP',
            'get_items'            => [['name' => 'Plan GOLD', 'product_id' => '7', 'quantity' => 1]],
            'get_billing_period'   => 'month',
            'get_total'            => '5000',
            'get_billing_interval' => '1',
            'get_date'             => '',
        ]);

        $plan = $gateway->getPlansBySubscription([$sub])[0];

        $this->assertSame(strtolower($plan['id_plan']), $plan['id_plan'],
            'El id_plan debe estar en minúsculas');
    }

    public function test_getPlansBySubscription_usa_moneda_de_la_suscripcion(): void
    {
        $gateway = $this->buildGateway();
        $sub     = $this->buildSubscription([
            'get_total_discount'   => 0.0,
            'get_base_data'        => ['total' => '5000', 'total_tax' => '0'],
            'get_currency'         => 'USD',
            'get_items'            => [['name' => 'Plan USD', 'product_id' => '8', 'quantity' => 1]],
            'get_billing_period'   => 'month',
            'get_total'            => '5000',
            'get_billing_interval' => '1',
            'get_date'             => '',
        ]);

        $plan = $gateway->getPlansBySubscription([$sub])[0];

        $this->assertSame('USD', $plan['currency']);
    }

    // -----------------------------------------------------------------------
    // process_payment()
    // -----------------------------------------------------------------------

    public function test_process_payment_retorna_success_con_redirect_url(): void
    {
        $gateway = $this->buildGateway();
        $order   = new \WC_Order(10);
        $GLOBALS['_webhook_test_order'] = $order;

        $result = $gateway->process_payment(10);

        $this->assertSame('success', $result['result']);
        $this->assertNotEmpty($result['redirect']);
    }

    public function test_process_payment_retorna_false_cuando_lanza_excepcion(): void
    {
        $gateway = $this->buildGateway();

        // Orden que lanza excepción al llamar get_checkout_payment_url
        $orderMock = $this->getMockBuilder(\WC_Order::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['get_checkout_payment_url', 'get_id'])
            ->getMock();
        $orderMock->method('get_checkout_payment_url')
            ->willThrowException(new \Exception('Order not found'));
        $orderMock->method('get_id')->willReturn(99);

        $GLOBALS['_webhook_test_order'] = $orderMock;

        $result = $gateway->process_payment(99);

        $this->assertSame('false', $result['result']);
        $this->assertStringContainsString('Order not found', $result['message']);
    }

    // -----------------------------------------------------------------------
    // createToken()
    // -----------------------------------------------------------------------

    public function test_createToken_retorna_null_cuando_data_es_null(): void
    {
        [$gateway] = $this->buildGatewayWithSdk();

        // Sin datos de entrada (php://input vacío en tests)
        $result = $gateway->createToken(null);

        $this->assertNull($result);
    }

    public function test_createToken_parsea_campo_expiry_en_exp_month_y_year(): void
    {
        [$gateway, $sdkMock] = $this->buildGatewayWithSdk();

        // Configurar la respuesta del SDK
        $tokenResponse       = new \stdClass();
        $tokenResponse->status = true;
        $tokenResponse->id     = 'tok_test_123';

        $tokenApiMock = $this->getMockBuilder(\stdClass::class)
            ->addMethods(['create'])
            ->getMock();
        $tokenApiMock->method('create')->willReturnCallback(
            function (array $body) use ($tokenResponse): object {
                // Verificar que exp_month y exp_year se derivan de expiry
                $this->assertArrayHasKey('card[exp_month]', $body);
                $this->assertArrayHasKey('card[exp_year]', $body);
                $this->assertSame('12', $body['card[exp_month]']);
                return $tokenResponse;
            }
        );
        $sdkMock->token = $tokenApiMock;

        // Datos con campo 'expiry' (formato del formulario de checkout)
        $cardData = [
            'number' => '4111111111111111',
            'expiry' => '12/2028',
            'cvv'    => '123',
        ];
        $input = base64_encode(json_encode($cardData));

        $result = $gateway->createToken($input);

        $this->assertNotNull($result);
    }

    // -----------------------------------------------------------------------
    // validatePlan()
    // -----------------------------------------------------------------------

    public function test_validatePlan_create_false_confirm_true_llama_validatePlanData(): void
    {
        $expected = ['success' => true, 'ref_payco' => 'REF123', 'url' => 'http://example.com'];
        $gateway  = $this->buildGateway(['validatePlanData']);
        $gateway->method('validatePlanData')->willReturn($expected);

        $plan = ['id_plan' => 'plan_test', 'amount' => 1000, 'currency' => 'COP'];
        $result = $gateway->validatePlan(
            false, '1', [$plan], [], [], 'http://confirm', new \WC_Order(1),
            true,  // $confirm = true
            false, new \stdClass()
        );

        $this->assertSame($expected, $result);
    }

    public function test_validatePlan_create_true_retorna_error_cuando_plansCreate_falla(): void
    {
        $planFailed          = new \stdClass();
        $planFailed->status  = false;
        $planFailed->message = 'El identificador del plan ya está en uso';

        $gateway = $this->buildGateway(['plansCreate']);
        $gateway->method('plansCreate')->willReturn($planFailed);

        $plan   = ['id_plan' => 'plan_duplicado', 'amount' => 1000];
        $result = $gateway->validatePlan(
            true, '1', [$plan], [], [], 'http://confirm', new \WC_Order(1)
        );

        $this->assertFalse($result['success']);
        $this->assertNotEmpty($result['message']);
    }

    public function test_validatePlan_create_true_llama_validatePlanData_cuando_plan_se_crea(): void
    {
        $planCreated         = new \stdClass();
        $planCreated->status = true;

        $planRetrieved         = new \stdClass();
        $planRetrieved->status = true;

        $expected = ['success' => true, 'ref_payco' => 'REF_OK', 'url' => 'http://done'];

        $gateway = $this->buildGateway(['plansCreate', 'getPlans', 'validatePlanData']);
        $gateway->method('plansCreate')->willReturn($planCreated);
        $gateway->method('getPlans')->willReturn($planRetrieved);
        $gateway->method('validatePlanData')->willReturn($expected);

        $plan   = ['id_plan' => 'plan_nuevo', 'amount' => 5000];
        $result = $gateway->validatePlan(
            true, '1', [$plan], [], [], 'http://confirm', new \WC_Order(1)
        );

        $this->assertSame($expected, $result);
    }

    // -----------------------------------------------------------------------
    // init_form_fields()
    // -----------------------------------------------------------------------

    public function test_init_form_fields_define_campo_enabled(): void
    {
        $gateway = $this->buildGateway(['payment_scripts']);
        // payment_scripts tiene void return type — no configurar willReturn
        $gateway->init_form_fields();

        $this->assertArrayHasKey('enabled', $gateway->form_fields);
    }

    public function test_init_form_fields_define_campos_de_credenciales(): void
    {
        $gateway = $this->buildGateway(['payment_scripts']);
        $gateway->init_form_fields();

        foreach (['custIdCliente', 'pKey', 'apiKey', 'privateKey'] as $field) {
            $this->assertArrayHasKey($field, $gateway->form_fields,
                "El campo '$field' debe estar en form_fields");
        }
    }
}
