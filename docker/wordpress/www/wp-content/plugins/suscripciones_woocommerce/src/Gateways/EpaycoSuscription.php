<?php

namespace EpaycoSubscription\Woocommerce\Gateways;

use Exception;
use Epayco as EpaycoSdk;
use EpaycoSubscription\Woocommerce\Helpers\Customer;
use function wc_get_order;
use function get_locale;
use function sanitize_text_field;
use function wp_unslash;

if (!defined('ABSPATH')) {
    exit;
}

class EpaycoSuscription extends AbstractGateway
{
    /**
     * @const
     */
    public const ID = 'woo-epaycosubscription';

    /**
     * @const
     */
    public const CHECKOUT_NAME = 'checkout-subscription';

    /**
     * @const
     */
    public const WEBHOOK_API_NAME = 'WC_WooEpaycoSuscription_Gateway';

    /** 
     * @const
     */
    public const WEBHOOK_API_NAME_VALIDATION = 'WC_WooEpaycoSuscription_Validation';


    /**
     * @const
     */
    public const LOG_SOURCE = 'EpaycoSuscription_Gateway';

    // public $cron_data;

    protected EpaycoSdk\Epayco $epaycoSdk;

    public $logger;

    public $custIdCliente;

    /**
     * BasicGateway constructor
     * @throws Exception
     */
    public function __construct()
    {
        parent::__construct();
        $this->id        = self::ID;
        $this->title     = $this->epaycosuscription->storeConfig->getGatewayTitle($this, 'epayco');
        $this->init_form_fields();
        $this->payment_scripts($this->id);
        $this->supports = [
            'subscriptions',
            'subscription_suspension',
            'subscription_reactivation',
            'subscription_cancellation',
            'multiple_subscriptions'
        ];
        $this->description        = 'Pagos de suscripciónes con epayco';
        $this->method_title       = 'Suscripciónes ePayco';
        $this->method_description = 'Crea productos de suscripciónes para tus clientes';

        $this->epaycosuscription->hooks->gateway->registerUpdateOptions($this);
        $this->epaycosuscription->hooks->gateway->registerGatewayTitle($this);
        // Register thank you page renderer for this gateway
        $this->epaycosuscription->hooks->gateway->registerThankYouPage($this->id, [$this, 'renderThankYouPage']);
        $this->epaycosuscription->hooks->gateway->registerAvailablePaymentGateway();
        $this->epaycosuscription->hooks->gateway->registerCustomBillingFieldOptions();
        $this->epaycosuscription->hooks->gateway->registerGatewayReceiptPage($this->id, [$this, 'receiptPage']);
        $this->epaycosuscription->hooks->checkout->registerReceipt($this->id, [$this, 'renderOrderForm']);
        $this->epaycosuscription->hooks->endpoints->registerApiEndpoint(self::WEBHOOK_API_NAME, [$this, 'webhook']);
        $this->epaycosuscription->hooks->endpoints->registerApiEndpoint(self::WEBHOOK_API_NAME_VALIDATION, [$this, 'validate_ePaycoSubscription_request']);
        $this->epaycosuscription->hooks->gateway->getAdminCredentiaslFields($this, 'ePaycoSubscription_credentials_validation');

        $lang = \get_locale();
        $lang = explode('_', $lang);
        $lang = $lang[0];
        // $this->cron_data = $this->get_option('cron_data');
        $this->custIdCliente =  $this->get_option('custIdCliente');

        add_action('woocommerce_subscription_status_cancelled', [$this, 'on_wc_subscription_cancelled']);

        add_action('woocommerce_epayco_suscripcion_cleanup_draft_orders', [$this, 'update_cron_status_suscription']);
        // add_action('woocommerc_epayco_suscripcion_cron_hook', [$this, 'woocommerc_epayco_suscripcion_cron_job_funcion']);
        add_action('admin_init', [$this, 'install']);
        $this->epaycoSdk = new EpaycoSdk\Epayco(
            [
                "apiKey" => $this->get_option('apiKey'),
                "privateKey" => $this->get_option('privateKey'),
                "lenguage" => strtoupper($lang),
                "test" => (bool)$this->get_option('environment')
            ]
        );
        if (class_exists('WC_Logger') && function_exists('wc_get_logger')) {
            $this->logger = wc_get_logger();
        } else {
            $this->logger = null;
        }
    }

    public function install()
    {
        $this->maybe_create_cronjobs();
    }

    protected function maybe_create_cronjobs()
    {
        // $cron_data = $this->cron_data == "yes" ? true : false;
        $intervalo = $this->get_option('cron_interval_30') == "yes" ? 30 : ($this->get_option('cron_interval_60') == "yes" ? 60 : 0);
        if ($intervalo) {
            if (function_exists('as_next_scheduled_action') && false === as_next_scheduled_action('woocommerce_epayco_suscripcion_cleanup_draft_orders')) {
                as_schedule_recurring_action(time() + $intervalo, $intervalo, 'woocommerce_epayco_suscripcion_cleanup_draft_orders');
            }
        }
    }


    public function update_cron_status_suscription()
    {
        $this->updateStatusSubscription();
    }


    /**
     * Get checkout name
     *
     * @return string
     */
    public function getCheckoutName(): string
    {
        return self::CHECKOUT_NAME;
    }

    /**
     * Init form fields for checkout configuration
     *
     * @return void
     */
    public function init_form_fields(): void
    {
        parent::init_form_fields();

        $this->form_fields = array(
            'enabled' => array(
                'title' => __('Habilitar/Deshabilitar', 'epayco-subscriptions-for-woocommerce'),
                'type' => 'checkbox',
                'label' => __('Habilitar ePayco suscripción', 'epayco-subscriptions-for-woocommerce'),
                'default' => 'yes'
            ),
            'epayco_title' => array(
                'title' => __('Titulo', 'epayco-subscriptions-for-woocommerce'),
                'type' => 'text',
                'description' => __('Corresponde al titulo que los usuarios visualizan el chekout', 'epayco-subscriptions-for-woocommerce'),
                'default' => __('Titulo', 'epayco-subscriptions-for-woocommerce'),
                'desc_tip' => true,
            ),
            'shop_name' => array(
                'title' => __('Nombre del comercio', 'epayco-subscriptions-for-woocommerce'),
                'type' => 'text',
                'description' => __('Corresponde al nombre de la tienda que los usuarios visualizan en el checkout', 'epayco-subscriptions-for-woocommerce'),
                'default' => __('Tienda de pruebas', 'epayco-subscriptions-for-woocommerce'),
                'desc_tip' => true,
            ),
            /*'shop_icon' => array(
                'title' => __('Icono del comercio', 'epayco-subscriptions-for-woocommerce'),
                'type' => 'text',
                'description' => __('Corresponde al icono de la tienda que los usuarios visualizan en el checkout', 'epayco-subscriptions-for-woocommerce'),
                'default' => __('', 'epayco-subscriptions-for-woocommerce'),
                'desc_tip' => true,
            ),*/
            'description' => array(
                'title' => __('Descripción', 'epayco-subscriptions-for-woocommerce'),
                'type' => 'textarea',
                'description' => __('Corresponde al descripción de la tienda que los usuarios visualizan en el checkout', 'epayco-subscriptions-for-woocommerce'),
                'default' => __('Detalle de la suscripción ePayco', 'epayco-subscriptions-for-woocommerce'),
                'desc_tip' => true,
            ),
            'environment' => array(
                'title' => __('Modo de pruebas', 'epayco-subscriptions-for-woocommerce'),
                'type' => 'select',
                'class' => 'wc-enhanced-select',
                'description' => __('mode prueba/producción', 'epayco-subscriptions-for-woocommerce'),
                'desc_tip' => true,
                'default' => true,
                'options' => array(
                    false => __('Produción', 'epayco-subscriptions-for-woocommerce'),
                    true => __('Pruebas', 'epayco-subscriptions-for-woocommerce'),
                ),
            ),
            'custIdCliente' => array(
                'title' => __('P_CUST_ID_CLIENTE', 'epayco-subscriptions-for-woocommerce'),
                'type' => 'text',
                'description' => __('La encuentra en el panel de ePayco, integraciones, Llaves API', 'epayco-subscriptions-for-woocommerce'),
                'default' => '',
                'desc_tip' => true,
                'placeholder' => ''
            ),
            'pKey' => array(
                'title' => __('P_KEY', 'epayco-subscriptions-for-woocommerce'),
                'type' => 'text',
                'description' => __('La encuentra en el panel de ePayco, integraciones, Llaves API', 'epayco-subscriptions-for-woocommerce'),
                'default' => '',
                'desc_tip' => true,
                'placeholder' => ''
            ),
            'apiKey' => array(
                'title' => __('PUBLIC_KEY', 'epayco-subscriptions-for-woocommerce'),
                'type' => 'text',
                'description' => __('La encuentra en el panel de ePayco, integraciones, Llaves API', 'epayco-subscriptions-for-woocommerce'),
                'default' => '',
                'desc_tip' => true,
                'placeholder' => ''
            ),
            'privateKey' => array(
                'title' => __('PRIVATE_KEY', 'epayco-subscriptions-for-woocommerce'),
                'type' => 'text',
                'description' => __('La encuentra en el panel de ePayco, integraciones, Llaves API', 'epayco-subscriptions-for-woocommerce'),
                'default' => '',
                'desc_tip' => true,
                'placeholder' => ''
            ),
            'epayco_endorder_state' => array(
                'title' => __('Estado final del pedido', 'epayco-subscriptions-for-woocommerce'),
                'type' => 'select',
                'css' => 'line-height: inherit',
                'description' => __('Seleccione el estado del pedido que se aplicaría a la hora de aceptar y confirmar el pago de la orden', 'epayco-subscriptions-for-woocommerce'),
                'options' => array(
                    'epayco-processing' => "ePayco Procesando Pago",
                    "epayco-completed" => "ePayco Pago Completado",
                    'processing' => "Procesando",
                    "completed" => "Completado"
                ),
            ),

            'cron_interval_30' => array(
                'title' => __('Actualiza automáticamente el estado de las suscripciones', 'epayco-subscriptions-for-woocommerce'),
                'type' => 'checkbox',
                'label' => __('30 segundos', 'epayco-subscriptions-for-woocommerce'),
                'default' => 'yes',
            ),
            'cron_interval_60' => array(
                'title' => __('', 'epayco-subscriptions-for-woocommerce'),
                'type' => 'checkbox',
                'label' => __('60 segundos', 'epayco-subscriptions-for-woocommerce'),
                'default' => 'no',
            ),

        );
    }


    /**
     * Output the gateway settings screen.
     */

    public function admin_options()
    {
        $path  = EPAYCO_PLUGIN_SUSCRIPCIONES_URL . 'assets/images/';
        $validation_url = get_site_url() . "/";
        $validation_url = add_query_arg('wc-api', self::WEBHOOK_API_NAME_VALIDATION, $validation_url);
        //$validation_url = add_query_arg('wc-api', get_class($this) . "Validation", $validation_url);
?>
        <div id="path_plugin" hidden>
            <?php esc_html_e($path, 'text_domain'); ?>
        </div>
        <div id="path_validate" hidden>
            <?php esc_html_e($validation_url, 'text_domain'); ?>
        </div>
        <img src="<?php echo EPAYCO_PLUGIN_SUSCRIPCIONES_URL . '/assets/images/iconoepayco2025.png' ?>">
        <div style="color: #31708f; background-color: #d9edf7; border-color: #bce8f1; padding: 10px; border-radius: 5px;">
            <h2><?php esc_html_e('ePayco Suscripciónes', 'epayco-subscriptions-for-woocommerce'); ?></h2><br>
            Con este módulo, podrás aceptar pagos de suscripciones de forma segura a través de la plataforma ePayco.
            <br>Cuando un cliente selecciona ePayco como método de pago, el estado del pedido cambiará a <strong>“ePayco Esperando Pago”</strong>.
            <br>Una vez que el pago sea aceptado o rechazado, ePayco notificará automáticamente a tu tienda y el estado del pedido se <br>
            actualizará en consecuencia.
            <br><br>
        </div>
        <table class="form-table">
            <tbody>
                <?php
                $this->generate_settings_html();
                ?>
                <tr valign="top">
                    <th scope="row" class="titledesc">
                        <label for="woocommerce_epayco_enabled"><?php esc_html_e('Validar llaves', 'epayco-subscriptions-for-woocommerce'); ?></label>
                        <span hidden id="public_key">0</span>
                        <span hidden id="private_key">0</span>
                    <td class="forminp">
                        <form method="post" action="#">
                            <label for="woocommerce_epayco_enabled">
                            </label>
                            <input type="button" id="validar" class="button-primary woocommerce-save-button validar" value="Validar">
                            <p class="description">
                                <?php esc_html_e('Validación de llaves PUBLIC_KEY y PRIVATE_KEY', 'epayco-subscriptions-for-woocommerce'); ?>
                            </p>
                        </form>
                        <br>
                        <div id="myModal" class="modal" style="display: none;">
                            <div class="modal-content">
                                <span class="closeEpaycoModal" style="cursor: pointer;">&times;</span>
                                <center>
                                    <img id="epaycoModalImg" src="<?php echo $path . 'logo_warning.png' ?>">
                                </center>
                                <p id="epaycoCredentialTittle"><strong><?php esc_html_e('Llaves de comercio inválidas', 'epayco-subscriptions-for-woocommerce'); ?></strong> </p>
                                <p id="epaycoCredentialDescription"><?php esc_html_e('Las llaves Public Key, Private Key insertadas', 'epayco-subscriptions-for-woocommerce'); ?><br><?php esc_html_e('del comercio son inválidas.', 'epayco-subscriptions-for-woocommerce'); ?><br><?php esc_html_e('Consúltelas en el apartado de integraciones', 'epayco-subscriptions-for-woocommerce'); ?> <br><?php esc_html_e('Llaves API en su Dashboard ePayco.', 'epayco-subscriptions-for-woocommerce'); ?>,</p>
                            </div>
                            <span class="loader"></span>
                        </div>

                    </td>
                    </th>
                </tr>
            </tbody>
        </table>
<?php
    }



    /**
     * Added gateway scripts
     *
     * @param string $gatewaySection
     *
     * @return void
     */

    public function payment_scripts(string $gatewaySection): void
    {
        parent::payment_scripts($gatewaySection);

        if ($this->canCheckoutLoadScriptsAndStyles()) {
            $this->registerCheckoutScripts();
        }
    }

    /**
     * Register checkout scripts
     *
     * @return void
     */

    public function registerCheckoutScripts(): void
    {
        parent::registerCheckoutScripts();
        $this->epaycosuscription->hooks->scripts->registerCheckoutScript(
            'wc_epaycosubscription_jquery',
            'https://code.jquery.com/jquery-1.11.3.min.js'
        );
    }

    /**
     * @param $validationData
     */
    public function ePaycoSubscription_credentials_validation($validationData)
    {
        $username = sanitize_text_field($validationData['epayco_publickey']);
        $password = sanitize_text_field($validationData['epayco_privatey']);
        $response = wp_remote_post('https://eks-apify-service.epayco.io/login', array(
            'headers' => array(
                'Authorization' => 'Basic ' . base64_encode($username . ':' . $password),
            ),
        ));


        $data = json_decode(wp_remote_retrieve_body($response));
        if ($data->token) {
            $response = wp_remote_get("https://eks-rest-pagos-service.epayco.io/restpagos/validarllaves?public_key=" . trim($username));

            if (is_wp_error($response)) {
                error_log('ePayco validation: ' . $response->get_error_message());
                if (class_exists('WC_Logger')) {
                    $logger = wc_get_logger();
                    $logger->info("checkout_error" . $response->get_error_message());
                }
                return wp_send_json("{success:false}");
            }

            $body = wp_remote_retrieve_body($response);
            return wp_send_json($body);
        } else {
            if (class_exists('WC_Logger')) {
                $logger = wc_get_logger();
                $logger->info("checkout_error" . json_encode($data));
            }
            return wp_send_json("{success:false}");
        }
    }

    /**
     * Render gateway checkout template
     *
     * @return void
     */
    public function payment_fields(): void {}
    /**
     * Get Payment Fields params
     *
     * @return array
     */
    public function getPaymentFieldsParams(): array
    {
        return [];
    }

    /**
     * Process payment and create woocommerce order
     *
     * @param $order_id
     *
     * @return array
     * @throws Exception
     */

    public function process_payment($order_id): array
    {
        $order = wc_get_order($order_id);
        try {
            $urlReceived =  $order->get_checkout_payment_url(true);
            return [
                'result'   => 'success',
                'redirect' => $urlReceived,
            ];
        } catch (Exception $e) {
            return [
                'result'   => 'false',
                'message' =>  $e->getMessage(),
                'redirect' => '',
            ];
        }
    }

    public function createToken($dataEpayco = null)
    {
        if (is_null($dataEpayco)) {
            $raw_input = file_get_contents('php://input');
            $json_input = json_decode($raw_input, true);
            $dataEpayco = $json_input['data'] ?? null;
        }
        
        if (!is_null($dataEpayco)) {
            $decoded = base64_decode($dataEpayco, true);
            
            if ($decoded !== false && $decoded !== null) {
                $fixed = mb_convert_encoding($decoded, 'UTF-8', 'ISO-8859-1');
                $data = json_decode($fixed, true);

                if (isset($data['expiry']) && !isset($data['exp_month'])) {
                    $expiry = explode('/', $data['expiry']);
                    $data['exp_year'] = $expiry[1];
                    $data['exp_month'] = $expiry[0];
                }
                // Limpiar y validar datos antes de enviar al SDK
                $card_number = preg_replace('/\s+/', '', $data['number']); // Eliminar espacios
                $card_year = str_pad($data['exp_year'], 4, '20', STR_PAD_LEFT); // Asegurar formato YYYY
                $card_month = str_pad($data['exp_month'], 2, '0', STR_PAD_LEFT); // Asegurar formato MM
                $card_cvc = $data['cvv']??$data['cvc'];
                $tokenBody =array(
                    "card[number]" => $card_number,
                    "card[exp_year]" => $card_year,
                    "card[exp_month]" => $card_month,
                    "card[cvc]" => $card_cvc,
                    "hasCvv" => true //hasCvv: validar codigo de seguridad en la transacción
                );
                
                $token = $this->epaycoSdk->token->create($tokenBody);
                // Log para debugging si es necesario
                if (class_exists('WC_Logger')) {
                    $logger = wc_get_logger();
                    $logger->info("Token creado exitosamente: " . json_encode($token));
                }
                //error_log("Epayco createToken request: " . json_encode($token));
                return $token;
            } else {
                if (class_exists('WC_Logger')) {
                    $logger = wc_get_logger();
                    $logger->error("Error al decodificar base64 data", array('source' => 'epayco_subscription'));
                }
                return null;
            }
        } else {
            if (class_exists('WC_Logger')) {
                $logger = wc_get_logger();
                $logger->error("No se recibieron datos de ePayco", array('source' => 'epayco_subscription'));
            }
        }
        
        return null;
    }

    public function createCustomer($customerData, $token, $order_id){
        $ePaycoCustomer = new Customer();
        return $ePaycoCustomer->createOrUpdateEpaycoCustomer($customerData, $token, $order_id);
    }

    /**
     * Render Receipt  page
     *
     * @param $order_id
     */
    public function receiptPage($order_id): void
    {
        global $woocommerce;
        global $wpdb;
        $subscription = new \WC_Subscription($order_id);
        $order = wc_get_order($order_id);
        $order_data = $order->get_data();
        $name_billing = $subscription->get_billing_first_name() . ' ' . $subscription->get_billing_last_name();
        $email_billing = $subscription->get_billing_email();
        $str_countryCode = $subscription->get_billing_country();
        $redirect_url = get_site_url() . "/";
        $redirect_url = add_query_arg('wc-api', self::WEBHOOK_API_NAME, $redirect_url);
        $redirect_url = add_query_arg('order_id', $order_id, $redirect_url);

        $amount = $subscription->get_total();
        $mountFloat = floatval($amount);
        $currency = get_woocommerce_currency();
        $descripcionParts = array();
        foreach ($subscription->get_items() as $product) {
            $clearData = str_replace('_', ' ', $this->string_sanitize($product['name']));
            $descripcionParts[] = $clearData;
        }

        $descripcion = implode(' - ', $descripcionParts);
        if (substr_count($descripcion, ' - ') >= 1) {
            $product_name = $descripcionParts[0];
            $porciones = explode(" - ", $product_name);
            $product_name = $porciones[0] . "...";
        } else {
            $product_name = $descripcion;
        }
        if (strlen($product_name) < 20) {
            $product_name_ = $descripcion;
        } else {
            $resultado = substr($product_name, 0, 19);
            $product_name_ = $resultado . "...";
        }

        $logo_comercio = plugins_url('assets/images/comercio.png', EPS_PLUGIN_FILE);
        //$logo_comercio=$this->get_option('shop_icon');
        $css_checkout = plugins_url('assets/css/css-suscription.css', EPS_PLUGIN_FILE);
        $js_suscription = plugins_url('assets/js/js-suscription.js', EPS_PLUGIN_FILE);
        $style = plugins_url('assets/css/style.css', EPS_PLUGIN_FILE);
        $general = plugins_url('assets/css/general.min.css', EPS_PLUGIN_FILE);
        $card_style = plugins_url('assets/css/card-js.min.css', EPS_PLUGIN_FILE);
        $stylemin = plugins_url('assets/css/style.min.css', EPS_PLUGIN_FILE);
        $cardsjscss = plugins_url('assets/css/cardsjs.min.css', EPS_PLUGIN_FILE);
        $card_unmin = plugins_url('assets/js/card-js-unmin.js', EPS_PLUGIN_FILE);
        $indexjs = plugins_url('assets/js/index.js', EPS_PLUGIN_FILE);
        $appjs = plugins_url('assets/js/app.js', EPS_PLUGIN_FILE);
        $cardsjs = plugins_url('assets/js/cardsjs.js', EPS_PLUGIN_FILE);
        $epaycojs = plugins_url('assets/js/epayco.js', EPS_PLUGIN_FILE);
        //$epaycojs ="https://checkout.epayco.co/epayco.min.js";
        $epaycocheckout =  plugins_url('assets/js/epaycocheckout.js', EPS_PLUGIN_FILE);


        $lang = get_locale();
        $lang = explode('_', $lang);
        $lang = $lang[0];

        $doc_number = get_post_meta($order->get_id(), '_epayco_billing_dni', true) != null ? get_post_meta($order->get_id(), '_epayco_billing_dni', true) : ($order->get_meta('_epayco_billing_dni') !== "" ? $order->get_meta('_epayco_billing_dni') : $order->get_meta('_billing_custom_field'));
        $type_document = get_post_meta($order->get_id(), '_epayco_billing_type_document', true) != null ? get_post_meta($order->get_id(), '_epayco_billing_type_document', true) : ($order->get_meta('_epayco_billing_type_document') !== "" ? $order->get_meta('_epayco_billing_type_document') : "CC");
        $suscriptionDescription = (
            function_exists('mb_strlen')
                ? (mb_strlen($product_name_) > 25 ? mb_substr($product_name_, 0, 25) . '...' : $product_name_)
                : (strlen($product_name_) > 25 ? substr($product_name_, 0, 25) . '...' : $product_name_)
        );
        $shop_name = (
            function_exists('mb_strlen')
                ? (mb_strlen($this->get_option('shop_name')) > 25 ? mb_substr($this->get_option('shop_name'), 0, 25) . '...' : $this->get_option('shop_name'))
                : (strlen($this->get_option('shop_name')) > 25 ? substr($this->get_option('shop_name'), 0, 25) . '...' : $product_name_)
        );
        $this->epaycosuscription->hooks->template->getWoocommerceTemplate(
            'public/checkout/subscription.php',
            [
                'logo_comercio' => $logo_comercio,
                'invoice' => $order->get_order_number(),
                'city' => $order_data['billing']['city'],
                'address' => $order_data['billing']['address_1'],
                'amount' => $amount,
                'epayco'  => 'epayco subscription',
                'shop_name' => $shop_name,
                'product_name_' => $suscriptionDescription,
                'currency' => $currency,
                'email_billing' => $email_billing,
                'redirect_url' => $redirect_url,
                'name_billing' => $name_billing,
                'str_countryCode' => $str_countryCode,
                'style' => $style,
                'general' => $general,
                'card_style' => $card_style,
                'cardsjscss' => $cardsjscss,
                'indexjs' => $indexjs,
                'stylemin' => $stylemin,
                'card_unmin' => $card_unmin,
                'appjs' => $appjs,
                'cardsjs' => $cardsjs,
                'epaycojs' => $epaycojs,
                'apiKey' => $this->get_option('apiKey'),
                'privateKey' => $this->get_option('privateKey'),
                'lang' => $lang,
                'epaycocheckout' => $epaycocheckout,

            ]
        );
    }


    public function webhook(): array
    {
        // Limpiar cualquier output previo
        try {
            ob_clean();
            
            global $woocommerce;
            global $wpdb;
            if (!isset($_REQUEST['_wpnonce']) || !\wp_verify_nonce(\sanitize_text_field(\wp_unslash($_REQUEST['_wpnonce'])), 'epayco_subscription_action')) {
                if (!function_exists('wp_die') || !function_exists('__')) {
                    require_once ABSPATH . 'wp-includes/pluggable.php';
                }
                // \wp_die(esc_html__('Nonce verification failed', 'epayco-subscriptions-for-woocommerce'));
            }
            //obtiene los datos de la orden y la suscripcion desde los parametros recibidos
            $params = $_REQUEST;

            // Eliminar debug y retornar JSON para el frontend
            $return_url = '';
            if (isset($params['order_id'])) {
                $order_id = sanitize_text_field($params['order_id']);
                $order = wc_get_order($order_id);
                if ($order) {
                    $return_url = $order->get_checkout_order_received_url();
                }
            }

            $order_id = isset($_REQUEST["order_id"]) ? sanitize_text_field(wp_unslash($_REQUEST["order_id"])) : '';
            $order = new \WC_Order($order_id);
            $table_name = $wpdb->prefix . 'epayco_plans';
            $table_name_setings = $wpdb->prefix . 'epayco_setings';

            $subscriptions = $this->getWooCommerceSubscriptionFromOrderId($order_id);
            // subscription_id = $subscriptions[0]->get_id() ?? 0;
            // $subscription = wcs_get_subscription($subscription_id);
            $token = isset($params['epaycoToken']) ? sanitize_text_field(wp_unslash($params['epaycoToken'])) : '';
            
            $token = $this->createToken($token);
            $token = is_string($token) ? json_decode($token) : $token;
            if(!$token || !$token->status){
                $error = $this->errorMessages($token);
                wc_add_notice($error, 'error');
                wp_redirect(wc_get_checkout_url());
                exit;
                header('Content-Type: application/json');
                $return = [
                    'success' => false,
                    'result'   => 'error',
                    'message' =>  $error,
                    'url' => wc_get_checkout_url(),
                ];
                //echo json_encode( $return);
                //exit;
                return $return;
            }

            $customerName =  $params['name'] ?? '';
            $customerData = $this->paramsBilling($subscriptions, $order, $customerName);
            $customerData['token_card'] = $token->id;
            $customerData['email'] = 'ricardo' . date('YmdHis') . '@epayco.com';
            $cache_key = "epayco_customer_{$this->custIdCliente}_{$customerData['email']}";
            $customerGetData = wp_cache_get($cache_key, 'epayco');
            $ePaycoCustomer = new Customer();
            $customer_id = $this->createCustomer($customerData, $token->id, $order_id);
            if (is_null($customer_id) ) {
                $customer = $ePaycoCustomer->customerCreate($customerData);
                if ($customer->data->status == 'error' || !$customer->status) {
                    if (class_exists('WC_Logger')) {
                        $logger->info("customerCreate: " . json_encode($customer));
                    }
                    $customerJson = json_decode(json_encode($customer), true);
                    $dataError = $customerJson;
                    $error = isset($dataError['message']) ? $dataError['message'] : (isset($dataError["message"]) ? $dataError["message"] : __('El token no se puede asociar al cliente, verifique que: el token existe, el cliente no esté asociado y que el token no este asociado a otro cliente.', 'epayco-subscriptions-for-woocommerce'));
                    wc_add_notice($error, 'error');
                    wp_redirect(wc_get_checkout_url());
                    exit;
                    header('Content-Type: application/json');
                    $return = [
                        'success' => false,
                        'result'   => 'error',
                        'message' =>  $error,
                        'url' => wc_get_checkout_url(),
                    ];
                    //echo json_encode($return);
                    //exit;
                    //return $return;
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
                        $error_message = __('No se insertó el registro del cliente en la base de datos.', 'epayco-subscriptions-for-woocommerce');
                        wc_add_notice($error_message, 'error');
                        // Redirigir al mismo receipt page para permitir reintentar el pago sin recargar el checkout
                        $redirect_url = $order->get_checkout_payment_url(true);
                        wp_redirect($redirect_ur);
                        exit;
                        header('Content-Type: application/json');
                        $return = [
                            'success' => false,
                            'result'   => 'error',
                            'message' =>  $error_message,
                            'url' => $redirect_url,
                        ];
                       // echo json_encode($return);
                       // exit;
                        return $return;
                    }
                    if (class_exists('WC_Logger')) {
                        $logger->info("Error : 'No se inserto el registro del cliente en la base de datos.'");
                    }
                    $customerData['customer_id'] = $customer->data->customerId;
                }
            } else {
                $customerData['customer_id'] = $customer_id['customer_id'];
            }
            
            $confirm_url = $this->getUrlNotify($order_id);
            $plans = $this->getPlansBySubscription($subscriptions);
            $getPlans = $this->getPlans($plans);
            //$getPlansList = $this->getPlansList(); 
            if (!$getPlans) {
                $validatePlan_ = $this->validatePlan(true, $order_id, $plans, $subscriptions, $customerData, $confirm_url, $order, false, false, null);
            } else {
                $validatePlan_ = $this->validatePlan(false, $order_id, $plans, $subscriptions, $customerData, $confirm_url, $order, true, false, $getPlans);
            }
            
            $return = $validatePlan_;
            wp_redirect($return['url']);
            exit;
        } catch (Exception $exception) {
            if (class_exists('WC_Logger')) {
                $logger = wc_get_logger();
                $logger->info("Error : " . $exception->getMessage());
            }
            wc_add_notice($exception->getMessage(), 'error');
            header('Content-Type: application/json');
            $redirect_url = $order->get_checkout_payment_url(true);
            wp_redirect($redirect_ur);
            exit;
            $return = [
                'success' => false,
                'result'   => 'error',
                'message' =>  $exception->getMessage(),
                'url' => $redirect_url,
            ];
        }
        //echo json_encode($return);
        //exit;
        return $return;
    }

    public function validate_ePaycoSubscription_request(): void
    {
        @ob_clean();
        if (! empty($_REQUEST)) {
            header('HTTP/1.1 200 OK');
            do_action("ePaycoSubscription_init_validation", $_REQUEST);
        } else {
            wp_die('Do not access this page directly (ePayco)');
        }
    }

    public function customerCreate(array $data)
    {
        if (class_exists('WC_Logger')) {
            $logger = wc_get_logger();
        }
        $customer = false;
        try {
            $customer = $this->epaycoSdk->customer->create(
                [
                    "token_card" => $data['token_card'],
                    "name" => $data['name'],
                    "last_name" => $data['last_name'], // Este parámetro es opcional según tu ejemplo
                    "email" => $data['email'],
                    "phone" => $data['phone'],
                    "cell_phone" => $data['phone'],
                    "city" => $data['city'],
                    "address" => $data['address'],
                    "default" => true
                ]
            );
            if (class_exists('WC_Logger')) {
                $logger->info(json_encode($customer));
            }
        } catch (Exception $exception) {
            if (class_exists('WC_Logger')) {
                $logger->info("customerCreate" . $exception->getMessage());
                $logger->info("Error : " . $exception->getMessage());
            }
            // No usar echo aquí ya que interfiere con JSON response
            throw $exception; // Re-lanzar para manejo superior
        }

        return $customer;
    }

    public function customerAddToken($customer_id, $token_card)
    {
        if (class_exists('WC_Logger')) {
            $logger = wc_get_logger();
        }
        $customer = false;
        try {
            $customer = $this->epaycoSdk->customer->addNewToken(
                [
                    "token_card" => $token_card,
                    "customer_id" => $customer_id
                ]
            );
            if (class_exists('WC_Logger')) {
                $logger->info(json_encode($customer));
            }
        } catch (Exception $exception) {
            if (class_exists('WC_Logger')) {
                $logger->info("customerAddToken" . $exception->getMessage());
            }
            echo esc_html('add token: ' . $exception->getMessage());
            if (class_exists('WC_Logger')) {
                $logger->info("Error : " . $exception->getMessage());
            }
            die();
        }

        return $customer;
    }

    public function getPlans(array $plans)
    {
        foreach ($plans as $key => $plan) {
            try {
                $plan = $this->epaycoSdk->plan->get(strtolower($plans[$key]['id_plan']));
                if ($plan->status) {
                    unset($plans[$key]);
                    return $plan;
                } else {
                    return false;
                }
            } catch (Exception $exception) {
                if (class_exists('WC_Logger')) {
                    $logger = wc_get_logger();
                    $logger->info("getPlans" . $exception->getMessage());
                }
                echo esc_html($exception->getMessage());
                if (class_exists('WC_Logger')) {
                    $logger = wc_get_logger();
                    $logger->info("Error : " . $exception->getMessage());
                }
                die();
            }
        }
    }

    public function getPlansList()
    {
        try {
            $plan = $this->epaycoSdk->plan->getList();
            if ($plan->status) {
                return $plan;
            } else {
                return false;
            }
        } catch (Exception $exception) {
            if (class_exists('WC_Logger')) {
                $logger = wc_get_logger();
                $logger->info("getPlansList" . $exception->getMessage());
            }
            echo esc_html($exception->getMessage());
            if (class_exists('WC_Logger')) {
                $logger = wc_get_logger();
                $logger->info("Error : " . $exception->getMessage());
            }
            die();
        }
    }

    public function getPlanById($plan_id)
    {
        try {
            $plan = $this->epaycoSdk->plan->get(strtolower($plan_id));
            if ($plan->status) {
                return $plan;
            } else {
                return false;
            }
        } catch (Exception $exception) {
            if (class_exists('WC_Logger')) {
                $logger = wc_get_logger();
                $logger->info("getPlanById" . $exception->getMessage());
            }
            echo esc_html($exception->getMessage());
            if (class_exists('WC_Logger')) {
                $logger = wc_get_logger();
                $logger->info("Error : " . $exception->getMessage());
            }
            die();
        }
    }


    public function validatePlan($create, $order_id, array $plans, $subscriptions, $customer, $confirm_url, $order, $confirm = null, $update = null, $getPlans = null)
    {
        if (class_exists('WC_Logger')) {
            $logger = wc_get_logger();
        }
        
        if ($create) {
            $newPLan = $this->plansCreate($plans);
            
            if ($newPLan->status) {
                $getPlans_ = $this->getPlans($plans);

                if ($getPlans_) {
                    $eXistPLan = $this->validatePlanData($plans, $getPlans_, $order_id, $subscriptions, $customer, $confirm_url, $order);
                } else {
                    $this->validatePlan(true, $order_id, $plans, $subscriptions, $customer, $confirm_url, $order, false, false, null);
                }
            } else {
                // Corrige error: json_decode espera string, pero puede llegar stdClass
                if (is_string($newPLan)) {
                    $newPlanJson = json_decode($newPLan, true);
                    $dataError = $newPlanJson;
                } else {
                    $dataError = $newPLan;
                }
                if (class_exists('WC_Logger')) {
                    $logger->info("Error : " . json_encode($newPLan));
                }

                if (is_array($dataError)) {
                    $message = $dataError['message'];
                    $errores_listados = [];
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
                } else {
                    if (isset($newPLan->data->errors) && is_array($newPLan->data->errors)) {
                        foreach ($newPLan->data->errors as $campo => $mensajes) {
                            foreach ($mensajes as $msg) {
                                $errores_listados[] = ucfirst($campo) . ': ' . $msg;
                            }
                        }
                    }
                    $message = isset($newPLan->message) ? $newPLan->message : (isset($newPLan["message"]) ? $newPLan["message"] : __('El identificador del plan ya está en uso para este comercio. Por favor, elija un nombre diferente para el plan.', 'epayco-subscriptions-for-woocommerce'));
                }


                $errorMessage = $message;
                if (!empty($errores_listados)) {
                    $errorMessage .=  implode(' | ', $errores_listados);
                }



                $response_status = [
                    'success' => false,
                    /* translators: %s será reemplazado con el mensaje de error del nuevo plan */
                    'message' => $errorMessage,
                ];

                return $response_status;
            }
        } else {
            if ($confirm) {
                $eXistPLan = $this->validatePlanData($plans, $getPlans, $order_id, $subscriptions, $customer, $confirm_url, $order);
            }
        }
        return $eXistPLan;
    }

    public function validatePlanData($plans, $getPlans, $order_id, $subscriptions, $customer, $confirm_url, $order)
    {
        global $wpdb;
        $table_name = $wpdb->prefix . 'epayco_plans';
        $wc_order_product_lookup = $wpdb->prefix . "wc_order_product_lookup";
        foreach ($plans as $plan) {
            $plan_amount_cart = $plan['amount'];
            $plan_id_cart = $plan['id_plan'];
            $plan_currency_cart = $plan['currency'];
        }
        $plan_amount_epayco = $getPlans->plan->amount;
        $plan_id_epayco = $getPlans->plan->id_plan;
        $plan_currency_epayco = $getPlans->plan->currency;
        
        if ($plan_id_cart == $plan_id_epayco) {

            try {
                if (intval($plan_amount_cart) == $plan_amount_epayco) {
                    return $this->process_payment_epayco($plans, $customer, $confirm_url, $subscriptions, $order);
                } else {
                    return $this->validateNewPlanData($subscriptions, $order_id, $plan_amount_cart, $plan_currency_epayco, $plans, $customer, $confirm_url, $order);
                }
            } catch (Exception $exception) {
                if (class_exists('WC_Logger')) {
                    $logger = wc_get_logger();
                    $logger->info($exception->getMessage());
                }
                echo esc_html($exception->getMessage());
                die();
                return false;
            }
        } else {
            if (class_exists('WC_Logger')) {
                $logger = wc_get_logger();
                $logger->info("el id del plan creado no concuerda!");
            }
            echo 'el id del plan creado no concuerda!';
            die();
        }
    }

    public function validateNewPlanData($subscriptions, $order_id, $value, $currency, $plans, $customer, $confirm_url, $order)
    {
        global $wpdb;


        $subsCreated = $this->planUpdate($plans);
        if ($subsCreated->success) {

            return $this->process_payment_epayco($plans, $customer, $confirm_url, $subscriptions, $order);
        }
        error_log("validateNewPlanData: Error" . json_encode($subsCreated));
        return [
            "success" => false,
            "message" => __('Error al actualizar el plan en ePayco, por favor intente de nuevo.', 'epayco-subscriptions-for-woocommerce')
        ];
    }



    public function plansCreate(array $plans)
    {
        if (class_exists('WC_Logger')) {
            $logger = wc_get_logger();
        }
        foreach ($plans as $plan) {
            try {
                $plan_ = $this->epaycoSdk->plan->create(
                    [
                        "id_plan" => (string)strtolower($plan['id_plan']),
                        "name" => (string)$plan['name'],
                        "description" => (string)$plan['description'],
                        "amount" => $plan['amount'],
                        "currency" => $plan['currency'],
                        "interval" => $plan['interval'],
                        "interval_count" => $plan['interval_count'],
                        "trial_days" => $plan['trial_days'],
                        "ip" => $this->getIP(),
                        "iva" => isset($plan['iva']) ? $plan['iva'] : 0,
                        "ico" => isset($plan['ico']) ? $plan['ico'] : 0,
                        "planLink" => isset($plan['planLink']) ? $plan['planLink'] : "https://github.com/epayco",
                        "greetMessage" => isset($plan['greetMessage']) ? $plan['greetMessage'] : "",
                        "linkExpirationDate" => isset($plan['linkExpirationDate']) ? $plan['linkExpirationDate'] : "",
                        "subscriptionLimit" => isset($plan['subscriptionLimit']) ? $plan['subscriptionLimit'] : 10,
                        "imgUrl" => isset($plan['imgUrl']) ? $plan['imgUrl'] : "https://epayco.com/wp-content/uploads/2023/04/logo-blanco.svg",
                        // "discountValue" => isset($plan['discountValue']) ? $plan['discountValue'] : 5000,
                        // "discountPercentage" => isset($plan['discountPercentage']) ? $plan['discountPercentage'] : 19,
                        // "transactionalLimit" => isset($plan['transactionalLimit']) ? $plan['transactionalLimit'] : 2,
                        // "additionalChargePercentage" => isset($plan['additionalChargePercentage']) ? $plan['additionalChargePercentage'] : 0.0,
                        // "firstPaymentAdditionalCost" => isset($plan['firstPaymentAdditionalCost']) ? $plan['firstPaymentAdditionalCost'] : 45700
                    ]
                );

                if (class_exists('WC_Logger')) {
                    $logger->info(json_encode($plan_));
                }
                return $plan_;
            } catch (Exception $exception) {
                if (class_exists('WC_Logger')) {
                    $logger->info("plansCreate" . $exception->getMessage());
                }
                echo esc_html($exception->getMessage());
                if (class_exists('WC_Logger')) {
                    $logger->info("Error : " . $exception->getMessage());
                }
                die();
            }
        }
    }


    public function subscriptionCreate(array $plans, array $customer, $confirm_url)

    {
        if (class_exists('WC_Logger')) {
            $logger = wc_get_logger();
        }
        foreach ($plans as $plan) {
            try {
                $suscriptionBody  =  [
                    "id_plan" => $plan['id_plan'],
                    "customer" => $customer['customer_id'],
                    "token_card" => $customer['token_card'],
                    "doc_type" => $customer['type_document'],
                    "doc_number" => $customer['doc_number'],
                    "url_confirmation" => $confirm_url,
                    "method_confirmation" => "POST"
                ];
                $suscriptioncreted = $this->epaycoSdk->subscriptions->create($suscriptionBody);
                
                return $suscriptioncreted;
            } catch (Exception $exception) {
                if (class_exists('WC_Logger')) {
                    $logger->info("subscriptionCreate" . $exception->getMessage());
                }
                echo esc_html($exception->getMessage());
                if (class_exists('WC_Logger')) {
                    $logger->info("Error : " . $exception->getMessage());
                }
                die();
            }
        }
    }


    public function subscriptionCharge(array $plans, array $customer, $confirm_url, $epayco_subscription_id)
    {
        $subs = [];
        if (class_exists('WC_Logger')) {
            $logger = wc_get_logger();
        }

        foreach ($plans as $plan) {
            try {
                if (class_exists('WC_Logger')) {
                    $logger->info("subscriptionCharge : " . json_encode($customer));
                }
                $subs[] = $this->epaycoSdk->subscriptions->charge(
                    [
                        "id_plan" => $plan['id_plan'],
                        "customer" => $customer['customer_id'],
                        "token_card" => $customer['token_card'],
                        "doc_type" => $customer['type_document'],
                        "doc_number" => $customer['doc_number'],
                        "address" => $customer['address'],
                        "phone" => $customer['phone'],
                        "cell_phone" => $customer['phone'],
                        "ip" => $this->getIP(),
                        "idSubscription" => $epayco_subscription_id
                    ]
                );
            } catch (Exception $exception) {
                if (class_exists('WC_Logger')) {
                    $logger->info("subscriptionCharge" . $exception->getMessage());
                    $logger->info("Error : " . $exception->getMessage());
                }
                throw $exception; // Re-lanzar para manejo superior
            }
        }
        if (class_exists('WC_Logger')) {
            $logger->info("subscriptionCharge : " . json_encode($subs));
        }
        return $subs;
    }


    public function planUpdate(array $plans)
    {
        foreach ($plans as $plan) {
            try {
                $plan_ = $this->epaycoSdk->plan->update(
                    (string)strtolower($plan['id_plan']),
                    [
                        "name" => (string)$plan['name'],
                        "description" => (string)$plan['description'],
                        "amount" => $plan['amount'],
                        "currency" => $plan['currency'],
                        "interval" => $plan['interval'],
                        "interval_count" => $plan['interval_count'],
                        "trial_days" => $plan['trial_days'],
                        "iva" => $plan['iva'],
                    ]
                );

                return $plan_;
            } catch (Exception $exception) {
                if (class_exists('WC_Logger')) {
                    $logger = wc_get_logger();
                    $logger->info("planUpdate" . $exception->getMessage());
                }
                echo esc_html($exception->getMessage());
                if (class_exists('WC_Logger')) {
                    $logger = wc_get_logger();
                    $logger->info("Error : " . $exception->getMessage());
                }
                die();
            }
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


    private function getWooCommerceSubscriptionFromOrderId($orderId)
    {
        $subscriptions = wcs_get_subscriptions_for_order($orderId);

        return $subscriptions;
    }


    public function setPaymentsIdData(\WC_Order $order, $value): void
    {
        try {
            $logger = new \WC_Logger();
            if ($order instanceof \WC_Order) {
                $order->add_meta_data(self::ID, $value);
                $order->save();
            }
        } catch (\Exception $ex) {
            $error_message = "Unable to update batch of orders on action got error: {$ex->getMessage()}";
            $logger->add(self::ID, $error_message);
        }
    }


    public function setPaymentsIdDataForSubscription($subscription, $value): void
    {
        try {
            $logger = new \WC_Logger();

            if (is_array($subscription)) {
                foreach ($subscription as $sub) {
                    if ($sub instanceof \WC_Subscription) {
                        $sub->delete_meta_data(self::ID);
                        $sub->update_meta_data(self::ID, $value);
                        $sub->save();


                        $sub = wcs_get_subscription($sub->get_id());
                    } else {
                        $logger->add($this->id, "Elemento no es una instancia de WC_Subscription.");
                    }
                }
            } else {
                $logger->add($this->id, "Objeto no es una instancia de WC_Subscription.");
            }
        } catch (\Exception $ex) {
            $error_message = "Error al actualizar la suscripción: {$ex->getMessage()}";
            $logger->add($this->id, $error_message);
        }
    }


    public function paramsBilling($subscriptions, $order, $customerName)
    {
        $data = [];
        $subscription = end($subscriptions);
        if ($subscription) {
            $doc_number = get_post_meta($order->get_id(), '_epayco_billing_dni', true) != null ? get_post_meta($order->get_id(), '_epayco_billing_dni', true)  : ($order->get_meta('_epayco_billing_dni') !== "" ? $order->get_meta('_epayco_billing_dni') :  $order->get_meta('_billing_custom_field'));
            $type_document = get_post_meta($order->get_id(), '_epayco_billing_type_document', true) != null ? get_post_meta($order->get_id(), '_epayco_billing_type_document', true) : ($order->get_meta('_epayco_billing_type_document') !== "" ? $order->get_meta('_epayco_billing_type_document')  : "CC");

            // Mejorar captura de nombre y apellido
            $fullName = trim((string) ($customerName ?? ''));
            if (empty($fullName)) {
                // Si el nombre no viene por parámetro, usar los datos de la orden
                $firstName = $order->get_billing_first_name();
                $lastName = $order->get_billing_last_name();
                $data['name'] = $firstName;
                $data['last_name'] = $lastName;
            } else {
                $nameParts = explode(' ', $fullName);
                if (count($nameParts) >= 2) {
                    $data['name'] = $nameParts[0];
                    $data['last_name'] = implode(' ', array_slice($nameParts, 1));
                } else {
                    $data['name'] = $fullName;
                    $data['last_name'] = $fullName;
                }
            }

            $data['email'] = $subscription->get_billing_email();
            $data['phone'] = $subscription->get_billing_phone();
            $data['country'] = $subscription->get_shipping_country() ? $subscription->get_shipping_country() : $subscription->get_billing_country();
            $data['city'] = $subscription->get_shipping_city() ? $subscription->get_shipping_city() : $subscription->get_billing_city();
            $data['address'] = $subscription->get_shipping_address_1() ? $subscription->get_shipping_address_1() . " " . $subscription->get_shipping_address_2() : $subscription->get_billing_address_1() . " " . $subscription->get_billing_address_2();
            $data['doc_number'] = $doc_number;
            $data['type_document'] = $type_document;

            return $data;
        } else {
            $redirect = array(
                'result' => 'success',
                'redirect' => add_query_arg('order-pay', $order->id, add_query_arg('key', $order->order_key, get_permalink(woocommerce_get_page_id('pay'))))
            );
            wc_add_notice('EL producto que intenta pagar no es permitido', 'error');
            wp_redirect($redirect["redirect"]);
            die();
        }
    }


    public function getPlansBySubscription(array $subscriptions)
    {
        $plans = [];
        foreach ($subscriptions as $key => $subscription) {
            $total_discount = $subscription->get_total_discount();
            $total = $subscription->get_base_data()['total'];
            $tax = $subscription->get_base_data()['total_tax'] ?? 0;
            $subtotal = $total - $tax;
            if ($subtotal > 0 && $tax > 0) {
                $tax_percentage = ($tax / $subtotal) * 100;
                $tax_percentage = intval($tax_percentage); // Redondear a 2 decimales
            } else {
                $tax_percentage = 0;
            }
            $order_currency = $subscription->get_currency();
            $products = $subscription->get_items();
            $product_plan = $this->getPlan($products);
            $quantity = $product_plan['quantity'];
            $product_name = $product_plan['name'];
            $product_id = $product_plan['id'];
            $trial_days = $this->getTrialDays($subscription);
            $plan_code = "$product_name-$product_id";
            $plan_code = $trial_days > 0 ? "$product_name-$product_id-$trial_days" : $plan_code;
            $plan_code = get_option('woocommerce_currency') !== $order_currency ? "$plan_code-$order_currency" : $plan_code;
            $plan_code = $quantity > 1 ? "$plan_code-$quantity" : $plan_code;
            $plan_code = $total_discount > 0 ? "$plan_code-$total_discount" : $plan_code;
            $plan_code = rtrim($plan_code, "-");
            $plan_id = str_replace(array("-", "--"), array("_", ""), $plan_code);
            $plan_name = trim(str_replace("-", " ", $product_name));
            $plan_name = strtolower(str_replace("__", "_", $plan_id));
            $normalized = preg_replace('/[-_]+/', '_', $plan_code);
            $normalized = strtolower($normalized);
            $normalized = preg_replace('/[^a-z0-9_]/', '', $normalized);
            $description = str_replace('_', ' ', $plan_name);
            $plans[] = array_merge(
                [
                    "id_plan" => $normalized,
                    "name" => "Plan $description",
                    "description" => "Plan $description",
                    "currency" => $order_currency,
                    "amount" => $total,
                    "iva" => $tax_percentage,
                    "ico" => 0
                ],
                [
                    "trial_days" => $trial_days
                ],
                $this->intervalAmount($subscription)
            );
        }
        return $plans;
    }


    public function updatePlansBySubscription(array $subscriptions)
    {

        $ran = wp_rand(1, 999);
        $plans = [];

        foreach ($subscriptions as $key => $subscription) {

            $total_discount = $subscription->get_total_discount();
            $order_currency = $subscription->get_currency();
            $products = $subscription->get_items();
            $product_plan = $this->getPlan($products);
            $quantity = $product_plan['quantity'];
            $product_name = $product_plan['name'];
            $product_id = $product_plan['id'];
            $trial_days = $this->getTrialDays($subscription);

            $plan_code = "$product_name-$product_id";
            $plan_code = $trial_days > 0 ? "$product_name-$product_id-$trial_days" : $plan_code;
            $plan_code = get_option('woocommerce_currency') !== $order_currency ? "$plan_code-$order_currency" : $plan_code;
            $plan_code = $quantity > 1 ? "$plan_code-$quantity" : $plan_code;
            $plan_code = $total_discount > 0 ? "$plan_code-$total_discount" : $plan_code;
            $plan_code = rtrim($plan_code, "-");

            $plans[] = array_merge(
                [
                    "id_plan" => $plan_code . '-' . $ran,
                    "name" => "Plan $plan_code-$ran",
                    "description" => "Plan $plan_code-$ran",
                    "currency" => $order_currency,
                ],
                [
                    "trial_days" => $trial_days
                ],
                $this->intervalAmount($subscription)
            );
        }
        return $plans;
    }

    public function getPlan($products)
    {
        $product_plan = [];

        $product_plan['name'] = '';
        $product_plan['id'] = 0;
        $product_plan['quantity'] = 0;

        foreach ($products as $product) {
            $product_plan['name'] .= "{$product['name']}-";
            $product_plan['id'] .= "{$product['product_id']}-";
            $product_plan['quantity'] .= $product['quantity'];
        }

        $product_plan['name'] = $this->cleanCharacters($product_plan['name']);

        return $product_plan;
    }

    public function intervalAmount(\WC_Subscription $subscription)
    {
        return [
            "interval" => $subscription->get_billing_period(),
            "amount" => $subscription->get_total(),
            "interval_count" => $subscription->get_billing_interval()
        ];
    }

    public function getTrialDays(\WC_Subscription $subscription)
    {
        $trial_days = "0";
        $trial_start = $subscription->get_date('start');
        $trial_end = $subscription->get_date('trial_end');

        if ($trial_end > 0)
            $trial_days = (string)(strtotime($trial_end) - strtotime($trial_start)) / (60 * 60 * 24);

        return $trial_days;
    }

    public function cleanCharacters($string)
    {
        $string = str_replace(' ', '-', $string);
        $patern = '/[^A-Za-z0-9\-]/';
        return preg_replace($patern, '', $string);
    }

    public function getUrlNotify($order_id)
    {
        $confirm_url = get_site_url() . "/";
        $confirm_url = add_query_arg('wc-api', self::WEBHOOK_API_NAME, $confirm_url);
        $confirm_url = add_query_arg('order_id', $order_id, $confirm_url);
        $confirm_url = $confirm_url . '&confirmation=1';
        return $confirm_url;
    }

    public function handleStatusSubscriptions(array $subscriptionsStatus, array $subscriptions, array $customer, $order, $customerId, $suscriptionId, $planId)
    {
        global $wpdb;
        $table_subscription_epayco = $wpdb->prefix . 'epayco_subscription';
        
        // Inicializar logger
        $logger = null;
        if (class_exists('WC_Logger')) {
            $logger = wc_get_logger();
        }

        $count = 0;
        $messageStatus = [];
        $messageStatus['success'] = true;
        $messageStatus['message'] = [];
        $messageStatus['ref_payco'] = [];
        $messageStatus['orderStatus'] = [];
        $messageStatus['date'] = [];
        $quantitySubscriptions = count($subscriptionsStatus);
        $current_state = $order->get_status();

        foreach ($subscriptions as $subscription) {

            $sub = $subscriptionsStatus[$count];
            $data = count(get_object_vars($sub));
            
            if ($data < 10 || ( isset($sub->status) ? $sub->status == 'active' : false)) {
                
                $isTestTransaction = (bool)$this->get_option('environment') == true ? "yes" : "no";
                update_option('epayco_order_status', $isTestTransaction);
                $isTestMode = get_option('epayco_order_status') == "yes" ? "true" : "false";

                if ($isTestMode == "true") {
                    $message = 'Pago pendiente de aprobación Prueba';
                    $orderStatus = "epayco_on_hold";
                    if ($current_state != "epayco_on_hold" || $current_state == "pending") {
                        $this->restore_order_stock($order->id, '+');
                    }
                } else {
                    $message = 'Pago pendiente de aprobación';
                    $orderStatus = "epayco-on-hold";
                    if ($current_state != "epayco-on-hold" || $current_state == "pending") {
                        // $this->restore_order_stock($order->id, '+');
                    }
                }
                
               // $order->update_status($orderStatus);
               $is_payment_approved = (
                    $sub->data->cod_respuesta === '1' || 
                    intval($sub->data->cod_respuesta) === 1 || 
                    $sub->data->cod_respuesta === '1' ||
                    (isset($sub->data->estado) && strtolower($sub->data->estado) === 'aceptada')
                );

                $is_payment_pending = (
                    intval($sub->data->cod_respuesta) === 3 || 
                    $sub->data->cod_respuesta === '3' ||
                    (isset($sub->data->estado) && strtolower($sub->data->estado) === 'pendiente')
                );

                if($is_payment_pending || $is_payment_approved){
                    $order->update_status('on-hold');
                }else{
                    $messageStatus['ref_payco'] = array_merge($messageStatus['ref_payco'], [$sub->data->ref_payco]);
                    $messageStatus['orderStatus'] = array_merge($messageStatus['orderStatus'], [$sub->data->estado]);
                    $messageStatus['message'] = array_merge($messageStatus['message'], ["estado: {$sub->data->respuesta}"]);
                    $messageStatus['date'] = array_merge($messageStatus['date'], [current_time('Y-m-d H:i:s')]);
                    $messageStatus['success'] = false;
                    return $messageStatus;
                }
                if (isset($sub->data->cod_respuesta) && $is_payment_approved) {
                    if ($isTestMode == "true") {
                        $message = 'Pago exitoso Prueba';
                        switch ($this->get_option('epayco_endorder_state')) {
                            case 'epayco-processing': {
                                    $orderStatus = 'epayco_processing';
                                }
                                break;
                            case 'epayco-completed': {
                                    $orderStatus = 'epayco_completed';
                                }
                                break;
                            case 'processing': {
                                    $orderStatus = 'processing_test';
                                }
                                break;
                            case 'completed': {
                                    $orderStatus = 'completed_test';
                                }
                                break;
                            default: {
                                    $orderStatus = 'processing_test'; // Fallback
                                }
                                break;
                        }
                    } else {
                        $message = 'Pago exitoso';
                        $orderStatus = $this->get_option('epayco_endorder_state');
                        
                        // Fallback si la configuración no retorna nada
                        if (empty($orderStatus)) {
                            $orderStatus = 'processing';
                        }
                    }
                    $orderStatus = 'processing';
                    $order->update_status($orderStatus);
                }
                
                $order->add_order_note($message);

                $subscription->update_status('active');
            } else {

                $isTestTransaction = $sub->data->enpruebas == 1 ? "yes" : "no";
                update_option('epayco_order_status', $isTestTransaction);
                $isTestMode = get_option('epayco_order_status') == "yes" ? "true" : "false";
                if (isset($sub->data->cod_respuesta) && (intval($sub->data->cod_respuesta) === 2 || intval($sub->data->cod_respuesta) === 4)) {
                    $messageStatus['message'] = array_merge($messageStatus['message'], ["estado: {$sub->data->respuesta}"]);
                }

                // Validar si el pago fue exitoso: cod_respuesta "00" = aprobado, o cod_respuesta 1, o status/success true
                $is_payment_approved = (
                    $sub->data->cod_respuesta === '1' || 
                    intval($sub->data->cod_respuesta) === 1 || 
                    $sub->data->cod_respuesta === '1' ||
                    (isset($sub->data->estado) && strtolower($sub->data->estado) === 'aceptada')
                );
                $is_payment_pending = (
                    intval($sub->data->cod_respuesta) === 3 || 
                    $sub->data->cod_respuesta === '3' ||
                    (isset($sub->data->estado) && strtolower($sub->data->estado) === 'pendiente')
                );

                if($is_payment_pending || $is_payment_approved){
                    $order->update_status('on-hold');
                }else{
                    $messageStatus['ref_payco'] = array_merge($messageStatus['ref_payco'], [$sub->data->ref_payco]);
                    $messageStatus['orderStatus'] = array_merge($messageStatus['orderStatus'], [$sub->data->estado]);
                    $messageStatus['message'] = array_merge($messageStatus['message'], ["estado: {$sub->data->respuesta}"]);
                    $messageStatus['date'] = array_merge($messageStatus['date'], [current_time('Y-m-d H:i:s')]);
                    $messageStatus['success'] = false;
                    return $messageStatus;
                }

                if (isset($sub->data->cod_respuesta) && $is_payment_approved) {
                 
                    
                    if ($isTestMode == "true") {
                        $message = 'Pago exitoso Prueba';
                        switch ($this->get_option('epayco_endorder_state')) {
                            case 'epayco-processing': {
                                    $orderStatus = 'epayco_processing';
                                }
                                break;
                            case 'epayco-completed': {
                                    $orderStatus = 'epayco_completed';
                                }
                                break;
                            case 'processing': {
                                    $orderStatus = 'processing_test';
                                }
                                break;
                            case 'completed': {
                                    $orderStatus = 'completed_test';
                                }
                                break;
                            default: {
                                    $orderStatus = 'processing_test'; // Fallback
                                }
                                break;
                        }
                    } else {
                        $message = 'Pago exitoso';
                        $orderStatus = $this->get_option('epayco_endorder_state');
                        
                        // Fallback si la configuración no retorna nada
                        if (empty($orderStatus)) {
                            $orderStatus = 'processing';
                        }
                    }

                    if ($logger !== null) {
                        $logger->info("Intentando actualizar estado de orden a: " . $orderStatus);
                    }

                    $order->update_status($orderStatus);
                    $order->add_order_note($message);

                    // Validar que subscription y ref_payco existan
                    $subscription_id = isset($sub->subscription->_id) ? esc_html($sub->subscription->_id) : $subscription->get_id();
                    $ref_payco = isset($sub->data->ref_payco) ? esc_html($sub->data->ref_payco) : 'N/A';
                    
                    $note = sprintf(

                        /* translators: %1$s será reemplazado con el ID de la suscripción y %2$s con la referencia de pago */
                        esc_html__('Successful subscription (subscription ID: %1$s), reference (%2$s)', 'epayco-subscriptions-for-woocommerce'),
                        $subscription_id,
                        $ref_payco
                    );

                    $subscription->add_order_note($note);
                    $messageStatus['ref_payco'] = array_merge($messageStatus['ref_payco'], [$sub->data->ref_payco]);
                    $messageStatus['orderStatus'] = array_merge($messageStatus['orderStatus'], [$sub->data->estado]);
                    $messageStatus['date'] = array_merge($messageStatus['date'], [current_time('Y-m-d H:i:s')]);
                    $subscription->update_status('active'); // Asegurar que la suscripción se marque como activa
                    $subscription->payment_complete();
                    
                    if ($logger !== null) {
                        $logger->info("✅ Orden y suscripción actualizadas correctamente - Order ID: " . $order->get_id());
                    }
                    // $this->restore_order_stock($order->get_id(), "-");


                } elseif (isset($sub->data->cod_respuesta) && (intval($sub->data->cod_respuesta) === 3 || $sub->data->cod_respuesta === '3')) {
                    if ($isTestMode == "true") {
                        $message = 'Pago pendiente de aprobación Prueba';
                        $orderStatus = "epayco_on_hold";
                        if ($current_state != "epayco_on_hold") {
                            $this->restore_order_stock($order->get_id(), "+");
                        }
                    } else {
                        $message = 'Pago pendiente de aprobación';
                        $orderStatus = "epayco-on-hold";
                        if ($current_state != "epayco_on_hold") {
                            $this->restore_order_stock($order->get_id(), "+");
                        }
                    }

                    $order->update_status($orderStatus);
                    $order->add_order_note($message);
                    $subscription->update_status('on-hold');

                    // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
                    $wpdb->insert(
                        $table_subscription_epayco,
                        [
                            'order_id' => $subscription->get_id(),
                            'ref_payco' => $sub->data->ref_payco
                        ]
                    );
                }else{
                    $messageStatus['ref_payco'] = array_merge($messageStatus['ref_payco'], [$sub->data->ref_payco]);
                    $messageStatus['orderStatus'] = array_merge($messageStatus['orderStatus'], [$sub->data->estado]);
                    $messageStatus['message'] = array_merge($messageStatus['message'], ["estado: {$sub->data->respuesta}"]);
                    $messageStatus['date'] = array_merge($messageStatus['date'], [current_time('Y-m-d H:i:s')]);
                    $messageStatus['success'] = false;
                    return $messageStatus;
                }
            }
            
            $messageStatus['ref_payco'] = array_merge($messageStatus['ref_payco'], [$sub->data->ref_payco]);
            $messageStatus['orderStatus'] = array_merge($messageStatus['orderStatus'], [$sub->data->estado]);
            $messageStatus['date'] = array_merge($messageStatus['date'], [current_time('Y-m-d H:i:s')]);
            $count++;

            if ($count === $quantitySubscriptions && count($messageStatus['message']) >= $count) {
                $messageStatus['success'] = false;
            }

            update_post_meta($subscription->get_id(), 'subscription_id', $suscriptionId);
            update_post_meta($subscription->get_id(), 'id_client', $customerId);
            update_post_meta($subscription->get_id(), 'plan_id', $planId);
            update_post_meta($order->get_id(), 'subscription_id', $suscriptionId);
            update_post_meta($order->get_id(), 'id_client', $customerId);
            update_post_meta($order->get_id(), 'plan_id', $planId);
        }
    
        return $messageStatus;
    }

    public function savePlanId($order_id, array $plans, array $subscriptions, $update = null, $product_id = null)
    {
        $ran = wp_rand(1, 9999);

        global $wpdb;
        $table_subscription_epayco = $wpdb->prefix . 'epayco_plans';

        if ($update) {

            foreach ($plans as $plan) {
                try {
                    $plan_id_ = strtolower((string)$plan['id_plan']);
                    $plan_amount = floatval($plan['amount']);
                    $plan_currency = (string)$plan['currency'];
                    // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
                    $result = $wpdb->update(
                        $table_subscription_epayco,
                        [
                            'order_id' => intval($order_id),
                            'plan_id' => $plan_id_,
                            'amount' => $plan_amount,
                            'product_id' => $product_id,
                            'currency' => $plan_currency,
                        ],
                        [
                            'order_id' => intval($order_id),
                            'product_id' => $product_id,
                        ]
                    );
                } catch (Exception $exception) {
                    echo esc_html($exception->getMessage());
                    if (class_exists('WC_Logger')) {
                        $logger = wc_get_logger();
                        $logger->info("sub error: " . $exception->getMessage());
                    }
                    die();
                }
            }
        } else {

            try {
                foreach ($plans as $plan) {
                    $plan_id_ = (string)$plan['id_plan'] . "_" . $ran;
                    $plan_amount = floatval($plan['amount']);
                    $plan_currency = (string)$plan['currency'];
                }

                $dataToSave = [
                    'order_id' => intval($order_id),
                    'plan_id' => strtolower($plan_id_),
                    'amount' => $plan_amount,
                    'product_id' => $product_id,
                    'currency' => $plan_currency,
                ];

                // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching1
                $result = $wpdb->insert(
                    $table_subscription_epayco,
                    $dataToSave
                );
                $result = 1;
            } catch (Exception $exception) {
                echo esc_html($exception->getMessage());
                if (class_exists('WC_Logger')) {
                    $logger = wc_get_logger();
                    $logger->info("sub error: " . $exception->getMessage());
                }
                die();
            }
        }
        return $result;
    }

    public function process_payment_epayco(array $plans, array $customerData, $confirm_url, $subscriptions, $order)
    {
        $subsCreated = $this->subscriptionCreate($plans, $customerData, $confirm_url);
        
        if ($subsCreated->status) {
            if (isset($subsCreated->id)) {
                $epayco_subscription_id = $subsCreated->id;
                if (wcs_order_contains_subscription($order->get_id())) {
                    $subscriptions_wc = wcs_get_subscriptions_for_order($order, ['order_type' => 'parent']);
                    foreach ($subscriptions_wc as $subscription) {
                        update_post_meta($subscription->get_id(), '_epayco_subscription_id', $epayco_subscription_id);
                    }
                }
            }
            $subs = $this->subscriptionCharge($plans, $customerData, $confirm_url, $epayco_subscription_id);

            foreach ($subs as $sub) {
                $customerId = isset($subsCreated->customer->_id) ? $subsCreated->customer->_id : null;
                $suscriptionId = isset($subsCreated->id) ? $subsCreated->id : null;
                $this->setPaymentsIdDataForSubscription($subscriptions, $suscriptionId);
                $planId = isset($subsCreated->data->idClient) ? $subsCreated->data->idClient : null;
                // Validar si la transacción fue exitosa - la propiedad es "success" no "status"
                $validation = isset($sub->success) ? $sub->success : false;
                $active_plan = isset($sub->status) ? $sub->status : false;
                if ($validation || $active_plan) {
                    $messageStatus = $this->handleStatusSubscriptions($subs, $subscriptions, $customerData, $order, $customerId, $suscriptionId, $planId);
                    $response_status = [
                            'ref_payco' => $messageStatus['ref_payco'][0],
                            'orderStatus' => $messageStatus['orderStatus'][0],
                            'success' => $messageStatus['success'],
                            'message' => $messageStatus['message'][0],
                            'date' => $messageStatus['date'][0],
                            'url' => $order->get_checkout_order_received_url()
                        ];
                } else {
                    error_log("process_payment_epayco: " . json_encode($sub));
                    $subJson = json_decode(json_encode($sub), true);
                    if (class_exists('WC_Logger')) {
                        $logger = wc_get_logger();
                        $logger->info("process_payment_epayco_error_sub:" . json_encode($sub));
                    }
                    $dataError = $subJson;
                    $message = isset($dataError['message']) ? $dataError['message'] : (isset($dataError["message"]) ? $dataError["message"] : __('Ocurrió un error, por favor contactar con soporte.', 'epayco-subscriptions-for-woocommerce'));
                    $errores_listados = [];
                    if (isset($dataError['data']['errors'])) {
                        if (is_array($dataError['data']['errors'])) {
                            foreach ($dataError['data']['errors'] as $campo => $mensajes) {
                                foreach ($mensajes as $msg) {
                                    $errores_listados[] = ucfirst($campo) . ': ' . $msg;
                                }
                            }
                        } else {
                            $errores_listados[] = $dataError['data']['errors'];
                        }
                    }
                    if (isset($dataError['data']->errors) && is_array($dataError['data']->errors)) {
                        foreach ($dataError['data']->errors as $campo => $mensajes) {
                            foreach ($mensajes as $msg) {
                                $errores_listados[] = ucfirst($campo) . ': ' . $msg;
                            }
                        }
                    }
                    $errorMessage = $message;
                    if (!empty($errores_listados)) {
                        $errorMessage .=  implode(' | ', $errores_listados);
                    }

                    $response_status = [
                        'ref_payco' => null,
                        'success' => false,
                        'message' => $errorMessage,
                        'url' => $order->get_checkout_order_received_url()
                    ];
                }
            }
        } else {
            error_log("process_payment_epayco error: " . json_encode($subsCreated));
            $subsCreatedJson = json_decode(json_encode($subsCreated), true);
            $dataError = $subsCreatedJson;
            if (class_exists('WC_Logger')) {
                $logger = wc_get_logger();
                $logger->info("process_payment_epayco_error:" . json_encode($subsCreated));
            }
            $message = isset($dataError['message']) ? $dataError['message'] : (isset($dataError["message"]) ? $dataError["message"] : __('Ocurrió un error, por favor contactar con soporte.', 'epayco-subscriptions-for-woocommerce'));
            $errores_listados = [];
            if (isset($dataError['data']['errors'])) {
                if (is_array($dataError['data']['errors'])) {
                    foreach ($dataError['data']['errors'] as $campo => $mensajes) {
                        foreach ($mensajes as $msg) {
                            $errores_listados[] = ucfirst($campo) . ': ' . $msg;
                        }
                    }
                } else {
                    $errores_listados[] = $dataError['data']['errors'];
                }
            }
            if (isset($dataError['data']->errors) && is_array($dataError['data']->errors)) {
                foreach ($dataError['data']->errors as $campo => $mensajes) {
                    foreach ($mensajes as $msg) {
                        $errores_listados[] = ucfirst($campo) . ': ' . $msg;
                    }
                }
            }
            $errorMessage = $message . " ";
            if (!empty($errores_listados)) {
                $errorMessage .=  implode(' | ', $errores_listados);
            }
            $response_status = [
                'ref_payco' => null,
                'success' => false,
                'message' => $errorMessage,
                'url' => $order->get_checkout_order_received_url()
            ];
        }
        return $response_status;
    }


    public function getIP()
    {
        if (getenv('HTTP_CLIENT_IP'))
            $ipaddress = getenv('HTTP_CLIENT_IP');
        else if (getenv('HTTP_X_FORWARDED_FOR'))
            $ipaddress = getenv('HTTP_X_FORWARDED_FOR');
        else if (getenv('HTTP_X_FORWARDED'))
            $ipaddress = getenv('HTTP_X_FORWARDED');
        else if (getenv('HTTP_FORWARDED_FOR'))
            $ipaddress = getenv('HTTP_FORWARDED_FOR');
        else if (getenv('HTTP_FORWARDED'))
            $ipaddress = getenv('HTTP_FORWARDED');
        else if (getenv('REMOTE_ADDR'))
            $ipaddress = getenv('REMOTE_ADDR');
        else
            $ipaddress = '127.0.0.1';

        return $ipaddress;
    }

    public function authSignature($x_ref_payco, $x_transaction_id, $x_amount, $x_currency_code)
    {
        $signature = hash(
            'sha256',
            trim($this->get_option('custIdCliente')) . '^'
                . trim($this->get_option('pKey')) . '^'
                . $x_ref_payco . '^'
                . $x_transaction_id . '^'
                . $x_amount . '^'
                . $x_currency_code
        );
        return $signature;
    }

    /**
     * @param $order_id
     */
    public function restore_order_stock($order_id, $operation = 'increase')
    {
        $order = wc_get_order($order_id);
        if (!get_option('woocommerce_manage_stock') == 'yes' && !sizeof($order->get_items()) > 0) {
            return;
        }

        foreach ($order->get_items() as $item) {
            // Get an instance of corresponding the WC_Product object
            $product = $item->get_product();
            $qty = $item->get_quantity(); // Get the item quantity
            wc_update_product_stock($product, $qty, $operation);
        }
    }

    public function cancelledPayment($order_id, $id_client, $subscription_id, $planId)
    {
        $order = new \WC_Order($order_id);
        $current_state = $order->get_status();
        $subscriptions = $this->getWooCommerceSubscriptionFromOrderId($order_id);
        $isTestMode = get_option('epayco_order_status') == "yes" ? "true" : "false";
        foreach ($subscriptions as $subscription) {
            if ($isTestMode == "true") {
                $message = 'Pago rechazado Prueba';
                if (
                    $current_state == "epayco_failed" ||
                    $current_state == "epayco_cancelled" ||
                    $current_state == "failed" ||
                    $current_state == "epayco_processing" ||
                    $current_state == "epayco_completed" ||
                    $current_state == "processing_test" ||
                    $current_state == "completed_test"
                ) {
                    $order->update_status('epayco_cancelled');
                    $order->add_order_note($message);
                    $subscription->update_status('on-hold');
                } else {
                    $messageClass = 'woocommerce-error';
                    $order->update_status('epayco_cancelled');
                    $order->add_order_note($message);
                    $subscription->update_status('on-hold');
                }
            } else {
                if (
                    $current_state == "epayco-failed" ||
                    $current_state == "epayco-cancelled" ||
                    $current_state == "failed" ||
                    $current_state == "epayco-processing" ||
                    $current_state == "epayco-completed" ||
                    $current_state == "processing" ||
                    $current_state == "completed"
                ) {
                    $subscription->payment_failed();
                    $order->update_status('epayco-cancelled');
                    $order->add_order_note('Pago fallido');
                } else {
                    $message = 'Pago rechazado';
                    $messageClass = 'woocommerce-error';
                    $order->update_status('epayco-cancelled');
                    $order->add_order_note('Pago fallido');
                    $subscription->payment_failed();
                }
            }
            update_post_meta($subscription->get_id(), 'subscription_id', $subscription_id);
            update_post_meta($subscription->get_id(), 'id_client', $id_client);
            update_post_meta($subscription->get_id(), 'plan_id', $planId);
            update_post_meta($order->get_id(), 'subscription_id', $subscription_id);
            update_post_meta($order->get_id(), 'id_client', $id_client);
            update_post_meta($order->get_id(), 'plan_id', $planId);
            $response_status = [
                'ref_payco' => null,
                'success' => true,
                'message' => null,
                'url' => $order->get_checkout_order_received_url()
            ];

            return $response_status;
        }
    }

    public function subscription_epayco_confirm(array $params)
    {

        $order_id = trim(sanitize_text_field($params['order_id']));
        $order = new \WC_Order($order_id);
        $current_state = $order->get_status();
        if (isset($params['x_signature'])) {

            if (!isset($_REQUEST['_wpnonce']) || !\wp_verify_nonce(\sanitize_text_field(\wp_unslash($_REQUEST['_wpnonce'])), 'epayco_subscription_action')) {
                wp_die(esc_html__('Nonce verification failed', 'epayco-subscriptions-for-woocommerce'));
            }

            $x_ref_payco = isset($_REQUEST['x_ref_payco']) ? trim(\sanitize_text_field(\wp_unslash($_REQUEST['x_ref_payco']))) : '';
            $x_transaction_id = isset($_REQUEST['x_transaction_id']) ? trim(\sanitize_text_field(\wp_unslash($_REQUEST['x_transaction_id']))) : '';
            if (isset($_REQUEST['x_amount'])) {
                $x_amount = trim(sanitize_text_field(wp_unslash($_REQUEST['x_amount'])));
            } else {
                $x_amount = '';
            }
            $x_currency_code = isset($_REQUEST['x_currency_code']) ? trim(sanitize_text_field(wp_unslash($_REQUEST['x_currency_code']))) : '';
            $x_signature = isset($_REQUEST['x_signature']) ? trim(sanitize_text_field(wp_unslash($_REQUEST['x_signature']))) : '';
            $x_cod_transaction_state = isset($_REQUEST['x_cod_transaction_state']) ? (int)trim(sanitize_text_field(wp_unslash($_REQUEST['x_cod_transaction_state']))) : 0;
            if ($order_id != "" && $x_ref_payco != "") {
                $authSignature = $this->authSignature($x_ref_payco, $x_transaction_id, $x_amount, $x_currency_code);
            }
        }

        $current_state = $order->get_status();
        if ($authSignature == $x_signature) {
            $subscriptions = $this->getWooCommerceSubscriptionFromOrderId($order_id);
            $x_test_request = isset($_REQUEST['x_test_request']) ? trim(sanitize_text_field(wp_unslash($_REQUEST['x_test_request']))) : '';
            $isTestTransaction = $x_test_request == "TRUE" ? "yes" : "no";
            update_option('epayco_order_status', $isTestTransaction);
            $isTestMode = get_option('epayco_order_status') == "yes" ? "true" : "false";
            foreach ($subscriptions as $subscription) {
                if ($x_cod_transaction_state == 1) {
                    if ($isTestMode == "true") {
                        $message = 'Pago exitoso Prueba';
                        switch ($this->get_option('epayco_endorder_state')) {
                            case 'epayco-processing': {
                                    $orderStatus = 'epayco_processing';
                                }
                                break;
                            case 'epayco-completed': {
                                    $orderStatus = 'epayco_completed';
                                }
                                break;
                            case 'processing': {
                                    $orderStatus = 'processing_test';
                                }
                                break;
                            case 'completed': {
                                    $orderStatus = 'completed_test';
                                }
                                break;
                        }

                        if (!($current_state == "epayco_on_hold")) {
                            // $this->restore_order_stock($order->get_id(), "+");
                        }
                    } else {
                        $message = 'Pago exitoso';
                        $orderStatus = $this->get_option('epayco_endorder_state');
                        if (!($current_state == "epayco-on-hold")) {
                            // $this->restore_order_stock($order->get_id(), "+");
                        }
                    }

                    $subscription->payment_complete();
                    $order->update_status($orderStatus);
                    $order->add_order_note($message);

                    $note = sprintf(
                        /* translators: %1$s será reemplazado con el ID de la suscripción y %2$s con la referencia de pago */
                        esc_html__('Successful subscription (subscription ID: %1$s), reference (%2$s)', 'epayco-subscriptions-for-woocommerce'),
                        esc_html($subscription->get_data()['id']),
                        esc_html($x_ref_payco)
                    );

                    $subscription->add_order_note($note);

                    echo "1";
                }

                if (
                    $x_cod_transaction_state == 2 ||
                    $x_cod_transaction_state == 4 ||
                    $x_cod_transaction_state == 6 ||
                    $x_cod_transaction_state == 9 ||
                    $x_cod_transaction_state == 10 ||
                    $x_cod_transaction_state == 11
                ) {
                    if ($isTestMode == "true") {
                        $message = 'Pago rechazado Prueba: ' . $x_ref_payco;
                        if (
                            $current_state == "epayco_failed" ||
                            $current_state == "epayco_cancelled" ||
                            $current_state == "failed" ||
                            $current_state == "epayco_processing" ||
                            $current_state == "epayco_completed" ||
                            $current_state == "processing_test" ||
                            $current_state == "completed_test"
                        ) {
                            $order->update_status('epayco_cancelled');
                            $order->add_order_note($message);
                            $subscription->update_status('on-hold');
                        } else {
                            $order->update_status('epayco_cancelled');
                            $order->add_order_note($message);
                            $subscription->update_status('on-hold');
                            if (
                                $current_state = "epayco-on-hold" ||
                                $current_state = "epayco-on-hold"
                            ) {
                                $this->restore_order_stock($order->get_id());
                            }
                        }
                    } else {
                        $counter = 3;
                        $message = 'Pago rechazado: ' . $x_ref_payco;
                        if (
                            $current_state == "epayco-failed" ||
                            $current_state == "epayco-cancelled" ||
                            $current_state == "failed" ||
                            $current_state == "epayco-processing" ||
                            $current_state == "epayco-completed" ||
                            $current_state == "processing" ||
                            $current_state == "completed"
                        ) {
                            if ($counter <= 0) {
                                $order->update_status('epayco-cancelled');
                                $order->add_order_note($message);
                                $subscription->update_status('on-hold');
                                $counter = 3;
                            } else {
                                $counter -= 1;
                            }
                        } else {
                            if ($counter <= 0) {
                                $order->update_status('epayco-cancelled');
                                $order->add_order_note($message);
                                $subscription->update_status('on-hold');
                                $counter = 3;
                            } else {
                                $counter -= 1;
                            }
                            if (
                                $current_state = "epayco-on-hold" ||
                                $current_state = "epayco-on-hold"
                            ) {
                                $this->restore_order_stock($order->get_id());
                            }
                        }
                    }
                    echo esc_html($x_cod_transaction_state);
                }

                if ($x_cod_transaction_state == 3) {
                    if ($isTestMode == "true") {
                        $message = 'Pago pendiente de aprobación Prueba';
                        $orderStatus = "epayco_on_hold";
                        if (!($current_state == "epayco_on_hold")) {
                            $this->restore_order_stock($order->get_id(), "+");
                        }
                    } else {
                        $message = 'Pago pendiente de aprobación';
                        $orderStatus = "epayco-on-hold";
                        if (!($current_state == "epayco-on-hold")) {
                            $this->restore_order_stock($order->get_id(), "+");
                        }
                    }

                    $order->update_status($orderStatus);
                    $order->add_order_note($message);
                    $subscription->update_status('on-hold');
                    echo "3";
                    die();
                }
            }
        } else {
            $message = 'Firma no valida';
            echo esc_html($message);
        }
    }



    public function updateStatusSubscription()
    {
        $subs = $this->epaycoSdk->subscriptions->getList();
        $logger = new \WC_Logger();
        global $wpdb;
        $table_name = $wpdb->prefix . 'wc_orders';
        $counter = 10;

        if (!empty($subs->data)) {
            foreach ($subs->data as $epayco_subscription) {
                $epayco_id = $epayco_subscription->_id ?? null;
                $epayco_status = strtolower($epayco_subscription->status ?? '');

                if (empty($epayco_id)) continue;

                $meta = $wpdb->get_results(
                    $wpdb->prepare(
                        "SELECT * FROM {$wpdb->postmeta} WHERE meta_key = %s AND meta_value = %s",
                        '_epayco_subscription_id',
                        strval(trim($epayco_id))
                    )
                );

                if (!empty($meta)) {
                    foreach ($meta as $row) {
                        $wc_subscription_id = $row->post_id;
                        $wc_subscription = wcs_get_subscription($wc_subscription_id);

                        if (!$wc_subscription) continue;

                        $current_status = $wc_subscription->get_status();
                        $desired_status = null;

                        if (in_array($epayco_status, ['inactive', 'cancelled', 'canceled'])) {
                            $desired_status = 'cancelled';
                        } elseif ($epayco_status === 'pending') {
                            $desired_status = 'on-hold';
                        } elseif ($epayco_status === 'active') {
                            $desired_status = 'active';
                        }


                        if (!$desired_status || $current_status === $desired_status) continue;
                        try {

                            $allowed_force_statuses = ['active', 'cancelled', 'on-hold'];

                            $logger->add(self::LOG_SOURCE, "Actualizando estado de la suscripción. ID={$wc_subscription_id}, Estado actual: {$current_status}, Nuevo estado: {$desired_status}");
                            if (in_array($desired_status, $allowed_force_statuses)) {
                                if ($desired_status == 'cancelled') {
                                    if ($counter <= 0) {
                                        $wc_subscription->update_status($desired_status);

                                        $result = wp_update_post([
                                            'ID' => $wc_subscription_id,
                                            'post_status' => 'wc-' . $desired_status,
                                        ], true);
                                        $counter = 10;
                                    } else {
                                        $counter -= 1;
                                    }
                                } else {
                                    $wc_subscription->update_status($desired_status);

                                    $result = wp_update_post([
                                        'ID' => $wc_subscription_id,
                                        'post_status' => 'wc-' . $desired_status,
                                    ], true);
                                }



                                // if (is_wp_error($result)) {
                                //    // $logger->add(self::LOG_SOURCE, "❌ No se pudo realizar el cambio de estado de la suscripción con wp_update_post ");
                                // } else {
                                //  //   $logger->add(self::LOG_SOURCE, "✅ Estado actualizado con update_status y wp_update_post. ID={$wc_subscription_id}");
                                // }

                            }
                        } catch (\Throwable $e) {
                            $logger->add(self::LOG_SOURCE, "❌ No se pudo realizar el cambio de estado de la suscripción con wp_update_post " . $e);
                        }

                        if ($current_status === 'pending-cancel' && $desired_status === 'active') {
                            try {
                                $sql = $wpdb->prepare(
                                    "UPDATE {$table_name} SET status = %s WHERE id = %d",
                                    'wc-active',
                                    $wc_subscription_id
                                );
                                $result = $wpdb->query($sql);
                                if ($result === false) {
                                    $logger->add(self::LOG_SOURCE, "❌ Error en consulta SQL para ID={$wc_subscription_id}");
                                } elseif ($result === 0) {
                                    // $logger->add(self::LOG_SOURCE, "ℹ️ SQL ejecutada pero sin cambios en ID={$wc_subscription_id}");
                                } else {
                                    // $logger->add(self::LOG_SOURCE, "✅ Consulta SQL ejecutada correctamente para ID={$wc_subscription_id}.");
                                }
                            } catch (\Throwable $e) {
                                $logger->add(self::LOG_SOURCE, "❗ Excepción en SQL manual para ID={$wc_subscription_id}: " . $e->getMessage());
                            }
                        }
                    }
                }
            }
        }
    }


    public function on_wc_subscription_cancelled($subscription)
    {
        $epayco_subscription_id = get_post_meta($subscription->get_id(), '_epayco_subscription_id', true);

        if ($epayco_subscription_id) {
            $this->cancelSubscription($epayco_subscription_id);
        }
    }


    /**
     * Render order form
     *
     * @param $order_id
     * @throws Exception
     */
    public function renderOrderForm($order_id): void {}

    public function string_sanitize($string, $force_lowercase = true, $anal = false)
    {
        $strip = array("~", "`", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "=", "+", "[", "{", "]", "}", "\\", "|", ";", ":", "\"", "'", "&#8216;", "&#8217;", "&#8220;", "&#8221;", "&#8211;", "&#8212;", "â€”", "â€“", ",", "<", ".", ">", "/", "?");
        $clean = trim(str_replace($strip, "", wp_strip_all_tags($string)));
        $clean = preg_replace('/\s+/', "_", $clean);
        $clean = ($anal) ? preg_replace("/[^a-zA-Z0-9]/", "", $clean) : $clean;
        return $clean;
    }


    public function updateCustomerInfo($customer, $customerData)
    {
        global $wpdb;

        $table_name = $wpdb->prefix . 'settings_epayco';

        $id_payco    = $this->custIdCliente;
        $customer_id = $customer->data->customerId;
        $token_id    = $customerData['token_card'];
        $email       = $customerData['email'];

        // Preparar SQL con ON DUPLICATE KEY
        $sql = $wpdb->prepare("
            INSERT INTO $table_name (id_payco, customer_id, token_id, email)
            VALUES (%s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
                id_payco = VALUES(id_payco),
                customer_id = VALUES(customer_id),
                token_id = VALUES(token_id)
        ", $id_payco, $customer_id, $token_id, $email);

        $wpdb->query($sql);
    }

    public function renderThankYouPage($order_id): void
    {
        // Validate order id
        if (empty($order_id)) {
            return;
        }

        $order = \wc_get_order($order_id);
        if (!$order) {
            return;
        }

        // Ensure this thank you content is only rendered for this gateway
        if (method_exists($order, 'get_payment_method') && $order->get_payment_method() !== $this->id) {
            return;
        }

        // Build data payload for DetailPurchase.config
        $request = $_REQUEST; // phpcs:ignore WordPress.Security.NonceVerification

        $get = static function ($key) use ($request) {
            return isset($request[$key]) ? \sanitize_text_field(\wp_unslash($request[$key])) : null;
        };

        // Determine ePayco reference from possible request keys
        $referencePayco = $get('x_ref_payco') ?: $get('ref_payco') ?: $get('referencePayco') ?: $get('refPayco');


        //    $subs = $this->epaycoSdk->charge->transaction($referencePayco);
        // $data = [
        //     // Prefer gateway-provided response over order status
        //     'status'           => $get('x_response') ?: (method_exists($order, 'get_status') ? $order->get_status() : null),
        //     'referencePayco'   => $referencePayco,
        //     'transactionDate'  => $get('x_transaction_date'),
        //     'franchise'        => $get('x_franchise'),
        //     // Prefer invoice id from gateway if available
        //     'bill'             => $get('x_id_invoice') ?: (method_exists($order, 'get_order_number') ? $order->get_order_number() : (string) $order_id),
        //     'authorization'    => $get('x_approval_code'),
        //     'taxBaseClient'    => is_null($get('x_amount_base')) ? null : (float) $get('x_amount_base'),
        //     'numberCard'       => $get('x_cardnumber'),
        //     // Prefer transaction description from gateway
        //     'description'      => $get('x_description') ?: (method_exists($order, 'get_formatted_billing_full_name') ? $order->get_formatted_billing_full_name() : null),
        //     'ip'               => $get('x_customer_ip') ?: (method_exists($order, 'get_customer_ip_address') ? $order->get_customer_ip_address() : null),
        //     'response'         => $get('x_response_reason_text'),
        //     'currency'         => $get('x_currency_code') ?: (method_exists($order, 'get_currency') ? $order->get_currency() : null),
        //     'amount'           => is_null($get('x_amount')) ? (method_exists($order, 'get_total') ? (float) $order->get_total() : null) : (float) $get('x_amount'),
        //     'expirationDate'   => $get('x_expiration_date'),
        //     'codeProject'      => $get('x_code_project'),
        //     'pin'              => $get('x_pin'),
        // ];

        // Language and flags
        $lang = \get_locale();
        if (is_string($lang) && strpos($lang, '_') !== false) {
            $parts = explode('_', $lang);
            $lang = $parts[0];
        }
        $sendEmail = true;

        $this->epaycosuscription->hooks->template->getWoocommerceTemplate(
            'public/checkout/order-received.php',
            [
                'referencePayco' => $referencePayco,
                // 'data' => $data,
                'lang' => $lang,
                'sendEmail' => $sendEmail,
            ]
        );
    }

    public function epyacoBerarToken()
    {
        $publicKey = $this->get_option('apiKey');
        $privateKey = $this->get_option('privateKey');
        
        $cookie_name = $publicKey .  "_apify";
        if (!isset($_COOKIE[$cookie_name])) {
            $token = base64_encode($publicKey . ":" . $privateKey);
            $bearer_token = $token;
            $cookie_value = $bearer_token;
            setcookie($cookie_name, $cookie_value, time() + (60 * 14), "/");
        } else {
            $bearer_token = $_COOKIE[$cookie_name];
        }
        
        $headers = array(
            'Content-Type' => 'application/json',
            'Authorization' => "Basic " . $bearer_token
        );
        
        return $this->epayco_realizar_llamada_api("login", [], $headers);
    }

    public function epayco_realizar_llamada_api($path, $data, $headers, $method = 'POST')
    {
        $url = 'https://eks-apify-service.epayco.io/' . $path;

        $response = wp_remote_post($url, [
            'headers' => $headers,
            'body'    => json_encode($data),
            'timeout' => 15,
        ]);

        if (is_wp_error($response)) {
            $error_message = $response->get_error_message();
            //self::$logger->add($this->id, "Error al hacer la llamada a la API de ePayco: " . $error_message);
            error_log("Error al hacer la llamada a la API de ePayco: " . $error_message);
            return false;
        } else {
            $response_body = wp_remote_retrieve_body($response);
            $status_code = wp_remote_retrieve_response_code($response);
            if ($status_code == 200) {
                $responseTransaction = json_decode($response_body, true);
                return $responseTransaction;
            } else {
                //self::$logger->add($this->id,"Error en la respuesta de la API de ePayco, código de estado: " . $status_code);
                error_log("Error en la respuesta de la API de ePayco, código de estado: " . $status_code);
                return false;
            }
        }
    }
}
