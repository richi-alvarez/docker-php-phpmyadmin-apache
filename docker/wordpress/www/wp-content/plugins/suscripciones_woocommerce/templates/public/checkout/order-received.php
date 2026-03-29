<?php
/**
 * Part of Woo Epayco Module
 * Author - Epayco
 * Developer
 * Copyright - Copyright(c) Epayco [https://www.epayco.com]
 * License - https://www.gnu.org/licenses/gpl.html GPL version 2 or higher
 *
 * @package Epayco
 */

if (!defined('ABSPATH')) {
    exit;
}

?>
<div id="epayco-cms-detail-purchase"></div>
<script>
     document.addEventListener('DOMContentLoaded', function() {
if (window.DetailPurchase) {
    DetailPurchase.config({
    referencePayco: <?php echo json_encode($referencePayco); ?>,  // ID de referencia de la orden a consultar
    sendEmail: <?php echo json_encode($sendEmail); ?>, // Habilita envío de comprobante al correo
    lang: <?php echo json_encode($lang); ?> // Idioma del componente (es, en, pt)
    });
  } else {
    console.error("DetailPurchase no está cargado todavía");
  }
});

</script>
