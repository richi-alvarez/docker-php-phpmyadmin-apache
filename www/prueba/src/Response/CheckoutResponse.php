<?php

namespace Epayco\Payment\Response;
use Epayco\Payment\Response\AbstractResponse;

class CheckoutResponse extends AbstractResponse
{
    public function isSuccessful(): bool
    {
        return isset($this->data['status']) && $this->data['status'] === 'success';
    }

    public function getMessage(): ?string
    {
        return $this->data['message'] ?? null;
    }

    public function getTransactionReference(): ?string
    {
        return $this->data['transaction_reference'] ?? null;
    }

    public function isRedirect(): bool
    {
        return false;
    }

    public function isCancelled(): bool
    {
        return isset($this->data['status']) && $this->data['status'] === 'cancelled';
    }

    public function getCode(): ?string
    {
        return $this->data['code'] ?? null;
    }

    public function getRequest()
    {
        // Implementación según sea necesario
        return $this->data;
    }

    public function getPayload()
    {
        return $this->data['payload'] ?? null;
    }
}