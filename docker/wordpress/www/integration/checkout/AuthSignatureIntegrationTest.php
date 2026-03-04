<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;

final class AuthSignatureIntegrationTest extends TestCase
{
    private const EPAYCO_CUSTOMER_ID = '627579';
    private const EPAYCO_SECRET_KEY = '170e3e02b3aa6086c6c020a25b1a7ff2e7c52585';
    private const X_REF_PAYCO = '101767484';
    private const X_TRANSACTION_ID = '48771874407066';
    private const X_AMOUNT = '76000';
    private const X_CURRENCY_CODE = 'COP';
    private const EXPECTED_SIGNATURE = '48fc4edbbce976abb44453386343ec27bebb66552e766d378bff01a95fbdc85a';

    public function test_auth_signature_matches_expected_value(): void
    {
        $reflection = new ReflectionClass(WC_Gateway_Epayco::class);
        $gateway = $reflection->newInstanceWithoutConstructor();
        $gateway->settings = [
            'epayco_customerid' => self::EPAYCO_CUSTOMER_ID,
            'epayco_secretkey' => self::EPAYCO_SECRET_KEY,
        ];

        $signature = $gateway->authSignature(
            self::X_REF_PAYCO,
            self::X_TRANSACTION_ID,
            self::X_AMOUNT,
            self::X_CURRENCY_CODE
        );

        $this->assertSame(self::EXPECTED_SIGNATURE, $signature);
    }
}