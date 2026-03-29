# Arquitectura — ePayco Subscriptions for WooCommerce

**Versión**: 6.5.3 | **Gateway ID**: `woo-epaycosubscription` | **Namespace**: `EpaycoSubscription\Woocommerce`

---

## 1. Visión General del Sistema

```mermaid
graph TB
    subgraph WP["WordPress / WooCommerce"]
        HOOKS["WordPress Hooks<br/>(add_action / add_filter)"]
        DB_WC["WooCommerce DB<br/>(orders, subscriptions, meta)"]
        CRON["WP Cron<br/>woocommerce_epayco_suscripcion<br/>_cleanup_draft_orders"]
    end

    subgraph PLUGIN["Plugin: suscripciones_woocommerce"]
        ENTRY["epayco-subscription.php<br/>(Entry Point)"]
        STARTUP["Startup.php<br/>(Bootstrap)"]
        MAIN["WoocommerceEpaycoSubscription<br/>(Main Class)"]
        DI["Dependencies<br/>(DI Container)"]
        HOOKS_AGG["Hooks.php<br/>(Agregador)"]
        HELPERS_AGG["Helpers.php<br/>(Agregador)"]
        STORE["Configs/Store<br/>(Estado del plugin)"]
        FUNNEL["Funnel<br/>(Lifecycle Vendor)"]
        GW["Gateways/EpaycoSuscription<br/>(Payment Gateway)"]
    end

    subgraph DB_CUSTOM["Base de Datos Custom"]
        T1["wp_epayco_subscription<br/>(order_id, ref_payco)"]
        T2["wp_epayco_setings<br/>(customer_id, token_id, email)"]
        T3["wp_epayco_plans<br/>(planes de suscripción)"]
    end

    subgraph EPAYCO_API["ePayco API (Externa)"]
        SDK["epayco/epayco-php SDK"]
        API_CUSTOMER["Customer API"]
        API_PLAN["Plan API"]
        API_SUB["Subscription API"]
    end

    ENTRY --> STARTUP --> MAIN --> DI
    DI --> HOOKS_AGG & HELPERS_AGG & STORE & FUNNEL & GW
    MAIN --> HOOKS
    GW --> SDK
    SDK --> API_CUSTOMER & API_PLAN & API_SUB
    GW --> DB_CUSTOM
    GW --> DB_WC
    CRON --> GW
```

---

## 2. Estructura de Clases (Jerarquía)

```mermaid
classDiagram
    class WC_Payment_Gateway {
        <<WooCommerce>>
    }
    class EpaycoSubscriptionGatewayInterface {
        <<Interface>>
        +init_form_fields() void
        +payment_fields() void
        +validate_fields() bool
        +process_payment(order_id) array
        +webhook() void
        +registerCheckoutScripts() void
        +isAvailable() bool
    }
    class AbstractGateway {
        +ID string
        +CHECKOUT_NAME string
        +WEBHOOK_API_NAME string
        +LOG_SOURCE string
        +payment_scripts(section) void
        +registerAdminScripts() void
        +registerCheckoutScripts() void
        +canAdminLoadScriptsAndStyles(section) bool
        +canCheckoutLoadScriptsAndStyles() bool
        +errorMessages(dataError) string
    }
    class EpaycoSuscription {
        +ID = woo-epaycosubscription
        +WEBHOOK_API_NAME = WC_WooEpaycoSuscription_Gateway
        +WEBHOOK_API_NAME_VALIDATION
        +supports[]
        +epaycoSdk Epayco
        +epaycosuscription WoocommerceEpaycoSubscription
        +process_payment(order_id) array
        +webhook() void
        +validate_ePaycoSubscription_request() void
        +ePaycoSubscription_credentials_validation() void
    }
    class EpaycoSubscriptionHandlerInterface {
        <<Interface>>
        +validateCustomer(customerData, token, custId)
    }
    class EpaycoHandler {
        +customerData array
        +planInfo array
        +subscriptionInfo array
        +handlerSubscription array
        +confirmUrl string
        +validateCustomer(data, token, custId)
        +validatePlan(plans)
        +validatePlanData(getPlans)
        +createSubscription(subscriptions, plans)
        +processPaymentEpayco(subscriptions)
        +cancelSubscription(id)
        +updatePlan(subscriptions, plans)
        +setPaymentsIdDataForSubscription(sub, value)
    }
    class Customer {
        +getEpaycoCustomer(clientId)
        +customerCreate(data)
        +customerAddToken(customerId, token)
        +createOrUpdateEpaycoCustomer(data, token, orderId)
        +registerEpaycoCustomer(data, orderId, token)
        +getEpaycoExisting(customerId, token)
    }
    class Plan {
        +getPlans(plans)
        +plansCreate(plan, order)
        +plansUpdate(planId, order, newPlan)
    }
    class Subscription {
        +subscriptionCreate(plans, customer, url, order)
        +subscriptionCharge(plan, customer, url, subId, order, subs)
        +cancelSubscription(subscriptionId)
        -handleSubscriptions(order, sub, subscriptions)
        -completedPayment(order, subscription, sub)
        -pendingPayment(order, subscription, sub)
    }

    WC_Payment_Gateway <|-- AbstractGateway
    EpaycoSubscriptionGatewayInterface <|.. AbstractGateway
    AbstractGateway <|-- EpaycoSuscription
    EpaycoSuscription <|-- Customer
    EpaycoSuscription <|-- Plan
    EpaycoSuscription <|-- Subscription
    EpaycoSubscriptionHandlerInterface <|.. EpaycoHandler
    EpaycoHandler --> Customer
    EpaycoHandler --> Plan
    EpaycoHandler --> Subscription
```

---

## 3. Contenedor de Inyección de Dependencias

```mermaid
graph LR
    subgraph DI["Dependencies.php (DI Container)"]
        direction TB
        WC["WooCommerce (global)"]

        subgraph HOOKS_GROUP["Hooks"]
            AdminH["Hooks\\Admin"]
            BlocksH["Hooks\\Blocks"]
            CheckoutH["Hooks\\Checkout"]
            EndpH["Hooks\\Endpoints"]
            GatewH["Hooks\\Gateway"]
            PluginH["Hooks\\Plugin"]
            ScriptsH["Hooks\\Scripts"]
            TemplH["Hooks\\Template"]
            OptionsH["Hooks\\Options"]
        end

        subgraph HELPERS_GROUP["Helpers"]
            SessionHlp["Helpers\\Session"]
            StringsHlp["Helpers\\Strings"]
            UrlHlp["Helpers\\Url"]
            GatewaysHlp["Helpers\\Gateways"]
        end

        subgraph CONFIG_GROUP["Config"]
            StoreConf["Configs\\Store"]
        end

        FunnelC["Funnel\\Funnel"]
        HooksAgg["Hooks (Agregador)"]
        HelpersAgg["Helpers (Agregador)"]
    end

    OptionsH --> StoreConf
    StringsHlp --> UrlHlp
    UrlHlp --> ScriptsH
    StoreConf --> GatewaysHlp
    GatewaysHlp --> FunnelC
    StoreConf & UrlHlp & FunnelC --> GatewH

    AdminH & BlocksH & CheckoutH & EndpH & GatewH & PluginH & ScriptsH & TemplH --> HooksAgg
    SessionHlp & UrlHlp --> HelpersAgg
```

---

## 4. Sistema de Hooks de WordPress

```mermaid
graph TD
    subgraph WP_LIFECYCLE["Ciclo de vida WordPress"]
        PL["plugins_loaded"]
        INIT["woocommerce_init"]
        ADMIN_ENQUEUE["admin_enqueue_scripts"]
        WP_ENQUEUE["wp_enqueue_scripts"]
        BLOCK_ENQUEUE["enqueue_block_assets"]
        BEFORE_WC_INIT["before_woocommerce_init"]
    end

    subgraph WC_HOOKS["Hooks WooCommerce"]
        WC_GW["woocommerce_payment_gateways"]
        WC_GW_TITLE["woocommerce_gateway_title"]
        WC_AVAIL["woocommerce_available_payment_gateways"]
        WC_FIELDS["woocommerce_checkout_fields"]
        WC_UPDATE_META["woocommerce_checkout_update_order_meta"]
        WC_RECEIPT["woocommerce_receipt_*"]
        WC_THANKYOU["woocommerce_thankyou_*"]
        WC_UPD_OPTIONS["woocommerce_update_options_payment_gateways_*"]
        WC_BLOCKS_REG["woocommerce_blocks_payment_method_type_registration"]
        WC_API["woocommerce_api_WC_WooEpaycoSuscription_*"]
    end

    subgraph PLUGIN_ACTIONS["Custom Plugin Actions"]
        EP_CREDS["epaycosubscription_plugin_credentials_updated"]
        EP_STORE["epaycosubscription_plugin_store_info_updated"]
        EP_MODE["epaycosubscription_plugin_test_mode_updated"]
        EP_LOADED["epaycosubscription_main_plugin_loaded"]
    end

    PL --> |"init()"| WC_GW & WC_BLOCKS_REG
    BEFORE_WC_INIT --> |"declara compatibilidad"| WC_GW
    INIT --> WC_FIELDS
    WC_FIELDS --> |"Hooks\\Gateway"| CAMPOS["epayco_billing_type_document<br/>epayco_billing_dni"]
    WC_UPDATE_META --> |"epayco-subscription.php"| META["order_meta: type_document, dni"]
    WC_AVAIL --> |"filtra si NO hay suscripciones"| HIDE["Oculta gateway"]
    WC_API --> |"Endpoints"| WEBHOOK["webhook() / validate_request()"]
    ADMIN_ENQUEUE --> |"Scripts"| ADMIN_ASSETS["Admin CSS/JS"]
    WP_ENQUEUE --> |"Scripts"| FRONT_ASSETS["Checkout CSS/JS"]
    WC_UPD_OPTIONS --> |"Gateway"| SAVE_OPT["Guarda config en WP options"]
    EP_CREDS & EP_MODE --> FUNNEL["Funnel.updateStep*()"]
```

---

## 5. Flujo de Pago (Payment Flow)

```mermaid
sequenceDiagram
    actor Cliente
    participant WC as WooCommerce Checkout
    participant GW as EpaycoSuscription Gateway
    participant Handler as EpaycoHandler
    participant CustHlp as Customer Helper
    participant PlanHlp as Plan Helper
    participant SubHlp as Subscription Helper
    participant SDK as ePayco PHP SDK
    participant API as ePayco API
    participant DB as Base de Datos

    Cliente->>WC: Agrega producto de suscripción al carrito
    WC->>GW: Filtra available_payment_gateways (solo si hay suscripciones)
    Cliente->>WC: Ingresa datos de tarjeta + tipo/número de documento
    Cliente->>WC: Confirma pago
    WC->>GW: process_payment(order_id)

    GW->>Handler: validateCustomer(customerData, token, custIdCliente)
    Handler->>DB: SELECT wp_epayco_setings WHERE email = ?
    alt Cliente no existe
        Handler->>CustHlp: customerCreate(data)
        CustHlp->>SDK: customer->create({token, name, email...})
        SDK->>API: POST /customers
        API-->>SDK: customer_id
        Handler->>DB: INSERT INTO wp_epayco_setings
    else Cliente existe, token distinto
        Handler->>CustHlp: customerAddToken(customer_id, token)
        CustHlp->>SDK: customer->addNewToken({customer_id, token})
        SDK->>API: POST /customers/token
    end

    GW->>Handler: validatePlan(plans)
    Handler->>PlanHlp: getPlans(plans)
    PlanHlp->>SDK: plan->get(id_plan)
    SDK->>API: GET /plans/{id}
    alt Plan no existe
        Handler->>PlanHlp: plansCreate(plan, order)
        PlanHlp->>SDK: plan->create({id_plan, amount, interval...})
        SDK->>API: POST /plans
    else Plan existe pero datos difieren
        Handler->>PlanHlp: plansUpdate(planId, order, newPlan)
        PlanHlp->>SDK: plan->update(planId, data)
        SDK->>API: PUT /plans/{id}
        Handler->>Handler: handlerSubscription.type = 'validate'
    end

    GW->>Handler: createSubscription(subscriptions, plans)
    Handler->>SubHlp: subscriptionCreate(plans, customer, confirm_url, order)
    SubHlp->>SDK: subscriptions->create({id_plan, customer_id, token_card, doc_type, doc_number, url_confirmation})
    SDK->>API: POST /subscriptions
    API-->>SDK: subscription_id
    Handler->>DB: Guarda subscription_id en WC meta

    Handler->>SubHlp: subscriptionCharge(plan, customer, confirm_url, sub_id, order, subscriptions)
    SubHlp->>SDK: subscriptions->charge({subscription, customer, token, doc_type, doc_number})
    SDK->>API: POST /subscriptions/charge
    API-->>SDK: resultado {status, ref_payco}

    alt status = "aceptada"
        SubHlp->>WC: completedPayment() → order->update_status("processing")
        SubHlp->>DB: INSERT wp_epayco_subscription (order_id, ref_payco)
    else status = "pendiente"
        SubHlp->>WC: pendingPayment() → order->update_status("on-hold")
    else status = "rechazada"
        SubHlp->>WC: wc_add_notice(error) → order->update_status("failed")
    end

    SubHlp->>WC: Vaciar carrito
    SubHlp-->>GW: redirect → order-received?ref_payco=...
    GW-->>WC: return {result: success, redirect}
    WC-->>Cliente: Redirige a Thank You Page
```

---

## 6. Flujo del Webhook (Confirmación Asíncrona)

```mermaid
sequenceDiagram
    participant API as ePayco API
    participant WP as WordPress
    participant GW as EpaycoSuscription
    participant WC as WooCommerce Order
    participant DB as wp_epayco_subscription

    API->>WP: POST /?wc-api=WC_WooEpaycoSuscription_Gateway
    WP->>GW: webhook()
    GW->>GW: Valida firma / datos del request
    GW->>WC: get_order(order_id)
    GW->>GW: Evalúa estado del pago
    alt Pago aprobado
        GW->>WC: order->update_status("completed" / "processing")
        GW->>DB: INSERT/UPDATE wp_epayco_subscription
    else Pago pendiente
        GW->>WC: order->update_status("on-hold")
    else Pago rechazado / cancelado
        GW->>WC: order->update_status("failed" / "cancelled")
    end
    GW-->>API: HTTP 200 OK
```

---

## 7. Esquema de Base de Datos

```mermaid
erDiagram
    wp_posts ||--o{ wp_postmeta : "order meta"
    wp_posts ||--o{ wp_epayco_subscription : "order_id"
    wp_epayco_setings ||--o{ wp_epayco_subscription : "customer_id"

    wp_epayco_subscription {
        bigint id PK
        bigint order_id FK
        varchar ref_payco
    }

    wp_epayco_setings {
        bigint id PK
        bigint id_payco
        varchar customer_id
        varchar token_id
        varchar email
    }

    wp_epayco_plans {
        bigint id PK
        varchar plan_id
        varchar name
        decimal amount
        varchar currency
        varchar interval
        int interval_count
        int trial_days
    }

    wp_posts {
        bigint ID PK
        varchar post_type
        varchar post_status
    }

    wp_postmeta {
        bigint meta_id PK
        bigint post_id FK
        varchar meta_key
        longtext meta_value
    }
```

**Meta keys relevantes en `wp_postmeta`**:
| meta_key | Descripción |
|---|---|
| `_epayco_subscription_id` | ID de suscripción en ePayco |
| `epayco_billing_type_document` | Tipo de documento (CC, NIT, etc.) |
| `epayco_billing_dni` | Número de documento |
| `epayco_order_status` | Estado del pago en ePayco |

---

## 8. Integración con ePayco SDK

```mermaid
graph LR
    subgraph PLUGIN["Plugin PHP"]
        CUST["Customer.php"]
        PLAN["Plan.php"]
        SUB["Subscription.php"]
    end

    subgraph SDK["epayco/epayco-php (vendor)"]
        EP_CLASS["Epayco(apiKey, privateKey, lang, test)"]
        EP_CUST["->customer"]
        EP_PLAN["->plan"]
        EP_SUBS["->subscriptions"]
    end

    subgraph EPAYCO_ENDPOINTS["ePayco REST API"]
        E1["POST /customers"]
        E2["POST /customers/token"]
        E3["GET  /customers/{id}"]
        E4["POST /plans"]
        E5["PUT  /plans/{id}"]
        E6["GET  /plans/{id}"]
        E7["POST /subscriptions"]
        E8["POST /subscriptions/charge"]
        E9["DELETE /subscriptions/{id}"]
    end

    CUST --> EP_CUST
    PLAN --> EP_PLAN
    SUB --> EP_SUBS

    EP_CUST --> |"create()"| E1
    EP_CUST --> |"addNewToken()"| E2
    EP_CUST --> |"get()"| E3
    EP_PLAN --> |"create()"| E4
    EP_PLAN --> |"update()"| E5
    EP_PLAN --> |"get()"| E6
    EP_SUBS --> |"create()"| E7
    EP_SUBS --> |"charge()"| E8
    EP_SUBS --> |"cancel()"| E9

    EP_CLASS --> EP_CUST & EP_PLAN & EP_SUBS
```

**Inicialización del SDK** (en `EpaycoSuscription.__construct`):
```php
$this->epaycoSdk = new Epayco([
    'apiKey'     => $this->get_option('apiKey'),        // PUBLIC_KEY
    'privateKey' => $this->get_option('privateKey'),    // PRIVATE_KEY
    'lang'       => 'ES',
    'test'       => $this->get_option('environment') === 'yes'
]);
```

---

## 9. Estados de Orden Personalizados

```mermaid
stateDiagram-v2
    [*] --> Pendiente : Cliente inicia pago
    Pendiente --> wc_epayco_processing : ePayco procesando
    wc_epayco_processing --> wc_epayco_completed : Pago aprobado
    wc_epayco_processing --> wc_epayco_failed : Pago rechazado
    wc_epayco_processing --> wc_epayco_cancelled : Pago cancelado
    wc_epayco_processing --> wc_epayco_on_hold : Pago pendiente
    wc_epayco_on_hold --> wc_epayco_completed : Webhook confirma
    wc_epayco_on_hold --> wc_epayco_failed : Webhook rechaza
    wc_epayco_failed --> [*]
    wc_epayco_cancelled --> [*]
    wc_epayco_completed --> [*]

    note right of wc_epayco_processing
        Modo test: wc-epayco_processing
        Modo prod: wc-epayco-processing
    end note
```

---

## 10. Campos de Checkout Adicionales

```mermaid
graph LR
    REGISTER["woocommerce_checkout_fields<br/>(Gateway::registerCustomBillingFieldOptions)"]

    REGISTER --> F1["epayco_billing_type_document<br/>type: select<br/>opciones: CC, CE, PPN,<br/>SSN, LIC, NIT, TI, DNI"]
    REGISTER --> F2["epayco_billing_dni<br/>type: text<br/>Número de documento"]

    SAVE["woocommerce_checkout_update_order_meta<br/>(epayco-subscription.php)"]
    F1 & F2 --> SAVE --> META["wp_postmeta"]
```

---

## 11. Sistema de Assets (Scripts y Estilos)

```mermaid
graph TB
    subgraph REGISTRO["Registro (Scripts.php)"]
        REG_ADMIN["registerAdminStyle / registerAdminScript"]
        REG_FRONT["registerCheckoutStyle / registerCheckoutScript"]
        REG_BLOCK["registerPaymentBlockScript / registerPaymentBlockStyle"]
    end

    subgraph ADMIN_ASSETS["Assets Admin"]
        A1["admin/mp-admin-notices.css"]
        A2["admin/epayco-settings JS"]
    end

    subgraph FRONT_ASSETS["Assets Checkout"]
        F1["animate.min.css"]
        F2["fontawesome-all.css"]
        F3["bootstrap-slider.min.css"]
        F4["epaycocheckout.js"]
        F5["subscription-epayco-config.js"]
        F6["card-js-unmin.js"]
        F7["sweetalert2.js"]
    end

    subgraph BLOCK_ASSETS["Assets WC Blocks"]
        B1["blocks.js"]
        B2["epayco-thankyou-block.js"]
        B3["index.js"]
    end

    REG_ADMIN --> ADMIN_ASSETS
    REG_FRONT --> FRONT_ASSETS
    REG_BLOCK --> BLOCK_ASSETS

    subgraph HOOKS_ENQUEUE["WordPress Hooks"]
        H1["admin_enqueue_scripts"]
        H2["wp_enqueue_scripts"]
        H3["enqueue_block_assets"]
    end

    ADMIN_ASSETS --> H1
    FRONT_ASSETS --> H2
    BLOCK_ASSETS --> H3
```

---

## 12. Funnel de Lifecycle del Plugin

```mermaid
stateDiagram-v2
    [*] --> Instalado : register_activation_hook
    Instalado --> FunnelCreado : Funnel::create()
    FunnelCreado --> CredencialesActualizadas : Plugin::UPDATE_CREDENTIALS_ACTION
    CredencialesActualizadas --> ModoActualizado : Plugin::UPDATE_TEST_MODE_ACTION
    ModoActualizado --> Activo : Funnel::updateStepActivate()
    Activo --> Deshabilitado : register_deactivation_hook\nFunnel::updateStepDisable()
    Deshabilitado --> Activo : re-activación
    Activo --> VersionActualizada : upgrader_post_install\nFunnel::updateStepPluginVersion()
    VersionActualizada --> Activo : continúa
    Activo --> Desinstalado : uninstall.php\nFunnel::updateStepUninstall()
    Desinstalado --> [*]
```

---

## 13. Soporte WooCommerce Blocks

```mermaid
graph TD
    REG["woocommerce_blocks_payment_method_type_registration"]
    REG --> SB["SubscriptionBlock extends AbstractBlock"]
    SB --> |"name = woo-epaycosubscription"| BLOCK_REG["PaymentMethodRegistry::register()"]
    SB --> |"getScriptParams()"| PARAMS["apiKey, publicKey,<br/>shopName, currency, lang"]
    BLOCK_REG --> FRONT["Checkout por bloques<br/>(Gutenberg)"]
    SB --> |"get_payment_method_script_handles()"| SCRIPTS["blocks.js, index.js"]

    subgraph INTERFACE["EpaycoSubscriptionPaymentBlockInterface"]
        I1["initialize()"]
        I2["is_active() bool"]
        I3["get_payment_method_script_handles() array"]
        I4["get_payment_method_data() array"]
        I5["get_supported_features() array"]
        I6["getScriptParams() array"]
    end

    SB -.->|"implementa"| INTERFACE
```

---

## 14. Resumen de Responsabilidades por Capa

| Capa | Clases | Responsabilidad |
|---|---|---|
| **Entry** | `epayco-subscription.php`, `Startup.php` | Bootstrap, DB creation, custom statuses, asset enqueuing |
| **Main** | `WoocommerceEpaycoSubscription` | Orchestration, gateway registration, block support |
| **DI** | `Dependencies` | Wiring de todas las dependencias |
| **Gateway** | `AbstractGateway`, `EpaycoSuscription` | WC Payment Gateway, process_payment, webhook |
| **Business Logic** | `EpaycoHandler`, `Customer`, `Plan`, `Subscription` | ePayco API calls, DB persistence, payment state |
| **Hooks** | `Admin`, `Blocks`, `Checkout`, `Endpoints`, `Gateway`, `Options`, `Plugin`, `Scripts`, `Template` | WordPress hooks registration |
| **Config** | `Store` | Plugin state flags via WP options |
| **Funnel** | `Funnel` | Vendor onboarding lifecycle |
| **Blocks** | `SubscriptionBlock`, `AbstractBlock` | WooCommerce Blocks checkout |
| **Helpers** | `Url`, `Session`, `Form`, `Strings`, `Paths`, `Gateways` | Utilities |
| **Interfaces** | `EpaycoSubscriptionGatewayInterface`, `EpaycoSubscriptionHandlerInterface`, `EpaycoSubscriptionPaymentBlockInterface` | Contracts |
| **Templates** | `subscription.php`, `order-received.php`, notices | Frontend rendering |
