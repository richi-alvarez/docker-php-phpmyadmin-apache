document.getElementById("pay").addEventListener("click", () => {
  var handler = ePayco.checkout.configure({
    key: document.getElementById("publicKey").value,
    test: false, // !document.getElementById("testProd").checked,
  });

  function validate() {
    var flag = true;
    let required = document.getElementsByClassName("required");
    for (let i = 0; i < required.length; i++) {
      required[i].classList.remove("invalid");
    }

    // if (document.getElementById("idClient").value == "") {
    //   flag = false;
    //   document.getElementById("idClient").classList.add("invalid");
    // }

    if (document.getElementById("publicKey").value == "") {
      flag = false;
      document.getElementById("publicKey").classList.add("invalid");
    }

    if (document.getElementById("inputEmail").value == "") {
      flag = false;
      document.getElementById("inputEmail").classList.add("invalid");
    }

    if (document.getElementById("inputDescription").value == "") {
      flag = false;
      document.getElementById("inputDescription").classList.add("invalid");
    }

    if (document.getElementById("inputName").value == "") {
      flag = false;
      document.getElementById("inputName").classList.add("invalid");
    }

    if (document.getElementById("amount").value == "0,00") {
      flag = false;
      document.getElementById("amount").classList.add("invalid");
    }

    // if (
    //   parseFloat(document.getElementById("taxBase").value) == 0 ||
    //   document.getElementById("taxBase").value == ""
    // ) {
    //   flag = false;
    //   document.getElementById("taxBase").classList.add("invalid");
    // }

    if (!flag) {
      swal("Error!", "Por favor diligenciar los campos obligatorios", "error");
    }

    return flag;
  }

  let data = {
    //Parametros compra (obligatorio)
    name: "Prueba Certificación",
    description: document.getElementById("inputDescription").value,
    invoice: document.getElementById("invoice").value,
    currency: "cop", // document.getElementById("currency").checked ? "usd" : "cop",
    amount: document.getElementById("amount").value,
    tax_base: 0, // document.getElementById("taxBase").value,
    tax: 0, // document.getElementById("taxIva").value == "" ? "0" : document.getElementById("taxIva").value,
    tax_ico: 0, // document.getElementById("taxIco").value == "" ? "0" : document.getElementById("taxIco").value,
    country: "co",
    lang: "es", // document.getElementById("language").checked ? "en" : "es",
    external: false, // document.getElementById("typeUx").checked ? "true" : "false",
    //Atributos opcionales
    confirmation: "https://epaycocom.000webhostapp.com/confirmation/mix.php", // document.getElementById("urlConfirmation").value,
    response: "https://epaycocom.000webhostapp.com/confirmation/mix.php", // document.getElementById("urlResponse").value,
    method_confirmation: "POST", // document.getElementById("method").checked ? "GET" : "POST",
    //method: document.getElementById("method").checked ? "GET" : "POST",
    // Split Payment
    extra1: "Extra1",
    extra2: "Extra2",
    extra3: "Extra3",
    extra4: "Extra4",
    extra5: "Extra5",
    extra6: "Extra6",
    extra7: "Extra7",
    extra8: "Extra8",
    extra9: "Extra9",
    extra10: "Extra10",
    //Atributos cliente
    name_billing: document.getElementById("inputName").value,
    address_billing: document.getElementById("address").value,
    type_doc_billing: "cc",
    mobilephone_billing: document.getElementById("phone").value,
    number_doc_billing: document.getElementById("id").value,
    email_billing: document.getElementById("inputEmail").value,
    //methodsDisable: ["SP", "CASH"],
    //atributo deshabilitación metodo de pago
    // methodsDisable: ["TDC", "PSE", "SP", "CASH"],
  };

  // var add1 =
  //   parseFloat(document.getElementById("taxIva1").value) +
  //   parseFloat(document.getElementById("taxBase1").value);
  // var add2 =
  //   parseFloat(document.getElementById("taxIva2").value) +
  //   parseFloat(document.getElementById("taxBase2").value);

  // let split = {
  //   split_app_id: document.getElementById("idClient").value,
  //   split_merchant_id: document.getElementById("idClient").value,
  //   split_type: "01",
  //   split_primary_receiver: document.getElementById("idClient").value,
  //   split_primary_receiver_fee: "0",
  //   splitpayment: "true",
  //   split_rule: "multiple",
  //   split_receivers: [
  //     {
  //       id: document.getElementById("idClient1").value,
  //       total: add1.toString(),
  //       iva: document.getElementById("taxIva1").value,
  //       base_iva: document.getElementById("taxBase1").value,
  //       fee: document.getElementById("fee1").value,
  //     },
  //     {
  //       id: document.getElementById("idClient2").value,
  //       total: add2.toString(),
  //       iva: document.getElementById("taxIva2").value,
  //       base_iva: document.getElementById("taxBase2").value,
  //       fee: document.getElementById("fee2").value,
  //     },
  //   ],
  // };

  // if (document.getElementById("split").checked) {
  //   Object.assign(data, split);
  // }

  if (validate()) {
    handler.open(data);
  }
});
