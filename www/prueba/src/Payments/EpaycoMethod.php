<?php

namespace Epayco\Payment\Payments;

use Epayco\Payment\Gateway\Gateway;
use Epayco\Payment\Request\RequestInterface;

/**
 * Implementación concreta para Epayco que construye el payload con la estructura solicitada.
 * Esta clase almacena el gateway y utiliza sus parámetros para recuperar/guardar el payload.
 */
class EpaycoMethod extends AbstractPaymentMethod
{
    protected Gateway $gateway;

    public function __construct(Gateway $gateway, array $config = [])
    {
        $this->gateway = $gateway;
        parent::__construct($config);
    }

    public function supports(string $gateway): bool
    {
        return in_array(strtolower($gateway), ['epayco', 'epayco_card', 'epayco_checkout']);
    }

    public function validate(array $params): void
    {
        // validar campos esenciales
        $required = [
            'description',
            'order_id',
            'currency',
            'amount',
            'confirm_url',
            'redirect_url',
            'billing'
        ];

        $this->ensureRequired($params, $required);

        // billing must be array with required fields
        if (!is_array($params['billing'])) {
            throw new \InvalidArgumentException('billing must be an array');
        }

        $this->ensureRequired($params['billing'], ['name', 'address', 'email', 'mobilePhone']);
    }

    public function getPayload(): array
    {
        $raw = $this->gateway->getParameter("payload");
        if (!$raw) {
            return [];
        }
        $data = json_decode($raw, true);
        return is_array($data) ? $data : [];
    }

    public function buildPayload(array $params): void
    {
        // mapear valores con defaults
        
        $payload = $this->gateway->buildPayload($params);
        $this->gateway->setParameter("payload", json_encode($payload));
    }

    public function send(string $classname, array $payload): RequestInterface
    {
        // Aquí se debería integrar con el flujo Epayco existente.
        // Por ahora devolvemos un array convertido en Response compatible con Epayco\Message\Response

        if (!class_exists($classname)) {
            throw new \RuntimeException("Response class not found: {$responseClass}");
        }
        
        return $this->gateway->send($classname, $payload);

        
    }

    
}
