const { Paciente, ObraSocial, Persona } = require("../models/init-models");
const sequelize = require("../models/db");
const { Op } = require("sequelize");
async function crearPaciente(req, res) {
  const {
    dni,
    nombre,
    apellido,
    fecha_nacimiento,
    genero,
    telefono,
    mail,
    contacto,
    direccion,
    id_obra_social,
    cod_os,
    detalle,
  } = { ...req.body };

  let mensajeAlert = [];
  const regexName = /^[a-zA-Z\s]+$/;
  const regexDni = /^\d{7,8}$/;
  const regexTelefono = /^\d{10}$/;
  const regexEmail = /^([a-zA-Z0-9._-]+)@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Validar campos obligatorios
  if (
    !dni ||
    !nombre ||
    !apellido ||
    !fecha_nacimiento ||
    !genero ||
    !direccion ||
    !obra_social
  ) {
    return res.render("crearPaciente", {
      mensajeAlert: "Por favor llene todos los campos obligatorios(*)",
    });
  }

  // Validaciones especificas
  //dni
  if (!regexDni.test(dni)) {
    mensajeAlert.push("El DNI debe tener entre 7 y 8 dígitos");
  }
  //nombre
  if (nombre.length < 3 || !regexName.test(nombre)) {
    mensajeAlert.push(
      "El nombre debe tener al menos 3 caracteres y solo puede contener letras y espacios"
    );
  }
  //apellido
  if (apellido.length < 3 || !regexName.test(apellido)) {
    mensajeAlert.push(
      "El apellido debe tener al menos 3 caracteres y solo puede contener letras y espacios"
    );
  }
  //fecha_nacimiento
  if (fecha_nacimiento >= new Date()) {
    mensajeAlert.push("La fecha de nacimiento no puede ser mayor a la actual");
  }
  //genero
  if (genero !== "fememino" && genero !== "masculino" && genero !== "otro") {
    mensajeAlert.push("El género debe ser 'femenino', 'masculino' u 'otro'");
  }
  //telefono
  if (telefono && !regexTelefono.test(telefono)) {
    mensajeAlert.push("El teléfono debe tener 10 dígitos");
  }
  //telefono_contacto
  if (contacto && !regexTelefono.test(contacto)) {
    mensajeAlert.push("El teléfono de contacto debe tener 10 dígitos");
  }
  //mail
  if (mail && !regexEmail.test(email)) {
    mensajeAlert.push("El email debe ser válido");
  }
  //obra_social
  const obraSocialBuscada = await ObraSocial.findByPk(id_obra_social);
  if (!obraSocialBuscada) {
    mensajeAlert.push(
      "La obra social no existe, por favor seleccione una de la lista"
    );
  }
  //cod_os
  if (cod_os && cod_os.length < 3) {
    mensajeAlert.push(
      "El código de la obra social debe tener al menos 3 caracteres"
    );
  }
}
//detalle
if (detalle && detalle.length > 255) {
  mensajeAlert.push("El detalle no puede tener más de 255 caracteres");
}
//renderiza la vista con los errores
if (mensajeAlert.length > 0) {
  return res.status(400).render("crearPaciente", {
    mensajeAlert,
    paciente: req.body,
  });
}

// Crear un nuevo paciente
try {
  // 1. Buscar persona por DNI
  const persona = await Persona.findOne({ where: { dni } });

  let idPersona;
  if (persona) {
    // 2. Si existe persona, buscar paciente
    idPersona = persona.id_persona;
    const pacienteExistente = await Paciente.findOne({
      where: { id_persona: idPersona },
    });
    if (pacienteExistente) {
      mensajeAlert.push("Ya hay un paciente con ese DNI");
      return res.render("crearPaciente", { mensajeAlert, paciente: req.body });
    }
  } else {
    // 3. Si no existe persona, crearla
    const nuevaPersona = await Persona.create({
      dni,
      nombre,
      apellido,
      f_nacimiento: fecha_nacimiento,
      genero,
      telefono,
      mail,
    });
    idPersona = nuevaPersona.id_persona;
  }

  // 4. Crear paciente con la FK de persona
  await Paciente.create({
    id_persona: idPersona,
    contacto,
    direccion,
    id_obra_social,
    cod_os,
    detalle,
  });

  mensajeAlert.push("Paciente creado exitosamente");
  return res.render("crearPaciente", { mensajeAlert });
} catch (error) {
  mensajeAlert.push("Error al crear el paciente");
  return res.render("crearPaciente", { mensajeAlert, paciente: req.body });
}

async function crearPaciente(req, res) {
  res.render("crearPaciente");
}

async function verificarPaciente(req, res) {
  const paciente = await vP.buscarDni(req.params.dni);
  let claseB;
  if (!paciente) {
    claseB = "btn-outline-danger";
  } else {
    claseB = "btn-outline-success";
  }
  return res.render("crearPaciente", { paciente, claseB });
}
//checkea si el paciente existe, si no existe lo crea
// si existe rederiza la vista corresponidente del navbar seleccionado
async function checkPaciente(req, res) {
  const { dni, navbar } = req.body;
  const paciente = await vP.buscarDni(dni);
  if (!paciente) {
    navbar = "crearPaciente";
    return res.render("crearPaciente", { dni, navbar });
  } else {
    switch (navbar) {
      case "gestionPaciente":
        return res.render("crearPaciente", { paciente, dni, navbar });

      case "buscarPacientes":
        return res.render("buscarPacientes", { dni, navbar });

      case "crearAdmision":
        return res.render("crearAdmision", { dni, navbar });

      case "modificarAdmision":
        return res.render("modificarAdmision", { dni, navbar });

      case "crearTurno":
        return res.render("crearTurno", { dni, navbar });

      case "modificarTurno":
        return res.render("modificarTurno", { dni, navbar });

      case "verTurnos":
        return res.render("verTurnos", { dni, navbar });

      default:
        console.log("Error en la redirección de checkPaciente");
        return res.redirect("/");
    }
  }
}
async function gcheckPaciente(req, res) {
  res.render("verficardni", {
    navbar: req.query.navbar,
  });
}
module.exports = {
  controlPaciente,
  crearPaciente,
  verificarPaciente,
  checkPaciente,
  gcheckPaciente,
};
