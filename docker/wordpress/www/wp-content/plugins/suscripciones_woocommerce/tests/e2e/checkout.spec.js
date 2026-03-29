const { test, expect } = require('@playwright/test');

test('epayco-checkout', async ({ page }, testInfo) => {
  test.setTimeout(240000);

  const checkoutEmail = 'ricardo.saldarriaga12345@epayco.com';
  const checkoutPhone = '3184210294';
  const checkoutDocument = '1214723219';

  // const fillFirstVisible = async (selectors, value) => {
  //   for (const selector of selectors) {
  //     const input = page.locator(selector).first();
  //     const isVisible = await input.isVisible().catch(() => false);
  //     if (!isVisible) continue;
  //     await input.fill(value);
  //     return true;
  //   }
  //   return false;
  // };

  const fillAndValidateField = async (selectors, value, normalize = (input) => String(input || '').trim()) => {
    const expected = normalize(value);

    for (const selector of selectors) {
      const input = page.locator(selector).first();
      const visible = await input.isVisible({ timeout: 1200 }).catch(() => false);
      if (!visible) continue;

      for (let attempt = 0; attempt < 3; attempt += 1) {
        await input.click({ force: true }).catch(() => {});
        await input.fill('').catch(() => {});
        await input.type(String(value), { delay: 20 }).catch(async () => {
          await input.fill(String(value)).catch(() => {});
        });
        await input.dispatchEvent('input').catch(() => {});
        await input.dispatchEvent('change').catch(() => {});
        await input.press('Tab').catch(() => {});

        const currentValue = await input.inputValue().catch(() => '');
        const current = normalize(currentValue);
        if (current && current === expected) {
          return true;
        }

        await page.waitForTimeout(120);
      }
    }

    return false;
  };

  const fillCheckoutRequiredFields = async () => {
    const required = {
      emailFilled: await fillAndValidateField([
        '#email:visible',
        'input[name="contact_email"]:visible',
        'input[name="billing_email"]:visible',
        'input[type="email"]:visible',
      ], checkoutEmail),
      firstNameFilled: await fillAndValidateField([
        '#shipping-first_name:visible',
        '#billing-first_name:visible',
        'input[name="shipping_first_name"]:visible',
        'input[name="billing_first_name"]:visible',
        'input[autocomplete="shipping given-name"]:visible',
      ], 'Ricardo'),
      lastNameFilled: await fillAndValidateField([
        '#shipping-last_name:visible',
        '#billing-last_name:visible',
        'input[name="shipping_last_name"]:visible',
        'input[name="billing_last_name"]:visible',
        'input[autocomplete="shipping family-name"]:visible',
      ], 'Saldarriaga'),
      addressFilled: await fillAndValidateField([
        '#shipping-address_1:visible',
        '#billing-address_1:visible',
        'input[name="shipping_address_1"]:visible',
        'input[name="billing_address_1"]:visible',
        'input[autocomplete="shipping address-line1"]:visible',
      ], 'Calle 10 #20-30'),
      cityFilled: await fillAndValidateField([
        '#shipping-city:visible',
        '#billing-city:visible',
        'input[name="shipping_city"]:visible',
        'input[name="billing_city"]:visible',
        'input[autocomplete="shipping address-level2"]:visible',
      ], 'Bogotá'),
      phoneFilled: await fillAndValidateField([
        '#shipping-phone:visible',
        '#billing-phone:visible',
        'input[name="shipping_phone"]:visible',
        'input[name="billing_phone"]:visible',
        'input[autocomplete="tel"]:visible',
      ], checkoutPhone, (input) => String(input || '').replace(/\D/g, '')),
    };

    const documentFields = await fillCheckoutDocumentFields();

    const requiredFilled = Object.values(required).every(Boolean)
      && (!documentFields.numberFieldVisible || documentFields.numberFilled);
    return { ...required, ...documentFields, requiredFilled };
  };

  const clickPlaceOrderSafely = async () => {
    const placeOrderCandidates = [
      page.getByRole('button', { name: /Realizar el pedido|Place order/i }).first(),
      page.locator('button.wc-block-components-checkout-place-order-button').first(),
      page.locator('button[type="submit"]').filter({ hasText: /Realizar el pedido|Place order/i }).first(),
    ];

    for (const button of placeOrderCandidates) {
      const visible = await button.isVisible({ timeout: 2500 }).catch(() => false);
      if (!visible) continue;

      await button.scrollIntoViewIfNeeded().catch(() => {});

      for (let attempt = 0; attempt < 3; attempt += 1) {
        const enabled = await button.isEnabled().catch(() => false);
        if (enabled) {
          await button.click({ noWaitAfter: true }).catch(() => {});
        } else {
          await button.click({ force: true, noWaitAfter: true }).catch(() => {});
        }

        const moved = await page
          .waitForURL(/order-pay|finalizar-compra\/order-pay|checkout\/order-pay/i, { timeout: 7000 })
          .then(() => true)
          .catch(() => false);
        if (moved) return true;

        const iframeOpened = await page.locator('iframe[title="ePayco Checkout V2"]').first().isVisible({ timeout: 3000 }).catch(() => false);
        if (iframeOpened) return true;

        await page.waitForTimeout(400);
      }

      const clickedByJs = await button.evaluate((node) => {
        if (!(node instanceof HTMLButtonElement)) return false;
        node.removeAttribute('disabled');
        node.disabled = false;
        node.click();
        return true;
      }).catch(() => false);

      if (clickedByJs) {
        const movedAfterJs = await page
          .waitForURL(/order-pay|finalizar-compra\/order-pay|checkout\/order-pay/i, { timeout: 7000 })
          .then(() => true)
          .catch(() => false);
        if (movedAfterJs) return true;

        const iframeOpenedAfterJs = await page.locator('iframe[title="ePayco Checkout V2"]').first().isVisible({ timeout: 3000 }).catch(() => false);
        if (iframeOpenedAfterJs) return true;
      }
    }

    return false;
  };

  /**
   * 
   Solo aplica para suscripciones
   * 
   */
  const fillCheckoutDocumentFields = async () => {
    const documentNumberValue = checkoutDocument;

    const documentTypeCandidates = [
      page.locator('select[name*="document" i]').first(),
      page.locator('select[id*="document" i]').first(),
      page.getByLabel(/Tipo de documento|Document type/i).first(),
      page.locator('select').filter({ hasText: /Seleccionar tipo de documento|Document type|Documento/i }).first(),
    ];

    let typeSelected = false;
    let typeFieldVisible = false;
    for (const selectField of documentTypeCandidates) {
      const visible = await selectField.isVisible({ timeout: 1200 }).catch(() => false);
      if (!visible) continue;
      typeFieldVisible = true;

      const options = await selectField.locator('option').allTextContents().catch(() => []);
      const normalized = options.map((option) => String(option || '').trim().toLowerCase());

      const preferredByLabel = [
        'cédula de ciudadanía',
        'cedula de ciudadania',
        'cedula',
        'dni',
        'citizenship id',
        'citizenship card',
        'document',
      ];

      let selected = false;
      for (const preferred of preferredByLabel) {
        const index = normalized.findIndex((option) => option.includes(preferred));
        if (index > 0) {
          await selectField.selectOption({ index }).catch(() => {});
          selected = true;
          break;
        }
      }

      if (!selected) {
        await selectField.selectOption({ index: 1 }).catch(() => {});
      }

      const value = (await selectField.inputValue().catch(() => '')).trim();
      if (value) {
        typeSelected = true;
        break;
      }
    }

    const documentNumberCandidates = [
      page.locator('input[name*="document" i]').first(),
      page.locator('input[id*="document" i]').first(),
      page.getByLabel(/N[uú]mero de documento|Document number/i).first(),
      page.locator('input[placeholder*="document" i], input[placeholder*="documento" i]').first(),
    ];

    let numberFilled = false;
    let numberFieldVisible = false;
    for (const inputField of documentNumberCandidates) {
      const visible = await inputField.isVisible({ timeout: 1200 }).catch(() => false);
      if (!visible) continue;
      numberFieldVisible = true;

      await inputField.click({ force: true }).catch(() => {});
      await inputField.fill('').catch(() => {});
      await inputField.type(documentNumberValue, { delay: 20 }).catch(async () => {
        await inputField.fill(documentNumberValue).catch(() => {});
      });
      await inputField.dispatchEvent('input').catch(() => {});
      await inputField.dispatchEvent('change').catch(() => {});

      const current = (await inputField.inputValue().catch(() => '')).replace(/\D/g, '');
      if (current === documentNumberValue) {
        numberFilled = true;
        break;
      }
    }

    return { typeSelected, numberFilled, typeFieldVisible, numberFieldVisible };
  };

  try {
    //url dle producto
    await page.goto('/producto/suscription-gim-x-2026-26-03/', { waitUntil: 'domcontentloaded' });

    const addToCartCandidates = [
      page.getByRole('button', { name: /Añadir al carrito|Add to cart/i }).first(),
      page.locator('button.single_add_to_cart_button').first(),
      page.locator('button[name="add-to-cart"], a.add_to_cart_button').first(),
    ];

    let addedToCart = false;
    for (const addToCartButton of addToCartCandidates) {
      const visible = await addToCartButton.isVisible({ timeout: 4000 }).catch(() => false);
      if (!visible) continue;
      await addToCartButton.click({ force: true }).catch(() => {});
      addedToCart = true;
      break;
    }
    expect(addedToCart).toBeTruthy();

    const checkoutCandidates = [
      page.getByRole('link', { name: /Finalizar compra|Checkout/i }).first(),
      page.getByRole('button', { name: /Finalizar compra|Checkout/i }).first(),
      page.locator('a.checkout, .checkout-button').first(),
    ];

    let checkoutOpened = false;
    for (const checkoutControl of checkoutCandidates) {
      const visible = await checkoutControl.isVisible({ timeout: 4000 }).catch(() => false);
      if (!visible) continue;
      await checkoutControl.click({ force: true }).catch(() => {});
      checkoutOpened = true;
      break;
    }
    expect(checkoutOpened).toBeTruthy();

    await page.waitForURL(/finalizar-compra|checkout/i, { timeout: 30000 });

    let checkoutFields = await fillCheckoutRequiredFields();
    if (!checkoutFields.requiredFilled) {
      await page.waitForTimeout(800);
      checkoutFields = await fillCheckoutRequiredFields();
    }
    expect(checkoutFields.requiredFilled).toBeTruthy();

    const epaycoOption = page.getByText(/Checkout ePayco/i).first();
    if (await epaycoOption.isVisible({ timeout: 10000 }).catch(() => false)) {
      await epaycoOption.click();
    }

    const placeOrderClicked = await clickPlaceOrderSafely();
    expect(placeOrderClicked).toBeTruthy();

    const movedToOrderPay = await page
      .waitForURL(/order-pay|finalizar-compra\/order-pay|checkout\/order-pay/i, { timeout: 30000 })
      .then(() => true)
      .catch(() => false);


  /////////////////////////////////////////////////////////////////////////

    const runEpaycoSubscriptionFlow = async () => {
      await page.waitForTimeout(5000);
      const epaycoFlow = (process.env.EPAYCO_FLOW || 'credit').toLowerCase();
      const cardProfiles = {
        aceptada: { number: '4575623182290326', expiration: '12/27', cvv: '123', state: 'aceptada' },
        rechazada: { number: '4151611527583283', expiration: '12/27', cvv: '123', state: 'rechazada' },
        fallida: { number: '5170394490379427', expiration: '12/27', cvv: '123', state: 'fallida' },
        pendiente: { number: '373118856457642', expiration: '12/27', cvv: '123', state: 'pendiente' },
        'fondos insuficientes': { number: '4151611527583283', expiration: '12/27', cvv: '123', state: 'rechazada' },
      };
      const requestedCardState = (process.env.CARD_STATE || 'aceptada').toLowerCase();
      const selectedCardProfile = cardProfiles[requestedCardState] || cardProfiles.aceptada;
      const acceptedCardProfile = cardProfiles.aceptada;
    };
  

    await runEpaycoSubscriptionFlow();
    await page.screenshot({ path: testInfo.outputPath('final-checkout.png'), fullPage: true }).catch(() => {});

    ///////////////////////////////////////////////////////////////////////

    await page.screenshot({ path: testInfo.outputPath('epayco-post-flow-state.png'), fullPage: true }).catch(() => {});
  } catch (error) {
    await page.screenshot({ path: testInfo.outputPath('checkout-error-or-block.png'), fullPage: true }).catch(() => {});
    throw error;
  }
});