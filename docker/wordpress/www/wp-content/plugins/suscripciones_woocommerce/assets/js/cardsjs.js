function CardJs2(elem) {
    (this.elem = jQuery(elem)),
        (this.captureName = this.elem.data("capture-name") ? this.elem.data("capture-name") : !1),
        (this.iconColour = this.elem.data("icon-colour") ? this.elem.data("icon-colour") : !1),
        (this.stripe = this.elem.data("stripe") ? this.elem.data("stripe") : !1),
        this.stripe && (this.captureName = !1),
        this.initNameInput(),
        this.initCardNumberInput(),
        this.elem.empty(),
        this.setupCardNumberInput(),
        this.iconColour && this.setIconColour(this.iconColour),
        this.refreshCreditCardTypeIcon();
}

!(function ($) {
    var methods = {
        init: function () {
            return this.data("cardsjs", new CardJs2(this)), this;
        },
        cardNumber: function () {
            return this.data("cardsjs").getCardNumber();
        },
        cardType: function () {
            return this.data("cardsjs").getCardType();
        },
        name: function () {
            return this.data("cardsjs").getName();
        },
    };
    $.fn.CardJs = function (methodOrOptions) {
        return methods[methodOrOptions]
            ? methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1))
            : "object" != typeof methodOrOptions && methodOrOptions
                ? void $.error("Method " + methodOrOptions + " does not exist on jQuery.CardJs")
                : methods.init.apply(this, arguments);
    };
})(jQuery),
    $(function () {
        $(".cards-js").each(function (i, obj) {
            $(obj).CardJs2();
        });
    }),
    (CardJs2.prototype.constructor = CardJs2),
    (CardJs2.KEYS = { 0: 48, 9: 57, NUMPAD_0: 96, NUMPAD_9: 105, DELETE: 46, BACKSPACE: 8, ARROW_LEFT: 37, ARROW_RIGHT: 39, ARROW_UP: 38, ARROW_DOWN: 40, HOME: 36, END: 35, TAB: 9, A: 65, X: 88, C: 67, V: 86 }),
    (CardJs2.CREDIT_CARD_NUMBER_DEFAULT_MASK = "XXXX XXXX XXXX XXXX"),
    (CardJs2.CREDIT_CARD_NUMBER_VISA_MASK = "XXXX XXXX XXXX XXXX"),
    (CardJs2.CREDIT_CARD_NUMBER_MASTERCARD_MASK = "XXXX XXXX XXXX XXXX"),
    (CardJs2.CREDIT_CARD_NUMBER_DISCOVER_MASK = "XXXX XXXX XXXX XXXX"),
    (CardJs2.CREDIT_CARD_NUMBER_JCB_MASK = "XXXX XXXX XXXX XXXX"),
    (CardJs2.CREDIT_CARD_NUMBER_AMEX_MASK = "XXXX XXXXXX XXXXX"),
    (CardJs2.CREDIT_CARD_NUMBER_DINERS_MASK = "XXXX XXXX XXXX XX"),
    (CardJs2.prototype.creditCardNumberMask = CardJs2.CREDIT_CARD_NUMBER_DEFAULT_MASK),
    (CardJs2.CREDIT_CARD_NUMBER_PLACEHOLDER = "**** **** **** ****"),
    (CardJs2.NAME_PLACEHOLDER = "John Doe"),
    (CardJs2.CVC_MASK_3 = "***"),
    (CardJs2.CVC_MASK_4 = "****"),
    (CardJs2.CVC_PLACEHOLDER = "CVC"),
    (CardJs2.CREDIT_CARD_SVG =
        '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="3px" width="24px" height="17px" viewBox="0 0 216 146" enable-background="new 0 0 216 146" xml:space="preserve"><g><path class="svg" d="M182.385,14.258c-2.553-2.553-5.621-3.829-9.205-3.829H42.821c-3.585,0-6.653,1.276-9.207,3.829c-2.553,2.553-3.829,5.621-3.829,9.206v99.071c0,3.585,1.276,6.654,3.829,9.207c2.554,2.553,5.622,3.829,9.207,3.829H173.18c3.584,0,6.652-1.276,9.205-3.829s3.83-5.622,3.83-9.207V23.464C186.215,19.879,184.938,16.811,182.385,14.258z M175.785,122.536c0,0.707-0.258,1.317-0.773,1.834c-0.516,0.515-1.127,0.772-1.832,0.772H42.821c-0.706,0-1.317-0.258-1.833-0.773c-0.516-0.518-0.774-1.127-0.774-1.834V73h135.571V122.536z M175.785,41.713H40.214v-18.25c0-0.706,0.257-1.316,0.774-1.833c0.516-0.515,1.127-0.773,1.833-0.773H173.18c0.705,0,1.316,0.257,1.832,0.773c0.516,0.517,0.773,1.127,0.773,1.833V41.713z"/><rect class="svg" x="50.643" y="104.285" width="20.857" height="10.429"/><rect class="svg" x="81.929" y="104.285" width="31.286" height="10.429"/></g></svg>'),
    (CardJs2.LOCK_SVG =
        '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="3px" width="24px" height="17px" viewBox="0 0 216 146" enable-background="new 0 0 216 146" xml:space="preserve"><path class="svg" d="M152.646,70.067c-1.521-1.521-3.367-2.281-5.541-2.281H144.5V52.142c0-9.994-3.585-18.575-10.754-25.745c-7.17-7.17-15.751-10.755-25.746-10.755s-18.577,3.585-25.746,10.755C75.084,33.567,71.5,42.148,71.5,52.142v15.644h-2.607c-2.172,0-4.019,0.76-5.54,2.281c-1.521,1.52-2.281,3.367-2.281,5.541v46.929c0,2.172,0.76,4.019,2.281,5.54c1.521,1.52,3.368,2.281,5.54,2.281h78.214c2.174,0,4.02-0.76,5.541-2.281c1.52-1.521,2.281-3.368,2.281-5.54V75.607C154.93,73.435,154.168,71.588,152.646,70.067z M128.857,67.786H87.143V52.142c0-5.757,2.037-10.673,6.111-14.746c4.074-4.074,8.989-6.11,14.747-6.11s10.673,2.036,14.746,6.11c4.073,4.073,6.11,8.989,6.11,14.746V67.786z"/></svg>'),
    (CardJs2.USER_SVG =
        '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="4px" width="24px" height="16px" viewBox="0 0 216 146" enable-background="new 0 0 216 146" xml:space="preserve"><g><path class="svg" d="M107.999,73c8.638,0,16.011-3.056,22.12-9.166c6.111-6.11,9.166-13.483,9.166-22.12c0-8.636-3.055-16.009-9.166-22.12c-6.11-6.11-13.484-9.165-22.12-9.165c-8.636,0-16.01,3.055-22.12,9.165c-6.111,6.111-9.166,13.484-9.166,22.12c0,8.637,3.055,16.01,9.166,22.12C91.99,69.944,99.363,73,107.999,73z"/><path class="svg" d="M165.07,106.037c-0.191-2.743-0.571-5.703-1.141-8.881c-0.57-3.178-1.291-6.124-2.16-8.84c-0.869-2.715-2.037-5.363-3.504-7.943c-1.466-2.58-3.15-4.78-5.052-6.6s-4.223-3.272-6.965-4.358c-2.744-1.086-5.772-1.63-9.085-1.63c-0.489,0-1.63,0.584-3.422,1.752s-3.815,2.472-6.069,3.911c-2.254,1.438-5.188,2.743-8.799,3.909c-3.612,1.168-7.237,1.752-10.877,1.752c-3.639,0-7.264-0.584-10.876-1.752c-3.611-1.166-6.545-2.471-8.799-3.909c-2.254-1.439-4.277-2.743-6.069-3.911c-1.793-1.168-2.933-1.752-3.422-1.752c-3.313,0-6.341,0.544-9.084,1.63s-5.065,2.539-6.966,4.358c-1.901,1.82-3.585,4.02-5.051,6.6s-2.634,5.229-3.503,7.943c-0.869,2.716-1.589,5.662-2.159,8.84c-0.571,3.178-0.951,6.137-1.141,8.881c-0.19,2.744-0.285,5.554-0.285,8.433c0,6.517,1.983,11.664,5.948,15.439c3.965,3.774,9.234,5.661,15.806,5.661h71.208c6.572,0,11.84-1.887,15.806-5.661c3.966-3.775,5.948-8.921,5.948-15.439C165.357,111.591,165.262,108.78,165.07,106.037z"/></g></svg>'),
    (CardJs2.MAIL_SVG =
        '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"x="0px" y="4px" width="24px" height="16px" viewBox="0 0 216 146" enable-background="new 0 0 216 146" xml:space="preserve"><path class="svg" d="M177.171,19.472c-2.553-2.553-5.622-3.829-9.206-3.829H48.036c-3.585,0-6.654,1.276-9.207,3.829C36.276,22.025,35,25.094,35,28.679v88.644c0,3.585,1.276,6.652,3.829,9.205c2.553,2.555,5.622,3.83,9.207,3.83h119.929c3.584,0,6.653-1.275,9.206-3.83c2.554-2.553,3.829-5.621,3.829-9.205V28.679C181,25.094,179.725,22.025,177.171,19.472zM170.57,117.321c0,0.706-0.258,1.317-0.774,1.833s-1.127,0.773-1.832,0.773H48.035c-0.706,0-1.317-0.257-1.833-0.773c-0.516-0.516-0.774-1.127-0.774-1.833V54.75c1.738,1.955,3.612,3.748,5.622,5.377c14.557,11.189,26.126,20.368,34.708,27.538c2.77,2.336,5.024,4.155,6.762,5.459s4.087,2.62,7.047,3.951s5.744,1.995,8.351,1.995H108h0.081c2.606,0,5.392-0.664,8.351-1.995c2.961-1.331,5.311-2.647,7.049-3.951c1.737-1.304,3.992-3.123,6.762-5.459c8.582-7.17,20.15-16.349,34.707-27.538c2.01-1.629,3.885-3.422,5.621-5.377V117.321z M170.57,30.797v0.896c0,3.204-1.262,6.776-3.787,10.713c-2.525,3.938-5.256,7.075-8.188,9.41c-10.484,8.257-21.373,16.865-32.672,25.827c-0.326,0.271-1.277,1.073-2.852,2.403c-1.574,1.331-2.824,2.351-3.748,3.056c-0.924,0.707-2.131,1.562-3.625,2.566s-2.865,1.752-4.114,2.24s-2.417,0.732-3.503,0.732H108h-0.082c-1.086,0-2.253-0.244-3.503-0.732c-1.249-0.488-2.621-1.236-4.114-2.24c-1.493-1.004-2.702-1.859-3.625-2.566c-0.923-0.705-2.173-1.725-3.748-3.056c-1.575-1.33-2.526-2.132-2.852-2.403c-11.297-8.962-22.187-17.57-32.67-25.827c-7.985-6.3-11.977-14.013-11.977-23.138c0-0.706,0.258-1.317,0.774-1.833c0.516-0.516,1.127-0.774,1.833-0.774h119.929c0.434,0.244,0.814,0.312,1.141,0.204c0.326-0.11,0.57,0.094,0.732,0.61c0.163,0.516,0.312,0.76,0.448,0.733c0.136-0.027,0.218,0.312,0.245,1.019c0.025,0.706,0.039,1.061,0.039,1.061V30.797z"/></svg>'),
    (CardJs2.INFORMATION_SVG =
        '<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="4px" width="24px" height="16px" viewBox="0 0 216 146" enable-background="new 0 0 216 146" xml:space="preserve"><g><path class="svg" d="M97.571,41.714h20.859c1.411,0,2.633-0.516,3.666-1.548c1.031-1.031,1.547-2.254,1.547-3.666V20.857c0-1.412-0.516-2.634-1.549-3.667c-1.031-1.031-2.254-1.548-3.666-1.548H97.571c-1.412,0-2.634,0.517-3.666,1.548c-1.032,1.032-1.548,2.255-1.548,3.667V36.5c0,1.412,0.516,2.635,1.548,3.666C94.937,41.198,96.159,41.714,97.571,41.714z"/><path class="svg" d="M132.523,111.048c-1.031-1.032-2.254-1.548-3.666-1.548h-5.215V62.571c0-1.412-0.516-2.634-1.547-3.666c-1.033-1.032-2.255-1.548-3.666-1.548H87.143c-1.412,0-2.634,0.516-3.666,1.548c-1.032,1.032-1.548,2.254-1.548,3.666V73c0,1.412,0.516,2.635,1.548,3.666c1.032,1.032,2.254,1.548,3.666,1.548h5.215V109.5h-5.215c-1.412,0-2.634,0.516-3.666,1.548c-1.032,1.032-1.548,2.254-1.548,3.666v10.429c0,1.412,0.516,2.635,1.548,3.668c1.032,1.03,2.254,1.547,3.666,1.547h41.714c1.412,0,2.634-0.517,3.666-1.547c1.031-1.033,1.547-2.256,1.547-3.668v-10.429C134.07,113.302,133.557,112.08,132.523,111.048z"/></g></svg>'),
    (CardJs2.keyCodeFromEvent = function (e) {
        return e.which || e.keyCode;
    }),
    (CardJs2.keyIsCommandFromEvent = function (e) {
        return e.ctrlKey || e.metaKey;
    }),
    (CardJs2.keyIsNumber = function (e) {
        return CardJs2.keyIsTopNumber(e) || CardJs2.keyIsKeypadNumber(e);
    }),
    (CardJs2.keyIsTopNumber = function (e) {
        var keyCode = CardJs2.keyCodeFromEvent(e);
        return keyCode >= CardJs2.KEYS[0] && keyCode <= CardJs2.KEYS[9];
    }),
    (CardJs2.keyIsKeypadNumber = function (e) {
        var keyCode = CardJs2.keyCodeFromEvent(e);
        return keyCode >= CardJs2.KEYS.NUMPAD_0 && keyCode <= CardJs2.KEYS.NUMPAD_9;
    }),
    (CardJs2.keyIsDelete = function (e) {
        return CardJs2.keyCodeFromEvent(e) == CardJs2.KEYS.DELETE;
    }),
    (CardJs2.keyIsBackspace = function (e) {
        return CardJs2.keyCodeFromEvent(e) == CardJs2.KEYS.BACKSPACE;
    }),
    (CardJs2.keyIsDeletion = function (e) {
        return CardJs2.keyIsDelete(e) || CardJs2.keyIsBackspace(e);
    }),
    (CardJs2.keyIsArrow = function (e) {
        var keyCode = CardJs2.keyCodeFromEvent(e);
        return keyCode >= CardJs2.KEYS.ARROW_LEFT && keyCode <= CardJs2.KEYS.ARROW_DOWN;
    }),
    (CardJs2.keyIsNavigation = function (e) {
        var keyCode = CardJs2.keyCodeFromEvent(e);
        return keyCode == CardJs2.KEYS.HOME || keyCode == CardJs2.KEYS.END;
    }),
    (CardJs2.keyIsKeyboardCommand = function (e) {
        var keyCode = CardJs2.keyCodeFromEvent(e);
        return CardJs2.keyIsCommandFromEvent(e) && (keyCode == CardJs2.KEYS.A || keyCode == CardJs2.KEYS.X || keyCode == CardJs2.KEYS.C || keyCode == CardJs2.KEYS.V);
    }),
    (CardJs2.keyIsTab = function (e) {
        return CardJs2.keyCodeFromEvent(e) == CardJs2.KEYS.TAB;
    }),
    (CardJs2.copyAllElementAttributes = function (source, destination) {
        $.each(source[0].attributes, function (idx, attr) {
            destination.attr(attr.nodeName, attr.nodeValue);
        });
    }),
    (CardJs2.numbersOnlyString = function (string) {
        for (var numbersOnlyString = "", i = 0; i < string.length; i++) {
            var currentChar = string.charAt(i),
                isValid = !isNaN(parseInt(currentChar));
            isValid && (numbersOnlyString += currentChar);
        }
        return numbersOnlyString;
    }),
    (CardJs2.applyFormatMask = function (string, mask) {
        for (var formattedString = "", numberPos = 0, j = 0; j < mask.length; j++) {
            var currentMaskChar = mask[j];
            if ("X" == currentMaskChar) {
                var digit = string.charAt(numberPos);
                if (!digit) break;
                (formattedString += string.charAt(numberPos)), numberPos++;
            } else formattedString += currentMaskChar;
        }
        return formattedString;
    }),
    (CardJs2.cardTypeFromNumber = function (number) {
        if (((re = new RegExp("^30[0-5]")), null != number.match(re))) return "Diners - Carte Blanche";
        if (((re = new RegExp("^(30[6-9]|36|38)")), null != number.match(re))) return "Diners";
        if (((re = new RegExp("^35(2[89]|[3-8][0-9])")), null != number.match(re))) return "JCB";
        if (((re = new RegExp("^3[47]")), null != number.match(re))) return "AMEX";
        if (((re = new RegExp("^(4026|417500|4508|4844|491(3|7))")), null != number.match(re))) return "Visa Electron";
        var re = new RegExp("^4");
        return null != number.match(re)
            ? "Visa"
            : ((re = new RegExp("^5[1-5]")), null != number.match(re) ? "Mastercard" : ((re = new RegExp("^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)")), null != number.match(re) ? "Discover" : ""));
    }),
    (CardJs2.caretStartPosition = function (element) {
        return "number" == typeof element.selectionStart ? element.selectionStart : !1;
    }),
    (CardJs2.caretEndPosition = function (element) {
        return "number" == typeof element.selectionEnd ? element.selectionEnd : !1;
    }),
    (CardJs2.setCaretPosition = function (element, caretPos) {
        if (null != element)
            if (element.createTextRange) {
                var range = element.createTextRange();
                range.move("character", caretPos), range.select();
            } else element.selectionStart ? (element.focus(), element.setSelectionRange(caretPos, caretPos)) : element.focus();
    }),
    (CardJs2.normaliseCaretPosition = function (mask, caretPosition) {
        var numberPos = 0;
        if (0 > caretPosition || caretPosition > mask.length) return 0;
        for (var i = 0; i < mask.length; i++) {
            if (i == caretPosition) return numberPos;
            "X" == mask[i] && numberPos++;
        }
        return numberPos;
    }),
    (CardJs2.denormaliseCaretPosition = function (mask, caretPosition) {
        var numberPos = 0;
        if (0 > caretPosition || caretPosition > mask.length) return 0;
        for (var i = 0; i < mask.length; i++) {
            if (numberPos == caretPosition) return i;
            "X" == mask[i] && numberPos++;
        }
        return mask.length;
    }),
    (CardJs2.filterNumberOnlyKey = function (e) {
        var isNumber = CardJs2.keyIsNumber(e),
            isDeletion = CardJs2.keyIsDeletion(e),
            isArrow = CardJs2.keyIsArrow(e),
            isNavigation = CardJs2.keyIsNavigation(e),
            isKeyboardCommand = CardJs2.keyIsKeyboardCommand(e),
            isTab = CardJs2.keyIsTab(e);
        isNumber || isDeletion || isArrow || isNavigation || isKeyboardCommand || isTab || e.preventDefault();
    }),
    (CardJs2.digitFromKeyCode = function (keyCode) {
        return keyCode >= CardJs2.KEYS[0] && keyCode <= CardJs2.KEYS[9] ? keyCode - CardJs2.KEYS[0] : keyCode >= CardJs2.KEYS.NUMPAD_0 && keyCode <= CardJs2.KEYS.NUMPAD_9 ? keyCode - CardJs2.KEYS.NUMPAD_0 : null;
    }),
    (CardJs2.handleMaskedNumberInputKey = function (e, mask) {
        CardJs2.filterNumberOnlyKey(e);
        var keyCode = e.which || e.keyCode,
            element = e.target,
            caretStart = CardJs2.caretStartPosition(element),
            caretEnd = CardJs2.caretEndPosition(element),
            normalisedStartCaretPosition = CardJs2.normaliseCaretPosition(mask, caretStart),
            normalisedEndCaretPosition = CardJs2.normaliseCaretPosition(mask, caretEnd),
            newCaretPosition = caretStart,
            isNumber = CardJs2.keyIsNumber(e),
            isDelete = CardJs2.keyIsDelete(e),
            isBackspace = CardJs2.keyIsBackspace(e);
        if (isNumber || isDelete || isBackspace) {
            e.preventDefault();

            var rawText = $(element).val(),
                numbersOnly = CardJs2.numbersOnlyString(rawText),
                digit = CardJs2.digitFromKeyCode(keyCode),
                rangeHighlighted = normalisedEndCaretPosition > normalisedStartCaretPosition;

            rangeHighlighted && (numbersOnly = numbersOnly.slice(0, normalisedStartCaretPosition) + numbersOnly.slice(normalisedEndCaretPosition)),
                caretStart != mask.length &&
                (isNumber &&
                    rawText.length <= mask.length &&
                    ((numbersOnly = numbersOnly.slice(0, normalisedStartCaretPosition) + digit + numbersOnly.slice(normalisedStartCaretPosition)),
                        (newCaretPosition = Math.max(CardJs2.denormaliseCaretPosition(mask, normalisedStartCaretPosition + 1), CardJs2.denormaliseCaretPosition(mask, normalisedStartCaretPosition + 2) - 1))),
                    isDelete && (numbersOnly = numbersOnly.slice(0, normalisedStartCaretPosition) + numbersOnly.slice(normalisedStartCaretPosition + 1))),
                0 != caretStart &&
                isBackspace &&
                !rangeHighlighted &&
                ((numbersOnly = numbersOnly.slice(0, normalisedStartCaretPosition - 1) + numbersOnly.slice(normalisedStartCaretPosition)), (newCaretPosition = CardJs2.denormaliseCaretPosition(mask, normalisedStartCaretPosition - 1))),
                $(element).val(CardJs2.applyFormatMask(numbersOnly, mask)),
                CardJs2.setCaretPosition(element, newCaretPosition);
        }
    }),
    (CardJs2.handleCreditCardNumberKey = function (e, cardMask) {
        CardJs2.handleMaskedNumberInputKey(e, cardMask);
    }),
    (CardJs2.handleCreditCardNumberChange = function (e) { }),
    (CardJs2.prototype.getCardNumber = function () {
        return this.cardNumberInput.val();
    }),
    (CardJs2.prototype.getCardType = function () {
        return CardJs2.cardTypeFromNumber(this.getCardNumber());
    }),
    (CardJs2.prototype.getName = function () {
        return this.nameInput.val();
    }),
    (CardJs2.prototype.setIconColour = function (colour) {
        this.elem.find(".icon .svg").css({ fill: colour });
    }),
    (CardJs2.prototype.setIconColour = function (colour) {
        this.elem.find(".icon .svg").css({ fill: colour });
    }),
    (CardJs2.prototype.refreshCreditCardTypeIcon = function () {
        this.setCardTypeIconFromNumber(CardJs2.numbersOnlyString(this.cardNumberInput.val()));
    }),
    (CardJs2.prototype.refreshCreditCardNumberFormat = function () {
        var numbersOnly = CardJs2.numbersOnlyString($(this.cardNumberInput).val()),
            formattedNumber = CardJs2.applyFormatMask(numbersOnly, this.creditCardNumberMask);
        $(this.cardNumberInput).val(formattedNumber);
    }),
    (CardJs2.prototype.setCardTypeIconFromNumber = function (number) {
        switch (CardJs2.cardTypeFromNumber(number)) {
            case "Visa Electron":
            case "Visa":
                this.setCardTypeAsVisa();
                break;
            case "Mastercard":
                this.setCardTypeAsMasterCard();
                break;
            case "AMEX":
                this.setCardTypeAsAmericanExpress();
                break;
            case "Discover":
                this.setCardTypeAsDiscover();
                break;
            case "Diners - Carte Blanche":
            case "Diners":
                this.setCardTypeAsDiners();
                break;
            case "JCB":
                this.setCardTypeAsJcb();
                break;
            default:
                this.clearCardType();
        }
    }),
    (CardJs2.prototype.setCardMask = function (cardMask) {
        (this.creditCardNumberMask = cardMask), this.cardNumberInput.attr("maxlength", cardMask.length);
    }),
    (CardJs2.prototype.clearCardTypeIcon = function () {
        CardJs2.logo_franchise.hidden = false;

        let logo = document.getElementById('franchise_logo');
        let input = document.getElementById('the-card-number2-element');
        if (input.value < 1) {
            logo.className = 'card-type-icon';
        }

        this.elem.find(".card-number2-wrapper .card-type-icon").removeClass("show");
    }),
    (CardJs2.prototype.setCardTypeIconAsVisa = function () {
        CardJs2.logo_franchise.hidden = true;
        this.elem.find(".card-number2-wrapper .card-type-icon").attr("class", "card-type-icon show visa");
    }),
    (CardJs2.prototype.setCardTypeIconAsMasterCard = function () {
        CardJs2.logo_franchise.hidden = true;
        this.elem.find(".card-number2-wrapper .card-type-icon").attr("class", "card-type-icon show master-card");
    }),
    (CardJs2.prototype.setCardTypeIconAsAmericanExpress = function () {
        CardJs2.logo_franchise.hidden = true;
        this.elem.find(".card-number2-wrapper .card-type-icon").attr("class", "card-type-icon show american-express");
    }),
    (CardJs2.prototype.setCardTypeIconAsDiscover = function () {
        CardJs2.logo_franchise.hidden = true;
        this.elem.find(".card-number2-wrapper .card-type-icon").attr("class", "card-type-icon show discover");
    }),
    (CardJs2.prototype.setCardTypeIconAsDiners = function () {
        CardJs2.logo_franchise.hidden = true;
        this.elem.find(".card-number2-wrapper .card-type-icon").attr("class", "card-type-icon show diners");
    }),
    (CardJs2.prototype.setCardTypeIconAsJcb = function () {
        CardJs2.logo_franchise.hidden = true;
        this.elem.find(".card-number2-wrapper .card-type-icon").attr("class", "card-type-icon show jcb");
    }),
    (CardJs2.prototype.clearCardType = function () {
        this.clearCardTypeIcon(), this.setCardMask(CardJs2.CREDIT_CARD_NUMBER_DEFAULT_MASK);
    }),
    (CardJs2.prototype.setCardTypeAsVisa = function () {
        this.setCardTypeIconAsVisa(), this.setCardMask(CardJs2.CREDIT_CARD_NUMBER_VISA_MASK);
    }),
    (CardJs2.prototype.setCardTypeAsMasterCard = function () {
        this.setCardTypeIconAsMasterCard(), this.setCardMask(CardJs2.CREDIT_CARD_NUMBER_MASTERCARD_MASK);
    }),
    (CardJs2.prototype.setCardTypeAsAmericanExpress = function () {
        this.setCardTypeIconAsAmericanExpress(), this.setCardMask(CardJs2.CREDIT_CARD_NUMBER_AMEX_MASK);
    }),
    (CardJs2.prototype.setCardTypeAsDiscover = function () {
        this.setCardTypeIconAsDiscover(), this.setCardMask(CardJs2.CREDIT_CARD_NUMBER_DISCOVER_MASK);
    }),
    (CardJs2.prototype.setCardTypeAsDiners = function () {
        this.setCardTypeIconAsDiners(), this.setCardMask(CardJs2.CREDIT_CARD_NUMBER_DINERS_MASK);
    }),
    (CardJs2.prototype.setCardTypeAsJcb = function () {
        this.setCardTypeIconAsJcb(), this.setCardMask(CardJs2.CREDIT_CARD_NUMBER_JCB_MASK);
    }),
    (CardJs2.prototype.initCardNumberInput = function () {
        (this.cardNumberInput = CardJs2.detachOrCreateElement(this.elem, ".card-number2", "<input class='card-number2' />")),
            CardJs2.elementHasAttribute(this.cardNumberInput, "name") || this.cardNumberInput.attr("name", "card-number2"),
            CardJs2.elementHasAttribute(this.cardNumberInput, "placeholder") || this.cardNumberInput.attr("placeholder", CardJs2.CREDIT_CARD_NUMBER_PLACEHOLDER),
            this.cardNumberInput.attr("type", "tel"),
            this.cardNumberInput.attr("maxlength", this.creditCardNumberMask.length),
            this.cardNumberInput.attr("x-autocompletetype", "cc-number"),
            this.cardNumberInput.attr("autocompletetype", "cc-number"),
            this.cardNumberInput.attr("autocorrect", "off"),
            this.cardNumberInput.attr("spellcheck", "off"),
            this.cardNumberInput.attr("autocapitalize", "off");
        var $this = this;
        this.cardNumberInput.keydown(function (e) {
            CardJs2.handleCreditCardNumberKey(e, $this.creditCardNumberMask);
        }),
            this.cardNumberInput.keyup(function () {
                $this.refreshCreditCardTypeIcon();
            }),
            this.cardNumberInput.on("paste", function () {
                setTimeout(function () {
                    $this.refreshCreditCardNumberFormat(), $this.refreshCreditCardTypeIcon();
                }, 1);
            });
    }),
    (CardJs2.prototype.initNameInput = function () {
        (this.captureName = null != this.elem.find(".name")[0]),
            (this.nameInput = CardJs2.detachOrCreateElement(this.elem, ".name", "<input class='name' />")),
            CardJs2.elementHasAttribute(this.nameInput, "name") || this.nameInput.attr("name", "card-number2"),
            CardJs2.elementHasAttribute(this.nameInput, "placeholder") || this.nameInput.attr("placeholder", CardJs2.NAME_PLACEHOLDER);
    }),
    (CardJs2.prototype.setupCardNumberInput = function () {
        this.stripe && this.cardNumberInput.attr("data-stripe", "number"), this.elem.append("<div class='card-number2-wrapper'></div>");
        var wrapper = this.elem.find(".card-number2-wrapper");
        wrapper.append(this.cardNumberInput), wrapper.append("<div class='card-type-icon'  id='franchise_logo'></div>"), wrapper.append("<div class='icon'></div>"), wrapper.find(".icon");
    }),
    (CardJs2.elementHasAttribute = function (element, attributeName) {
        var attr = $(element).attr(attributeName);
        return "undefined" != typeof attr && attr !== !1;
    }),
    (CardJs2.detachOrCreateElement = function (parentElement, selector, html) {
        var element = parentElement.find(selector);
        return element[0] ? element.detach() : (element = $(html)), element;
    });