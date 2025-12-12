<?php

namespace Epayco\Payment\Payments;

use Epayco\Payment\Request\RequestInterface;
use InvalidArgumentException;

abstract class AbstractPaymentMethod implements PaymentMethodInterface
{
    protected array $config;

    public function __construct(array $config = [])
    {
        $this->config = $config;
    }

    public function getConfig(): array
    {
        return $this->config;
    }

    public function setConfig(array $config): self
    {
        $this->config = $config;

        return $this;
    }


    /**
     * Validación por defecto: no hace nada. Las implementaciones concretas deben usar ensureRequired
     * o lanzar InvalidArgumentException cuando falten parámetros obligatorios.
     */
    public function validate(array $params): void
    {
        // Implementaciones concretas deben validar los campos que necesiten
    }

    /**
     * Devuelve el payload construido para el gateway. Implementado por cada método concreto.
     */
    abstract public function getPayload(): array;

    /**
     * Construye el payload para el gateway. Implementado por cada método concreto.
     */
    abstract public function buildPayload(array $params): void;

    /**
     * Envía el payload al gateway y devuelve una ResponseInterface.
     * Implementado por cada método concreto.
     */
    abstract public function send(string $className, array $payload): RequestInterface;

    /**
     * Indica si el método soporta el gateway solicitado. Por defecto true.
     */
    public function supports(string $gateway): bool
    {
        return true;
    }

    /**
     * Formatea el monto a float con 2 decimales.
     */
    protected function formatAmount($amount): float
    {
        return (float) number_format((float)$amount, 2, '.', '');
    }

    /**
     * Asegura que los parámetros obligatorios existan en el array.
     * Lanzará InvalidArgumentException si falta alguno.
     */
    protected function ensureRequired(array $params, array $required): void
    {
        foreach ($required as $key) {
            if (!isset($params[$key]) || $params[$key] === '') {
                throw new InvalidArgumentException("Missing required parameter: {$key}");
            }
        }
    }

}