<?php

namespace EpaycoSubscription\Woocommerce;

use EpaycoSubscription\Woocommerce\Hooks\Plugin;
use EpaycoSubscription\Woocommerce\Configs\Store;
use EpaycoSubscription\Woocommerce\Hooks\Admin;
use EpaycoSubscription\Woocommerce\Hooks\Blocks;
use EpaycoSubscription\Woocommerce\Hooks\Checkout;
use EpaycoSubscription\Woocommerce\Hooks\Endpoints;
use EpaycoSubscription\Woocommerce\Hooks\Scripts;
use EpaycoSubscription\Woocommerce\Hooks\Gateway;
use EpaycoSubscription\Woocommerce\Hooks\Options;
use EpaycoSubscription\Woocommerce\Helpers\Session;
use EpaycoSubscription\Woocommerce\Helpers\Strings;
use EpaycoSubscription\Woocommerce\Hooks\Template;
use EpaycoSubscription\Woocommerce\Helpers\Gateways;
use EpaycoSubscription\Woocommerce\Helpers\Url;
use EpaycoSubscription\Woocommerce\Funnel\Funnel;
use WooCommerce;
class Dependencies
{
    public WooCommerce $woocommerce;
    public Admin $adminHook;
    public Blocks $blocksHook;
    public Checkout $checkoutHook;
    public Endpoints $endpointsHook;

    public Store $storeConfig;
    public Session $sessionHelper;
    public Strings $stringsHelper;
    public Scripts $scriptsHook;
    public Template $templateHook;
    public Gateway $gatewayHook;
    public Plugin $pluginHook;

    public Url $urlHelper;

    public Hooks $hooks;

    public Helpers $helpers;

    public Gateways $gatewaysHelper;

    public Options $optionsHook;

    public Funnel $funnel;

    /**
     * Dependencies constructor
     */
    public function __construct()
    {
        global $woocommerce;

        $this->woocommerce             = $woocommerce;
        $this->adminHook               = new Admin();
        $this->blocksHook              = new Blocks();
        $this->endpointsHook           = new Endpoints();
        $this->optionsHook             = new Options();
        $this->templateHook            = new Template();
        $this->pluginHook              = new Plugin();
        $this->sessionHelper           = new Session();
        $this->stringsHelper           = new Strings();
        $this->checkoutHook            = new Checkout();
        $this->storeConfig             = $this->setStore();
        $this->urlHelper               = $this->setUrl();
        $this->scriptsHook             = $this->setScripts();
        $this->gatewaysHelper          = $this->setGatewaysHelper();
        $this->funnel                  = $this->setFunnel();
        $this->gatewayHook             = $this->setGateway();
        $this->hooks                   = $this->setHooks();
        $this->helpers                 = $this->setHelpers();
    }

    /**
     * @return Hooks
     */
    private function setHooks(): Hooks
    {
        return new Hooks(
            $this->adminHook,
            $this->blocksHook,
            $this->checkoutHook,
            $this->endpointsHook,
            $this->gatewayHook,
            $this->pluginHook,
            $this->scriptsHook,
            $this->templateHook
        );
    }

    private function setHelpers(): Helpers
    {
        return new Helpers(
            $this->sessionHelper,
            $this->urlHelper
        );
    }

    /**
     * @return Scripts
     */
    private function setScripts(): Scripts
    {
        return new Scripts($this->urlHelper);
    }

    /**
     * @return Url
     */
    private function setUrl(): Url
    {
        return new Url($this->stringsHelper);
    }

    /**
     * @return Gateway
     */
    private function setGateway(): Gateway
    {
        return new Gateway(
            $this->storeConfig,
            $this->urlHelper,
            $this->funnel
        );
    }

    /**
     * @return Funnel
     */
    private function setFunnel(): Funnel
    {
        return new Funnel(
            $this->gatewaysHelper
        );
    }

    /**
     * @return Gateways
     */
    private function setGatewaysHelper(): Gateways
    {
        return new Gateways(
            $this->storeConfig
        );
    }

    /**
     * @return Store
     */
    private function setStore(): Store
    {
        return new Store($this->optionsHook);
    }


}