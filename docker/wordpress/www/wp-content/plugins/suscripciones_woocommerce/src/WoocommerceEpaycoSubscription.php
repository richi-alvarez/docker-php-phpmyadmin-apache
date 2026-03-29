<?php

namespace EpaycoSubscription\Woocommerce;

use Automattic\WooCommerce\Blocks\Payments\PaymentMethodRegistry;
use EpaycoSubscription\Woocommerce\Configs\Store;
use EpaycoSubscription\Woocommerce\Blocks\SubscriptionBlock;
use EpaycoSubscription\Woocommerce\Helpers\Paths;
use EpaycoSubscription\Woocommerce\Helpers\Strings;
use EpaycoSubscription\Woocommerce\Funnel\Funnel;
use WooCommerce;

if (!defined('ABSPATH')) {
    exit;
}

class WoocommerceEpaycoSubscription
{
    private const PLUGIN_VERSION = '6.4.4';
    private const PLATFORM_NAME = 'woocommerce';
    private const PLUGIN_NAME = 'epayco-subscriptions-for-woocommerce/epayco-subscription.php';

    public WooCommerce $woocommerce;

    public Hooks $hooks;

    public Helpers $helpers;

    public Store $storeConfig;

    public Funnel $funnel;

    /**
     * WoocommerceEpaycoSubscription constructor
     */
    public function __construct()
    {
        $this->defineConstants();
        $this->loadPluginTextDomain();
        $this->registerHooks();
    }

    /**
     * Load plugin text domain
     *
     * @return void
     */
    public function loadPluginTextDomain(): void
    {
        $textDomain = $this->pluginMetadata('text-domain');
        unload_textdomain($textDomain);
        $locale = explode('_', apply_filters('plugin_locale', get_locale(), $textDomain))[0];
        load_textdomain($textDomain, Paths::basePath(Paths::join($this->pluginMetadata('domain-path'), "epayco-subscriptions-for-woocommerce-$locale.mo")));
    }

    /**
     * Register hooks
     *
     * @return void
     */
    public function registerHooks(): void
    {
        add_action('plugins_loaded', [$this, 'init']);
    }

    /**
     * Register gateways
     *
     * @return void
     */
    public function registerGateways(): void
    {

        $gatewayClass = 'EpaycoSubscription\Woocommerce\Gateways\EpaycoSuscription';
        /* add_filter('woocommerce_payment_gateways', function ($methods) use ($gatewayClass) {
            $methods[] = $gatewayClass;
            return $methods;
        });*/
        if (class_exists('WC_Subscriptions')) {
            $this->hooks->gateway->registerGateway($gatewayClass);
        }
    }

    /**
     * Init plugin
     *
     * @return void
     */
    public function init(): void
    {
        if (!class_exists('WC_Payment_Gateway')) {
            $this->adminNoticeMissWoocoommerce();
            return;
        }

        if (!class_exists('WC_Subscriptions_Cart')) {
            $this->adminNoticeMissWoocoommerceSubscription();
            return;
        }

        $this->setProperties();
        $this->setPluginSettingsLink();
        $this->registerBlocks();
        $this->registerGateways();

        $this->hooks->gateway->registerSaveCheckoutSettings();
        if ($this->storeConfig->getExecuteActivate()) {
            $this->hooks->plugin->executeActivatePluginAction();
        }
        if ($this->storeConfig->getExecuteAfterPluginUpdate()) {
            $this->afterPluginUpdate();
        }
    }


    /**
     * Register woocommerce blocks support
     *
     * @return void
     */
    public function registerBlocks(): void
    {
        if (class_exists('Automattic\WooCommerce\Blocks\Payments\Integrations\AbstractPaymentMethodType')) {
            add_action(
                'woocommerce_blocks_payment_method_type_registration',
                function (PaymentMethodRegistry $payment_method_registry) {
                    $payment_method_registry->register(new SubscriptionBlock());
                }
            );
        }
    }

    /**
     * Define plugin constants
     *
     * @return void
     */
    private function defineConstants(): void
    {
        $this->define('EPS_VERSION', self::PLUGIN_VERSION);
        $this->define('EPS_PLATFORM_NAME', self::PLATFORM_NAME);
        $this->define('EPS_PLUGIN_URL', sprintf('%s%s', plugin_dir_url(__FILE__), '../assets/json/'));
    }

    /**
     * Function hook disabled plugin
     *
     * @return void
     */
    public function disablePlugin()
    {
        $this->funnel->updateStepDisable();
    }

    /**
     * Function hook active plugin
     */
    public function activatePlugin(): void
    {
        $after = fn() => $this->storeConfig->setExecuteActivate(false);

        $this->funnel->created() ? $this->funnel->updateStepActivate($after) : $this->funnel->create($after);
    }

    /**
     * Function hook after plugin update
     */
    public function afterPluginUpdate(): void
    {
        $this->funnel->updateStepPluginVersion(fn() => $this->storeConfig->setExecuteAfterPluginUpdate(false));
    }

    /**
     * Set plugin properties
     *
     * @return void
     */
    public function setProperties(): void
    {
        $dependencies = new Dependencies();

        // Globals
        $this->woocommerce = $dependencies->woocommerce;
        // Configs
        $this->storeConfig    = $dependencies->storeConfig;

        // Helpers
        $this->helpers = $dependencies->helpers;

        // Hooks
        $this->hooks = $dependencies->hooks;

        $this->funnel = $dependencies->funnel;
    }

    /**
     * Set plugin configuration links
     *
     * @return void
     */
    public function setPluginSettingsLink()
    {
        $pluginLinks = [
            [
                'text'   => 'Configuración',
                'href'   => 'admin.php?page=wc-settings&tab=checkout&section=epaycosuscription',
                'target' => $this->hooks->admin::HREF_TARGET_DEFAULT,
            ],
        ];

        $this->hooks->admin->registerPluginActionLinks(self::PLUGIN_NAME, $pluginLinks);
    }

    /**
     * Define constants
     *
     * @param $name
     * @param $value
     *
     * @return void
     */
    private function define($name, $value): void
    {
        if (!defined($name)) {
            define($name, $value);
        }
    }

    /**
     * Show woocommerce missing notice
     * This function should use WordPress features only
     *
     * @return void
     */
    public function adminNoticeMissWoocoommerceSubscription(): void
    {
        $url_docs = 'https://github.com/wp-premium/woocommerce-subscriptions';


        $subs = sprintf(
            /* translators: %1$s es la URL de la documentación, %2$s es el texto del enlace */
            __('Subscription ePayco: Woocommerce subscriptions must be installed and active, <a target="_blank" href="%1$s">%2$s</a>', 'epayco-subscriptions-for-woocommerce'),
            esc_url($url_docs),
            __('Check documentation for help', 'epayco-subscriptions-for-woocommerce')
        );

        add_action(
            'admin_notices',
            function () use ($subs) {
                $this->subscription_epayco_se_notices($subs);
            }
        );
    }



    public function subscription_epayco_se_notices($notice): void
    {
        ?>
        <div class="error notice">
        <p><?php echo wp_kses_post($notice); ?></p>
        </div>
        <?php
    }

    /**
     * Show woocommerce missing notice
     * This function should use WordPress features only
     *
     * @return void
     */
    public function adminNoticeMissWoocoommerce(): void
    {
        add_action('admin_enqueue_scripts', function () {
            wp_enqueue_style('woocommerce-epayco-subscription-admin-notice-css');
            wp_register_style(
                'woocommerce-epayco-subscription-admin-notice-css',
                sprintf('%s%s', plugin_dir_url(__FILE__), '../assets/css/admin/mp-admin-notices.css'),
                false,
                EPS_VERSION
            );
        });

        add_action(
            'admin_notices',
            function () {
                $strings = new Strings();
                $allowedHtmlTags = $strings->getAllowedHtmlTags();
                $isInstalled = false;
                $currentUserCanInstallPlugins = current_user_can('install_plugins');

                $minilogo     = sprintf('%s%s', plugin_dir_url(__FILE__), '../assets/images/comercio.png');
                $translations = [
                    'activate_woocommerce' => __('Activate WooCommerce', 'epayco-subscriptions-for-woocommerce'),
                    'install_woocommerce'  => __('Install WooCommerce', 'epayco-subscriptions-for-woocommerce'),
                    'see_woocommerce'      => __('See WooCommerce', 'epayco-subscriptions-for-woocommerce'),
                    'miss_woocommerce' => sprintf(
                       
                        /* translators: %s será reemplazado con el enlace a la página de WooCommerce */
                        esc_html__('Epayco module needs an active version of %s in order to work!', 'epayco-subscriptions-for-woocommerce'),
                        '<a target="_blank" href="https://wordpress.org/extend/plugins/woocommerce/">WooCommerce</a>'
                    ),

                ];

                $activateLink = wp_nonce_url(
                    self_admin_url('plugins.php?action=activate&plugin=woocommerce/woocommerce.php&plugin_status=all'),
                    'activate-plugin_woocommerce/woocommerce.php'
                );

                $installLink = wp_nonce_url(
                    self_admin_url('update.php?action=install-plugin&plugin=woocommerce'),
                    'install-plugin_woocommerce'
                );

                if (function_exists('get_plugins')) {
                    $allPlugins  = get_plugins();
                    $isInstalled = !empty($allPlugins['woocommerce/woocommerce.php']);
                }

                if ($isInstalled && $currentUserCanInstallPlugins) {
                    $missWoocommerceAction = 'active';
                } else {
                    if ($currentUserCanInstallPlugins) {
                        $missWoocommerceAction = 'install';
                    } else {
                        $missWoocommerceAction = 'see';
                    }
                }

                include dirname(__FILE__) . '/../templates/admin/notices/miss-woocommerce-notice.php';
            }
        );
    }

    /**
     * Plugin file metadata
     *
     * Metadata map:
     * ```
     * [
     *     'name'             => 'Plugin Name',
     *     'uri'              => 'Plugin URI',
     *     'description'      => 'Description',
     *     'version'          => 'Version',
     *     'author'           => 'Author',
     *     'author-uri'       => 'Author URI',
     *     'text-domain'      => 'Text Domain',
     *     'domain-path'      => 'Domain Path',
     *     'network'          => 'Network',
     *     'min-wp'           => 'Requires at least',
     *     'min-wc'           => 'WC requires at least',
     *     'min-php'          => 'Requires PHP',
     *     'tested-wc'        => 'WC tested up to',
     *     'update-uri'       => 'Update URI',
     *     'required-plugins' => 'Requires Plugins',
     * ]
     * ```
     *
     * @param string $key metadata desired element key
     *
     * @return string|string[] all data or just $key element value
     */
    public function pluginMetadata(?string $key = null)
    {
        $data = get_file_data(EPS_PLUGIN_FILE, [
            'name' => 'Plugin Name',
            'uri' => 'Plugin URI',
            'description' => 'Description',
            'version' => 'Version',
            'author' => 'Author',
            'author-uri' => 'Author URI',
            'text-domain' => 'Text Domain',
            'domain-path' => 'Domain Path',
            'network' => 'Network',
            'min-wp' => 'Requires at least',
            'min-wc' => 'WC requires at least',
            'min-php' => 'Requires PHP',
            'tested-wc' => 'WC tested up to',
            'update-uri' => 'Update URI',
            'required-plugins' => 'Requires Plugins',
        ]);

        return isset($key) ? $data[$key] : $data;
    }
}