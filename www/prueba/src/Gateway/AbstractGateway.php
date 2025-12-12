<?php

namespace Epayco\Payment\Gateway;

use Epayco\Payment\Payments\ResponseInterface;
use Epayco\Payment\Request\RequestInterface;

abstract class AbstractGateway implements GatewayInterface
{
    use ParametersTrait {
        setParameter as traitSetParameter;
        getParameter as traitGetParameter;
    }

    protected array $config;

    /**
     * An associated ResponseInterface.
     *
     * @var ResponseInterface
     */
    protected $response;

    public function __construct(array $config = [])
    {
        $this->config = $config;
        $this->initialize($config);
    }

    public function getConfig(): array
    {
        return $this->config;
    }

    public function initialize(array $parameters = []): self
    {
        if (null !== $this->response) {
            throw new RuntimeException('Request cannot be modified after it has been sent!');
        }
        foreach ($parameters as $key => $value) {
            $this->setParameter($key, $value);
        }
        return $this;
    }

    public function getDefaultParameters(): array
    {
        return [];
    }

    public function getParameters(): array
    {
        return $this->parameters;
    }

    public function getShortName(): string
    {
        return (new \ReflectionClass($this))->getShortName();
    }

    public function getName(): string
    {
        return $this->getShortName();
    }

    public function setParameter(string $key, $value): self
    {
        if (null !== $this->response) {
            throw new RuntimeException('Request cannot be modified after it has been sent!');
        }
        $this->traitSetParameter($key, $value);
        return $this;
    }

    public function getParameter(string $key)
    {
        return $this->traitGetParameter($key);
    }

    public function getTestMode(): bool
    {
        return (bool) $this->getParameter('testMode');
    }


    public function createRequest(string $class, array $parameters = []): RequestInterface  
    {
 
        $obj = new $class($parameters);
        if (!is_object($obj)) {
            throw new \InvalidArgumentException("Class $class is not a valid request class.");
        }
        if (method_exists($obj, 'initialize')) {
            $obj->initialize(array_merge($this->getParameters(), $parameters));
        }
        return $obj;
    }
    
}

