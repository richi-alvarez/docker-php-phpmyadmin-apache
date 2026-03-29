jQuery( function( $ ) {
    $("body").on("contextmenu",function(e){
        return false;
    });
    var myVar = setTimeout(load, 2000);
    const openModalButtons = document.querySelectorAll('[data-modal-target]')
    const closeModalButtons = document.querySelectorAll('[data-close-button]')
    const esModalButtons = document.querySelectorAll('[data-es-button]')
    const enModalButtons = document.querySelectorAll('[data-en-button]')
    var info_lenguage = document.getElementById("info_lenguage")
    const overlay = document.getElementById('overlay')
    const loadoverlay_ = document.getElementById('loadoverlay')
    const webCheckoutContent = document.getElementById('web-checkout-content')
    const movil = document.getElementById('movil');
    const movil_header = document.getElementById('movil_header');
    const cardjsmincss = document.getElementById('cardjsmincss');
    const style_min = document.getElementById('style_min');
    loadoverlay_.style.display='none'
    if(webCheckoutContent) webCheckoutContent.style.display='block'
    const mainContainer = document.getElementById('movil_mainContainer')
    const movil_modal = document.getElementById('movil_modal')
    const movil_footer = document.getElementById('movil_footer')
    const mdlInactivityTime = document.getElementById('mdlInactivityTime')
    const cancelT_modal = document.getElementById('cancelT_modal')
    const mdlTimeExpired = document.getElementById('mdlTimeExpired')
    mdlInactivityTime.style.display='none'
    cancelT_modal.style.display='none'
    mdlTimeExpired.style.display='none'
    var contador = 0;
    var loading;
    function alertar(){
        try {
            var string = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse('traysads'), 'secrasdasdaset').toString();
        } catch (error) {
            console.log(error);
            location.reload();
        }
    }
    const INACTIVITY_TIME = 6e4
        , TIMER_EXTEND_SESSION = 45;
    var form = document.getElementById('form-action');
    let interval, counter = TIMER_EXTEND_SESSION, urlRedirect = form.action+"&canceled=1", counterDos = 0;
    const idleTimeouts = ()=>{
        let e;
        function t() {
            clearTimeout(e),
                e = setTimeout(inactivityTimes, INACTIVITY_TIME)
            mdlTimeExpired.style.display='none';
            mdlInactivityTime.style.display='none';
            clearInterval(interval)
            counter = TIMER_EXTEND_SESSION
        }
        null == $("#trx-finish-status").val() && (window.onload = t,
            window.ontouchstart = t,
            window.onclick = t,
            window.onkeypress = t,
            window.addEventListener("scroll", t, !0))
    }, inactivityTimes = ()=>{
        mdlTimeExpired.style.display='none';
        mdlInactivityTime.style.display='flex',
            $("#counterInactivity").text(counter),
            showMdl("mdlInactivityTime"),
            interval = setInterval(counterInactivityTime, 1e3)
    };
    function counterInactivityTime() {
        0 ===counter && (resetInterval(),
            closeTimeExpired()),
            counter--,
            $("#counterInactivity").text(counter)
    }
    function resetInterval() {
        mdlTimeExpired.style.display='flex',
            mdlInactivityTime.style.display='none',
            clearInterval(interval),
            hideMdl("mdlInactivityTime"),
            showMdl("mdlTimeExpired"),
            counter = TIMER_EXTEND_SESSION,
            $("#counterInactivity").text(counter)
    }

    closeTimeExpired = ()=>{
        let e = [];
    }
        , showMdl = e=>{
        let t = [`#${e}`, `#${e}Body`];
        addRemoveClass(t, "dn", !1),
            addRemoveClass(t, "op")
    }
        , hideMdl = e=>{
        let t = [`#${e}`, `#${e}Body`];
        addRemoveClass(t, "op", !1),
            addRemoveClass(t, "dn")
    }  , addRemoveClass = (e,t,c=!0)=>{
        c ? e.forEach(e=>{
                $(e).addClass(t)
            }
        ) : e.forEach(e=>{
                $(e).removeClass(t)
            }
        )
    };
    $("#btnMdlTimeExpired").click(()=>{
        window.location = urlRedirect;
    });
    $(document).ready(function(){

        const epayco_title = document.getElementById('epayco_title')
        const button_epayco = document.getElementById('button_epayco')
        // Size of browser viewport.
        let first_widtht = $(window).width();
        if(first_widtht>425){
            // In desktop view, mainContainer may not exist (mobile-only). Guard it.
            if (mainContainer) {
                mainContainer.className = "";
            }
        }else{
            if (epayco_title) epayco_title.hidden = true;
            if (button_epayco) button_epayco.hidden = true;
            let script = document.createElement('script');
         
            script.src = scriptSrc;
            script.async = true;
            movil_header.appendChild(script);
            let link = document.createElement('link');
            let linkValue =  style_min.innerText.replace(/ /g, "");
            link.rel = "stylesheet";
            link.type = "text/css";
            link.href = linkValue;
            cardjsmincss.appendChild(link);
            let modal = document.getElementById('centered');
            modal.hidden = true;
            overlay.hidden = true;
            cargarMovil()
        }

        alertar()
        // Eliminado: integración con restcountries (fetch de países y banderas)
        idleTimeouts()

        var url = "https://restcountries.com/v3.1/alpha/"+$("#result")[0].innerText;
        divFoo = document.getElementById('foo');
        divSample = document.getElementById('countryName');
        divResult = document.getElementById('result');
        divFlag = document.getElementById('flag');
        $.getJSON(url, function(result){
            $.each(result, function(i, field){
                divSample.innerText = field.name.common;
                divSample.id = field.altSpellings[0];
                divFlag.innerText = field.flag;
            });
        });

        $.getJSON("https://restcountries.com/v3.1/independent?status=true", function(result){
            $.each(result, function(i, field){
                newlink = document.createElement('a');
                li = document.createElement('li');
                img = document.createElement('img');
                img.style.width = "23px";
                img.style.float = "left";
                img.style.marginTop = "8px";
                img.style.marginRight = "10px";
                img.src = field.flags.png;
                newlink.text = field.name.common;
                newlink.href = '#';
                newlink.className = field.flag;
                newlink.id = field.altSpellings[0];
                divFoo.appendChild(li).appendChild(newlink).appendChild(img);
            });
        });

        const monthInput = document.getElementById('month-value');
        if (monthInput) {
            // mejor soporte en móviles
            monthInput.setAttribute('inputmode', 'numeric');
            monthInput.setAttribute('pattern', '[0-9]*');
            // input event: elimina no dígitos y trunca a 2
            monthInput.addEventListener('input', function () {
                const cleaned = this.value.replace(/\D+/g, '').slice(0, 2);
                if (this.value !== cleaned) this.value = cleaned;
            });
            // evitar pegar texto no numérico
            monthInput.addEventListener('paste', function (e) {
                e.preventDefault();
                const paste = (e.clipboardData || window.clipboardData).getData('text');
                const cleaned = paste.replace(/\D+/g, '').slice(0, 2);
                document.execCommand('insertText', false, cleaned);
            });
            // bloquear teclas no numéricas (permite control/navigation keys)
            monthInput.addEventListener('keydown', function (e) {
                const allowed = ['Backspace','Tab','ArrowLeft','ArrowRight','Delete'];
                if (allowed.indexOf(e.key) !== -1) return;
                // si es carácter y no es dígito, bloquear
                if (e.key.length === 1 && /\D/.test(e.key)) e.preventDefault();
                // evitar superar 2 dígitos cuando no hay selección
                if (this.value.length >= 2 && this.selectionStart === this.selectionEnd && e.key.length === 1) {
                    e.preventDefault();
                }
            });
        }

        const yearInput = document.getElementById('year-value');
        if (yearInput) {
            // mejor soporte en móviles
            yearInput.setAttribute('inputmode', 'numeric');
            yearInput.setAttribute('pattern', '[0-9]*');
            // input event: elimina no dígitos y trunca a 4
            yearInput.addEventListener('input', function () {
                const cleaned = this.value.replace(/\D+/g, '').slice(0, 4);
                if (this.value !== cleaned) this.value = cleaned;
            });
            // evitar pegar texto no numérico
            yearInput.addEventListener('paste', function (e) {
                e.preventDefault();
                const paste = (e.clipboardData || window.clipboardData).getData('text');
                const cleaned = paste.replace(/\D+/g, '').slice(0, 4);
                document.execCommand('insertText', false, cleaned);
            });
            // bloquear teclas no numéricas (permite control/navigation keys)
            yearInput.addEventListener('keydown', function (e) {
                const allowed = ['Backspace','Tab','ArrowLeft','ArrowRight','Delete'];
                if (allowed.indexOf(e.key) !== -1) return;
                // si es carácter y no es dígito, bloquear
                if (e.key.length === 1 && /\D/.test(e.key)) e.preventDefault();
                // evitar superar 4 dígitos cuando no hay selección
                if (this.value.length >= 4 && this.selectionStart === this.selectionEnd && e.key.length === 1) {
                    e.preventDefault();
                }
            });
        }


    });

    function cargarMovil(){
        setTimeout(function(){
            mdlInactivityTime.style.display='flex'
            cancelT_modal.style.display='flex'
            mdlTimeExpired.style.display='flex'
            // mainContainer puede no existir en desktop; validar
            if (mainContainer) {
                mainContainer.className = "mainContainer";
                mainContainer.style.position = "fixed";
                mainContainer.style.top = "-64px"; // corregido, sin ; en el valor
                mainContainer.style.left = "0px";
                mainContainer.style.height ="100%";
                mainContainer.style.zIndex= "999999";
            }
            movil_modal.hidden = false;
            movil_footer.hidden = false;
        }, 3000);
    }

    // Eliminado: handlers del dropdown asociados a restcountries
    $(".dropdown a").click(function() {
        $(".dropdown dd ul").toggle();
    });

    $(".dropdown dd ul").click(function(e) {
        var $clicked = $(e.target);
        var texts = $clicked[0].innerText;
        var id = $clicked[0].id;
        var flag = $clicked[0].className;
        divSample.innerText = texts;
        divSample.id = id;
        divFlag.innerText = flag;
        $(".dropdown dd ul").toggle();
    });

    if( $("#lang_epayco").text() == 'en')
    {
        document.getElementById('esButton').classList.remove('bgcolor')
        document.getElementById('esButton').classList.remove('active')
        $("#info_es").hide();
        $("#pagar_es").hide();
        $("#pagar_logo_es").hide();
        $("#info_en").show();
        $("#pagar_en").show();
        $("#pagar_logo_en").show();

        document.getElementById('enButton').classList.add('bgcolor')
        document.getElementById('enButton').classList.add('active')
    }else{
        document.getElementById('enButton').classList.remove('bgcolor')
        document.getElementById('enButton').classList.remove('active')
        $("#info_en").hide();
        $("#pagar_en").hide();
        $("#pagar_logo_en").hide();
        $("#info_es").show();
        $("#pagar_es").show();
        $("#pagar_logo_es").show();
        document.getElementById('esButton').classList.add('bgcolor')
        document.getElementById('esButton').classList.add('active')
    }

    function load() {
        const modal = document.getElementById('centered')
        openModal(modal)
    }

    openModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = document.querySelector(button.dataset.modalTarget)
            openModal(modal)
        })
    })

    overlay.addEventListener('click', (button) =>{
        const modals = button.closest('.centered.active')
        modals.forEach(modal =>{
            closeModal(modal)
        })
    })

    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.centered')
            closeModal(modal)
        })
    })

    esModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            document.getElementById('enButton').classList.remove('bgcolor')
            document.getElementById('enButton').classList.remove('active')
            $("#info_en").hide();
            $("#pagar_en").hide();
            $("#pagar_logo_en").hide();
            $("#info_es").show();
            $("#pagar_es").show();
            $("#pagar_logo_es").show();
            document.getElementById('esButton').classList.add('bgcolor')
            document.getElementById('esButton').classList.add('active')
        })
    })

    enModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            document.getElementById('esButton').classList.remove('bgcolor')
            document.getElementById('esButton').classList.remove('active')
            $("#info_es").hide();
            $("#pagar_es").hide();
            $("#pagar_logo_es").hide();
            $("#info_en").show();
            $("#pagar_en").show();
            $("#pagar_logo_en").show();
            document.getElementById('enButton').classList.add('bgcolor')
            document.getElementById('enButton').classList.add('active')
        })
    })

    function openModal(modal) {
        if(modal == null) return
        modal.classList.add('active')
        overlay.classList.add('active')
    }

    function closeModal(modal) {
        if(modal == null) return
        modal.classList.remove('active')
        overlay.classList.remove('active')
    }
    async function getPosts(e) {
        return await  new Promise(function(resolve, reject) {
            var r = ePayco._utils.parseForm(e);
            let data = btoa(JSON.stringify(r.card));
            resolve(data)   
            /*ePayco.token.create(e, function(error, token) {
                loading=false;
                if(!error) {
                    if(error != undefined){
                        enviarData(token)
                    }else{
                        if(token){
                            enviarData(token)
                        }else{
                            reject("No pudimos procesar la transacción, por favor contacte con soporte.")
                            }
                        }
                } else {
                    if(!error || error !== undefined) {
                        resolve(token)
                    } else {
                        try {
                            if(error != undefined){
                                if(!error.status){
                                    let message = error.data.description;
                                    reject(message)
                                }else{
                                    console.error(error)
                                }
                            }else{
                                reject("No pudimos procesar la transacción, por favor contacte con soporte.")
                            }
                        } catch(e) {
                            reject('No se pudo realizar el pago, por favor reintente nuevamente')
                        } 
                    }
                }
            });*/
        });
    }
    $('#send-form').click(function(){
        $('#token-credit').submit();
    });
    const $checkout_movil_fomr = $( '#form-action' );
    $checkout_movil_fomr.on('submit', function (event) {
        event.preventDefault();
    });
    const $checkout_form = $( '#token-credit' );
    $checkout_form.on('submit', function (event) {
        event.preventDefault();
        var key = $("#p_c").text();
        var key_p = $("#p_p").text();
        var lang = $("#lang_epayco").text();
        ePayco.setPublicKey(key);
        ePayco.setLanguage(lang);
        var $form = $(this);
        // Name rule aligned to: mínimo 2 letras (cuenta letras, incluye acentos y ñ/ü)
        var nameLetters = (document.getElementById('the-card-name-element').value.match(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g) || []).length;
        var number = document.getElementById('the-card-number-element').value.replace(/[^0-9]/g, "").length;
        var month = document.getElementById('month-value').value.replace(/[^0-9]/g, "").length;
        var year = document.getElementById('year-value').value.replace(/[^0-9]/g, "").length;
        var cvc = document.getElementById('card_cvc').value.replace(/[ -]/g, "").length;
        $("#web-checkout-content").removeClass("animated shake");
        if( number <= 14 || nameLetters < 2 || month < 1 || year < 2 || cvc < 3 ){
            $("#web-checkout-content").addClass("animated shake");
            if( number <= 14){
                document.getElementById('the-card-number-element').classList.add('inputerror')
            }
            if( nameLetters < 2){
                document.getElementById('the-card-name-element').classList.add('inputerror')
            }
            if( month < 1 ){
                var expEl = document.getElementById('expInput');
                if (expEl) expEl.classList.add('inputerror');
            }
            if( year < 2 ){
                var expEl2 = document.getElementById('expInput');
                if (expEl2) expEl2.classList.add('inputerror');
            }
            if( cvc < 3 ){
                document.getElementById('cvc_').classList.add('inputerror')
            }
        }else{
            if(!loading){
                loadoverlay_.style.display='block';
                if(webCheckoutContent) webCheckoutContent.style.display='none';
                loading = true;
                getPosts($form).then(r =>{
                    contador=0;
                    $checkout_form.find('input[name=my-custom-form-field__card-number]').remove();
                    $checkout_form.find('input[name=cvc]').remove();
                    $checkout_form.find('input[name=year]').remove();
                    $checkout_form.find('input[name=month]').remove();
                    $checkout_form.find('input[name=card_email]').remove();
                    $checkout_form.find('input[name=card_number]').remove();
                    var form = document.getElementById('token-credit');
                    var hiddenInput = document.createElement('input');
                    hiddenInput.setAttribute('type', 'hidden');
                    hiddenInput.setAttribute('name', 'epaycoToken');
                    hiddenInput.setAttribute('value', r);
                    form.appendChild(hiddenInput);
                    form.submit();
                }).catch((e) => {
                    console.log('Algo saliò mal!');
                    loadoverlay_.style.display='none';
                    if(webCheckoutContent) webCheckoutContent.style.display='block';
                    alert(e)
                });
            }
        }
    });

    async function enviarData(r){
        setTimeout(function(){
            $checkout_form.find('input[name=my-custom-form-field__card-number]').remove();
            $checkout_form.find('input[name=cvc]').remove();
            $checkout_form.find('input[name=year]').remove();
            $checkout_form.find('input[name=month]').remove();
            $checkout_form.find('input[name=card_email]').remove();
            $checkout_form.find('input[name=card_number]').remove();
            var form = document.getElementById('token-credit');
            var hiddenInput = document.createElement('input');
            hiddenInput.setAttribute('type', 'hidden');
            hiddenInput.setAttribute('name', 'epaycoToken');
            hiddenInput.setAttribute('value', r);
            form.appendChild(hiddenInput);
            form.submit();
        }, 3000);
    }

});
