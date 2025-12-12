<?php

namespace Epayco\Payment\Payments;

use InvalidArgumentException;

/**
 * Factory simple y extensible para crear métodos de pago.
 *
 * Registro:
 *  $factory->register('epayco', function(array $config){ return new EpaycoMethod($config); });
 */
class PaymentMethodFactory
{
    /**
     * @var array<string, callable> Map de id => creator callable
     */
    protected array $map = [];

    /**
     * @var array<string, PaymentMethodInterface> Instancias creadas (cache)
     */
    protected array $instances = [];

    public function __construct(array $map = [])
    {
        $this->map = $map;
    }

    /**
     * Registrar un creador para un método de pago.
     * El creador debe ser callable: function(array $config): PaymentMethodInterface
     */
    public function register(string $id, callable $creator): self
    {
        $this->map[$id] = $creator;

        return $this;
    }

    /**
     * Crea (o devuelve cached) una instancia de PaymentMethodInterface para el id dado.
     * Lanzará InvalidArgumentException si no existe un creador registrado.
     *
     * @throws InvalidArgumentException
     */
    public function create(string $id, array $config = []): PaymentMethodInterface
    {
        if (isset($this->instances[$id])) {
            return $this->instances[$id];
        }

        if (!isset($this->map[$id])) {
            throw new InvalidArgumentException("Unknown payment method: {$id}");
        }

        $creator = $this->map[$id];

        if (!is_callable($creator)) {
            throw new InvalidArgumentException("Creator for payment method '{$id}' is not callable");
        }

        $instance = $creator($config);

        if (!$instance instanceof PaymentMethodInterface) {
            throw new InvalidArgumentException("Creator for payment method '{$id}' must return an instance of PaymentMethodInterface");
        }

        $this->instances[$id] = $instance;

        return $instance;
    }

    public function has(string $id): bool
    {
        return isset($this->map[$id]);
    }

    /**
     * Lista los IDs registrados.
     *
     * @return string[]
     */
    public function list(): array
    {
        return array_keys($this->map);
    }
}
