const {
  Paciente,
  ObraSocial,
  Persona,
  Motivos,
  Admision,
  Turno,
  MovimientoCama,
  Cama,
  Sector,
  Habitacion,
} = require("../models/init");
const sequelize = require("../models/db"); // transacciones
const { Op } = require("sequelize");
function validator(persona, empleado, medico, especialidad, estado) {
  const errores = [];
  if (
    !persona.dni ||
    !persona.nombre ||
    !persona.apellido ||
    !persona.f_nacimiento ||
    !persona.genero ||
    !persona.telefono ||
    !persona.mail ||
    !empleado.fecha_ingreso ||
    !empleado.id_rol ||
    !medico.matricula ||
    !especialidad ||
    !estado
  ) {
    errores.push("Faltan datos obligatorios(*)");
    return errores;
  }
  const regexDni = /^[0-9]{7,8}$/;
  const regexNombre = /^[a-zA-Z\s]+$/;
  const regexTelefono = /^\d{10}$/;

  if (!regexDni.test(persona.dni)) {
    errores.push("DNI inválido, debe tener 7 u 8 dígitos");
  }
  if (!regexNombre.test(persona.nombre)) {
    errores.push("Nombre inválido, solo se permiten letras");
  }
  if (!regexNombre.test(persona.apellido)) {
    errores.push("Apellido inválido, solo se permiten letras");
  }
  const fechaN = new Date(persona.f_nacimiento);
  if (isNaN(fechaN.getTime())) {
    errores.push("Fecha nacimiento no valida");
  } else if (fechaN >= new Date()) {
    errores.push("Cambia la fecha de nacimiento,¿Como naciste en el futuro?");
  }

  if (genero !== "Femenino" && genero !== "Masculino" && genero !== "Otro") {
    errores.push("Genero invalido");
  }
  if (persona.telefono && !regexTelefono.test(persona.telefono)) {
    errores.push("Telefono debe tener 10 digitos, solo numeros");
  }
  if (!regexEmail.test(mail)) {
    errores.push("Email invalido, asi deberia ser jorgepower@gmail.com");
  }
  //-------------------------------------------------------------------------------
  if (!empleado.fecha_ingreso || isNaN(new Date(empleado.fecha_ingreso))) {
    errores.push("Fecha de ingreso no valida");
  }
  if (empleado.id_rol !== 3 && empleado.id_rol !== 4) {
    errores.push("Rol inválido");
  }
  //-------------------------------------------------------------------------------
  if (!regexDni.test(medico.matricula)) {
    errores.push("Matrícula inválida");
  }
  if (!estado || (estado !== "Activo" && estado !== "Inactivo")) {
    errores.push("Especialidad inválida");
  }
  return errores;
}

async function name(params) {}

module.exports = { validator };
