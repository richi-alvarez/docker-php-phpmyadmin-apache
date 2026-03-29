<?php

namespace EpaycoSubscription\Woocommerce\Helpers;

if (!defined('ABSPATH')) {
    exit;
}

use Exception;

use EpaycoSubscription\Woocommerce\Gateways\EpaycoSuscription;

class Subscription extends EpaycoSuscription
{
    public function __construct()
    {
        parent::__construct();
    }

    public function subscriptionCreate(array $plans, array $customer, $confirm_url, $order)
    {
        if (class_exists('WC_Logger')) {
            $logger = wc_get_logger();
        }
        foreach ($plans as $plan) {
            try {
                //$logger->info("customer_id : " . json_encode($customer));
                $suscriptioncreted = $this->epaycoSdk->subscriptions->create(
                    [
                        "id_plan" => $plan['id_plan'],
                        "customer" => $customer['customer_id'],
                        "token_card" => $customer['token_card'],
                        "doc_type" => $customer['type_document'],
                        "doc_number" => $customer['doc_number'],
                        "url_confirmation" => $confirm_url,
                        "method_confirmation" => "POST"
                    ]
                );
                if (!$suscriptioncreted->status) {
                    $planJson = json_decode(json_encode($suscriptioncreted), true);
                    $dataError = $planJson;
                    $error = $this->errorMessages($dataError);
                    //$error = isset($dataError['message']) ? $dataError['message'] : (isset($dataError["message"]) ? $dataError["message"] : __('El token no se puede asociar al cliente, verifique que: el token existe, el cliente no esté asociado y que el token no este asociado a otro cliente.', 'epayco-subscriptions-for-woocommerce'));
                    wc_add_notice($error, 'error');
                    //wp_redirect(wc_get_checkout_url());
                    $redirect_url = $order->get_checkout_payment_url(true);
                    wp_safe_redirect($redirect_url);
                    exit; 
                }
                if (class_exists('WC_Logger')) {
                    //$logger->info("subscriptionCreate : " . json_encode($suscriptioncreted));
                }
                return $suscriptioncreted;
            } catch (Exception $exception) {
                if (class_exists('WC_Logger')) {
                    $logger->info("subscriptionCreate" . $exception->getMessage());
                }
                wc_add_notice($exception->getMessage(), 'error');
                //wp_redirect(wc_get_checkout_url());
                $redirect_url = $order->get_checkout_payment_url(true);
                wp_safe_redirect($redirect_url);
                exit;  
            }
        }
    }


    public function subscriptionCharge(array $plan, array $customer, $confirm_url, $epayco_subscription_id,$order, $subscriptions)
    {

        if (class_exists('WC_Logger')) {
            $logger = wc_get_logger();
        }

       try {
            $sub = $this->epaycoSdk->subscriptions->charge(
                [
                    "id_plan" => $plan['id_plan'],
                    "customer" => $customer['customer_id'],
                    "token_card" => $customer['token_card'],
                    "doc_type" => $customer['type_document'],
                    "doc_number" => $customer['doc_number'],
                    "ip" => $this->getIP(),
                    "url_confirmation" => $confirm_url,
                    "method_confirmation" => "POST",
                    "idSubscription" => $epayco_subscription_id
                ]
            );
            
            $validation = isset($sub->success) ? $sub->success : (isset($sub->status) ? $sub->status == 'active' :  false);
            if (!$validation) {
                $subscriptionJson = json_decode(json_encode($sub), true);
                $dataError = $subscriptionJson;
                $error = $this->errorMessages($dataError);
                //$error = isset($dataError['message']) ? $dataError['message'] : (isset($dataError["message"]) ? $dataError["message"] : __('El token no se puede asociar al cliente, verifique que: el token existe, el cliente no esté asociado y que el token no este asociado a otro cliente.', 'epayco-subscriptions-for-woocommerce'));
                wc_add_notice($error, 'error');
                //wp_redirect(wc_get_checkout_url());
                $redirect_url = $order->get_checkout_payment_url(true);
                wp_safe_redirect($redirect_url);
                exit; 
            }else{
                $this->handleSubscriptions($order,$sub,$subscriptions);
            }
            
            //return $subs;
        } catch (Exception $exception) {
            if (class_exists('WC_Logger')) {
                $logger->info("subscriptionCharge" . $exception->getMessage());
            }
            wc_add_notice($exception->getMessage(), 'error');
            //wp_redirect(wc_get_checkout_url());
            $redirect_url = $order->get_checkout_payment_url(true);
            wp_safe_redirect($redirect_url);
            exit;  
        }
    }

    private function handleSubscriptions($order,$sub,$subscriptions){
        try{
            $logger = null;
            if (class_exists('WC_Logger')) {
                $logger = wc_get_logger();
            }
            $refPayco = null;
            $isTestTransaction = $sub->data->enpruebas == 1 ? "yes" : "no";
            update_option('epayco_order_status', $isTestTransaction);
            if (is_array($subscriptions)) {
                foreach ($subscriptions as $subscription) {
                    $is_payment_approved = (
                        ( isset($sub->data->estado) && (
                            $sub->data->estado == 'aceptada' ||
                            $sub->data->estado == 'Aceptada'
                            )
                        )||
                        ($sub->data->status === 'aceptada' || $sub->data->status === 'Aceptada') 
                    );
                    $is_payment_pending = (
                        ( isset($sub->data->estado) && (
                            $sub->data->estado == 'pendiente' ||
                            $sub->data->estado == 'Pendiente'
                            )
                        )||
                        ($sub->data->status === 'pendiente' || $sub->data->status === 'Pendiente') 
                    );
                    $is_payment_rejected = (
                        ( isset($sub->data->estado) && (
                            $sub->data->estado == 'rechazada' ||
                            $sub->data->estado == 'Rechazada'
                            )
                        )||
                        ($sub->data->status === 'rechazada' || $sub->data->status === 'Rechazada') 
                    );
                    if ($is_payment_approved) {
                        $this->completedPayment($order,$subscription,$sub);
                        $refPayco = isset($sub->data->ref_payco) ? esc_html($sub->data->ref_payco) : 'N/A';
                    }else{
                        if( $is_payment_rejected ) {
                            $response = isset($sub->data->respuesta) ? esc_html($sub->data->respuesta) : 'Rechazada';
                            wc_add_notice(__("La transacción {$response}, por favor intente de nuevo.", 'epayco-subscriptions-for-woocommerce'), 'error');
                            //wp_redirect(wc_get_checkout_url());
                            wp_safe_redirect($order->get_checkout_payment_url(true));
                            exit;
                        }else{
                            if( $is_payment_pending ) {
                                $this->pendingPayment($order,$subscription,$sub);
                                $refPayco = isset($sub->data->ref_payco) ? esc_html($sub->data->ref_payco) : 'N/A';
                            }
                        }
                    }
                }
            }else{
                throw new Exception(__('Objeto no es una instancia de WC_Subscription.', 'epayco-subscriptions-for-woocommerce'));
            }
            WC()->cart->empty_cart();
            $arguments = array();
            $arguments['ref_payco'] = $refPayco;
            $redirect_url = add_query_arg($arguments, $order->get_checkout_order_received_url());
            wp_redirect($redirect_url);
        } catch (Exception $exception) {
            if (class_exists('WC_Logger')) {
                $logger->info("handleSubscriptions" . $exception->getMessage());
            }
            wc_add_notice($exception->getMessage(), 'error');
            $redirect_url = $order->get_checkout_payment_url(true);
            wp_safe_redirect($redirect_url);
            exit;  
        }
    }

    public function cancelSubscription($subscription_id)
    {
        try {
            $result = $this->epaycoSdk->subscriptions->cancel($subscription_id);
            error_log("ePayco cancel result: " . print_r($result, true));
        } catch (Exception $exception) {
            if (class_exists('WC_Logger')) {
                $logger = wc_get_logger();
                $logger->info("Error al cancelar la suscripción $subscription_id: " . $exception->getMessage());
            }
            error_log("Error al cancelar la suscripción $subscription_id: " . $exception->getMessage());
            if (class_exists('WC_Logger')) {
                $logger = wc_get_logger();
                $logger->info("Error al cancelar la suscripción $subscription_id: " . $exception->getMessage());
            }
            throw $exception;
        }
    }

}