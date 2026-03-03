const { test, expect } = require('@playwright/test');

test('procesa checkout con método de pago ePayco', async ({ page }, testInfo) => {
  test.setTimeout(240000);

  const checkoutEmail = 'ricardo.saldarriaga@epayco.com';
  const checkoutPhone = '3184210294';
  const checkoutDocument = '1214723219';
  const epaycoFlow = (process.env.EPAYCO_FLOW || 'credit_card').toLowerCase();
  const cardProfiles = {
    aceptada: { number: '4575623182290326', expiration: '12/27', cvv: '123', state: 'aceptada' },
    rechazada: { number: '4151611527583283', expiration: '12/27', cvv: '123', state: 'rechazada' },
    fallida: { number: '5170394490379427', expiration: '12/27', cvv: '123', state: 'fallida' },
    pendiente: { number: '373118856457642', expiration: '12/27', cvv: '123', state: 'pendiente' },
    'fondos insuficientes': { number: '4151611527583283', expiration: '12/27', cvv: '123', state: 'rechazada' },
  };
  const requestedCardState = (process.env.CARD_STATE || 'fallida').toLowerCase();
  const selectedCardProfile = cardProfiles[requestedCardState] || cardProfiles.aceptada;
  const acceptedCardProfile = cardProfiles.aceptada;
  const failureScreenshotPath = testInfo.outputPath('checkout-error-or-block.png');
  const refPaycoScreenshotPath = testInfo.outputPath(`ref-payco-${epaycoFlow}.png`);

  const fillFirstVisible = async (selectors, value) => {
    for (const selector of selectors) {
      const input = page.locator(selector).first();
      const isVisible = await input.isVisible().catch(() => false);
      if (!isVisible) continue;
      await input.fill(value);
      return true;
    }
    return false;
  };

  try {
    await page.goto('/producto/camisa-roja/', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Añadir al carrito' }).first().click();
    await page.getByRole('link', { name: /Finalizar compra/i }).first().click();
    await page.waitForURL(/finalizar-compra/i, { timeout: 30000 });

    await fillFirstVisible(['#email:visible', 'input[name="contact_email"]:visible'], checkoutEmail);
    await fillFirstVisible(['#shipping-first_name:visible', 'input[name="shipping_first_name"]:visible'], 'Ricardo');
    await fillFirstVisible(['#shipping-last_name:visible', 'input[name="shipping_last_name"]:visible'], 'Saldarriaga');
    await fillFirstVisible(['#shipping-address_1:visible', 'input[name="shipping_address_1"]:visible'], 'Calle 10 #20-30');
    await fillFirstVisible(['#shipping-city:visible', 'input[name="shipping_city"]:visible'], 'Bogotá');
    await fillFirstVisible(['#shipping-phone:visible', 'input[name="shipping_phone"]:visible'], checkoutPhone);

    const epaycoOption = page.getByText(/Checkout ePayco/i).first();
    if (await epaycoOption.isVisible({ timeout: 10000 }).catch(() => false)) {
      await epaycoOption.click();
    }

    const placeOrder = page.getByRole('button', { name: /Realizar el pedido|Place Order/i }).first();
    await expect(placeOrder).toBeVisible({ timeout: 15000 });
    await placeOrder.click({ noWaitAfter: true });

    await page.waitForURL(/order-pay|finalizar-compra\/order-pay/i, { timeout: 60000 });
    await page.waitForTimeout(5000);

    const epaycoIframe = page.locator('iframe[title="ePayco Checkout V2"]').first();
    let iframeVisible = await epaycoIframe.isVisible({ timeout: 30000 }).catch(() => false);

    if (!iframeVisible) {
      const iframeCount = await page.locator('iframe[title="ePayco Checkout V2"]').count();
      if (iframeCount > 0) {
        iframeVisible = true;
      }
    }

    if (!iframeVisible) {
      const openCheckout = page.locator('a[href="#"]').first();
      if (await openCheckout.isVisible({ timeout: 10000 }).catch(() => false)) {
        await openCheckout.click({ force: true });
        await page.waitForTimeout(3000);
      }
      iframeVisible = await epaycoIframe.isVisible({ timeout: 30000 }).catch(() => false);
    }

    expect(iframeVisible).toBeTruthy();

    const frame = page.frameLocator('iframe[title="ePayco Checkout V2"]');

    const captureRefPaycoScreenshot = async () => {
      const refPaycoHeading = frame.getByRole('heading', { name: /Referencia ePayco/i }).first();
      const refContainer = frame.locator('article', { has: refPaycoHeading }).first();

      if (await refContainer.isVisible({ timeout: 30000 }).catch(() => false)) {
        //await refContainer.screenshot({ path: refPaycoScreenshotPath }).catch(() => {});
        return;
      }

      if (await refPaycoHeading.isVisible({ timeout: 30000 }).catch(() => false)) {
        //await page.screenshot({ path: refPaycoScreenshotPath, fullPage: true }).catch(() => {});
      }
    };

    const ensureModalPhone = async () => {
      const phoneInputs = [
        frame.getByRole('textbox', { name: 'mobilePhone' }).first(),
        frame.locator('input[name="mobilePhone"]').first(),
        frame.locator('input[placeholder*="número"]').first(),
      ];

      const findVisiblePhoneInput = async () => {
        const maxWaitMs = 45000;
        const startedAt = Date.now();

        while (Date.now() - startedAt < maxWaitMs) {
          for (const phoneInput of phoneInputs) {
            const isVisible = await phoneInput.isVisible({ timeout: 800 }).catch(() => false);
            if (isVisible) {
              return phoneInput;
            }
          }

          const cardMethodVisible = await frame.getByRole('link', { name: /Tarjeta de crédito y\/o débito/i }).first().isVisible({ timeout: 500 }).catch(() => false);
          const cashMethodVisible = await frame.getByRole('link', { name: /Efectivo/i }).first().isVisible({ timeout: 500 }).catch(() => false);
          if (cardMethodVisible || cashMethodVisible) {
            return null;
          }

          await page.waitForTimeout(500);
        }

        return false;
      };

      const phoneInput = await findVisiblePhoneInput();
      if (phoneInput === null) {
        return true;
      }
      if (!phoneInput) {
        return false;
      }

      for (let attempt = 0; attempt < 4; attempt += 1) {
        const currentValue = (await phoneInput.inputValue().catch(() => '')).trim();
        const currentDigits = currentValue.replace(/\D/g, '');
        if (currentDigits.length >= 10) {
          return true;
        }

        await phoneInput.click({ force: true });
        await phoneInput.fill('');
        await phoneInput.type(checkoutPhone, { delay: 35 });
        await page.waitForTimeout(300);
      }

      const finalValue = (await phoneInput.inputValue().catch(() => '')).trim();
      if (finalValue.replace(/\D/g, '').length >= 10) {
        return true;
      }

      return false;
    };

    const phoneReady = await ensureModalPhone();
    expect(phoneReady).toBeTruthy();

    const modalEmail = frame.getByRole('textbox', { name: 'email' }).first();
    if (await modalEmail.isVisible({ timeout: 8000 }).catch(() => false)) {
      const emailValue = (await modalEmail.inputValue().catch(() => '')).trim();
      if (!emailValue) {
        await modalEmail.fill(checkoutEmail);
      }
    }

    const contactContinue = frame.getByRole('button', { name: 'Continuar' }).first();
    if (await contactContinue.isVisible({ timeout: 10000 }).catch(() => false)) {
      if (!(await contactContinue.isEnabled().catch(() => false))) {
        await ensureModalPhone();
      }
      await expect(contactContinue).toBeEnabled({ timeout: 15000 });
      await contactContinue.click();

      const cardMethod = frame.getByRole('link', { name: /Tarjeta de crédito y\/o débito/i }).first();
      const cashMethod = frame.getByRole('link', { name: /Efectivo/i }).first();
      const methodsLoaded = await Promise.race([
        cardMethod.waitFor({ state: 'visible', timeout: 12000 }).then(() => true).catch(() => false),
        cashMethod.waitFor({ state: 'visible', timeout: 12000 }).then(() => true).catch(() => false),
      ]);

      if (!methodsLoaded) {
        await contactContinue.click({ force: true });
        await Promise.race([
          cardMethod.waitFor({ state: 'visible', timeout: 20000 }),
          cashMethod.waitFor({ state: 'visible', timeout: 20000 }),
        ]);
      }
    }

    if (epaycoFlow === 'cash') {
      await frame.getByRole('link', { name: /Efectivo/i }).first().click();
      await frame.getByRole('button', { name: /Select Efecty|Efecty/i }).first().click();
      await frame.getByRole('button', { name: /Continuar/i }).first().click();

      const ensureCashFullName = async () => {
        const fullNameValue = 'Ricardo Saldarriaga';
        const cashNameInputs = [
          frame.getByRole('textbox', { name: 'name' }).first(),
          frame.getByRole('textbox', { name: /Nombre y Apellidos/i }).first(),
          frame.locator('input[name="name"]').first(),
          frame.locator('input[placeholder*="Escribe"]').first(),
          frame.locator('input[placeholder*="Nombre"]').first(),
        ];

        for (const nameInput of cashNameInputs) {
          for (let attempt = 0; attempt < 3; attempt += 1) {
            const currentValue = (await nameInput.inputValue().catch(() => '')).trim();
            if (currentValue.split(/\s+/).filter(Boolean).length >= 2) {
              return currentValue;
            }

            const canUse = await nameInput.isVisible({ timeout: 3000 }).catch(() => false);
            if (!canUse) continue;

            await nameInput.click({ force: true });
            await nameInput.fill('');
            await nameInput.type(fullNameValue, { delay: 30 });
            await page.waitForTimeout(250);
          }
        }

        const fallbackInput = frame.locator('input[name="name"]').first();
        if (await fallbackInput.isVisible({ timeout: 5000 }).catch(() => false)) {
          await fallbackInput.fill(fullNameValue);
          await page.waitForTimeout(250);
        }

        return (await frame.locator('input[name="name"]').first().inputValue().catch(() => '')).trim();
      };

      const cashFullNameValue = await ensureCashFullName();
      expect(cashFullNameValue.split(/\s+/).filter(Boolean).length).toBeGreaterThanOrEqual(2);

      await frame.getByRole('textbox', { name: 'numberDoc' }).first().fill(checkoutDocument);
      const cashTerms = frame.getByTestId('default-checkbox').first();
      if (await cashTerms.isVisible({ timeout: 8000 }).catch(() => false)) {
        await cashTerms.click();
      }
      await frame.getByRole('button', { name: 'Pagar' }).first().click();

      const pendingMessage = frame.locator('text=/\[200\].*Pendiente/i').first();
      if (await pendingMessage.isVisible({ timeout: 25000 }).catch(() => false)) {
        await captureRefPaycoScreenshot();
        const closePending = frame.getByRole('button', { name: 'Close' }).first();
        if (await closePending.isVisible().catch(() => false)) {
          await closePending.click();
        }
      }

      const finalizar = frame.getByRole('button', { name: 'Finalizar' }).first();
      await expect(finalizar).toBeVisible({ timeout: 60000 });
      await expect(finalizar).toBeEnabled({ timeout: 60000 });
      await finalizar.click({ noWaitAfter: true });
    } else {
      const readIframeText = async () => {
        const iframeHandle = await page.locator('iframe[title="ePayco Checkout V2"]').elementHandle();
        const iframeContext = await iframeHandle?.contentFrame();
        const text = await iframeContext?.evaluate(() => (document.body?.innerText || '').toLowerCase());
        return text || '';
      };

      const waitCardOutcome = async (timeoutMs = 30000) => {
        const startedAt = Date.now();
        while (Date.now() - startedAt < timeoutMs) {
          const text = await readIframeText();
          if (/\[200\].*aceptada|transacción aprobada|respuesta\s*aprobada/.test(text)) return 'accepted';
          if (/fondos insuficientes|rechazada|fallida|error de comunicación/.test(text)) return 'rejected';
          if (/pendiente|transacción pendiente/.test(text)) return 'pending';
          await page.waitForTimeout(800);
        }
        return 'unknown';
      };

      const ensureCardStepVisible = async () => {
        const cardNumberInput = frame.getByRole('textbox', { name: 'cardNumber' }).first();
        if (await cardNumberInput.isVisible({ timeout: 3000 }).catch(() => false)) {
          return cardNumberInput;
        }

        const retryPaymentButton = frame.getByRole('button', { name: /Reintentar pago/i }).first();
        if (await retryPaymentButton.isVisible({ timeout: 3000 }).catch(() => false)) {
          await retryPaymentButton.click();
        }

        if (await cardNumberInput.isVisible({ timeout: 8000 }).catch(() => false)) {
          return cardNumberInput;
        }

        const returnButton = frame.getByRole('button', { name: /return/i }).first();
        if (await returnButton.isVisible({ timeout: 3000 }).catch(() => false)) {
          await returnButton.click();
        }

        const cardMethod = frame.getByRole('link', { name: /Tarjeta de crédito y\/o débito/i }).first();
        if (await cardMethod.isVisible({ timeout: 12000 }).catch(() => false)) {
          await cardMethod.click();
        }

        await expect(cardNumberInput).toBeVisible({ timeout: 20000 });
        return cardNumberInput;
      };

      const ensureCardFullName = async () => {
        const cardNameInput = frame.locator('input[name="name"]').first();
        await expect(cardNameInput).toBeVisible({ timeout: 15000 });

        let cardFullNameValue = (await cardNameInput.inputValue().catch(() => '')).trim();
        if (cardFullNameValue.split(/\s+/).filter(Boolean).length < 2) {
          await cardNameInput.click({ force: true });
          await cardNameInput.fill('');
          await cardNameInput.type('Ricardo Saldarriaga', { delay: 30 });
          await page.waitForTimeout(250);
          cardFullNameValue = (await cardNameInput.inputValue().catch(() => '')).trim();
        }

        expect(cardFullNameValue.split(/\s+/).filter(Boolean).length).toBeGreaterThanOrEqual(2);
      };

      const clickEnabledContinue = async () => {
        const continueButtons = frame.locator('button:visible', { hasText: /Continuar/i });
        const buttonCount = await continueButtons.count();

        for (let index = 0; index < buttonCount; index += 1) {
          const button = continueButtons.nth(index);
          const isEnabled = await button.isEnabled().catch(() => false);
          if (!isEnabled) continue;
          await button.click();
          return true;
        }

        return false;
      };

      const executeCardPaymentAttempt = async (cardProfile) => {
        const ensureCardAddress = async () => {
          const addressValue = 'Calle 10 #20-30';
          const addressInputs = [
            frame.getByRole('textbox', { name: /Dirección/i }).first(),
            frame.getByRole('textbox', { name: 'address' }).first(),
            frame.locator('input[name="address"]').first(),
            frame.locator('input[placeholder*="Escribe"]').first(),
            frame.locator('input[placeholder*="Dirección"]').first(),
          ];

          for (const addressInput of addressInputs) {
            const isVisible = await addressInput.isVisible({ timeout: 2000 }).catch(() => false);
            if (!isVisible) continue;

            for (let attempt = 0; attempt < 3; attempt += 1) {
              const currentValue = (await addressInput.inputValue().catch(() => '')).trim();
              if (currentValue.length >= 6) {
                return true;
              }

              await addressInput.click({ force: true });
              await addressInput.fill('');
              await addressInput.type(addressValue, { delay: 20 });
              await page.waitForTimeout(250);
            }

            const finalValue = (await addressInput.inputValue().catch(() => '')).trim();
            if (finalValue.length >= 6) {
              return true;
            }
          }

          return false;
        };

        const cardNumberInput = await ensureCardStepVisible();
        await ensureCardFullName();

        await cardNumberInput.fill(cardProfile.number);
        await frame.getByRole('textbox', { name: 'expirationDate' }).first().fill(cardProfile.expiration);
        await frame.getByRole('textbox', { name: /CVV/i }).first().fill(cardProfile.cvv);

        let continueClicked = await clickEnabledContinue();
        if (!continueClicked) {
          await page.waitForTimeout(2000);
          continueClicked = await clickEnabledContinue();
        }

        expect(continueClicked).toBeTruthy();
        const cardDocumentInput = frame.getByRole('textbox', { name: 'numberDoc' }).first();
        await cardDocumentInput.fill(checkoutDocument);
        await ensureCardAddress();

        const cardTermsCandidates = [
          frame.getByTestId('default-checkbox').first(),
          frame.locator('input[type="checkbox"]').first(),
          frame.getByRole('checkbox').first(),
        ];

        for (const termControl of cardTermsCandidates) {
          const isVisible = await termControl.isVisible({ timeout: 2000 }).catch(() => false);
          if (!isVisible) continue;

          const isChecked = await termControl.isChecked().catch(() => false);
          if (!isChecked) {
            await termControl.click({ force: true });
          }
          break;
        }

        const payButton = frame.getByRole('button', { name: 'Pagar' }).first();
        let payEnabled = await payButton.isEnabled().catch(() => false);
        if (!payEnabled) {
          await cardDocumentInput.fill(checkoutDocument);
          await ensureCardAddress();
          await page.waitForTimeout(800);
          payEnabled = await payButton.isEnabled().catch(() => false);
        }

        await expect(payButton).toBeEnabled({ timeout: 15000 });
        await payButton.click();
        return waitCardOutcome(35000);
      };

      let paymentOutcome = await executeCardPaymentAttempt(selectedCardProfile);

      const shouldRetryWithAcceptedCard = ['rechazada', 'fallida'].includes(selectedCardProfile.state);
      if (shouldRetryWithAcceptedCard && paymentOutcome !== 'accepted') {
        for (let retryAttempt = 0; retryAttempt < 2; retryAttempt += 1) {
          const retryPaymentButton = frame.getByRole('button', { name: /Reintentar pago/i }).first();
          if (await retryPaymentButton.isVisible({ timeout: 8000 }).catch(() => false)) {
            await retryPaymentButton.click();
          }

          paymentOutcome = await executeCardPaymentAttempt(acceptedCardProfile);
          if (paymentOutcome === 'accepted') {
            break;
          }
        }
      }

      const acceptedMessage = frame.locator('text=/\[200\].*Aceptada/i').first();
      if (paymentOutcome === 'accepted' || await acceptedMessage.isVisible({ timeout: 5000 }).catch(() => false)) {
        await captureRefPaycoScreenshot();
        await page.screenshot({ path: 'epayco-aceptada-checkout-spec.png', fullPage: true });
        const closeAccepted = frame.getByRole('button', { name: 'Close' }).first();
        if (await closeAccepted.isVisible().catch(() => false)) {
          await closeAccepted.click();
        }
      }

      const finalizar = frame.getByRole('button', { name: 'Finalizar' }).first();
      if (await finalizar.isVisible({ timeout: 45000 }).catch(() => false)) {
        const finalizarEnabled = await finalizar.isEnabled().catch(() => false);
        if (finalizarEnabled) {
          await finalizar.click({ noWaitAfter: true });
        }
      }

      const exitButton = frame.getByRole('button', { name: 'exit-button' }).first();
      if (await exitButton.isVisible({ timeout: 10000 }).catch(() => false)) {
        const exitEnabled = await exitButton.isEnabled().catch(() => false);
        if (exitEnabled) {
          await exitButton.click();
          const acceptExit = frame.getByRole('button', { name: 'Aceptar' }).first();
          if (await acceptExit.isVisible({ timeout: 10000 }).catch(() => false)) {
            await acceptExit.click();
          }
        }
      }
    }

    if (/order-pay/i.test(page.url())) {
      const finalizeFallback = frame.getByRole('button', { name: 'Finalizar' }).first();
      if (await finalizeFallback.isVisible({ timeout: 60000 }).catch(() => false)) {
        await expect(finalizeFallback).toBeEnabled({ timeout: 60000 });
        await finalizeFallback.click({ noWaitAfter: true });
      }
    }

    let reachedOrderReceived = false;
    try {
      await page.waitForURL(/order-received/i, { timeout: 60000, waitUntil: 'domcontentloaded' });
      reachedOrderReceived = true;
    } catch {
      reachedOrderReceived = false;
    }

    if (reachedOrderReceived) {
      await expect(page.getByRole('heading', { name: /Pedido recibido|Order received/i }).first()).toBeVisible({ timeout: 30000 });
    } else {
      const approvedHeading = frame.getByRole('heading', { name: /Transacción aprobada/i }).first();
      await expect(approvedHeading).toBeVisible({ timeout: 30000 });
      await captureRefPaycoScreenshot();
    }
  } catch (error) {
    await page.screenshot({ path: failureScreenshotPath, fullPage: true }).catch(() => {});
    throw error;
  }
});