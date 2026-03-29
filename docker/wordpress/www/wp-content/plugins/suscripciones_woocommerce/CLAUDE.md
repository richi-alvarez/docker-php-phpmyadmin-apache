# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ePayco Subscriptions for WooCommerce** — Plugin de pago para WordPress que integra el procesador de pagos ePayco con WooCommerce Subscriptions para mercados latinoamericanos. Gestiona cobros recurrentes/suscripciones a través de la API de ePayco.

- **Versión**: 6.5.3
- **Namespace PHP**: `EpaycoSubscription\Woocommerce`
- **Text Domain**: `epayco-subscriptions-for-woocommerce`
- **Gateway ID**: `woo-epaycosubscription`
- **Requisitos**: WordPress 5.3+, WooCommerce 7.7.0+, WooCommerce Subscriptions 2.6+, PHP 8.2+
- **Dependencia Composer**: `epayco/epayco-php: ^1.6`

## Comandos Docker

Los comandos se ejecutan desde `docker/wordpress/` (relativo a la raíz del repositorio):

```bash
make start-mysql          # Levanta contenedor MySQL
make start-wordpress      # Levanta contenedor WordPress
make stop                 # Detiene contenedores
make restart              # Para y reinicia
make build                # Reconstruye sin caché
make ssh-be               # bash dentro del contenedor wordpress
make prepare              # Instala dependencias Composer
```

## Tests E2E (Playwright)

Los tests están en `docker/wordpress/www/e2e/` y corren contra la instancia viva de WordPress.

```bash
# Desde docker/wordpress/
make test-e2e                           # Todos los tests
make test-payment                       # Flujo de checkout con trace
make test-payment-headed                # Modo headed (navegador visible)

# URL personalizada
E2E_BASE_URL=http://localhost:81 make test-e2e

# Un solo archivo
cd docker/wordpress/www/e2e && BASE_URL=http://localhost:81 npx playwright test checkout.spec.js --reporter=line
```

## Composer

```bash
# Dentro del contenedor WordPress:
composer install
```

## Arquitectura del Plugin

### Punto de entrada y bootstrap

- **`epayco-subscription.php`** — Cabecera WordPress, activa hooks de activación/desactivación, crea tablas en BD, registra estados de orden personalizados, registra campos de checkout adicionales, encola assets.
- **`src/Startup.php`** — Verifica que el autoload de Composer exista antes de cargar el plugin.
- **`src/WoocommerceEpaycoSubscription.php`** — Clase principal; orquesta la inicialización en el hook `plugins_loaded`, registra bloques, registra el gateway (solo si `WC_Subscriptions` existe), y dispara acciones del funnel.

### Inyección de dependencias

**`src/Dependencies.php`** es el contenedor DI. Instancia todas las clases (hooks, helpers, configs) y las conecta entre sí. Al agregar una nueva clase que dependa de servicios existentes, hacerlo aquí.

### Sistema de Hooks (`src/Hooks/`)

El agregador **`src/Hooks.php`** contiene todas las instancias de hook handlers:

| Archivo | Responsabilidad |
|---|---|
| `Admin.php` | Hooks de interfaz admin, action links del plugin |
| `Blocks.php` | Soporte WooCommerce Blocks (checkout por bloques) |
| `Checkout.php` | Personalización de checkout (campos DNI/tipo documento) |
| `Endpoints.php` | Endpoints REST/AJAX (`registerApiEndpoint`, `registerAjaxEndpoint`, `registerWCAjaxEndpoint`) |
| `Gateway.php` | Registro del gateway, página de recibo, thank you page, guardar settings, filtrar gateways disponibles según si el carrito tiene suscripciones |
| `Options.php` | Gestión de WordPress options |
| `Plugin.php` | Ciclo de vida del plugin; dispara acciones custom como `epaycosubscription_plugin_credentials_updated`, `epaycosubscription_plugin_test_mode_updated` |
| `Scripts.php` | Encolar assets |
| `Template.php` | Renderizado de templates |

### Gateway de Pago (`src/Gateways/`)

**`EpaycoSuscription.php`** extiende `AbstractGateway`. Constantes clave:

```php
const ID = 'woo-epaycosubscription';
const CHECKOUT_NAME = 'checkout-subscription';
const WEBHOOK_API_NAME = 'WC_WooEpaycoSuscription_Gateway';
const WEBHOOK_API_NAME_VALIDATION = 'WC_WooEpaycoSuscription_Validation';
```

Soporta: `subscriptions`, `subscription_suspension`, `subscription_reactivation`, `subscription_cancellation`, `multiple_subscriptions`.

Campos de configuración admin: `enabled`, `epayco_title`, `shop_name`, `description`, `environment` (test/production), `custIdCliente`, `pKey`, `apiKey`, `privateKey`, `epayco_endorder_state`, `cron_interval_30`, `cron_interval_60`.

Webhooks registrados vía `Endpoints::registerApiEndpoint`:
- `WC_WooEpaycoSuscription_Gateway` → `webhook()`
- `WC_WooEpaycoSuscription_Validation` → `validate_ePaycoSubscription_request()`

### Lógica de Negocio (`src/Helpers/`)

| Clase | Responsabilidad |
|---|---|
| `EpaycoHandler.php` | Handler principal; implementa `EpaycoSubscriptionHandlerInterface`. Orquesta `validateCustomer()`, `validatePlan()`, `createSubscription()`, `processPaymentEpayco()`. Propiedades: `customerData[]`, `planInfo[]`, `subscriptionInfo[]`, `handlerSubscription[]` (type: `create`\|`validate`) |
| `Customer.php` | Crea/recupera clientes en ePayco; gestiona tabla `wp_epayco_setings`; métodos: `createOrUpdateEpaycoCustomer()`, `customerCreate()`, `customerAddToken()`, `getEpaycoExisting()` |
| `Plan.php` | Crea/recupera planes de suscripción en ePayco; métodos: `getPlans()`, `plansCreate()`, `plansUpdate()` |
| `Subscription.php` | Operaciones CRUD de suscripción; métodos: `subscriptionCreate()`, `subscriptionCharge()`, `cancelSubscription()`, `handleSubscriptions()` (privado - evalúa estados: `aceptada`, `pendiente`, `rechazada`) |
| `Url.php` | Generación de URLs y rutas |
| `Session.php` | Manejo de datos de sesión |
| `Form.php` | Procesamiento de datos de formulario |
| `Gateways.php` | Recuperación de información del gateway |
| `Paths.php` | Utilidades de rutas de archivos |
| `Strings.php` | Utilidades de strings y tags HTML permitidos |

### Flujo de pago completo

1. Cliente agrega producto de suscripción al carrito
2. Checkout carga el gateway (solo si el carrito tiene suscripciones — filtrado por `Gateway::registerAvailablePaymentGateway()`)
3. Cliente ingresa tarjeta + tipo de documento + número de documento
4. El plugin valida/crea en ePayco:
   - **Customer** → `wp_epayco_setings` table
   - **Plan** (compara datos locales vs ePayco, type: `create` o `validate`)
   - **Subscription** → guarda ID en meta de WooCommerce
5. Cobra la suscripción → `handleSubscriptions()` evalúa estado y actualiza orden
6. Webhook de ePayco actualiza estado de orden y suscripción
7. Cron job `woocommerce_epayco_suscripcion_cleanup_draft_orders` sincroniza estados periódicamente

### Base de Datos

Tablas creadas en activación del plugin:

| Tabla | Columnas | Propósito |
|---|---|---|
| `wp_epayco_subscription` | `id`, `order_id`, `ref_payco` | Vincula órdenes WooCommerce con `ref_payco` de ePayco |
| `wp_epayco_setings` | `id_payco`, `customer_id`, `token_id`, `email` | Relación cliente WooCommerce ↔ cliente ePayco |
| `wp_epayco_plans` | (creada en activación) | Planes de suscripción |

### Estados de Orden Personalizados

El plugin registra 12+ estados custom para modo test y producción:

- `wc-epayco-failed` / `wc-epayco_failed`
- `wc-epayco-cancelled` / `wc-epayco_cancelled`
- `wc-epayco-on-hold` / `wc-epayco_on_hold`
- `wc-epayco-processing` / `wc-epayco_processing`
- `wc-epayco-completed` / `wc-epayco_completed`
- `wc-processing_test` / `wc-completed_test`

### Campos de Checkout Adicionales

Registrados vía `epayco/billing_type_document` y `epayco/billing_dni`:
- **Tipo de documento**: CC, CE, PPN, SSN, LIC, NIT, TI, DNI
- **Número de documento**: campo libre

### Configuración (`src/Configs/Store.php`)

Gestiona flags de estado del plugin via WordPress options:
- `_ep_execute_activate`: flag de activación
- `_ep_execute_after_update`: flag de actualización
- `availablePaymentGateways[]`: gateways registrados disponibles

### Funnel (`src/Funnel/Funnel.php`)

Maneja el onboarding del vendedor y lifecycle del plugin: crear funnel, actualizar credenciales, modo test/producción, versión del plugin, desinstalación. Inyecta `Gateways` helper.

### Bloques WooCommerce (`src/Blocks/`)

- `AbstractBlock.php`: Clase base
- `SubscriptionBlock.php`: Bloque de suscripción para checkout por bloques
- Registrado via `woocommerce_blocks_payment_method_type_registration`

### Interfaces (`src/Interfaces/`)

- `EpaycoSubscriptionGatewayInterface`
- `EpaycoSubscriptionHandlerInterface`
- `EpaycoSubscriptionPaymentBlockInterface`

## Estructura de Archivos Clave

```
suscripciones_woocommerce/
├── epayco-subscription.php          # Entrada del plugin
├── composer.json                    # Dependencia: epayco/epayco-php ^1.6
├── admin/
│   └── epayco-settings.php          # Formulario de configuración admin
├── src/
│   ├── Startup.php
│   ├── WoocommerceEpaycoSubscription.php
│   ├── Dependencies.php             # Contenedor DI
│   ├── Hooks.php                    # Agregador de hooks
│   ├── Helpers.php                  # Agregador de helpers
│   ├── Blocks/                      # WooCommerce Blocks
│   ├── Configs/Store.php            # Config store
│   ├── Funnel/Funnel.php            # Lifecycle del vendor
│   ├── Gateways/EpaycoSuscription.php
│   ├── Helpers/                     # Lógica de negocio
│   ├── Hooks/                       # Handlers de WordPress hooks
│   └── Interfaces/                  # Contratos
├── templates/
│   ├── admin/notices/               # Notices de admin
│   └── public/checkout/             # subscription.php, order-received.php
├── assets/
│   ├── css/                         # Estilos
│   ├── js/                          # app.js, epaycocheckout.js, blocks.js, etc.
│   └── images/                      # Logos e íconos de ePayco
└── vendor/                          # Composer: epayco-php SDK, requests
```

## Credenciales API (configuración en WP Admin)

Ruta: `WP Admin > WooCommerce > Ajustes > Pagos > ePayco Subscriptions`

Credenciales requeridas del dashboard de ePayco: `P_CUST_ID_CLIENTE`, `P_KEY`, `PRIVATE_KEY`, `PUBLIC_KEY`.

Soporte técnico: desarrollo@epayco.com
