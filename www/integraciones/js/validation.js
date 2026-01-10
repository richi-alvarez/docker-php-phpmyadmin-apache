let invoice = document.getElementById("invoice");
invoice.value = Math.floor(Math.random() * (3999999 - 1)) + 1;

let inputDescription = document.getElementById("inputDescription");
inputDescription.addEventListener("change", () => inputDescription.value);

let inputEmail = document.getElementById("inputEmail");
inputEmail.addEventListener("change", () => inputEmail.value);

let inputName = document.getElementById("inputName");
inputName.addEventListener("change", () => inputName.value);


// let testProd = document.getElementById("testProd");
// testProd.addEventListener("click", function () {
//   if (testProd.checked)
//     document.getElementById("labelTestProd").innerHTML = "Producción";
//   else document.getElementById("labelTestProd").innerHTML = "Prueba";
// });

// let language = document.getElementById("language");
// language.addEventListener("click", function () {
//   if (language.checked)
//     document.getElementById("labelLanguage").innerHTML = "Ingles";
//   else document.getElementById("labelLanguage").innerHTML = "Español";
// });

// let typeUx = document.getElementById("typeUx");
// typeUx.addEventListener("click", function () {
//   if (typeUx.checked)
//     document.getElementById("labelTypeUx").innerHTML = "Estandar";
//   else document.getElementById("labelTypeUx").innerHTML = "OnePage";
// });

// let split = document.getElementById("split");
// split.addEventListener("click", function () {
//   if (split.checked) {
//     document.getElementById("labelSplit").innerHTML = "Pago Divido";
//     document.getElementById("divSplit").hidden = false;
//     document.getElementById("taxBase").readOnly = true;
//   } else {
//     document.getElementById("labelSplit").innerHTML = "Pago Normal";
//     document.getElementById("divSplit").hidden = true;
//     document.getElementById("taxBase").readOnly = false;
//   }
// });

// let currency = document.getElementById("currency");
// currency.addEventListener("click", function () {
//   if (currency.checked)
//     document.getElementById("labelCurrency").innerHTML = "Dolares (USD)";
//   else document.getElementById("labelCurrency").innerHTML = "Pesos (COP)";
// });

// let method = document.getElementById("method");
// method.addEventListener("click", function () {
//   if (method.checked) document.getElementById("labelMethod").innerHTML = "GET";
//   else document.getElementById("labelMethod").innerHTML = "POST";
// });

// let taxBase = document.getElementById("taxBase");
// taxBase.addEventListener("keyup", function(e) {
//     if (e.key == 'a')
//       console.log(e.key)
//     else
//       taxBase.ke;
// });

// let taxIva = document.getElementById("taxIva");
// taxIva.addEventListener("keyup", () =>
//   add(
//     taxBase.value,
//     taxIva.value,
//     taxIco.value,
//     taxBase1.value,
//     taxIva1.value,
//     taxBase2.value,
//     taxIva2.value
//   )
// );

// let taxIco = document.getElementById("taxIco");
// taxIco.addEventListener("keyup", () =>
//   add(
//     taxBase.value,
//     taxIva.value,
//     taxIco.value,
//     taxBase1.value,
//     taxIva1.value,
//     taxBase2.value,
//     taxIva2.value
//   )
// );

// let taxBase1 = document.getElementById("taxBase1");
// taxBase1.addEventListener("keyup", () =>
//   add(
//     taxBase.value,
//     taxIva.value,
//     taxIco.value,
//     taxBase1.value,
//     taxIva1.value,
//     taxBase2.value,
//     taxIva2.value
//   )
// );

// let taxIva1 = document.getElementById("taxIva1");
// taxIva1.addEventListener("keyup", () =>
//   add(
//     taxBase.value,
//     taxIva.value,
//     taxIco.value,
//     taxBase1.value,
//     taxIva1.value,
//     taxBase2.value,
//     taxIva2.value
//   )
// );

// let taxBase2 = document.getElementById("taxBase2");
// taxBase2.addEventListener("keyup", () =>
//   add(
//     taxBase.value,
//     taxIva.value,
//     taxIco.value,
//     taxBase1.value,
//     taxIva1.value,
//     taxBase2.value,
//     taxIva2.value
//   )
// );

// let taxIva2 = document.getElementById("taxIva2");
// taxIva2.addEventListener("keyup", () =>
//   add(
//     taxBase.value,
//     taxIva.value,
//     taxIco.value,
//     taxBase1.value,
//     taxIva1.value,
//     taxBase2.value,
//     taxIva2.value
//   )
// );

// let amount = document.getElementById("amount");

// function add(taxBase, taxIVa, taxIco, taxBase1, taxIVa1, taxBase2, taxIVa2) {
//   var add =
//     parseFloat(taxBase) +
//     parseFloat(taxIVa) +
//     parseFloat(taxIco) +
//     parseFloat(taxBase1) +
//     parseFloat(taxIVa1) +
//     parseFloat(taxBase2) +
//     parseFloat(taxIVa2);
//   amount.value = add.toString();
// }

// let idClient = document.getElementById("idClient");
// idClient.addEventListener("change", () => idClient.value);
