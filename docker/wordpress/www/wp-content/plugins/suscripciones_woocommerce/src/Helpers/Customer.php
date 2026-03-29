<?php

namespace EpaycoSubscription\Woocommerce\Helpers;

if (!defined('ABSPATH')) {
    exit;
}

use Exception;

use EpaycoSubscription\Woocommerce\Gateways\EpaycoSuscription;

class Customer extends EpaycoSuscription
{
    public function __construct()
    {
        parent::__construct();
    }


    /**
     * @param int|string $clientId
     */
    public function getEpaycoCustomer($clientId)
    {
        $customer = false;
        try {
            $customer = $this->epaycoSdk->customer->get($clientId);
        } catch (Exception $exception) {
            if (class_exists('WC_Logger')) {
                $this->logger->info("getEpaycoCUstomer " . $exception->getMessage());
            }
            return false;
        }

        return $customer;
    }

    /**
     * @param array $data
     */
    public function customerCreate(array $data)
    {
        $customer = false;
        try {
          
            
            $customer = $this->epaycoSdk->customer->create(
                [
                    "token_card" => $data['token_card'],
                    "name" => $data['name'],
                    "last_name" => $data['last_name'],  
                    "email" => $data['email'],
                    "phone" => $data['phone'],
                    "cell_phone" => $data['phone'],
                    "country" => $data['country'],
                    "city" => $data['city'],
                    "address" => $data['address'],
                    "default" => true
                ]
            );

        } catch (Exception $exception) {
            if (!is_null($this->logger)) {
                $this->logger->info("customerAddToken" . $exception->getMessage());
            }
            return false;
        }
        return $customer;
    }

    /**
     * @param int|string $customer_id
     * @param int|string $token_card
     */
    public function customerAddToken($customer_id, $token_card)
    {
        $customer = false;
        try {
            $customer = $this->epaycoSdk->customer->addNewToken(
                [
                    "token_card" => $token_card,
                    "customer_id" => $customer_id
                ]
            );
        } catch (Exception $exception) {
            if (!is_null($this->logger)) {
                $this->logger->info("customerAddToken" . $exception->getMessage());
            }
            return false;
        }
        return $customer;
    }

    /**
     * @param array $customerData
     * @param string $token
     * @param mixed $order_id
     */
    public function createOrUpdateEpaycoCustomer($customerData, $token, $order_id)
    {
        global $wpdb;
        $table_name_setings = $wpdb->prefix . 'epayco_setings';

        // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery
        $customerGetData = $wpdb->get_results(
            $wpdb->prepare(
                // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
                "SELECT * FROM $table_name_setings WHERE id_payco = %d AND email = %s",
                $this->custIdCliente,
                $customerData['email']
            ),
            ARRAY_A
        );        
        if (empty($customerGetData)) {             
            return $this->registerEpaycoCustomer($customerData, $order_id,  $token);
        }else{
            $emailEncontrado = false;
            foreach ($customerGetData as $index => $usuario) {
                if ($usuario['email'] === $customerData['email']) {
                    $customer_id = $usuario['customer_id'];
                    $emailEncontrado = true;
                    break;
                }
            }
            if ($emailEncontrado) {
                $customerExist = $this->getEpaycoExisting($customer_id,$token);
                if($customerExist){
                    error_log("createOrUpdateEpaycoCustomer: " . json_encode(["success" => true, "customer_id" => $customerExist]));
                   return ["success" => true, "customer_id" => $customerExist];
                }
                $isAddedToken = $this->customerAddToken($customer_id, $token);
                if (!$isAddedToken->status) {
                    if (class_exists('WC_Logger')) {
                        $logger = wc_get_logger();
                        $logger->info("isAddedToken: " . json_encode($isAddedToken));
                    }
                    $customerJson = json_decode(json_encode($isAddedToken), true);
                    $error = $this->errorMessages($customerJson);                    
                    wc_add_notice($error, 'error');
                    error_log("createOrUpdateEpaycoCustomer Error: " . json_encode($isAddedToken));
                    return ["success" => false, "customer_id" => null, 'message' => $error];
                    //wp_redirect(wc_get_checkout_url());
                    /*$order = new \WC_Order($order_id);
                    $redirect_url = $order->get_checkout_payment_url(true);
                    wp_safe_redirect($redirect_url);
                    exit;*/
                }else{
                    error_log("createOrUpdateEpaycoCustomer: " . json_encode(["success" => true, "customer_id" => $customer_id]));
                    return ["success" => true, "customer_id" => $customer_id];
                }
               
            }else{
                return $this->registerEpaycoCustomer($customerGetData, $order_id, $token);
            }
            
        }
    
    }
    

    public function registerEpaycoCustomer($customerData,$order_id, $token) {
        global $wpdb;
        $table_name_setings = $wpdb->prefix . 'epayco_setings';
        $customer_id = isset($customerData['customer_id']) ? $customerData['customer_id'] : null;
        $customerExist = $this->getEpaycoExisting($customer_id, $token);
        if($customerExist){
            return ["success" => true, "customer_id" => $customerExist];
        }
        $customer = $this->customerCreate($customerData);
        if (!is_object($customer) || !isset($customer->status) || !isset($customer->data) || (isset($customer->data->status) && $customer->data->status == 'error') || !$customer->status) {
            if (!is_null($this->logger)) {
                $this->logger->info("customerCreate: " . json_encode($customer));
            }
            $customerJson = json_decode(json_encode($customer), true);
            $error = $this->errorMessages($customerJson);
            wc_add_notice($error, 'error');
            error_log("registerEpaycoCustomer Error: " . json_encode($customer));
            return ["success" => false, "customer_id" => null, 'message' => $error];
            //wp_redirect(wc_get_checkout_url());
            /*$order = new \WC_Order($order_id);
            $redirect_url = $order->get_checkout_payment_url(true);
            wp_safe_redirect($redirect_url);
            exit;*/
        } else {
            $inserCustomer = $wpdb->insert(
                $table_name_setings,
                [
                    'id_payco' => $this->custIdCliente,
                    'customer_id' => $customer->data->customerId,
                    //'token_id' => $customerData['token_card'],
                    'email' => $customerData['email']
                ]
            );
            if (!$inserCustomer) {
                if (!is_null($this->logger)) {
                    $this->logger->info('No se insertó el registro del cliente en la base de datos.');
                }
            }
            return ["success" => true, "customer_id" => $customer->data->customerId];
        } 
    }


    public function getEpaycoExisting($customer_id, $token){
        $customerExist = $this->getEpaycoCustomer($customer_id);
        if($customerExist && isset($customerExist->success)){
            $cards = $customerExist->data->cards;
            if(!empty($cards)){
                $cardEncontrada = false;
                foreach ($cards as $index => $card) {
                    if ($card->token === $token) {
                        $cardEncontrada = true;
                        break;
                    }
                }
                if($cardEncontrada){
                    return $customer_id;
                }else{
                    $isAddedToken = $this->customerAddToken($customer_id, $token);
                    if (!$isAddedToken->status) {
                        if (class_exists('WC_Logger')) {
                            $logger = wc_get_logger();
                            $logger->info("isAddedToken: " . json_encode($isAddedToken));
                        }
                        error_log("getEpaycoExisting Error: " . json_encode($isAddedToken));
                        return false;
                    }else{
                        return $customer_id;
                    }
                }
            }
        }else{
           return false; 
        }
    }


    protected function errorMessages($dataError){
        $error = "Ocurrió un error, por favor contactar con soporte.";
        $message = $error;
        $errores_listados = [];
        if (is_array($dataError)) {
            $message = $dataError['message'] ?? $error;
            if (isset($dataError['data']['errors']) && is_array($dataError['data']['errors'])) {
                foreach ($dataError['data']['errors'] as $campo => $mensajes) {
                    foreach ($mensajes as $msg) {
                        $errores_listados[] = ucfirst($campo) . ': ' . $msg;
                    }
                }
            }

            if (isset($dataError['data']->errors) && is_array($dataError['data']->errors)) {
                foreach ($dataError['data']->errors as $campo => $mensajes) {
                    foreach ($mensajes as $msg) {
                        $errores_listados[] = ucfirst($campo) . ': ' . $msg;
                    }
                }
            }

            if(isset($dataError['data']['errors'])){
                $message = $dataError['data']['errors'];
            }
            
        }

        $errorMessage = $message;
        if (!empty($errores_listados)) {
            $errorMessage .=  implode(' | ', $errores_listados);
        }
        return $errorMessage;
    }


}