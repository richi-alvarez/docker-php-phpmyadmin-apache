<?php

namespace Epayco\Payment\Request;
use Epayco\Payment\Payments\MessageInterface;
use Epayco\Payment\Response\ResponseInterface;
/**
 * Request Interface
 *
 * This interface class defines the standard functions that any Omnipay response
 * interface needs to be able to provide.  It is an extension of MessageInterface.
 *
 */
interface RequestInterface extends MessageInterface
{
    /**
     * Get the original request which generated this response
     *
     * @return RequestInterface
     */
    public function getRequest();

    /**
     * Is the response successful?
     *
     * @return boolean
     */
    public function isSuccessful();

    /**
     * Does the response require a redirect?
     *
     * @return boolean
     */
    public function isRedirect();

    /**
     * Is the transaction cancelled by the user?
     *
     * @return boolean
     */
    public function isCancelled();

    /**
     * Response Message
     *
     * @return null|string A response message from the payment gateway
     */
    public function getMessage();

    /**
     * Response code
     *
     * @return null|string A response code from the payment gateway
     */
    public function getCode();

    /**
     * Gateway Reference
     *
     * @return null|string A reference provided by the gateway to represent this transaction
     */
    public function getTransactionReference();

    /**
     * Get the response to this request (if the request has been sent)
     *
     * @return ResponseInterface
     */
    public function getResponse();

    /**
     * Send the request
     *
     * @return ResponseInterface
     */
    public function send(): ResponseInterface;

    /**
     * Send the request with specified data
     *
     * @param  mixed             $data The data to send
     * @return ResponseInterface
     */
    public function sendData($data);
}
