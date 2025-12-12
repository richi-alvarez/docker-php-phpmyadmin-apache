<?php

namespace Epayco\Payment\Payments;

use InvalidArgumentException;

/**
 * Registry / manager de métodos de pago.
 * Permite registrar creadores (callable) o instancias y obtenerlas bajo demanda.
 */
class PaymentMethodManager
{
    /** @var array<string, callable|PaymentMethodInterface> */
    protected array $registry = [];

    /** @var array<string, PaymentMethodInterface> Cached instances */
    protected array $instances = [];

    /**
     * Registra un método de pago. El $creator puede ser una instancia de PaymentMethodInterface
     * o un callable: function(array $config = []) : PaymentMethodInterface
     */
    public function register(string $id, $creator): self
    {
        if (!is_callable($creator) && !$creator instanceof PaymentMethodInterface) {
            throw new InvalidArgumentException('Creator must be a callable or instance of PaymentMethodInterface');
        }

        $this->registry[$id] = $creator;

        return $this;
    }

    /**
     * Desregistra un método de pago
     */
    public function unregister(string $id): self
    {
        unset($this->registry[$id], $this->instances[$id]);

        return $this;
    }

    /**
     * Verifica si existe un método registrado
     */
    public function has(string $id): bool
    {
        return isset($this->registry[$id]);
    }

    /**
     * Obtiene una instancia de PaymentMethodInterface.
     * Si se registró un callable, se invoca con $config la primera vez y se cachea la instancia.
     * Si se registró una instancia, se devuelve tal cual (ignorando $config).
     *
     * @throws InvalidArgumentException
     */
    public function get(string $id, array $config = []): PaymentMethodInterface
    {
        if (isset($this->instances[$id])) {
            return $this->instances[$id];
        }

        if (!isset($this->registry[$id])) {
            throw new InvalidArgumentException("Payment method not registered: {$id}");
        }

        $creator = $this->registry[$id];

        if ($creator instanceof PaymentMethodInterface) {
            $this->instances[$id] = $creator;
            return $creator;
        }

        if (is_callable($creator)) {
            $instance = $creator($config);
            if (!$instance instanceof PaymentMethodInterface) {
                throw new InvalidArgumentException("Creator for '{$id}' must return PaymentMethodInterface");
            }
            $this->instances[$id] = $instance;
            return $instance;
        }

        throw new InvalidArgumentException('Invalid creator registered');
    }

    /**
     * Lista ids registrados
     *
     * @return string[]
     */
    public function list(): array
    {
        return array_keys($this->registry);
    }

    /**
     * Devuelve todas las instancias ya creadas
     *
     * @return PaymentMethodInterface[]
     */
    public function getInstances(): array
    {
        return $this->instances;
    }
}
