<?php

namespace Epayco\Payment\Request;

use Epayco\Payment\Response\CheckoutResponse;

class CheckoutRequest extends AbstractRequest
{

    public function getRequest()
    {
        return $this->parameters;
    }

    public function isSuccessful()
    {
        return isset($this->parameters['status']) && $this->parameters['status'] === 'success';
    }

    public function isRedirect()
    {
        return isset($this->parameters['redirect_url']);
    }

    public function isCancelled()
    {
        return isset($this->parameters['status']) && $this->parameters['status'] === 'cancelled';
    }

    public function getCode()
    {
        return isset($this->parameters['code']) ? $this->parameters['code'] : null;
    }

    public function getMessage()
    {
        return isset($this->parameters['message']) ? $this->parameters['message'] : null;
    }

    public function getResponse()
    {
        return $this->response;
    }

    public function getTransactionReference()
    {
        return isset($this->parameters['transaction_id']) ? $this->parameters['transaction_id'] : null;
    }

    public function sendData($data)
    {
        /*
            aqui realizar la creacion de sessionId del checkout
        */
        return $this->response = new CheckoutResponse($this, $data);
    }

    
}