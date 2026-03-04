<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;

final class WCGatewayEpaycoUnitTest extends TestCase
{
    private const EPAYCO_CUSTOMER_ID = '627579';
    private const EPAYCO_SECRET_KEY = '170e3e02b3aa6086c6c020a25b1a7ff2e7c52585';
    private const EPAYCO_PUBLIC_KEY = '653bbf81a3074049ed02803d4df9faba';
    private const EPAYCO_PRIVATE_KEY = '85d925abbe69a25ae54561a46aefadb1';
    private const X_COD_TRANSACTION_STATE = 3;
    private const X_REF_PAYCO = 101766855;
    private const X_TRANSACTION_ID = '48771874224993';
    private const X_AMOUNT = '38000';
    private const X_CURRENCY_CODE = 'COP';
    private const X_TEST_REQUEST = 'FALSE';
    private const X_APPROVAL_CODE = '123222';
    private const X_FRANCHISE = 'EF';
    private const X_FECHA_TRANSACCION = '2026-03-02 08:28:58';
    private const X_CURRENCY = 'COP';
    private const X_SIGNATURE = '118885ab2c9e8fc44aebefd0e3ee6fa1750517177f63d2f83d031d6d935bca8d';
    private const ID_ORDER = 88;

    protected function setUp(): void
    {
        parent::setUp();
        $GLOBALS['stock_updates'] = [];
        $GLOBALS['wc_logs'] = [];
        $GLOBALS['wp_remote_get_map'] = [];
        $GLOBALS['wc_orders'] = [];
        $GLOBALS['wp_redirect_url'] = null;
        $GLOBALS['wp_safe_redirect_url'] = null;
        $GLOBALS['wp_options'] = ['woocommerce_manage_stock' => 'yes'];
        EpaycoOrder::$stockDiscountByOrder = [];
        WC_Gateway_Epayco::$logger = new WC_Logger();
        $_GET = [];
        $_REQUEST = [];
    }

    private function makeGateway(): WC_Gateway_Epayco
    {
        $reflection = new ReflectionClass(WC_Gateway_Epayco::class);
        $gateway = $reflection->newInstanceWithoutConstructor();
        $gateway->id = 'epayco';
        $gateway->settings = [
            'epayco_customerid' => self::EPAYCO_CUSTOMER_ID,
            'epayco_secretkey' => self::EPAYCO_SECRET_KEY,
            'epayco_publickey' => self::EPAYCO_PUBLIC_KEY,
            'epayco_privatekey' => self::EPAYCO_PRIVATE_KEY,
            'epayco_endorder_state' => 'processing',
            'epayco_cancelled_endorder_state' => 'epayco-failed',
            'epayco_reduce_stock_pending' => 'yes',
            'epayco_testmode' => 'yes',
        ];
        return $gateway;
    }

    public function test_auth_signature_validation_uses_expected_hash(): void
    {
        $gateway = $this->makeGateway();

        $signature = $gateway->authSignature(self::X_REF_PAYCO, self::X_TRANSACTION_ID, self::X_AMOUNT, self::X_CURRENCY);
        $expected = self::X_SIGNATURE;

        $this->assertSame($expected, $signature);
    }

    public function test_state_code_mapping_returns_expected_values(): void
    {
        $gateway = $this->makeGateway();

        $this->assertSame(1, $gateway->get_epayco_estado_codigo_detallado('aceptada'));
        $this->assertSame(2, $gateway->get_epayco_estado_codigo_detallado('rechazada'));
        $this->assertSame(4, $gateway->get_epayco_estado_codigo_detallado('fallida'));
        $this->assertSame(3, $gateway->get_epayco_estado_codigo_detallado('pendiente'));
    }

    public function test_get_ref_payco_returns_mapped_payload_from_api_response(): void
    {
        $gateway = $this->makeGateway();
        $url = 'https://eks-checkout-service.epayco.io/validation/v1/reference/' . self::X_REF_PAYCO;

        $GLOBALS['wp_remote_get_map'][$url] = [
            'body' => json_encode([
                'status' => true,
                'data' => [
                    'x_signature' => self::X_SIGNATURE,
                    'x_cod_transaction_state' => self::X_COD_TRANSACTION_STATE,
                    'x_ref_payco' => (string) self::X_REF_PAYCO,
                    'x_transaction_id' => self::X_TRANSACTION_ID,
                    'x_amount' => self::X_AMOUNT,
                    'x_currency_code' => self::X_CURRENCY_CODE,
                    'x_test_request' => self::X_TEST_REQUEST,
                    'x_approval_code' => self::X_APPROVAL_CODE,
                    'x_franchise' => self::X_FRANCHISE,
                    'x_fecha_transaccion' => self::X_FECHA_TRANSACCION,
                ],
            ]),
            'response' => ['code' => 200],
        ];

        $result = $gateway->getRefPayco((string) self::X_REF_PAYCO);

        $this->assertIsArray($result);
        $this->assertSame(self::X_SIGNATURE, $result['x_signature']);
        $this->assertSame(self::X_COD_TRANSACTION_STATE, $result['x_cod_transaction_state']);
        $this->assertSame((string) self::X_REF_PAYCO, $result['x_ref_payco']);
        $this->assertSame(self::X_TRANSACTION_ID, $result['x_transaction_id']);
        $this->assertSame(self::X_AMOUNT, $result['x_amount']);
        $this->assertSame(self::X_CURRENCY_CODE, $result['x_currency_code']);
    }
    

    public function test_order_confirmation_and_marks_stock(): void
    {
        $orderId = self::ID_ORDER;
        $order = new WC_Order($orderId);
        $GLOBALS['wc_orders'][$orderId] = $order;

        $gateway = new class extends WC_Gateway_Epayco {
            public array $mockResponse = [];

            public function getRefPayco($refPayco)
            {
                return $this->mockResponse;
            }
        };
        $gateway->settings = [
            'epayco_customerid' => self::EPAYCO_CUSTOMER_ID,
            'epayco_secretkey' => self::EPAYCO_SECRET_KEY,
            'epayco_publickey' => self::EPAYCO_PUBLIC_KEY,
            'epayco_privatekey' => self::EPAYCO_PRIVATE_KEY,
            'epayco_endorder_state' => 'processing',
            'epayco_cancelled_endorder_state' => 'epayco-failed',
            'epayco_reduce_stock_pending' => 'yes',
            'epayco_testmode' => 'no',
            'response_data' => 'no',
            'epayco_url_response' => 0,
        ];

        $signature = $gateway->authSignature(self::X_REF_PAYCO, self::X_TRANSACTION_ID, self::X_AMOUNT, self::X_CURRENCY);
        $mockResponse = [
            'x_signature' => $signature,
            'x_cod_transaction_state' => self::X_COD_TRANSACTION_STATE,
            'x_ref_payco' => self::X_REF_PAYCO,
            'x_transaction_id' => self::X_TRANSACTION_ID,
            'x_amount' => self::X_AMOUNT,
            'x_currency_code' => self::X_CURRENCY_CODE,
            'x_test_request' => self::X_TEST_REQUEST,
            'x_approval_code' => self::X_APPROVAL_CODE,
            'x_franchise' => self::X_FRANCHISE,
            'x_fecha_transaccion' => self::X_FECHA_TRANSACCION,
        ];
        $gateway->mockResponse = $mockResponse;

        $_GET['order_id'] = (string)$orderId;
        $_GET['confirmation'] = '0';
        $_REQUEST['ref_payco'] = self::X_REF_PAYCO;

        ob_start();
        $gateway->successful_request([]);
        ob_end_clean();


        switch (self::X_COD_TRANSACTION_STATE) {
            case 1: // Approved
                $this->assertSame('on-hold', $order->get_status());
                $this->assertFalse(EpaycoOrder::ifStockDiscount($orderId));
                $this->assertNotEmpty($GLOBALS['wp_redirect_url']);
                break;

            case 2: case 4: case 10: case 11: // Rejected
                $this->assertSame('epayco-failed', $order->get_status());
                $this->assertNotEmpty($GLOBALS['stock_updates']);
                $this->assertSame('increase', $GLOBALS['stock_updates'][0]['direction']);
                $this->assertSame(2, $GLOBALS['stock_updates'][0]['qty']);
                $this->assertNotEmpty($GLOBALS['wp_redirect_url']); 
                break;

            case 3: case 7: // Pending
                $this->assertSame('pending', $order->get_status());
                $this->assertFalse(EpaycoOrder::ifStockDiscount($orderId));
                $this->assertNotEmpty($GLOBALS['wp_redirect_url']);
                break;
            
        }


    }
}