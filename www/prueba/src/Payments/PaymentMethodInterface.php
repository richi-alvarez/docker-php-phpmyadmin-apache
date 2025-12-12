<?php

namespace Epayco\Payment\Payments;

use Epayco\Payment\Request\RequestInterface;

interface PaymentMethodInterface
{
    public function validate(array $params): void; 
    public function buildPayload(array $params): void;
    public function getPayload(): array;
    public function send(string $className, array $payload): RequestInterface; 
    public function supports(string $gateway): bool;
}
