<?php

namespace EpaycoSubscription\Woocommerce\Helpers;
use EpaycoSubscription\Woocommerce\Interfaces\EpaycoSubscriptionHandlerInterface;
use EpaycoSubscription\Woocommerce\Helpers\Customer;
use EpaycoSubscription\Woocommerce\Helpers\Plan;
use EpaycoSubscription\Woocommerce\Helpers\Subscription;

class EpaycoHandler implements EpaycoSubscriptionHandlerInterface
{
    private $orderEpayco;
    protected $customer;
    protected $plan;
    protected $subscription;
    public $customerData = [];
    public $planInfo = [];
    public $subscriptionInfo = [];
    public $handlerSubscription = [
        'customer' => [],
        'plan' => [],
        'subcription' => [],
        'type' => 'create'
    ];
    public $confirmUrl;
    public function __construct($order,$confirmUrl){
        $this->orderEpayco = $order;
        $this->customer = new Customer();
        $this->plan = new Plan();
        $this->subscription = new Subscription();
        $this->confirmUrl = $confirmUrl;
    }

    private function normalizeToArray($data): array
    {
        if (is_array($data)) {
            return $data;
        }
        if (is_object($data)) {
            return json_decode(json_encode($data), true);
        }
        return (array) $data;
    }

    // Fusiona recursivamente (los valores entrantes sobrescriben existentes)
    private function mergeRecursive(array $original, array $incoming): array
    {
        foreach ($incoming as $key => $value) {
            if (is_array($value) && isset($original[$key]) && is_array($original[$key])) {
                $original[$key] = $this->mergeRecursive($original[$key], $value);
            } else {
                $original[$key] = $value;
            }
        }
        return $original;
    }


    // Reemplaza o fusiona datos de customer
    public function setCustomer($customerData, bool $merge = false)
    {
        $new = $this->normalizeToArray($customerData);
        if ($merge && !empty($this->customerData) && is_array($this->customerData)) {
            $this->customerData = $this->mergeRecursive($this->customerData, $new);
        } else {
            $this->customerData = $new;
        }
    }

    // Añade/mergea datos al customer existente
    public function addCustomerData($customerData)
    {
        $this->setCustomer($customerData, true);
    }

    // Reemplaza o fusiona datos de planInfo
    public function setPlanInfo($plans, bool $merge = false)
    {
        $new = $this->normalizeToArray($plans);
        if ($merge && !empty($this->planInfo) && is_array($this->planInfo)) {
            $this->planInfo = $this->mergeRecursive($this->planInfo, $new);
        } else {
            $this->planInfo = $new;
        }
    }

    public function setSubscriptionnInfo($subscription, bool $merge = false)
    {
        $new = $this->normalizeToArray($subscription);
        if ($merge && !empty($this->subscriptionInfo) && is_array($this->subscriptionInfo)) {
            $this->subscriptionInfo = $this->mergeRecursive($this->subscriptionInfo, $new);
        } else {
            $this->subscriptionInfo = $new;
        }
    }

    // Añade/mergea datos al planInfo existente
    public function addPlanInfo($plans)
    {
        $this->setPlanInfo($plans, false);
    }

    public function addSubscriptionInfo($subscription)
    {
        $this->setSubscriptionnInfo($subscription, false);
    }

    public function validateCustomer(array $customerData, string $token , string $custIdCliente)
    {
        try{
            global $wpdb;
            $table_name_setings = $wpdb->prefix . 'epayco_setings';
            if (class_exists('WC_Logger')) {
                $logger = wc_get_logger();
            }
            $customer_id = $this->customer->createOrUpdateEpaycoCustomer($customerData, $token, $this->orderEpayco->get_id());
            if (is_null($customer_id)) {
                $customer = $this->customer->customerCreate($customerData,$this->orderEpayco->get_id());
                // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
                $inserCustomer = $wpdb->insert(
                    $table_name_setings,
                    [
                        'id_payco' => $custIdCliente,
                        'customer_id' => $customer->data->customerId,
                        //'token_id' => $customerData['token_card'],
                        'email' => $customerData['email']
                    ]
                );
                if (!$inserCustomer) {
                    $error_message = __('No se insertó el registro del cliente en la base de datos.', 'epayco-subscriptions-for-woocommerce');
                    wc_add_notice($error_message, 'error');
                    // Redirigir al mismo receipt page para permitir reintentar el pago sin recargar el checkout
                    $redirect_url = $this->orderEpayco->get_checkout_payment_url(true);
                    wp_safe_redirect($redirect_url);
                    exit;
                }
                if (class_exists('WC_Logger')) {
                    $logger->info("Error : 'No se inserto el registro del cliente en la base de datos.'");
                }
                $customerData['customer_id'] = $customer_id;
                $this->setCustomer($customerData);
            } else {
                $customerData['customer_id'] = $customer_id;
                $this->setCustomer($customerData);
            }
        }catch (\Exception $exception) {
            if (class_exists('WC_Logger')) {
                $logger->info("validateCustomer" . $exception->getMessage());
            }
            if (class_exists('WC_Logger')) {
                $logger->info("validateCustomer Error : " . $exception->getMessage());
            }
            wc_add_notice($exception->getMessage(), 'error');
            // Redirigir al mismo receipt page para permitir reintentar el pago sin recargar el checkout
            $redirect_url = $this->orderEpayco->get_checkout_payment_url(true);
            wp_safe_redirect($redirect_url);
            exit;
        }
    }

    public function validatePlan($plans){
        $getPlan = $this->plan->getPlans($plans);
        if (!$getPlan) {
            $newPLan = $this->plan->plansCreate($plans, $this->orderEpayco);
            $this->addPlanInfo($newPLan->data);
        }else{
            $this->addPlanInfo($getPlan->plan);
        }
    }

    public function validatePlanData($getPlans){
        try {
            $plan_amount_cart = $this->planInfo['amount'];
            $plan_id_cart = $this->planInfo['id_plan'];
            $plan_currency_cart = $this->planInfo['currency'];
            $plan_amount_epayco = $getPlans['amount'];
            $plan_id_epayco =$getPlans['id_plan'];
            $plan_currency_epayco = $getPlans['currency'];
            
            $this->handlerSubscription['plan'] = $this->planInfo;
            $this->handlerSubscription['customer'] = $this->customerData ?? [];
            if ($plan_id_cart == $plan_id_epayco) {
                if (
                    ((float)$plan_amount_cart == (float)$plan_amount_epayco)
                    && ( strtolower($plan_currency_cart) == strtolower($plan_currency_epayco) )
                    ) {
                    // Preparar handler para procesar (create)
                    $this->handlerSubscription['type'] = 'create';
                } else {
                    // Preparar handler para validar (validate)
                    $this->handlerSubscription['type'] = 'validate';
                }
            }else{
                if (class_exists('WC_Logger')) {
                    $logger = wc_get_logger();
                    $logger->info("el id del plan creado no concuerda!");
                }
                $error = 'el id del plan creado no concuerda!, por favor contacte con soporte';
                wc_add_notice($error, 'error');
                //wp_redirect(wc_get_checkout_url());
                $redirect_url = $this->orderEpayco->get_checkout_payment_url(true);
                wp_safe_redirect($redirect_url);
                die();
            }
        } catch (\Exception $exception) {
            if (class_exists('WC_Logger')) {
                $logger = wc_get_logger();
                $logger->info($exception->getMessage());
            }
            //echo esc_html($exception->getMessage());
            wc_add_notice($exception->getMessage(), 'error');
            //wp_redirect(wc_get_checkout_url());
            $redirect_url = $this->orderEpayco->get_checkout_payment_url(true);
            wp_safe_redirect($redirect_url);
            die();
        }
    }

    public function createSubscription($subscriptions, $plans){
        try{
            if($this->handlerSubscription['type'] == 'create'){
                // Lógica para crear la suscripción
                $subscription = $this->subscription->subscriptionCreate(
                    [$this->planInfo],
                    $this->customerData,
                    $this->confirmUrl,
                    $this->orderEpayco                                                                                                                                          
                );
            }else{
                $this->updatePlan($subscriptions, $plans);
            }
            
            if($subscription->status){
                $this->addSubscriptionInfo($subscription);
                $this->handlerSubscription['subcription'] = $subscription;
                $suscriptionId = isset($subscription->id) ? $subscription->id : null;
                $this->setPaymentsIdDataForSubscription($subscriptions, $suscriptionId);
            }
        } catch (\Exception $exception) {
            if (class_exists('WC_Logger')) {
                $logger = wc_get_logger();
                $logger->info($exception->getMessage());
            }
            //echo esc_html($exception->getMessage());
            wc_add_notice($exception->getMessage(), 'error');
            //wp_redirect(wc_get_checkout_url());
            $redirect_url = $this->orderEpayco->get_checkout_payment_url(true);
            wp_safe_redirect($redirect_url);
            die();
        }
    }

    public function cancelSubscription($subscription_id)
    {
        try {
            $this->subscription->cancelSubscription($subscription_id);
        } catch (\Exception $exception) {
            if (class_exists('WC_Logger')) {
                $logger = wc_get_logger();
                $logger->info($exception->getMessage());
            }
        }
    }

    public function updatePlan($subscriptions, $plans){
        try{
            /* 
            actualizar informacion del producto
            */
            $updatedPlan = $this->plan->plansUpdate($this->planInfo, $this->orderEpayco, $plans);
            if($updatedPlan->status){
                //$this->addPlanInfo($updatedPlan->data);
                $this->handlerSubscription['type'] = 'create';
                $this->createSubscription($subscriptions, $plans);
            }else{
                wc_add_notice("No se pudo crear el plan, por favor contacta con soporte", 'error');
                //wp_redirect(wc_get_checkout_url());
                $redirect_url = $this->orderEpayco->get_checkout_payment_url(true);
                wp_safe_redirect($redirect_url);
                die();
            }

        } catch (\Exception $exception) {
            if (class_exists('WC_Logger')) {
                $logger = wc_get_logger();
                $logger->info($exception->getMessage());
            }
            //echo esc_html($exception->getMessage());
            wc_add_notice($exception->getMessage(), 'error');
            //wp_redirect(wc_get_checkout_url());
            $redirect_url = $this->orderEpayco->get_checkout_payment_url(true);
            wp_safe_redirect($redirect_url);
            die();
        }
    }


    public function processPaymentEpayco($subscriptions){
        try{
            if($this->subscriptionInfo){
                if (isset($this->subscriptionInfo['id'])) {
                    $epayco_subscription_id = $this->subscriptionInfo['id'];
                    if (wcs_order_contains_subscription($this->orderEpayco->get_id())) {
                        $subscriptions_wc = wcs_get_subscriptions_for_order($this->orderEpayco, ['order_type' => 'parent']);
                        foreach ($subscriptions_wc as $subscription) {
                            update_post_meta($subscription->get_id(), '_epayco_subscription_id', $epayco_subscription_id);
                        }
                    }
                }
            }
            $this->subscription->subscriptionCharge(
                $this->planInfo, 
                $this->customerData, 
                $this->confirmUrl, 
                $epayco_subscription_id, 
                $this->orderEpayco,
                $subscriptions
            );

        } catch (\Exception $exception) {
            if (class_exists('WC_Logger')) {
                $logger = wc_get_logger();
                $logger->info($exception->getMessage());
            }
            //echo esc_html($exception->getMessage());
            wc_add_notice($exception->getMessage(), 'error');
            //wp_redirect(wc_get_checkout_url());
            $redirect_url = $this->orderEpayco->get_checkout_payment_url(true);
            wp_safe_redirect($redirect_url);
            die();
        }    
    }
    // Lógica para procesar el pago con Epayco

    public function setPaymentsIdDataForSubscription($subscription, $value): void
    {
        try {
             if (class_exists('WC_Logger')) {
                $logger = wc_get_logger();
            }

            if (is_array($subscription)) {
                foreach ($subscription as $sub) {
                    if ($sub instanceof \WC_Subscription) {
                        $sub->delete_meta_data('woo-epaycosubscription');
                        $sub->update_meta_data('woo-epaycosubscription', $value);
                        $sub->save();


                        $sub = wcs_get_subscription($sub->get_id());
                    } else {
                        $logger->add("ePaycoSubscription", "Elemento no es una instancia de WC_Subscription.");
                    }
                }
            } else {
                $logger->add("ePaycoSubscription", "Objeto no es una instancia de WC_Subscription.");
            }
        } catch (\Exception $ex) {
            $error_message = "Error al actualizar la suscripción: {$ex->getMessage()}";
            $logger->add("ePaycoSubscription", $error_message);
        }
    }


}