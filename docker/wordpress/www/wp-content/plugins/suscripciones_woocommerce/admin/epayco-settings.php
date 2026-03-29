<?php
return array(

    
    'enabled' => array(
        'title' => __('Habilitar/Deshabilitar', 'epayco-subscriptions-for-woocommerce'),
        'type' => 'checkbox',
        'label' => __('Habilitar ePayco Checkout Suscripción', 'epayco-subscriptions-for-woocommerce'),
        'default' => 'yes'
    ),
    'epayco_title' => array(
        'title' => __('Titulo', 'epayco-subscriptions-for-woocommerce'),
        'type' => 'text',
      'description' => __('Corresponde al título que los usuarios visualizan en el checkout', 'epayco-subscriptions-for-woocommerce'),
       'default' => __('Titulo', 'epayco-subscriptions-for-woocommerce'),
        'desc_tip' => true,
    ),
    'shop_name' => array(
        'title' => __('Nombre del comercio', 'epayco-subscriptions-for-woocommerce'),
        'type' => 'text',
        'description' => __('Corresponde al nombre de la tienda que los usuarios visualizan en el checkout', 'epayco-subscriptions-for-woocommerce'),
        'default' => __('Nombre de la tienda', 'epayco-subscriptions-for-woocommerce'),
        'desc_tip' => true,
    ),
    'description' => array(
        'title' => __('Description', 'epayco-subscriptions-for-woocommerce'),
        'type' => 'textarea',
        'description' => __('Corresponde al descripción de la tienda que los usuarios visualizan en el checkout', 'epayco-subscriptions-for-woocommerce'),
        'default' => __('Detalle de la suscripción ePayco', 'epayco-subscriptions-for-woocommerce'),
        'desc_tip' => true,
    ),
    'environment' => array(
        'title' => __('Modo', 'epayco-subscriptions-for-woocommerce'),
        'type' => 'select',
        'class' => 'wc-enhanced-select',
        'description' => __('mode prueba/producción', 'epayco-subscriptions-for-woocommerce'),
        'desc_tip' => true,
        'default' => true,
        'options' => array(
            false => __('Production', 'epayco-subscriptions-for-woocommerce'),
            true => __('Test', 'epayco-subscriptions-for-woocommerce'),
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
        'type' => 'password',
        'description' => __('La encuentra en el panel de ePayco, integraciones, Llaves API', 'epayco-subscriptions-for-woocommerce'),
        'default' => '',
        'desc_tip' => true,
        'placeholder' => ''
    ),
    'epayco_endorder_state' => array(
        'title' => __('Estado Final del Pedido', 'epayco-subscriptions-for-woocommerce'),
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
);