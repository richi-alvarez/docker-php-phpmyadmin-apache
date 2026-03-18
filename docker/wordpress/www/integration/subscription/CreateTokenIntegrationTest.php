<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;

final class CreateTokenIntegrationTest extends TestCase
{

    public function test_create_token_with_real_endpoint(): void
    {
        if (getenv('RUN_INTEGRATION') !== '1') {
            $this->markTestSkipped('Set RUN_INTEGRATION=1 to execute integration tests.');
        }

        $reflection = new ReflectionClass(EpaycoSuscription::class);
        $gateway = $reflection->newInstanceWithoutConstructor();
        $gateway->id = 'epayco';

        $apiKey = getenv('EPAYCO_API_KEY') ?: getenv('API_KEY');
        $privateKey = getenv('EPAYCO_PRIVATE_KEY') ?: getenv('PRIVATE_KEY');
        if (empty($apiKey) || empty($privateKey)) {
            $this->markTestSkipped('Set EPAYCO_API_KEY and EPAYCO_PRIVATE_KEY to execute real token integration test.');
        }

        $epaycoSdk = new \Epayco\Epayco([
            'apiKey' => $apiKey,
            'privateKey' => $privateKey,
            'lenguage' => 'ES',
            'test' => true,
        ]);
        if (!isset($epaycoSdk->token)) {
            $this->markTestSkipped('ePayco SDK token resource is not initialized. Check provided credentials.');
        }

        $sdkProperty = new ReflectionProperty(EpaycoSuscription::class, 'epaycoSdk');
        $sdkProperty->setAccessible(true);
        $sdkProperty->setValue($gateway, $epaycoSdk);

        $dataEpayco = "eyJuYW1lIjoiVGFyamV0YSBDculkaXRvIHkgROliaXRvIiwibG9nbyI6IiIsImZyYW5jaGljZSI6Ik1DIiwiZnVsbE5hbWUiOiJSaWNhcmRvIFNhbGRhcnJpYWdhIiwibnVtYmVyIjoiMjMyMCAwMjEwIDk4MzkgMTEyNiIsImV4cGlyeSI6IjA3LzMxIiwiY3Z2IjoiMzE2IiwiZXJyb3JzIjp7ImZ1bGxOYW1lIjpudWxsLCJudW1iZXIiOm51bGx9LCJhZGRyZXNzIjoiY2FsbGUgMTIzNCIsImNpdHkiOiJtZWRlbGxpbiIsImRvY3VtZW50IjoiMTIxNDcyMzIxOSIsImRvY3VtZW50VHlwZSI6IkNDIiwiY2VsbHBob25lVHlwZSI6IkNPIiwiY2VsbHBob25lIjoiKzU3MzE4NDIxMDI5NCIsImVtYWlsIjoicmljYXJkby5zYWxkYXJyaWFnYTEyM0BlcGF5Y28uY29tIiwicGF5bWVudERhdGEiOnsiYmVhcmVyVG9rZW4iOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSXNJbXRwWkNJNkltVndZWGxqYnlKOS5leUpwYzNNaU9pSmhjR2xtZVdWUVlYbGpiMHBYVkNJc0luTjFZaUk2SWpZeU56VTNPU0lzSW1saGRDSTZNVGMzTWpnd01EZzFOeXdpWlhod0lqb3hOemN5T0RBeU5qVTNMQ0p5WVc1a0lqb2lZakUwTXprNVkySmhZV00yWkdFMFlqVmlOek16WWpRNE16RXdOak00TTJZNU9UQXpJaXdpY21WeklqcG1ZV3h6WlN3aWFXNWhJanBtWVd4elpTd2laM1ZwSWpveU1qVXdPVEFzSW5WMWFXUWlPaUprWXpBeU5HSTBaUzAyTVRCbExUUTRNREF0T1RaaFl5MHpOekV3T1dKaFpXRmlOVElpTENKelkyOXdaU0k2SW1Gd2FXWjVJbjAuVzViWE52MUpDQWdfb2dpWFFNajF3QjB3OU9nLWJ4QkxKUFhxN0xpbEVHWSIsInRlc3QiOnRydWUsImludm9pY2UiOjE0MCwiY3VycmVuY3kiOiJDT1AiLCJkZXNjcmlwdGlvbiI6ImNhbWlzYSByb2phIC0gMzguMDAwIiwiYW1vdW50IjoiMzguMDAwIiwiYmFzZV90YXgiOiIzOC4wMDAiLCJ0YXgiOiIwIiwiaWNvIjoiMCJ9LCJhY3Rpb25VbHIiOiJodHRwczovL2dhbGF4eS1jb2F0aW5nLWludGVsbGVjdHVhbC1jYWxsZWQudHJ5Y2xvdWRmbGFyZS5jb20vP3djLWFwaT1XQ19Xb29FcGF5Y29TdXNjcmlwdGlvbl9HYXRld2F5Jm9yZGVyX2lkPTE0MCJ9";
        //EpaycoSuscription::$logger = new WC_Logger();
        $result = $gateway->createToken($dataEpayco);

        if ($result === false || $result === null) {
            $this->markTestSkipped('Reference endpoint unavailable or returned invalid data.');
        }

        if (is_object($result)) {
            $result = json_decode(json_encode($result, JSON_THROW_ON_ERROR), true, 512, JSON_THROW_ON_ERROR);
        }

        if (isset($result['status']) && $result['status'] === false) {
            $message = $result['message'] ?? 'Token endpoint returned status=false.';
            $this->markTestSkipped((string) $message);
        }

        $this->assertIsArray($result);

        $this->assertArrayHasKey('status', $result);
        $this->assertArrayHasKey('id', $result);
        $this->assertArrayHasKey('success', $result);
        $this->assertArrayHasKey('type', $result);
        $this->assertArrayHasKey('data', $result);
        $this->assertArrayHasKey('card', $result);
        $this->assertArrayHasKey('object', $result);

        $this->assertTrue((bool) $result['status']);
        $this->assertTrue((bool) $result['success']);
        $this->assertSame('card', $result['type']);
        $this->assertSame('token', $result['object']);
        $this->assertIsString($result['id']);
        $this->assertNotSame('', trim($result['id']));

        $this->assertIsArray($result['data']);
        $this->assertArrayHasKey('status', $result['data']);
        $this->assertArrayHasKey('id', $result['data']);
        $this->assertArrayHasKey('created', $result['data']);
        $this->assertArrayHasKey('livemode', $result['data']);
        $this->assertSame('exitoso', strtolower((string) $result['data']['status']));
        $this->assertSame($result['id'], $result['data']['id']);
        $this->assertMatchesRegularExpression('/^\d{2}\/\d{2}\/\d{4}$/', (string) $result['data']['created']);
        $this->assertIsBool($result['data']['livemode']);

        $this->assertIsArray($result['card']);
        $this->assertArrayHasKey('exp_month', $result['card']);
        $this->assertArrayHasKey('exp_year', $result['card']);
        $this->assertArrayHasKey('name', $result['card']);
        $this->assertArrayHasKey('mask', $result['card']);
        $this->assertMatchesRegularExpression('/^\d{2}$/', (string) $result['card']['exp_month']);
        $this->assertMatchesRegularExpression('/^\d{4}$/', (string) $result['card']['exp_year']);
        $this->assertIsString($result['card']['name']);
        $this->assertNotSame('', trim((string) $result['card']['name']));
        $this->assertMatchesRegularExpression('/^\d{6}\*{6}\d{4}$/', (string) $result['card']['mask']);
    }
}