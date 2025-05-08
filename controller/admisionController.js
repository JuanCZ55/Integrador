import e from "express";

const Paciente = require("../models/paciente");
const vP = require("../model/pacientesValidacion");

export function controlPaciente(req, res) {
  const paciente = { ...req.body };

  let mensajeAlert = [];
  const regexName = /^[a-zA-Z\s]+$/;
  const regexDni = /^\d{7,8}$/;
  const regexTelefono = /^\d{10}$/;
  const regexEmail = /^([a-zA-Z0-9._-]+)@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Validar campos obligatorios
  if (
    !paciente.nombre ||
    !paciente.apellido ||
    !paciente.dni ||
    !paciente.fecha_nacimiento ||
    !paciente.telefono ||
    !paciente.sexo ||
    !paciente.obra_social ||
    !paciente.email
  ) {
    return res.render("crearPaciente", { errores: "Por favor llene todos los campos obligatorios(*)" });
  }

  // Validaciones especificas
  if (paciente.nombre.length < 3) {
    mensajeAlert.push("El nombre debe tener al menos 3 caracteres");
  }
  if (paciente.apellido.length < 3) {
    mensajeAlert.push("El apellido debe tener al menos 3 caracteres");
  }
  if (!regexName.test(paciente.nombre)) {
    mensajeAlert.push("El nombre solo puede contener letras y espacios");
  }
  if (!regexName.test(paciente.apellido)) {
    mensajeAlert.push("El apellido solo puede contener letras y espacios");
  }
  if (!regexDni.test(paciente.dni)) {
    mensajeAlert.push("El DNI debe tener entre 7 y 8 dígitos");
  }
  if (!regexTelefono.test(paciente.telefono)) {
    mensajeAlert.push("El teléfono debe tener 10 dígitos");
  }
  if (paciente.telefono_contacto && !regexTelefono.test(paciente.telefono_contacto)) {
    mensajeAlert.push("El teléfono de contacto debe tener 10 dígitos");
  }
  if (!regexEmail.test(paciente.email)) {
    mensajeAlert.push("El email debe ser válido");
  }
  if (mensajeAlert.length > 0) {
    return res.render("crearPaciente", { mensajeAlert, paciente });
  }

  // Crear un nuevo paciente
  const nuevoPaciente = new Paciente(
    paciente.dni,
    paciente.nombre,
    paciente.apellido,
    paciente.fecha_nacimiento,
    paciente.sexo,
    paciente.telefono,
    paciente.telefono_contacto,
    paciente.obra_social,
    paciente.detalle
  );

  // Guardar el paciente con model
  console.log("Paciente guardado:", nuevoPaciente);
  mensajeAlert.push("Paciente creado exitosamente");
  return res.render("crearPaciente", mensajeAlert);
}

exports.crearPaciente = (req, res) => {
  res.render("crearPaciente");
};

exports.verificarPaciente = async (req, res) => {
  const paciente = await vP.buscarDni(req.params.dni);
  let claseB;
  if (!paciente) {
    claseB = "btn-outline-danger";
  } else {
    claseB = "btn-outline-success";
  }
  return res.render("crearPaciente", { paciente, claseB });
};
