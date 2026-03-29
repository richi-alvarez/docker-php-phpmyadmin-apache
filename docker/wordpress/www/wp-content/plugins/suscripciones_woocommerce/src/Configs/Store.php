<?php

namespace EpaycoSubscription\Woocommerce\Configs;

use EpaycoSubscription\Woocommerce\Gateways\AbstractGateway;
use EpaycoSubscription\Woocommerce\Hooks\Options;


if (!defined('ABSPATH')) {
    exit;
}

class Store
{
    private const GATEWAY_TITLE = 'title';

    private const EXECUTE_ACTIVATED_PLUGIN = '_ep_execute_activate';

    private const EXECUTE_AFTER_UPDATE = '_ep_execute_after_update';

    private array $availablePaymentGateways = [];

    private Options $options;

    /**
     * Store constructor
     *
     * @param Options $options
     */
    public function __construct(Options $options)
    {
        $this->options = $options;
    }


    /**
     * @return bool
     */
    public function getExecuteActivate(): bool
    {
        return (bool) $this->options->get(self::EXECUTE_ACTIVATED_PLUGIN);
    }

    /**
     * @param string $execute
     */
    public function setExecuteActivate(bool $execute): void
    {
        $this->options->set(self::EXECUTE_ACTIVATED_PLUGIN, (int) $execute);
    }

    public function getExecuteAfterPluginUpdate(): bool
    {
        return (bool) $this->options->get(self::EXECUTE_AFTER_UPDATE);
    }

    public function setExecuteAfterPluginUpdate(bool $execute): void
    {
        $this->options->set(self::EXECUTE_AFTER_UPDATE, (int) $execute);
    }

        /**
     * @return array<string>
     */
    public function getAvailablePaymentGateways(): array
    {
        return $this->availablePaymentGateways;
    }

    /**
     * @param string $paymentGateway
     */
    public function addAvailablePaymentGateway(string $paymentGateway): void
    {
        if (!in_array($paymentGateway, $this->availablePaymentGateways, true)) {
            $this->availablePaymentGateways[] = $paymentGateway;
        }
    }

    /**
     * @param AbstractGateway $gateway
     * @param $default
     *
     * @return mixed|string
     */
    public function getGatewayTitle(AbstractGateway $gateway, $default)
    {
        return $this->options->getGatewayOption($gateway, self::GATEWAY_TITLE, $default);
    }
}