<?php

namespace EpaycoSubscription\Woocommerce\Helpers;

use EpaycoSubscription\Woocommerce\Configs\Store;

if (!defined('ABSPATH')) {
    exit;
}

class Gateways
{
    private Store $store;

    /**
     * Gateways constructor
     *
     * @param Store $store
     */
    public function __construct(Store $store)
    {
        $this->store     = $store;
    }

    public function registerThankYouPage(string $id, $callback): void
    {
        add_action('woocommerce_thankyou_' . $id, $callback);
    }

    /**
     * Determines if there are currently enabled payment gateways
     *
     * @return array
     */
    public function getEnabledPaymentGateways(): array
    {
        $enabledPaymentGateways = array();
        $paymentGateways = $this->store->getAvailablePaymentGateways();
        foreach ($paymentGateways as $gateway) {
            $gateway = new $gateway();

            if (isset($gateway->settings['enabled']) && 'yes' === $gateway->settings['enabled']) {
                $enabledPaymentGateways[] = $gateway->id;
            }
        }

        return $enabledPaymentGateways;
    }
}