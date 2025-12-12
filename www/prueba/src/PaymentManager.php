<?php

namespace Epayco\Payment;

use Epayco\Payment\Payments\PaymentMethodManager;
use Epayco\Payment\Gateway\Gateway;
use Epayco\Payment\Payments\ResponseInterface;
use Epayco\Payment\Request\RequestInterface;

class PaymentManager
{
    protected PaymentMethodManager $manager;
    protected array $config;

    public function __construct(array $config = [], string $paymentMethodId)
    {
        $this->config = $config;
        $this->manager = new PaymentMethodManager();

        // Registrar el creador por defecto para epayco
        $factoryConfig = $this->config;
        $this->manager->register($paymentMethodId, function(array $cfg = []) use ($factoryConfig) {
            $merged = array_merge($factoryConfig, $cfg);
            $class = $merged['paymentMethodClass'];
            $gatewayClass = $merged['gatewayClass'];
            if (!class_exists($class)) {
                throw new \RuntimeException("Payment method class not found: {$class}");
            }

            return new $class($gatewayClass, $merged);
        });
    }

    public function getManager(): PaymentMethodManager
    {
        return $this->manager;
    }

    public function processPayload(string $methodId, array $params): array
    {
        $method = $this->manager->get($methodId, $this->config);
        $method->validate($params);
        $method->buildPayload($params);
        return $method->getPayload();
    }

    public function send(string $methodId, array $params): RequestInterface
    {
        $method = $this->manager->get($methodId, $this->config);
        $method->validate($params);
        $method->buildPayload($params);
        $payload = $method->getPayload();
        return $method->send($this->config['requestClass'],$this->config);
    }
}