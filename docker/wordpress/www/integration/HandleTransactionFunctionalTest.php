<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;

if (!function_exists('esc_attr')) {
    function esc_attr($value)
    {
        return $value;
    }
}

if (!function_exists('get_option')) {
    function get_option($key)
    {
        $options = $GLOBALS['wp_options'] ?? [];
        return $options[$key] ?? null;
    }
}

if (!function_exists('wc_get_order')) {
    function wc_get_order($orderId)
    {
        $orders = $GLOBALS['wc_orders'] ?? [];
        return $orders[$orderId] ?? null;
    }
}

if (!function_exists('wc_update_product_stock')) {
    function wc_update_product_stock($product, $qty, $direction)
    {
        $GLOBALS['stock_updates'][] = [
            'product' => $product,
            'qty' => $qty,
            'direction' => $direction,
        ];
    }
}

if (!class_exists('EpaycoOrder')) {
    class EpaycoOrder
    {
        public static function ifStockDiscount($orderId)
        {
            return false;
        }

        public static function updateStockDiscount($orderId, $value)
        {
            return true;
        }
    }
}

final class HandleTransactionFunctionalTest extends TestCase
{
    private const X_COD_TRANSACTION_STATE = 1;
    private const X_REF_PAYCO = '101766974';
    private const X_APPROVAL_CODE = '48771874243453';
    private const X_FRANCHISE = 'GA';
    private const X_FECHA_TRANSACCION = '2026-03-02 13:34:39';
    private const ID_ORDER = 94;
    private const END_ORDER_STATE = 'processing';
    private const CANCEL_ORDER_STATE = 'epayco-failed';

    private function resolveTransactionOutcome(int $transactionState): string
    {
        if ($transactionState === 1) {
            return 'aceptada';
        }

        if (in_array($transactionState, [2, 4, 10, 11], true)) {
            return 'rechazada';
        }

        if (in_array($transactionState, [3, 7], true)) {
            return 'pendiente';
        }

        return 'desconocida';
    }

    private function expectedOutputByOutcome(string $outcome): string
    {
        return match ($outcome) {
            'aceptada' => '1',
            'rechazada' => '2',
            'pendiente' => '3',
            default => 'default',
        };
    }

    private function expectedStatusByOutcome(string $outcome, string $initialStatus): string
    {
        return match ($outcome) {
            'aceptada' => $initialStatus === 'pending' ? 'on-hold' : self::END_ORDER_STATE,
            'rechazada' => self::CANCEL_ORDER_STATE,
            'pendiente' => 'on-hold',
            default => 'epayco-failed',
        };
    }

    private function useRealWooIntegration(): bool
    {
        return getenv('RUN_WC_REAL_INTEGRATION') === '1';
    }

    private function createTestOrder(string $initialStatus = 'pending')
    {
        if ($this->useRealWooIntegration()) {
            if (!function_exists('wc_get_order')) {
                $this->markTestSkipped('wc_get_order no está disponible en modo integración real.');
            }

            $order = wc_get_order(self::ID_ORDER);
            if (!$order) {
                $this->markTestSkipped('No existe una orden real con ID ' . self::ID_ORDER . '.');
            }

            $order->update_status($initialStatus);
            $order->save();

            return $order;
        }

        return new class(self::ID_ORDER, $initialStatus, []) {
            private int $id;
            private string $status;
            private array $meta = [];
            private array $items;
            private string $paymentCompleteRef = '';

            public function __construct(int $id, string $status, array $items)
            {
                $this->id = $id;
                $this->status = $status;
                $this->items = $items;
            }

            public function get_id()
            {
                return $this->id;
            }

            public function get_status()
            {
                return $this->status;
            }

            public function update_status($status)
            {
                $this->status = $status;
            }

            public function get_meta($key)
            {
                return $this->meta[$key] ?? '';
            }

            public function update_meta_data($key, $value)
            {
                $this->meta[$key] = $value;
            }

            public function save()
            {
                return true;
            }

            public function get_items()
            {
                return $this->items;
            }

            public function payment_complete($refPayco)
            {
                $this->paymentCompleteRef = (string) $refPayco;
            }
        };
    }

    protected function setUp(): void
    {
        parent::setUp();
        $GLOBALS['stock_updates'] = [];
        $GLOBALS['wc_orders'] = [];
        $GLOBALS['wp_options'] = ['woocommerce_manage_stock' => 'yes'];
    }

    public function test_handle_transaction_with_shared_constants_updates_pending_order(): void
    {
        $outcome = $this->resolveTransactionOutcome(self::X_COD_TRANSACTION_STATE);
        $expectedOutput = $this->expectedOutputByOutcome($outcome);
        $expectedStatus = $this->expectedStatusByOutcome($outcome, 'pending');

        $order = $this->createTestOrder();

        $GLOBALS['wc_orders'][self::ID_ORDER] = $order;

        $transactionData = [
            'x_cod_transaction_state' => self::X_COD_TRANSACTION_STATE,
            'x_ref_payco' => self::X_REF_PAYCO,
            'x_fecha_transaccion' => self::X_FECHA_TRANSACCION,
            'x_franchise' => self::X_FRANCHISE,
            'x_approval_code' => self::X_APPROVAL_CODE,
            'is_confirmation' => true,
        ];

        $settings = [
            'test_mode' => 'false',
            'end_order_state' => self::END_ORDER_STATE,
            'cancel_order_state' => self::CANCEL_ORDER_STATE,
            'reduce_stock_pending' => 'yes',
        ];

        ob_start();
        Epayco_Transaction_Handler::handle_transaction($order, $transactionData, $settings);
        $output = ob_get_clean();

        $this->assertContains($outcome, ['aceptada', 'rechazada', 'pendiente']);
        $this->assertSame($expectedOutput, trim((string) $output));
        $this->assertSame($expectedStatus, $order->get_status());
        $this->assertSame(self::X_REF_PAYCO, $order->get_meta('refPayco'));
        $this->assertSame(self::X_FECHA_TRANSACCION, $order->get_meta('fecha'));
        $this->assertSame(self::X_FRANCHISE, $order->get_meta('franquicia'));
        $this->assertSame(self::X_APPROVAL_CODE, $order->get_meta('autorizacion'));
    }

    public function test_handle_transaction_with_shared_constants_updates_on_hold_order_to_processing(): void
    {
        $outcome = $this->resolveTransactionOutcome(self::X_COD_TRANSACTION_STATE);
        $expectedOutput = $this->expectedOutputByOutcome($outcome);
        $expectedStatus = $this->expectedStatusByOutcome($outcome, 'on-hold');

        $order = $this->createTestOrder('on-hold');

        $GLOBALS['wc_orders'][self::ID_ORDER] = $order;

        $transactionData = [
            'x_cod_transaction_state' => self::X_COD_TRANSACTION_STATE,
            'x_ref_payco' => self::X_REF_PAYCO,
            'x_fecha_transaccion' => self::X_FECHA_TRANSACCION,
            'x_franchise' => self::X_FRANCHISE,
            'x_approval_code' => self::X_APPROVAL_CODE,
            'is_confirmation' => true,
        ];

        $settings = [
            'test_mode' => 'false',
            'end_order_state' => self::END_ORDER_STATE,
            'cancel_order_state' => self::CANCEL_ORDER_STATE,
            'reduce_stock_pending' => 'yes',
        ];

        ob_start();
        Epayco_Transaction_Handler::handle_transaction($order, $transactionData, $settings);
        $output = ob_get_clean();

        $this->assertContains($outcome, ['aceptada', 'rechazada', 'pendiente']);
        $this->assertSame($expectedOutput, trim((string) $output));
        $this->assertSame($expectedStatus, $order->get_status());
        $this->assertSame(self::X_REF_PAYCO, $order->get_meta('refPayco'));
    }
}
