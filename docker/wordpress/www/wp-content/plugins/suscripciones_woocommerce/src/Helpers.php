<?php

namespace EpaycoSubscription\Woocommerce;
use EpaycoSubscription\Woocommerce\Helpers\Session;
use EpaycoSubscription\Woocommerce\Helpers\Url;
if (!defined('ABSPATH')) {
    exit;
}

class Helpers
{
    public Url $url;
    public Session $session;

    public function __construct(
        Session $session,
        Url $url
    ){
        $this->session        = $session;
        $this->url      = $url;
    }
}