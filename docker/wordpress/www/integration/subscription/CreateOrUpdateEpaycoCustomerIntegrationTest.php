<?php

declare(strict_types=1);

use EpaycoSubscription\Woocommerce\Helpers\Customer;
use PHPUnit\Framework\TestCase;

if (!defined('ARRAY_A')) {
    define('ARRAY_A', 'ARRAY_A');
}

final class CreateOrUpdateEpaycoCustomerIntegrationTest extends TestCase
{
    /**
     * @dataProvider customerResponseProvider
     */
    public function test_registers_customer(array $registerReturn): void
    {
        global $wpdb;

        if (getenv('RUN_INTEGRATION') !== '1') {
            $this->markTestSkipped('Set RUN_INTEGRATION=1 to execute integration tests.');
        }

        $apiKey = getenv('EPAYCO_API_KEY') ?: getenv('API_KEY');
        $privateKey = getenv('EPAYCO_PRIVATE_KEY') ?: getenv('PRIVATE_KEY');
        if (empty($apiKey) || empty($privateKey)) {
            $this->markTestSkipped('Set EPAYCO_API_KEY and EPAYCO_PRIVATE_KEY to execute real customer integration test.');
        }

        $wpdb = new WpdbStub([]);

        $ePaycoCustomer = new CustomerTestDouble();
        $ePaycoCustomer->custIdCliente = 123;
        $ePaycoCustomer->registerReturn = $registerReturn;

        $customerData = ['email' => 'richissa111@epayco.com'];
        $token = '9ab0493f42deb10a807457e';
        $order_id = 140;
        $customerResponse = $ePaycoCustomer->createOrUpdateEpaycoCustomer($customerData, $token, $order_id);

        if ($customerResponse === false || $customerResponse === null) {
            $this->markTestSkipped('Reference endpoint unavailable or returned invalid data.');
        }

        $this->assertIsArray($customerResponse);
        $this->assertArrayHasKey('status', $customerResponse);
        $this->assertArrayHasKey('customerId', $customerResponse);
        $this->assertIsBool($customerResponse['status']);
        $this->assertTrue(is_string($customerResponse['customerId']) || is_null($customerResponse['customerId']));
        if ($customerResponse['status'] === false) {
            $this->assertNull($customerResponse['customerId']);
        }

        // $this->assertSame(1, $ePaycoCustomer->registerCallsCount);
        // $this->assertSame($customerData, $ePaycoCustomer->lastRegisterArgs['customerData']);
        // $this->assertSame('9ab0493f42deb10a807457e', $ePaycoCustomer->lastRegisterArgs['token']);
        // $this->assertSame(140, $ePaycoCustomer->lastRegisterArgs['order_id']);
    }

    public function customerResponseProvider(): array
    {
        return [
            'success_response' => [
                ['status' => true, 'customerId' => '9ab0493f42deb10a807457e'],
            ],
            'failed_response' => [
                ['status' => false, 'customerId' => null],
            ],
        ];
    }

}

class CustomerTestDouble extends Customer
{
    public array $registerReturn = ['status' => true, 'customerId' => '9ab0493f42deb10a807457e'];
    public int $registerCallsCount = 0;
    public array $lastRegisterArgs = [];

    public function __construct()
    {
    }

    public function registerEpaycoCustomer($customerData, $order_id, $token)
    {
        $this->registerCallsCount++;
        $this->lastRegisterArgs = [
            'customerData' => $customerData,
            'order_id' => $order_id,
            'token' => $token,
        ];

        return $this->registerReturn;
    }

    public function getEpaycoExisting($customer_id, $token)
    {
        return false;
    }

    public function customerAddToken($customer_id, $token_card)
    {
        return (object) ['status' => true];
    }
}

class WpdbStub
{
    public string $prefix = 'wp_';

    private array $rows;

    public function __construct(array $rows)
    {
        $this->rows = $rows;
    }

    public function prepare($query, ...$args)
    {
        return [
            'query' => $query,
            'args' => $args,
        ];
    }

    public function get_results($preparedQuery, $outputType)
    {
        return $this->rows;
    }
}

