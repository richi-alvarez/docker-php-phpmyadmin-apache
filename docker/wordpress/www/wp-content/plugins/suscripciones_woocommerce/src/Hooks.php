<?php

namespace EpaycoSubscription\Woocommerce;

use EpaycoSubscription\Woocommerce\Hooks\Plugin;
use EpaycoSubscription\Woocommerce\Hooks\Admin;
use EpaycoSubscription\Woocommerce\Hooks\Blocks;
use EpaycoSubscription\Woocommerce\Hooks\Checkout;
use EpaycoSubscription\Woocommerce\Hooks\Endpoints;
use EpaycoSubscription\Woocommerce\Hooks\Scripts;
use EpaycoSubscription\Woocommerce\Hooks\Gateway;
use EpaycoSubscription\Woocommerce\Hooks\Template;

if (!defined('ABSPATH')) {
    exit;
}

class Hooks
{
    public Admin $admin;

    public Blocks $blocks;

    public Checkout $checkout;

    public Endpoints $endpoints;

    public Gateway $gateway;

    public Plugin $plugin;

    public Scripts $scripts;

    public Template $template;

    public function __construct(
        Admin $admin,
        Blocks $blocks,
        Checkout $checkout,
        Endpoints $endpoints,
        Gateway $gateway,
        Plugin $plugin,
        Scripts $scripts,
        Template $template
    ){
        $this->admin     = $admin;
        $this->blocks    = $blocks;
        $this->checkout  = $checkout;
        $this->endpoints = $endpoints;
        $this->gateway   = $gateway;
        $this->plugin    = $plugin;
        $this->scripts   = $scripts;
        $this->template  = $template;
    }


}