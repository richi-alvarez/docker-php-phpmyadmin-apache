<?php

namespace Epayco\Payment\Request;

use Epayco\Payment\Response\ResponseInterface;
use RuntimeException;

abstract class AbstractRequest implements RequestInterface
{

    protected array $parameters = [];

     /**
     * An associated ResponseInterface.
     *
     * @var ResponseInterface
     */
    protected $response;

    public function __construct(array $parameters = [])
    {
        $this->setData($parameters);
        //$this->initialize( $parameters);
    }

    /**
     * Initialize the object with parameters.
     *
     * If any unknown parameters passed, they will be ignored.
     *
     * @param array $parameters An associative array of parameters
     *
     * @return $this
     * @throws RuntimeException
     */
    public function initialize(array $parameters = []): self
    {
        if (null !== $this->response) {
            throw new RuntimeException('Request cannot be modified after it has been sent!');
        }

        $this->parameters = $parameters;
        return $this;
    }


    public function getData(): array
    {
        return $this->parameters;
    }
    
    public function setData(array $data): void
    {
        $this->parameters = $data;
    }

    public function send(): ResponseInterface
    {
        return $this->sendData($this->getData());
    }
}