<?php

/**
 * @var string $minilogo
 * @var string $activateLink
 * @var string $installLink
 * @var string $missWoocommerceAction
 * @var array $translations
 *
 * @see \EpaycoSubscription\Woocommerce\WoocommerceEpaycoSubscription
 */

if (!defined('ABSPATH')) {
    exit;
}

?>

<div id="message" class="notice notice-error">
    <div class="mp-alert-frame">
        <div class="mp-left-alert">
            <?php echo wp_get_attachment_image($minilogo, 'full', false, array('alt' => 'ePayco mini logo')); ?>
        </div>

        <div class="mp-right-alert">
            <p><?php echo esc_html($translations['miss_woocommerce']); ?></p> <!-- Corregido -->

            <p>
                <?php if ($missWoocommerceAction === 'active') : ?>
                    <a class="button button-primary" href="<?php echo esc_url($activateLink); ?>">
                        <?php echo esc_html($translations['activate_woocommerce']); ?> <!-- Corregido -->
                    </a>
                <?php elseif ($missWoocommerceAction === 'install') : ?>
                    <a class="button button-primary" href="<?php echo esc_url($installLink); ?>">
                        <?php echo esc_html($translations['install_woocommerce']); ?> <!-- Corregido -->
                    </a>
                <?php else : ?>
                    <a class="button button-primary" href="https://wordpress.org/plugins/woocommerce/">
                        <?php echo esc_html($translations['see_woocommerce']); ?> <!-- Corregido -->
                    </a>
                <?php endif; ?>
            </p>
        </div>
    </div>
</div>
