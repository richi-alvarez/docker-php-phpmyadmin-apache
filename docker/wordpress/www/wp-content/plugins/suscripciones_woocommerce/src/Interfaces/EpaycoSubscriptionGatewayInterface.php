<?php

namespace EpaycoSubscription\Woocommerce\Interfaces;


if (!defined('ABSPATH')) {
    exit;
}

interface EpaycoSubscriptionGatewayInterface
{
    /**
     * @return void
     */
    public function init_form_fields(): void;

    /**
     * @param string $gatewaySection
     * @return void
     */
    public function payment_scripts(string $gatewaySection): void;

    /**
     * @return void
     */
    public function payment_fields(): void;

    /**
     * @return bool
     */
    public function validate_fields(): bool;

    /**
     * @param $order_id
     *
     * @return array
     */
    public function process_payment($order_id): array;

    /**
     * @return array
     */
    public function webhook(): array;

    /**
     * @return array
     */
    public function getPaymentFieldsParams(): array;

    /**
     * @return void
     */
    public function registerCheckoutScripts(): void;

    /**
     * @return bool
     */
    public static function isAvailable(): bool;
}