<?php

namespace EpaycoSubscription\Woocommerce\Blocks;

use Automattic\WooCommerce\Blocks\Payments\Integrations\AbstractPaymentMethodType;
use EpaycoSubscription\Woocommerce\Gateways\AbstractGateway;
use EpaycoSubscription\Woocommerce\WoocommerceEpaycoSubscription;
use EpaycoSubscription\Woocommerce\Interfaces\EpaycoSubscriptionGatewayInterface;
use EpaycoSubscription\Woocommerce\Interfaces\EpaycoSubscriptionPaymentBlockInterface;
use EpaycoSubscription\Woocommerce\Helpers\Paths;
use Exception;

if (!defined('ABSPATH')) {
    exit;
}

abstract class AbstractBlock extends AbstractPaymentMethodType implements EpaycoSubscriptionPaymentBlockInterface
{
    public const ACTION_SESSION_KEY = 'epaycosuscription_blocks_action';

    public const GATEWAY_SESSION_KEY = 'epaycosuscription_blocks_gateway';

    public const CHOSEN_PM_SESSION_KEY = 'chosen_payment_method';

    public const UPDATE_CART_NAMESPACE = 'epaycosuscription_blocks_update_cart';
    protected $name = '';
    protected $scriptName = '';

    protected $settings = [];

    protected WoocommerceEpaycoSubscription $epaycosuscription;

    /**
     * @var EpaycoSubscriptionGatewayInterface|null
     */
    protected $gateway;

    /**
     * AbstractBlock constructor
     */
    public function __construct()
    {
        global $epaycosuscription;

        $this->epaycosuscription = $epaycosuscription;
        $this->gateway     = $this->setGateway();

        $this->epaycosuscription->hooks->blocks->registerBlocksEnqueueCheckoutScriptsBefore([$this, 'resetCheckoutSession']);
        $this->epaycosuscription->hooks->blocks->registerBlocksUpdated(self::UPDATE_CART_NAMESPACE, [$this, 'updateCartToRegisterDiscountAndCommission']);
    }

    /**
     * Deletes session data
     *
     * @return void
     */
    public function resetCheckoutSession()
    {
        $this->epaycosuscription->helpers->session->deleteSession(self::ACTION_SESSION_KEY);
        $this->epaycosuscription->helpers->session->deleteSession(self::GATEWAY_SESSION_KEY);
        $this->epaycosuscription->helpers->session->deleteSession(self::CHOSEN_PM_SESSION_KEY);
    }

    /**
     * Initializes the payment method type
     *
     * @return void
     */
    public function initialize()
    {
        $this->settings = get_option("woocommerce_{$this->name}_settings", []);
    }

    /**
     * Returns if this payment method should be active
     *
     * @return boolean
     */
    public function is_active(): bool
    {
        return isset($this->gateway) && $this->gateway->isAvailable();
    }

    /**
     * Returns an array of scripts/handles to be registered for this payment method
     *
     * @return array
     */
    public function get_payment_method_script_handles(): array
    {
        if (!$this->gateway) {
            return [];
        }

        $scriptName = sprintf('wc_epaycosubscription_%s_blocks', $this->scriptName);
        $scriptPath = $this->epaycosuscription->helpers->url->getPluginFileUrl("build/$this->scriptName.block.js");
        $assetPath  = Paths::buildPath("$this->scriptName.block.asset.php");
        $asset      = file_exists($assetPath) ? require $assetPath : [];

        $this->gateway->registerCheckoutScripts();
        /*$this->epaycosuscription->hooks->scripts->registerPaymentBlockStyle(
            'wc_epaycosubscription_checkout_components',
            $this->epaycosuscription->helpers->url->getCssAsset('checkouts/ep-plugins-components')
        );*/
        $this->epaycosuscription->hooks->scripts->registerPaymentBlockScript($scriptName, $scriptPath, $asset['version'] ?? '', $asset['dependencies'] ?? []);
        return [$scriptName];
    }

    /**
     * Returns an array of key=>value pairs of data made available to the payment methods script
     *
     * @return array
     */
    public function get_payment_method_data(): array
    {
        return [
            'title'       => $this->get_setting('title'),
            'description' => $this->get_setting('description'),
            'supports'    => $this->get_supported_features(),
            'params'      => $this->getScriptParams(),
        ];
    }

/**
* Set selected gateway from blocks on session and update WC_Cart
*
* @param mixed $data
*
* @return void
*/
    public function updateCartToRegisterDiscountAndCommission($data)
    {
        $action  = $data['action'] ?? '';
        $gateway = $data['gateway'] ?? '';

        if (empty($action) || empty($gateway)) {
            return;
        }

        $this->epaycosuscription->helpers->session->setSession(self::ACTION_SESSION_KEY, $action);
        $this->epaycosuscription->helpers->session->setSession(self::GATEWAY_SESSION_KEY, $gateway);

    }

    /**
     * Returns an array of supported features
     *
     * @return array
     */
    public function get_supported_features(): array
    {
        return isset($this->gateway) ? $this->gateway->supports : [];
    }

    /**
     * Set block payment gateway
     *
     * @return ?AbstractGateway
     */
    public function setGateway(): ?AbstractGateway
    {
        $payment_gateways_class = WC()->payment_gateways();
        $payment_gateways       = $payment_gateways_class->payment_gateways();

        return $payment_gateways[ $this->name ] ?? null;
    }

    /**
     * Set payment block script params
     *
     * @return array
     */
    public function getScriptParams(): array
    {
        return [];
    }



}