function verificarDni(dni) {
  var regexDni = /^\d{7,8}$/;
  const getdni = require("../model/getdni");
  if (!dni) {
    return alert("Por favor ingrese un DNI");
  }
  if (!regexDni.test(dni)) {
    return alert("El DNI debe tener entre 7 y 8 dígitos");
  }
  fetch(`/admision/verficar/${dni}`).catch((error) => {
    console.error("Error del fetch de verificarDni:", error);
  });

}
function turnoDni(dni) {

  if (!verificarDni(dni)) {
    return window.location.href = '/crearPaciente';
  }

}