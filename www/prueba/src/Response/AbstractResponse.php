<?php

namespace Epayco\Payment\Response;
use Epayco\Payment\Response\ResponseInterface;
use Epayco\Payment\Request\RequestInterface;
abstract class AbstractResponse implements ResponseInterface
{
     /**
     * The embodied request object.
     *
     * @var RequestInterface
     */
    protected $request;

    /**
     * The data contained in the response.
     *
     * @var mixed
     */
    protected $data;

    /**
     * Constructor
     *
     * @param RequestInterface $request the initiating request.
     * @param mixed $data
     */
    public function __construct(RequestInterface $request, $data)
    {
        $this->request = $request;
        $this->data = $data;
    }

    public function getData(): array
    {
        return $this->data;
    }
}