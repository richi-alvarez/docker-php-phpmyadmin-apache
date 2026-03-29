(() => {
    "use strict";
    const e = window.React,
        t = window.wc.wcBlocksRegistry,
        o = window.wc.wcSettings,
        a = window.wp.element,
        c = window.wp.htmlEntities,
        n = "epaycosuscription_blocks_update_cart";
    var r;
    const m = "mp_checkout_blocks", d = "woo-epaycosubscription",
        i = (0, o.getSetting)("woo-epaycosubscription_data", {}),
        p = (0, c.decodeEntities)(i.title) || "ePayco", u = t => {
            (e => {
                const {extensionCartUpdate: t} = wc.blocksCheckout, {
                    eventRegistration: o,
                    emitResponse: c
                } = e, {onPaymentSetup: r, onCheckoutSuccess: i, onCheckoutFail: p} = o;
                (0, a.useEffect)((() => {
                    ((e, t) => {
                        e({namespace: n, data: {action: "add", gateway: t}})
                    })(t, d);
                    const e = r((() => ({type: c.responseTypes.SUCCESS})));
                    return () => (((e, t) => {
                        e({namespace: n, data: {action: "remove", gateway: t}})
                    })(t, d), e())
                }), [r]), (0, a.useEffect)((() => {
                    const e = i((async e => {
                        const t = e.processingResponse;
                        return {
                            type: c.responseTypes.SUCCESS,
                            messageContext: c.noticeContexts.PAYMENTS,
                            message: t.paymentDetails.message
                        }
                    }));
                    return () => e()
                }), [i]), (0, a.useEffect)((() => {
                    const e = p((e => {
                        const t = e.processingResponse;
                        return {
                            type: c.responseTypes.FAIL,
                            messageContext: c.noticeContexts.PAYMENTS,
                            message: t.paymentDetails.message
                        }
                    }));
                    return () => e()
                }), [p])
            })(t);
            const M = (0, a.useRef)(null),
                {eventRegistration: o, emitResponse: c} = t,
                {onPaymentSetup: r} = o;
            return (0, a.useEffect)((() => {
                const e = r((async () => {
                    const  n = {
                            "epayco_subscription": true,
                        }
                    return {
                        type: c.responseTypes.SUCCESS,
                        meta: {paymentMethodData: n}
                    }
                }));
                return () => e()
            }), [c.responseTypes.ERROR, c.responseTypes.SUCCESS, r]),
                (0, e.createElement)("div", {dangerouslySetInnerHTML: {__html: i.params.content}})
        }, l = {
            name: d,
            label: (0, e.createElement)((t => {
            const { PaymentMethodLabel: o } = t.components;
            const title = (0, c.decodeEntities)(i.title) || "Paga con ePayco";
            return (0, e.createElement)("div", { 
                style: { 
                    display: "flex", 
                    flexDirection: "column", 
                    alignItems: "flex-start",
                    width: "100%",
                    maxWidth: "100%",
                },
                className: "epayco-payment-label-responsive"
            },
                (0, e.createElement)(o, { text: title }),
                (0, e.createElement)("img", {
                    src: "https://multimedia.epayco.co/plugins-sdks/PaymentsCreditCards.svg",
                    alt: "ePayco",
                    style: {
                        maxWidth: "360px",
                        width: "100%",
                        margin: "10px 0px",
                        maxHeight: "none",
                        height: "auto"
                    }
                }),
                (0, e.createElement)("style", null, `
                    @media (max-width: 480px) {
                        .epayco-payment-label-responsive img {
                            max-width: 100% !important;
                            width: 100% !important;
                            height: auto !important;
                        }
                        .epayco-payment-label-responsive {
                            align-items: stretch !important;
                        }
                    }
                `)
            );
}), null),
            content: (0, e.createElement)(u, null),
            edit: (0, e.createElement)(u, null),
            canMakePayment: () => !0,
            ariaLabel: p,
            supports: {
                features: [
                    'subscriptions',
                    'products',
                    'subscription_suspension',
                    'subscription_reactivation',
                    'subscription_cancellation',
                    'multiple_subscriptions'
                ],
            },
        };
    (0, t.registerPaymentMethod)(l)
})();