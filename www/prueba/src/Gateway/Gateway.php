<?php

namespace Epayco\Payment\Gateway;

use Epayco\Payment\Request\RequestInterface;

class Gateway extends AbstractGateway
{
    // Implementación específica del gateway puede ir aquí
    public function __construct(array $config = [])
    {
        parent::__construct($config);
    }

    public function setParameter(string $key, $value): self
    {
        return parent::setParameter($key, $value);
    }

    public function getParameter(string $key)
    {
        return parent::getParameter($key);
    }

    public function createRequest(string $class, array $parameters = []): RequestInterface
    {
        return parent::createRequest($class, $parameters);
    }

    public function getName(): string
    {
        return parent::getName();
    }

    public function getShortName(): string
    {
        return parent::getShortName();
    }

    public function getDefaultParameters(): array
    {
        return parent::getDefaultParameters();
    }

    public function getParameters(): array
    {
        return parent::getParameters();
    }

    public function ProccessPayment(array $params): object
    {
        // Lógica para procesar el pago
        return  $this->createRequest($this->config['paymentMethodClass']."ProccessPayment", $params);
    }

    public function send(string $className, array $params): RequestInterface
    {
        // Lógica para enviar el pago
        return  $this->createRequest($className, $params);
    }


}