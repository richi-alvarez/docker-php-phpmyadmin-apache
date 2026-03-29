//Diseño desktop 
document.addEventListener('DOMContentLoaded', function () {
  const cardInput = document.getElementById('the-card-number-element');
  const cardLogo = document.getElementById('logo_franchise_2');

  if (cardInput) {
    cardInput.addEventListener('input', function () {
      const cardNumber = this.value.replace(/\s+/g, ''); // Eliminar espacios

      // Formatear el número de tarjeta para mostrar un espacio cada 4 dígitos
      cardInput.value = cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ');

      // Detectar el tipo de tarjeta y actualizar el ícono
      let isCardDetected = false; // Variable para saber si hay una tarjeta detectada
      if (/^4[0-9]{6,}$/.test(cardNumber)) {
        cardLogo.src = 'https://multimedia-epayco-preprod.s3.us-east-1.amazonaws.com/plugins-sdks/visa.svg'; // Ruta de la imagen de Visa
        isCardDetected = true;
      } else if (/^5[1-5][0-9]{5,}$/.test(cardNumber)) {
        cardLogo.src = 'https://multimedia-epayco-preprod.s3.us-east-1.amazonaws.com/plugins-sdks/mc.svg'; // Ruta de la imagen de Mastercard
        isCardDetected = true;
      } else if (/^3[47][0-9]{3,}$/.test(cardNumber)) {
        cardLogo.src = 'https://multimedia-epayco-preprod.s3.us-east-1.amazonaws.com/plugins-sdks/amx.svg'; // Ruta de la imagen de Amex
        isCardDetected = true;
      } else if (/^6(?:011|5[0-9]{2})[0-9]{3,}$/.test(cardNumber)) {
        cardLogo.src = 'https://msecure.epayco.co/img/credit-cards/discover.png'; // Ruta de la imagen de Discover
        isCardDetected = true;
      } else {
        cardLogo.src = ''; // Ruta de la imagen deshabilitada
      }

      // Mostrar el logo si se detectó la tarjeta
      cardLogo.style.display = isCardDetected ? 'block' : 'none';

      // Agregar o quitar la clase para ajustar el padding
      if (isCardDetected) {
        cardInput.classList.add('with-logo'); // Agrega padding-left extra
      } else {
        cardInput.classList.remove('with-logo'); // Restablece el padding-left
      }
    });
  }
});


// miniCard.js: Lógica para la tarjeta mini

// Utilidad para formatear número de tarjeta
function formatCreditCardNumber(value) {
  const digits = (value || '').replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

// DOM references
const cardFront = document.getElementById("cardFront");
const cardBack = document.getElementById("cardBack");
const cardNumberEl = document.getElementById('cardNumber');
const cardNameEl = document.getElementById('cardName');
const cardExpEl = document.getElementById('cardExp');
const cvvInput = document.getElementById("card_cvc");
const cvvBox = document.getElementById("cvvBox");
const logoFranquiciaDiv = document.getElementById('logoFranquicia');
const cardInput = document.getElementById('the-card-number-element');
const nameInput = document.getElementById('the-card-name-element');
const expInput = document.getElementById('expInput');

// Mostrar datos en la tarjeta
if (nameInput && cardNameEl) {
  nameInput.addEventListener('input', (e) => {
    cardNameEl.textContent = e.target.value.trim() || '';
  });
}

if (cardInput && cardNumberEl && logoFranquiciaDiv && cardFront && cardBack) {
  cardInput.addEventListener('input', function () {
    const cardNumber = this.value.replace(/\D/g, '').replace(/\s+/g, '');
    this.value = cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ');

    let logoSrc = '';
    let showLogo = false;
    let bgColor = '#0A0A0A'; // color neutro por defecto

    if (/^4[0-9]{6,}$/.test(cardNumber)) {
      // VISA SVG
      logoFranquiciaDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="37" height="10" style="position:relative; top:5px; left:-16px" viewBox="0 0 26 8" fill="none">
      <path d="M4.62539 0.954676C4.46618 0.390617 3.95843 0.0101935 3.26885 0.0020752H0.033321L0 0.138949C2.52393 0.705931 4.6424 2.45055 5.32967 4.09158L4.62539 0.954676Z" fill="white"/>
      <path d="M10.6251 -0.00012207L9.32055 7.39749H11.4058L12.7096 -0.00012207H10.6251ZM16.915 3.01325C16.1863 2.68535 15.7396 2.46404 15.7396 2.12867C15.7485 1.82375 16.1173 1.51135 16.941 1.51135C17.6185 1.49585 18.1164 1.64092 18.4942 1.78527L18.6834 1.86223L18.9669 0.314464C18.555 0.169389 17.902 0.00953842 17.0953 0.00953842C15.0361 0.00953842 13.5861 0.985121 13.5771 2.38042C13.5601 3.41007 14.6152 3.98145 15.4048 4.3242C16.2115 4.67581 16.4861 4.90377 16.4861 5.21617C16.4772 5.6958 15.8338 5.91711 15.2335 5.91711C14.4017 5.91711 13.9549 5.80312 13.2767 5.53587L13.0021 5.42189L12.7105 7.03038C13.2003 7.22879 14.1011 7.40341 15.0362 7.41234C17.2246 7.41234 18.6486 6.45154 18.6665 4.9645C18.6736 4.14876 18.1172 3.52398 16.915 3.01325ZM24.3128 0.0227715H22.6995C22.2023 0.0227715 21.8246 0.153071 21.6093 0.617928L18.5119 7.39749H20.7003L21.303 5.92969H23.7514L24.0641 7.40341H25.9942L24.3128 0.0227715ZM21.9099 4.44841C21.9522 4.45215 22.7499 2.05236 22.7499 2.05236L23.3851 4.44841C23.3851 4.44841 22.3218 4.44841 21.9099 4.44841ZM7.57815 -0.00012207L5.53514 5.02587L5.31258 4.0347C4.93483 2.89107 3.75051 1.64831 2.4288 1.03099L4.29959 7.3901H6.5059L9.78446 0.00068932H7.57815V-0.00012207Z" fill="white"/>
    </svg>`;
      showLogo = true;
      bgColor = '#262B77'; // Visa
    } else if (/^(5[1-5][0-9]{5,}|2[2-7][0-9]{4,})$/.test(cardNumber)) {
      // MASTERCARD SVG
      logoFranquiciaDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="35" height="25" style="position:relative; top:2px; left:-16px" viewBox="0 0 24 15" fill="none">
      <path d="M15.1996 1.95483H8.9668V13.1202H15.1996V1.95483Z" fill="#FF5F00"/>
      <path d="M9.36165 7.53698C9.36165 5.26839 10.4301 3.25625 12.0724 1.95427C10.8654 1.00738 9.34186 0.435303 7.67979 0.435303C3.74227 0.435303 0.556641 3.61133 0.556641 7.53698C0.556641 11.4626 3.74227 14.6387 7.67979 14.6387C9.34186 14.6387 10.8654 14.0666 12.0724 13.1197C10.4301 11.8374 9.36165 9.80557 9.36165 7.53698Z" fill="#EB001B"/>
      <path d="M23.6078 7.5368C23.6078 11.4624 20.4221 14.6385 16.4846 14.6385C14.8226 14.6385 13.299 14.0664 12.092 13.1195C13.7541 11.8175 14.8028 9.80539 14.8028 7.5368C14.8028 5.2682 13.7343 3.25606 12.092 1.95409C13.299 1.0072 14.8226 0.43512 16.4846 0.43512C20.4221 0.43512 23.6078 3.63087 23.6078 7.5368Z" fill="#F79E1B"/>
    </svg>`;
      showLogo = true;
      bgColor = '#0A0A0A'; // MasterCard
    } else if (/^3[47][0-9]{5,}$/.test(cardNumber)) {
      // AMEX SVG
      logoFranquiciaDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" style="position:relative; top:-4px; left:-16px" viewBox="0 0 33 33" fill="none">
      <path d="M2.96178 14.1103L2.33028 12.57L1.7011 14.1103M16.884 13.4975C16.757 13.5744 16.6067 13.5767 16.4273 13.5767H15.3053V12.7192H16.4424C16.6032 12.7192 16.771 12.7262 16.8805 12.7891C17.0005 12.845 17.0739 12.965 17.0739 13.1305C17.0739 13.2994 17.0029 13.4346 16.884 13.4975ZM24.885 14.1103L24.2465 12.57L23.6115 14.1103H24.885ZM9.96892 15.7777H9.02283L9.01934 12.7518L7.68059 15.7777H6.86966L5.52742 12.7495V15.7777H3.64921L3.29501 14.9155H1.37253L1.01367 15.7777H0.0104862L1.66382 11.9141H3.03519L4.60579 15.5714V11.9141H6.11232L7.32057 14.5345L8.43094 11.9141H9.96776L9.96892 15.7777ZM13.7416 15.7777H10.6575V11.9141H13.7416V12.718H11.5803V13.4148H13.6892V14.207H11.5803V14.9784H13.7416V15.7777ZM18.0911 12.9545C18.0911 13.5709 17.6798 13.889 17.441 13.9845C17.6425 14.0614 17.8161 14.1977 17.8977 14.3096C18.0282 14.5018 18.0503 14.6731 18.0503 15.018V15.7765H17.1194L17.1159 15.2895C17.1159 15.0564 17.138 14.7232 16.9702 14.5368C16.8351 14.4005 16.63 14.3713 16.2968 14.3713H15.3053V15.7765H14.3825V11.9141H16.5065C16.9784 11.9141 17.3256 11.9099 17.625 12.0993C17.9152 12.2718 18.0911 12.5234 18.0911 12.9545ZM19.5685 15.7777H18.6259V11.9141H19.5685V15.7777ZM30.4987 15.7777H29.1902L27.4402 12.8788V15.7777H25.5596L25.2008 14.9155H23.283L22.9346 15.7777H21.8545C21.4059 15.7777 20.8373 15.6786 20.5158 15.35C20.1907 15.0215 20.0229 14.5776 20.0229 13.875C20.0229 13.3017 20.1243 12.7786 20.5204 12.365C20.8187 12.0562 21.2859 11.9141 21.9221 11.9141H22.8157V12.7413H21.9407C21.604 12.7413 21.4141 12.7914 21.23 12.9697C21.0727 13.1328 20.9643 13.4392 20.9643 13.8447C20.9643 14.2583 21.0471 14.5566 21.2183 14.7523C21.3605 14.905 21.6191 14.9516 21.8615 14.9516H22.2763L23.5777 11.9141H24.9608L26.5244 15.5679V11.9141H27.9307L29.5537 14.6044V11.9141H30.4998V15.7777H30.4987ZM0 16.5362H1.5776L1.93296 15.6786H2.72875L3.08412 16.5362H6.18805V15.8802L6.46535 16.5385H8.07674L8.35404 15.8697V16.535H16.0684L16.0649 15.1263H16.2141C16.3189 15.1298 16.3492 15.1392 16.3492 15.3128V16.535H20.3387V16.2076C20.6602 16.38 21.1612 16.535 21.8195 16.535H23.4985L23.8574 15.6775H24.6532L25.005 16.535H28.2395V15.7194L28.7288 16.535H31.3213V11.1486H28.7556V11.7847L28.3968 11.1486H25.7647V11.7847L25.435 11.1486H21.8801C21.2847 11.1486 20.7616 11.2313 20.3398 11.4631V11.1486H17.8849V11.4631C17.6157 11.2243 17.2499 11.1486 16.8421 11.1486H7.87867L7.27745 12.5397L6.65993 11.1486H3.83564V11.7847L3.52571 11.1486H1.11853L0 13.7095V16.5362Z" fill="white"/>
      <path d="M32.8505 19.3862H31.1668C30.9991 19.3862 30.8872 19.392 30.7928 19.4561C30.695 19.519 30.6577 19.6111 30.6577 19.7346C30.6577 19.8802 30.7404 19.9792 30.8592 20.0224C30.9571 20.0561 31.0608 20.0666 31.2146 20.0666L31.7145 20.0806C32.219 20.0934 32.5569 20.1797 32.7619 20.3917C32.7992 20.4208 32.8213 20.4546 32.8481 20.4872M32.8505 21.9332C32.6268 22.2606 32.1887 22.4272 31.5979 22.4272H29.8153V21.5988H31.591C31.7669 21.5988 31.8904 21.5755 31.965 21.5032C32.029 21.4438 32.0745 21.3564 32.0745 21.2516C32.0745 21.1386 32.029 21.05 31.9615 20.9964C31.8951 20.937 31.7972 20.9102 31.6364 20.9102C30.7695 20.8811 29.6883 20.937 29.6883 19.7148C29.6883 19.1543 30.0436 18.5648 31.013 18.5648H32.8528V17.7958H31.1435C30.6274 17.7958 30.2534 17.9193 29.9877 18.1115V17.7958H27.4605C27.0562 17.7958 26.582 17.896 26.3571 18.1115V17.7958H21.8434V18.1115C21.4845 17.8529 20.8775 17.7958 20.5979 17.7958H17.6209V18.1115C17.3366 17.8366 16.7051 17.7958 16.3195 17.7958H12.9872L12.2252 18.6207L11.511 17.7958H6.53232V23.1869H11.4154L12.2007 22.3491L12.9406 23.1869L15.9513 23.1892V21.9204H16.2472C16.6469 21.9262 17.1176 21.9099 17.5336 21.7304V23.1857H20.0165V21.7806H20.1365C20.2891 21.7806 20.3043 21.7864 20.3043 21.9402V23.1857H27.8474C28.3262 23.1857 28.8272 23.0634 29.1045 22.8408V23.1857H31.4966C31.9941 23.1857 32.4811 23.1158 32.8505 22.9375V21.9332ZM29.1663 20.3894C29.3457 20.5758 29.4424 20.81 29.4424 21.2085C29.4424 22.0392 28.9228 22.4272 27.9918 22.4272H26.194V21.5988H27.9848C28.1596 21.5988 28.2843 21.5755 28.3624 21.5032C28.4253 21.4438 28.4719 21.3564 28.4719 21.2516C28.4719 21.1386 28.4229 21.05 28.3589 20.9964C28.2878 20.937 28.1911 20.9102 28.0303 20.9102C27.1669 20.8811 26.0857 20.937 26.0857 19.7148C26.0857 19.1543 26.4375 18.5648 27.4058 18.5648H29.2572V19.3874H27.5631C27.3953 19.3874 27.2858 19.3932 27.1926 19.4573C27.0912 19.5202 27.0539 19.6122 27.0539 19.7357C27.0539 19.8814 27.1401 19.9804 27.2555 20.0235C27.3533 20.0573 27.457 20.0678 27.6143 20.0678L28.1118 20.0818C28.614 20.0911 28.9577 20.1773 29.1663 20.3894ZM20.8356 20.1505C20.7121 20.2239 20.5594 20.2298 20.38 20.2298H19.258V19.3629H20.3951C20.5594 19.3629 20.7237 19.3664 20.8356 19.4328C20.9556 19.4957 21.0266 19.6146 21.0266 19.78C21.0266 19.9455 20.9544 20.0783 20.8356 20.1505ZM21.3925 20.6317C21.5976 20.7075 21.7665 20.8438 21.8446 20.9556C21.9751 21.1444 21.9937 21.3203 21.9972 21.6605V22.426H21.0698V21.9425C21.0698 21.7106 21.0919 21.3658 20.9206 21.1863C20.7855 21.0477 20.5804 21.0151 20.2437 21.0151H19.2568V22.4272H18.3293V18.5636H20.4615C20.9288 18.5636 21.269 18.5846 21.5731 18.7465C21.8644 18.9225 22.0473 19.1636 22.0473 19.6041C22.0473 20.2204 21.636 20.535 21.3925 20.6317ZM22.5588 18.5636H25.6406V19.3629H23.4781V20.0655H25.587V20.8543H23.4781V21.6233L25.6406 21.6268V22.4284H22.5588V18.5636ZM16.33 20.3463H15.1369V19.3629H16.3405C16.6737 19.3629 16.9055 19.4992 16.9055 19.8371C16.9055 20.1703 16.6842 20.3463 16.33 20.3463ZM14.2164 22.0753L12.7984 20.5012L14.2164 18.9772V22.0753ZM10.5555 21.6221H8.28585V20.8531H10.3132V20.0643H8.28585V19.3629H10.601L11.6112 20.4884L10.5555 21.6221ZM17.8959 19.8359C17.8959 20.909 17.0955 21.1304 16.288 21.1304H15.1357V22.4272H13.3414L12.2042 21.1479L11.0228 22.4272H7.36539V18.5636H11.0799L12.2159 19.8301L13.3903 18.5636H16.3405C17.0733 18.5636 17.8959 18.7663 17.8959 19.8359Z" fill="white"/>
    </svg>`;
      showLogo = true;
      bgColor = '#458CCF'; // Amex
    }

    // Cambia el color de fondo de la tarjeta (frente y dorso)
    if (!cardNumber) {
      cardFront.style.backgroundColor = '#0A0A0A';
      cardBack.style.backgroundColor = '#0A0A0A';
      logoFranquiciaDiv.innerHTML = '<img src="" alt="Logo de tarjeta" width="50px" height="50px">';
      logoFranquiciaDiv.style.display = 'none';
    } else {
      cardFront.style.backgroundColor = bgColor;
      cardBack.style.backgroundColor = bgColor;
      if (showLogo) {
        logoFranquiciaDiv.style.display = 'block';
      } else {
        logoFranquiciaDiv.innerHTML = '<img src="" alt="Logo de tarjeta" width="50px" height="50px">';
        logoFranquiciaDiv.style.display = 'none';
      }
    }
    cardNumberEl.textContent = this.value || 'XXXX XXXX XXXX XXXX';
  });
}

if (expInput && cardExpEl) {
  expInput.addEventListener('input', (e) => {
    // Permitir MM/AA o MM/YYYY (hasta 6 dígitos + '/').
    let v = e.target.value.replace(/\D/g, '').slice(0, 6);
    if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
    e.target.value = v;
    cardExpEl.textContent = v || 'MM/AA';
  });
}

// Voltear la tarjeta para el CVV
if (cvvInput && cardFront && cardBack) {
  cvvInput.addEventListener("focus", () => {
    cardFront.style.display = "none";
    cardBack.style.display = "flex";
  });
  cvvInput.addEventListener("blur", () => {
    cardBack.style.display = "none";
    cardFront.style.display = "flex";
  });
}

// Mostrar el CVV en la tarjeta
if (cvvInput && cvvBox) {
  cvvInput.addEventListener("input", e => {
    let v = e.target.value.replace(/\D/g, "").slice(0, 4);
    e.target.value = v;
    if (v.length === 0) {
      cvvBox.textContent = "***";
    } else if (v.length < 3) {
      cvvBox.textContent = v;
    } else {
      cvvBox.textContent = "*".repeat(v.length);
    }
  });
}


//Js Modales 
// JavaScript para manejar todos los modales
document.addEventListener('DOMContentLoaded', function () {
  // Modal 1 - Idioma
  const modal1 = document.getElementById("myModal");
  const btn1 = document.getElementById("openModal");

  // Modal 2 - Confirmar
  const modal2 = document.getElementById("myModal2");
  const btn2 = document.getElementById("openModal2");

  // Modal 3 - Éxito
  const modal3 = document.getElementById("myModal3");
  const btn3 = document.getElementById("openModal3");


  // Obtener todos los botones de cerrar
  const closeButtons = document.querySelectorAll(".close");

  // Abrir modales
  if (btn1) btn1.onclick = () => modal1.style.display = "block";
  if (btn2) btn2.onclick = () => modal2.style.display = "block";
  if (btn3) btn3.onclick = () => modal3.style.display = "block";

  // Cerrar modales con botones X
  closeButtons.forEach(closeBtn => {
    closeBtn.onclick = () => {
      closeBtn.closest('.modal').style.display = "none";
    };
  });

  // Cerrar modales al hacer clic fuera del contenido
  window.onclick = (event) => {
    if (event.target.classList.contains('modal')) {
      event.target.style.display = "none";
    }
  };

  // Botones específicos de los modales
  const confirmBtn2 = document.getElementById("confirmBtn2");
  const cancelBtn2 = document.getElementById("cancelBtn2");
  const closeBtn3 = document.getElementById("closeBtn3");
  // Prevent reference errors for optional modal 4 controls
  const closeBtn4 = document.getElementById("closeBtn4");
  const modal4 = document.getElementById("myModal4");


  if (confirmBtn2) confirmBtn2.onclick = () => {
    alert("Acción confirmada!");
    modal2.style.display = "none";
  };

  if (cancelBtn2) cancelBtn2.onclick = () => modal2.style.display = "none";
  if (closeBtn3) closeBtn3.onclick = () => modal3.style.display = "none";
  if (closeBtn4 && modal4) closeBtn4.onclick = () => modal4.style.display = "none";

  // Funcionalidad para cambiar idioma
  const languageText = document.getElementById("languageText");
  const enButton = document.getElementById("enButton");
  const esButton = document.getElementById("esButton");

  // Función para mostrar elementos en español
  function showSpanish() {
    document.body.classList.remove('lang-en');
    document.body.classList.add('lang-es');
  }

  // Función para mostrar elementos en inglés
  function showEnglish() {
    document.body.classList.remove('lang-es');
    document.body.classList.add('lang-en');
  } // Cambiar a inglés
  if (enButton && languageText) {
    enButton.onclick = () => {
      languageText.textContent = "EN";
      showEnglish();
      modal1.style.display = "none";
    };
    enButton.addEventListener('click', () => {
      languageText.textContent = "EN";
      showEnglish();
      modal1.style.display = "none";
    });
  }

  // Cambiar a español
  if (esButton && languageText) {
    esButton.onclick = () => {
      languageText.textContent = "ES";
      showSpanish();
      modal1.style.display = "none";
    };
    esButton.addEventListener('click', () => {
      languageText.textContent = "ES";
      showSpanish();
      modal1.style.display = "none";
    });
  }

  // Establecer idioma por defecto (español)
  showSpanish();
});

//Js mostrar y ocultar valor cvv 
document.addEventListener('DOMContentLoaded', function () {
  var eyeOpen = document.getElementById('cvv-eye-open');
  var eyeClosed = document.getElementById('cvv-eye-closed');
  var cvvInput = document.getElementById('card_cvc');
  var cvvBox = document.getElementById('cvvBox');

  if (eyeOpen && eyeClosed && cvvInput) {
    eyeOpen.addEventListener('click', function () {
      cvvInput.type = 'text';
      eyeOpen.style.display = 'none';
      eyeClosed.style.display = 'flex';
      // Mostrar el número real en el dorso
      if (cvvBox) cvvBox.textContent = cvvInput.value || '***';
    });
    eyeClosed.addEventListener('click', function () {
      cvvInput.type = 'password';
      eyeClosed.style.display = 'none';
      eyeOpen.style.display = 'flex';
      // Ocultar el número en el dorso
      if (cvvBox) cvvBox.textContent = cvvInput.value.length ? '*'.repeat(cvvInput.value.length) : '***';
    });
  }
});


// JS para formatear el input de expiración y repartir valores
jQuery(document).ready(function ($) {
  const $expInput = $('#expInput');
  const $month = $('#month-value');
  const $year = $('#year-value');

  $expInput.on('input', function () {
    let v = $expInput.val().replace(/[^0-9]/g, '');
    if (v.length > 6) v = v.slice(0, 6);
    // Formato MM/AA o MM/YYYY
    if (v.length >= 3) {
      v = v.slice(0, 2) + '/' + v.slice(2);
    }
    $expInput.val(v);
    // Extraer mes y año
    const parts = v.split('/');
    $month.val(parts[0] ? parts[0] : '');
    $year.val(parts[1] ? (parts[1].length === 2 ? '20' + parts[1] : parts[1]) : '');

    // Disparar eventos para que otros listeners (ej. habilitar botón Pagar) reaccionen
    $month.trigger('input');
    $year.trigger('input');

    // Si el campo está completo (MM/AA o MM/YYYY) y el mes es válido, enfocar automáticamente el CVV
    const monthStr = parts[0] || '';
    const yearStr = parts[1] || '';
    const monthNum = parseInt(monthStr, 10);
    const isMonthValid = monthStr.length === 2 && monthNum >= 1 && monthNum <= 12;
    const isYearComplete = yearStr.length === 2 || yearStr.length === 4;
    if (isMonthValid && isYearComplete) {
      const cvvEl = document.getElementById('card_cvc');
      // Solo mover el foco si el usuario está escribiendo en expInput actualmente
      if (cvvEl && document.activeElement === $expInput[0]) {
        cvvEl.focus();
      }
    }
  });

  // Al enviar el formulario, asegurar que los valores estén bien
  $('#token-credit').on('submit', function () {
      /*let v = $expInput.val();
      const parts = v.split('/');
      $month.val(parts[0] ? parts[0] : '');
      $year.val(parts[1] ? (parts[1].length === 2 ? '20' + parts[1] : parts[1]) : '');
    });*/
  });


// Script adicional para la tarjeta mini - asegurar funcionalidad
document.addEventListener('DOMContentLoaded', function () {
  // Referencias a elementos
  const cardFront = document.getElementById("cardFront");
  const cardBack = document.getElementById("cardBack");
  const cardNumberEl = document.getElementById('cardNumber');
  const cardNameEl = document.getElementById('cardName');
  const cardExpEl = document.getElementById('cardExp');
  const cvvInput = document.getElementById("card_cvc");
  const cvvBox = document.getElementById("cvvBox");
  const logoFranquiciaDiv = document.getElementById('logoFranquicia');
  const cardInput = document.getElementById('the-card-number-element');
  const nameInput = document.getElementById('the-card-name-element');
  const expInput = document.getElementById('expInput');

  // Event listener para el nombre
  if (nameInput && cardNameEl) {
    nameInput.addEventListener('input', function (e) {
      cardNameEl.textContent = e.target.value.trim() || '';
    });
  }

  // Event listener para el número de tarjeta
  if (cardInput && cardNumberEl && logoFranquiciaDiv && cardFront && cardBack) {
    cardInput.addEventListener('input', function () {
      const cardNumber = this.value.replace(/\D/g, '').replace(/\s+/g, '');
      this.value = cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ');

      let logoSrc = '';
      let showLogo = false;
      let bgColor = '#0A0A0A';

      if (/^4[0-9]{6,}$/.test(cardNumber)) {
        // VISA SVG
        logoFranquiciaDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="37" height="10" style="position:relative; top:5px; left:-16px" viewBox="0 0 26 8" fill="none">
                      <path d="M4.62539 0.954676C4.46618 0.390617 3.95843 0.0101935 3.26885 0.0020752H0.033321L0 0.138949C2.52393 0.705931 4.6424 2.45055 5.32967 4.09158L4.62539 0.954676Z" fill="white"/>
                      <path d="M10.6251 -0.00012207L9.32055 7.39749H11.4058L12.7096 -0.00012207H10.6251ZM16.915 3.01325C16.1863 2.68535 15.7396 2.46404 15.7396 2.12867C15.7485 1.82375 16.1173 1.51135 16.941 1.51135C17.6185 1.49585 18.1164 1.64092 18.4942 1.78527L18.6834 1.86223L18.9669 0.314464C18.555 0.169389 17.902 0.00953842 17.0953 0.00953842C15.0361 0.00953842 13.5861 0.985121 13.5771 2.38042C13.5601 3.41007 14.6152 3.98145 15.4048 4.3242C16.2115 4.67581 16.4861 4.90377 16.4861 5.21617C16.4772 5.6958 15.8338 5.91711 15.2335 5.91711C14.4017 5.91711 13.9549 5.80312 13.2767 5.53587L13.0021 5.42189L12.7105 7.03038C13.2003 7.22879 14.1011 7.40341 15.0362 7.41234C17.2246 7.41234 18.6486 6.45154 18.6665 4.9645C18.6736 4.14876 18.1172 3.52398 16.915 3.01325ZM24.3128 0.0227715H22.6995C22.2023 0.0227715 21.8246 0.153071 21.6093 0.617928L18.5119 7.39749H20.7003L21.303 5.92969H23.7514L24.0641 7.40341H25.9942L24.3128 0.0227715ZM21.9099 4.44841C21.9522 4.45215 22.7499 2.05236 22.7499 2.05236L23.3851 4.44841C23.3851 4.44841 22.3218 4.44841 21.9099 4.44841ZM7.57815 -0.00012207L5.53514 5.02587L5.31258 4.0347C4.93483 2.89107 3.75051 1.64831 2.4288 1.03099L4.29959 7.3901H6.5059L9.78446 0.00068932H7.57815V-0.00012207Z" fill="white"/>
                    </svg>`;
        showLogo = true;
        bgColor = '#262B77'; // Visa
      } else if (/^(5[1-5][0-9]{5,}|2[2-7][0-9]{4,})$/.test(cardNumber)) {
        // MASTERCARD SVG
        logoFranquiciaDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="35" height="25" style="position:relative; top:2px; left:-16px" viewBox="0 0 24 15" fill="none">
                      <path d="M15.1996 1.95483H8.9668V13.1202H15.1996V1.95483Z" fill="#FF5F00"/>
                      <path d="M9.36165 7.53698C9.36165 5.26839 10.4301 3.25625 12.0724 1.95427C10.8654 1.00738 9.34186 0.435303 7.67979 0.435303C3.74227 0.435303 0.556641 3.61133 0.556641 7.53698C0.556641 11.4626 3.74227 14.6387 7.67979 14.6387C9.34186 14.6387 10.8654 14.0666 12.0724 13.1197C10.4301 11.8374 9.36165 9.80557 9.36165 7.53698Z" fill="#EB001B"/>
                      <path d="M23.6078 7.5368C23.6078 11.4624 20.4221 14.6385 16.4846 14.6385C14.8226 14.6385 13.299 14.0664 12.092 13.1195C13.7541 11.8175 14.8028 9.80539 14.8028 7.5368C14.8028 5.2682 13.7343 3.25606 12.092 1.95409C13.299 1.0072 14.8226 0.43512 16.4846 0.43512C20.4221 0.43512 23.6078 3.63087 23.6078 7.5368Z" fill="#F79E1B"/>
                    </svg>`;
        showLogo = true;
        bgColor = '#0A0A0A'; // MasterCard
      } else if (/^3[47][0-9]{5,}$/.test(cardNumber)) {
        // AMEX SVG
        logoFranquiciaDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" style="position:relative; top:-4px; left:-16px" viewBox="0 0 33 33" fill="none">
                      <path d="M2.96178 14.1103L2.33028 12.57L1.7011 14.1103M16.884 13.4975C16.757 13.5744 16.6067 13.5767 16.4273 13.5767H15.3053V12.7192H16.4424C16.6032 12.7192 16.771 12.7262 16.8805 12.7891C17.0005 12.845 17.0739 12.965 17.0739 13.1305C17.0739 13.2994 17.0029 13.4346 16.884 13.4975ZM24.885 14.1103L24.2465 12.57L23.6115 14.1103H24.885ZM9.96892 15.7777H9.02283L9.01934 12.7518L7.68059 15.7777H6.86966L5.52742 12.7495V15.7777H3.64921L3.29501 14.9155H1.37253L1.01367 15.7777H0.0104862L1.66382 11.9141H3.03519L4.60579 15.5714V11.9141H6.11232L7.32057 14.5345L8.43094 11.9141H9.96776L9.96892 15.7777ZM13.7416 15.7777H10.6575V11.9141H13.7416V12.718H11.5803V13.4148H13.6892V14.207H11.5803V14.9784H13.7416V15.7777ZM18.0911 12.9545C18.0911 13.5709 17.6798 13.889 17.441 13.9845C17.6425 14.0614 17.8161 14.1977 17.8977 14.3096C18.0282 14.5018 18.0503 14.6731 18.0503 15.018V15.7765H17.1194L17.1159 15.2895C17.1159 15.0564 17.138 14.7232 16.9702 14.5368C16.8351 14.4005 16.63 14.3713 16.2968 14.3713H15.3053V15.7765H14.3825V11.9141H16.5065C16.9784 11.9141 17.3256 11.9099 17.625 12.0993C17.9152 12.2718 18.0911 12.5234 18.0911 12.9545ZM19.5685 15.7777H18.6259V11.9141H19.5685V15.7777ZM30.4987 15.7777H29.1902L27.4402 12.8788V15.7777H25.5596L25.2008 14.9155H23.283L22.9346 15.7777H21.8545C21.4059 15.7777 20.8373 15.6786 20.5158 15.35C20.1907 15.0215 20.0229 14.5776 20.0229 13.875C20.0229 13.3017 20.1243 12.7786 20.5204 12.365C20.8187 12.0562 21.2859 11.9141 21.9221 11.9141H22.8157V12.7413H21.9407C21.604 12.7413 21.4141 12.7914 21.23 12.9697C21.0727 13.1328 20.9643 13.4392 20.9643 13.8447C20.9643 14.2583 21.0471 14.5566 21.2183 14.7523C21.3605 14.905 21.6191 14.9516 21.8615 14.9516H22.2763L23.5777 11.9141H24.9608L26.5244 15.5679V11.9141H27.9307L29.5537 14.6044V11.9141H30.4998V15.7777H30.4987ZM0 16.5362H1.5776L1.93296 15.6786H2.72875L3.08412 16.5362H6.18805V15.8802L6.46535 16.5385H8.07674L8.35404 15.8697V16.535H16.0684L16.0649 15.1263H16.2141C16.3189 15.1298 16.3492 15.1392 16.3492 15.3128V16.535H20.3387V16.2076C20.6602 16.38 21.1612 16.535 21.8195 16.535H23.4985L23.8574 15.6775H24.6532L25.005 16.535H28.2395V15.7194L28.7288 16.535H31.3213V11.1486H28.7556V11.7847L28.3968 11.1486H25.7647V11.7847L25.435 11.1486H21.8801C21.2847 11.1486 20.7616 11.2313 20.3398 11.4631V11.1486H17.8849V11.4631C17.6157 11.2243 17.2499 11.1486 16.8421 11.1486H7.87867L7.27745 12.5397L6.65993 11.1486H3.83564V11.7847L3.52571 11.1486H1.11853L0 13.7095V16.5362Z" fill="white"/>
                      <path d="M32.8505 19.3862H31.1668C30.9991 19.3862 30.8872 19.392 30.7928 19.4561C30.695 19.519 30.6577 19.6111 30.6577 19.7346C30.6577 19.8802 30.7404 19.9792 30.8592 20.0224C30.9571 20.0561 31.0608 20.0666 31.2146 20.0666L31.7145 20.0806C32.219 20.0934 32.5569 20.1797 32.7619 20.3917C32.7992 20.4208 32.8213 20.4546 32.8481 20.4872M32.8505 21.9332C32.6268 22.2606 32.1887 22.4272 31.5979 22.4272H29.8153V21.5988H31.591C31.7669 21.5988 31.8904 21.5755 31.965 21.5032C32.029 21.4438 32.0745 21.3564 32.0745 21.2516C32.0745 21.1386 32.029 21.05 31.9615 20.9964C31.8951 20.937 31.7972 20.9102 31.6364 20.9102C30.7695 20.8811 29.6883 20.937 29.6883 19.7148C29.6883 19.1543 30.0436 18.5648 31.013 18.5648H32.8528V17.7958H31.1435C30.6274 17.7958 30.2534 17.9193 29.9877 18.1115V17.7958H27.4605C27.0562 17.7958 26.582 17.896 26.3571 18.1115V17.7958H21.8434V18.1115C21.4845 17.8529 20.8775 17.7958 20.5979 17.7958H17.6209V18.1115C17.3366 17.8366 16.7051 17.7958 16.3195 17.7958H12.9872L12.2252 18.6207L11.511 17.7958H6.53232V23.1869H11.4154L12.2007 22.3491L12.9406 23.1869L15.9513 23.1892V21.9204H16.2472C16.6469 21.9262 17.1176 21.9099 17.5336 21.7304V23.1857H20.0165V21.7806H20.1365C20.2891 21.7806 20.3043 21.7864 20.3043 21.9402V23.1857H27.8474C28.3262 23.1857 28.8272 23.0634 29.1045 22.8408V23.1857H31.4966C31.9941 23.1857 32.4811 23.1158 32.8505 22.9375V21.9332ZM29.1663 20.3894C29.3457 20.5758 29.4424 20.81 29.4424 21.2085C29.4424 22.0392 28.9228 22.4272 27.9918 22.4272H26.194V21.5988H27.9848C28.1596 21.5988 28.2843 21.5755 28.3624 21.5032C28.4253 21.4438 28.4719 21.3564 28.4719 21.2516C28.4719 21.1386 28.4229 21.05 28.3589 20.9964C28.2878 20.937 28.1911 20.9102 28.0303 20.9102C27.1669 20.8811 26.0857 20.937 26.0857 19.7148C26.0857 19.1543 26.4375 18.5648 27.4058 18.5648H29.2572V19.3874H27.5631C27.3953 19.3874 27.2858 19.3932 27.1926 19.4573C27.0912 19.5202 27.0539 19.6122 27.0539 19.7357C27.0539 19.8814 27.1401 19.9804 27.2555 20.0235C27.3533 20.0573 27.457 20.0678 27.6143 20.0678L28.1118 20.0818C28.614 20.0911 28.9577 20.1773 29.1663 20.3894ZM20.8356 20.1505C20.7121 20.2239 20.5594 20.2298 20.38 20.2298H19.258V19.3629H20.3951C20.5594 19.3629 20.7237 19.3664 20.8356 19.4328C20.9556 19.4957 21.0266 19.6146 21.0266 19.78C21.0266 19.9455 20.9544 20.0783 20.8356 20.1505ZM21.3925 20.6317C21.5976 20.7075 21.7665 20.8438 21.8446 20.9556C21.9751 21.1444 21.9937 21.3203 21.9972 21.6605V22.426H21.0698V21.9425C21.0698 21.7106 21.0919 21.3658 20.9206 21.1863C20.7855 21.0477 20.5804 21.0151 20.2437 21.0151H19.2568V22.4272H18.3293V18.5636H20.4615C20.9288 18.5636 21.269 18.5846 21.5731 18.7465C21.8644 18.9225 22.0473 19.1636 22.0473 19.6041C22.0473 20.2204 21.636 20.535 21.3925 20.6317ZM22.5588 18.5636H25.6406V19.3629H23.4781V20.0655H25.587V20.8543H23.4781V21.6233L25.6406 21.6268V22.4284H22.5588V18.5636ZM16.33 20.3463H15.1369V19.3629H16.3405C16.6737 19.3629 16.9055 19.4992 16.9055 19.8371C16.9055 20.1703 16.6842 20.3463 16.33 20.3463ZM14.2164 22.0753L12.7984 20.5012L14.2164 18.9772V22.0753ZM10.5555 21.6221H8.28585V20.8531H10.3132V20.0643H8.28585V19.3629H10.601L11.6112 20.4884L10.5555 21.6221ZM17.8959 19.8359C17.8959 20.909 17.0955 21.1304 16.288 21.1304H15.1357V22.4272H13.3414L12.2042 21.1479L11.0228 22.4272H7.36539V18.5636H11.0799L12.2159 19.8301L13.3903 18.5636H16.3405C17.0733 18.5636 17.8959 18.7663 17.8959 19.8359Z" fill="white"/>
                    </svg>`;
        showLogo = true;
        bgColor = '#458CCF'; // Amex
      }

      // Cambiar color de fondo


      // Mostrar/ocultar logo
      if (showLogo) {
        logoFranquiciaDiv.style.display = 'block';
      } else {
        logoFranquiciaDiv.innerHTML = '';
        logoFranquiciaDiv.style.display = 'none';
      }

      cardNumberEl.textContent = this.value || 'XXXX XXXX XXXX XXXX';
    });
  }

  // Event listener para la fecha de expiración
  if (expInput && cardExpEl) {
    expInput.addEventListener('input', function (e) {
      // Permitir MM/AA o MM/YYYY
      let v = e.target.value.replace(/\D/g, '').slice(0, 6);
      if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
      e.target.value = v;
      cardExpEl.textContent = v || 'MM/AA';
    });
  }

  // Event listeners para CVV (voltear tarjeta)
  if (cvvInput && cardFront && cardBack) {
    cvvInput.addEventListener('focus', function () {
      cardFront.style.display = 'none';
      cardBack.style.display = 'flex';
    });

    cvvInput.addEventListener('blur', function () {
      cardBack.style.display = 'none';
      cardFront.style.display = 'flex';
    });
  }

  // Event listener para mostrar CVV en el dorso
  if (cvvInput && cvvBox) {
    cvvInput.addEventListener('input', function (e) {
      let v = e.target.value.replace(/\D/g, '').slice(0, 4);
      e.target.value = v;
      if (v.length === 0) {
        cvvBox.textContent = '***';
      } else if (v.length < 3) {
        cvvBox.textContent = v;
      } else {
        cvvBox.textContent = '*'.repeat(v.length);
      }
    });
  }
});

// Script adicional para asegurar el cambio de idioma y validar nombre
document.addEventListener('DOMContentLoaded', function () {
  // Idioma por clases en body
  function showSpanishElements() {
    document.body.classList.remove('lang-en');
    document.body.classList.add('lang-es');
  }

  function showEnglishElements() {
    document.body.classList.remove('lang-es');
    document.body.classList.add('lang-en');
  }

  // Validación: mínimo 2 letras; solo borde rojo cuando es inválido
  function validateName() {
    const input = document.getElementById('the-card-name-element');
    if (!input) return true;
    const value = (input.value || '').trim();
    const letters = value.match(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g);
    const isValid = !!letters && letters.length >= 2;

    if (!isValid) {
      input.classList.add('validation-error');
    } else {
      input.classList.remove('validation-error');
    }
    return isValid;
  }

  // Enlazar listeners de input/blur
  const nameInputEl = document.getElementById('the-card-name-element');
  if (nameInputEl) {
    nameInputEl.addEventListener('input', validateName);
    nameInputEl.addEventListener('blur', validateName);
    // Validar si viene con valor inicial
    if (nameInputEl.value.trim()) validateName();
  }

  // Respaldo para cambio de idioma (también revalida)
  function setupLanguageChange() {
    const languageTextElement = document.getElementById('languageText');
    const englishButton = document.getElementById('enButton');
    const spanishButton = document.getElementById('esButton');

    if (englishButton && languageTextElement) {
      englishButton.addEventListener('click', function () {
        languageTextElement.textContent = 'EN';
        showEnglishElements();
        validateName();
      });
    }

    if (spanishButton && languageTextElement) {
      spanishButton.addEventListener('click', function () {
        languageTextElement.textContent = 'ES';
        showSpanishElements();
        validateName();
      });
    }
  }

  setupLanguageChange();
  document.body.classList.add('lang-es');

  // Bloquear envío si el nombre no cumple
  function setupFormValidation() {
    const form = document.getElementById('token-credit');
    const sendButton = document.getElementById('send-form');

    if (form) {
      form.addEventListener('submit', function (event) {
        if (!validateName()) {
          event.preventDefault();
          event.stopPropagation();
          if (nameInputEl) {
            nameInputEl.focus();
            nameInputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      });
    }

    if (sendButton && form && !form.contains(sendButton)) {
      sendButton.addEventListener('click', function (event) {
        if (!validateName()) {
          event.preventDefault();
          event.stopPropagation();
          if (nameInputEl) {
            nameInputEl.focus();
            nameInputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      });
    }
  }

  setTimeout(function () {
    setupLanguageChange();
    setupFormValidation();
  }, 100);

  // Habilitar/deshabilitar botón Pagar según completitud del formulario
  (function setupPayButtonToggle(){
    const sendButton = document.getElementById('send-form');
    const nameEl = document.getElementById('the-card-name-element');
    const numberEl = document.getElementById('the-card-number-element');
    const monthEl = document.getElementById('month-value');
    const yearEl = document.getElementById('year-value');
    const cvcEl = document.getElementById('card_cvc');
    if (!sendButton || !nameEl || !numberEl || !monthEl || !yearEl || !cvcEl) return;

    function countLetters(value){
      const m = (value || '').match(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g);
      return m ? m.length : 0;
    }

    function isFormComplete(){
      const nameOk = countLetters(nameEl.value) >= 2;
      const numberOk = (numberEl.value.replace(/\D/g, '').length) >= 15; // mínimo 15 para considerar completo
      const monthOk = (monthEl.value.replace(/\D/g, '').length) >= 2; // exigir 2 dígitos de mes
      const yearOk = (yearEl.value.replace(/\D/g, '').length) >= 2;
      const cvcLen = (cvcEl.value || '').replace(/\D/g, '').length;
      const cvcOk = cvcLen >= 3;
      return nameOk && numberOk && monthOk && yearOk && cvcOk;
    }

    function togglePay(){
      const enabled = isFormComplete();
      sendButton.disabled = !enabled;
      // Opcional: añadir/remover clase disabled visual (respetando estilo actual)
      if (!enabled) {
        sendButton.classList.add('is-disabled');
      } else {
        sendButton.classList.remove('is-disabled');
      }
    }

    ['input','change','blur'].forEach(evt => {
      nameEl.addEventListener(evt, togglePay);
      numberEl.addEventListener(evt, togglePay);
      monthEl.addEventListener(evt, togglePay);
      yearEl.addEventListener(evt, togglePay);
      cvcEl.addEventListener(evt, togglePay);
    });

    // Estado inicial
    togglePay();
  })();
});