<?php

namespace Epayco\Payment\Gateway;

use Epayco\Payment\Response\CheckoutResponse;

class CheckoutGateway extends Gateway
{
    public function getName(): string
    {
        return 'Epayco Checkout Gateway';
    }

    public function getShortName(): string
    {
        return 'EpaycoCheckout';
    }

    public function getDefaultParameters(): array
    {
        return array_merge(parent::getDefaultParameters(), [
            'checkoutMode' => 'standard', // standard or custom
        ]);
    }

    public function setPublickKey(string $key): self
    {
        return $this->setParameter('publicKey', $key);
    }

    public function getPublickKey(): string
    {
        return $this->getParameter('publicKey');
    }

    public function setPrivateKey(string $key): self
    {
        return $this->setParameter('privateKey', $key);
    }
    public function getPrivateKey(): string
    {
        return $this->getParameter('privateKey');
    }

    public function getCheckoutMode(): string
    {
        return $this->getParameter('checkoutMode');
    }

    public function setCheckoutMode(string $mode): self
    {
        return $this->setParameter('checkoutMode', $mode);
    }

    public function setSessionId(string $sessionId): self
    {
        return $this->setParameter('sessionId', $sessionId);
    }

    public function getSessionId(): string
    {
        return $this->getParameter('sessionId');
    }

    public function supports(string $gateway): bool
    {
        return $gateway === 'EpaycoCheckout';
    }
    

    public function buildPayload(array $params): array
    {
        // mapear valores con defaults
        $description = $params['description'] ?? '';
        $orderId = (string)($params['order_id'] ?? '');
        $currency = $params['currency'] ?? ($this->config['currency'] ?? 'COP');
        $amount = $this->formatAmount($params['amount'] ?? 0);
        $baseTax = isset($params['taxBase']) ? $this->formatAmount($params['taxBase']) : 0.0;
        $tax = isset($params['tax']) ? $this->formatAmount($params['tax']) : 0.0;
        $ico = isset($params['taxIco']) ? $this->formatAmount($params['taxIco']) : 0.0;
        $country = $params['country'] ?? ($this->config['country'] ?? 'CO');
        $lang = $params['lang'] ?? ($this->config['lang'] ?? 'es');
        $confirm = $params['confirm_url'] ?? ($params['confirmation'] ?? '');
        $response = $params['redirect_url'] ?? ($params['response'] ?? '');
        $billing = $params['billing'] ?? [
            'name' => $params['billing_name'] ?? '',
            'address' => $params['billing_address'] ?? '',
            'email' => $params['billing_email'] ?? '',
            'mobilePhone' => $params['billing_phone'] ?? '',
        ];
        $autoclick = $params['autoclick'] ?? true;
        $ip = $params['ip'] ?? ($this->config['ip'] ?? null);
        $testMode = $params['test'] ?? $this->isTestMode();
        $extras = $params['extras'] ?? ['extra1' => $orderId];
        $extrasEpayco = $params['extrasEpayco'] ?? $this->config['extrasEpayco'] ?? ['extra5' => 'P200'];
        $epaycoMethodsDisable = $params['epaycoMethodsDisable'] ?? [];
        $method = $params['method'] ?? 'POST';
        $checkoutVersion = $params['checkout_version'] ?? '2';
        $autoClick = $params['autoClick'] ?? false;
        $noRedirectOnClose = $params['noRedirectOnClose'] ?? true;
        $forceResponse = $params['forceResponse'] ?? false;
        $uniqueTransactionPerBill = $params['uniqueTransactionPerBill'] ?? false;

        $payload = [
            'name' => $description,
            'description' => $description,
            'invoice' => $orderId,
            'currency' => $currency,
            'amount' => (float)$amount,
            'taxBase' => (float)$baseTax,
            'tax' => (float)$tax,
            'taxIco' => (float)$ico,
            'country' => $country,
            'lang' => $lang,
            'confirmation' => $confirm,
            'response' => $response,
            'billing' => [
                'name' => $billing['name'] ?? '',
                'address' => $billing['address'] ?? '',
                'email' => $billing['email'] ?? '',
                'mobilePhone' => $billing['mobilePhone'] ?? '',
            ],
            'autoclick' => (bool)$autoclick,
            'ip' => $ip,
            'test' => (bool)$testMode,
            'extras' => (array)$extras,
            'extrasEpayco' => (array)$extrasEpayco,
            'epaycoMethodsDisable' => (array)$epaycoMethodsDisable,
            'method' => $method,
            'checkout_version' => $checkoutVersion,
            'autoClick' => (bool)$autoClick,
            'noRedirectOnClose' => (bool)$noRedirectOnClose,
            'forceResponse' => (bool)$forceResponse,
            'uniqueTransactionPerBill' => (bool)$uniqueTransactionPerBill,
        ];
        return $payload;
    }

    
    /**
     * Merge de extras garantizando la estructura correcta.
     */
    protected function mergeExtras(array $payload, array $extras = []): array
    {
        if (!isset($payload['extras']) || !is_array($payload['extras'])) {
            $payload['extras'] = [];
        }

        $payload['extras'] = array_merge($payload['extras'], $extras);

        return $payload;
    }

     /**
     * Formatea el monto a float con 2 decimales.
     */
    protected function formatAmount($amount): float
    {
        return (float) number_format((float)$amount, 2, '.', '');
    }

}