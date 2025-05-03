function verificarDni(dni) {
  var regexDni = /^\d{7,8}$/;
  const getdni = require("../model/getdni");
  if (!regexDni.test(dni)) {
    return alert("El DNI debe tener entre 7 y 8 dígitos");
  }
  const boton = document.getElementById("button-verificar");
  inputDni.classList.remove("light");

  if (getdni(dni)) {//si el dni ya existe en la base de datos
    boton.classList.add("success");
    return true;
  } else if (!getdni(dni)) {//si el dni no existe en la base de datos
    boton.classList.add("danger");
    return false;
  }
  return alert("Algo salio mal al verificar el DNI");


}
function turnoDni(dni) {

  if (!verificarDni(dni)) {
    return window.location.href = '/crearPaciente';
  }

}