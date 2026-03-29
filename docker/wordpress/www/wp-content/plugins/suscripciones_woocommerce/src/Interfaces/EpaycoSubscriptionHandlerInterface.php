<?php

namespace EpaycoSubscription\Woocommerce\Interfaces;

if (!defined('ABSPATH')) {
    exit;
}

interface EpaycoSubscriptionHandlerInterface
{
    /**
     * @return null
     */
    public function validateCustomer(array $customerData, string $token, string $custIdCliente);
}