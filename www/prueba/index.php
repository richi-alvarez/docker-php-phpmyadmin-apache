<?php
require __DIR__ . '/vendor/autoload.php'; // ajustar ruta si hace falta

use Epayco\Payment\PaymentManager;
use Epayco\Payment\Payments\EpaycoMethod;
use Epayco\Payment\Gateway\CheckoutGateway;
use Epayco\Payment\Request\CheckoutRequest;

// Config global, p.ej. testMode y responseClass
$checkoutGateway = new CheckoutGateway();
$config = [
    'paymentMethodClass' => EpaycoMethod::class,
    'requestClass' => CheckoutRequest::class,
    'gatewayClass' => $checkoutGateway,
];

$checkoutGateway->setPublickKey('653bbf81a3074049ed02803d4df9faba');
$checkoutGateway->setPrivateKey('85d925abbe69a25ae54561a46aefadb1');
$checkoutGateway->setCheckoutMode('standard');

$paymentMethodId = 'epayco';
$paymentService = new PaymentManager($config, $paymentMethodId);

// Datos del pedido (mapéalos según tu app)
$params = [
    'description'  => 'Compra Producto X',
    'order_id'     => 'ORD-1001',
    'currency'     => 'COP',
    'amount'       => 150000,
    'confirm_url'  => 'https://miweb.com/confirm',
    'redirect_url' => 'https://miweb.com/return',
    'billing' => [
        'name' => 'Cliente Ejemplo',
        'address' => 'Cll 100 # 10-10',
        'email' => 'cliente@ejemplo.com',
        'mobilePhone' => '3001234567'
    ],
    'ip' => $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1',
    'test' => true
];

// Obtener payload sin enviar:
//$payload = $paymentService->processPayload($paymentMethodId, $params);
$payload= $paymentService->send('epayco', $params)->send();
header('Content-Type: application/json');
//echo json_encode($payload->getRequest(), JSON_PRETTY_PRINT);
echo $payload->getPayload();
