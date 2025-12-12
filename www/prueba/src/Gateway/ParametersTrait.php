<?php

namespace Epayco\Payment\Gateway;

trait ParametersTrait
{
    protected array $parameters = [];

    public function setParameter(string $key, $value): self
    {
        $this->parameters[$key] = $value;
        return $this;
    }

    public function getParameter(string $key)
    {
        return $this->parameters[$key] ?? null;
    }

    public function getParameters(): array
    {
        return $this->parameters;
    }

    public function initialize(array $parameters = []): self
    {
        foreach ($parameters as $key => $value) {
            $this->setParameter($key, $value);
        }
        return $this;
    }

    public function getDefaultParameters(): array
    {
        return [];
    }

    public function getTestMode(): bool
    {
        return (bool) $this->getParameter('testMode');
    }

    public function validate(array $requiredParameters): void
    {
        foreach ($requiredParameters as $param) {
            if ($this->getParameter($param) === null) {
                throw new \InvalidArgumentException("The parameter '$param' is required.");
            }
        }
    }   
}