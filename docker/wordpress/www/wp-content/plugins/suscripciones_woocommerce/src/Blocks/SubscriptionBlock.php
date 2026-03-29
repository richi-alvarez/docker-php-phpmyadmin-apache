<?php

namespace EpaycoSubscription\Woocommerce\Blocks;

if (!defined('ABSPATH')) {
    exit;
}
class SubscriptionBlock extends AbstractBlock
{
    protected $scriptName = 'subscription';

    protected $name = 'woo-epaycosubscription';

    /**
     * SubscriptionBlock constructor
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Set payment block script params
     *
     * @return array
     */
    public function getScriptParams(): array
    {
        return $this->gateway->getPaymentFieldsParams();
    }
}