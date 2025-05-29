const {
  Paciente,
  ObraSocial,
  Persona,
  Motivos,
  Admision,
  Turno,
} = require("../models/init");
const sequelize = require("../models/db");
const { Op } = require("sequelize");

async function inicio(req, res) {
  res.render("admision/inicio");
}

//-------------get para admision----------------
async function admision(req, res) {
  console.log("Estoy en admision get");

  const { dni, emergencia } = req.query;
  try {
    // 1. Buscar persona por DNI
    const persona = await Persona.findOne({
      where: { dni },
      include: [
        {
          model: Paciente,
          as: "paciente",
        },
      ],
    });
    if (!persona || !persona.paciente) {
      let mensajeAlert = [];
      mensajeAlert.push(
        "El paciente no esta registrado, por favor complete el formulario"
      );
      //para crearlo
      return res.redirect(
        `/admision/crearPaciente?dni=${dni}&emergencia=${emergencia}`
      );
    }
    const motivos = await Motivos.findAll({
      attributes: ["id_motivo", "nombre"],
      where: { estado: true },
    });
    const motivosArray = motivos.map((m) => ({
      id: m.id_motivo,
      nombre: m.nombre,
    }));

    let mensajeAlert;
    if (emergencia == true) {
      mensajeAlert = `Paciente de emergencia creado. Escriba este DNI: ${dni} en la pulsera/frente del paciente.`;
    }
    return res.render("admision/crearAdmision", {
      dni: persona.dni,
      mensajeAlert: mensajeAlert,
      alertClass: "alert-success",
      paciente: {
        dni: persona.dni,
        nombre: persona.nombre,
        apellido: persona.apellido,
        f_nacimiento: persona.f_nacimiento,
        genero: persona.genero,
        telefono: persona.telefono,
        mail: persona.mail,
        contacto: persona.paciente.contacto,
        direccion: persona.paciente.direccion,
        id_obra_social: persona.paciente.id_obra_social,
        cod_os: persona.paciente.cod_os,
        detalle: persona.paciente.detalle,
      },
      emergencia: true,
      motivos: motivosArray,
    });
  } catch (error) {
    console.error("Error al hacer la admision", error);
    return res.redirect("admision/inicio=admision");
  }
}
//-------------post para admision----------------
async function padmision(req, res) {
  console.log("Estoy en admision post");

  const { id_paciente, id_motivo, derivado } = req.body;

  // Validar campos obligatorios id_paciente, id_motivo
  if (!id_paciente || !id_motivo) {
    console.log("Faltan campos obligatorios");
    return res.render("admision/crearAdmision", {
      mensajeAlert: "Por favor llene todos los campos obligatorios(*)",
      alertClass: "alert-danger",
      admision: {
        id_paciente,
        id_motivo,
        derivado,
      },
    });
  }
  //busco los motivos por id_motivo
  const motivo = await Motivos.findByPk(id_motivo);
  // Validar motivo de admisión turno o derivado, emergencia no ocupa
  if (motivo.nombre === "Turno") {
    const turno = await Turno.findOne({
      where: {
        id_paciente: id_paciente,
        fecha: fecha_ingreso,
      },
    });
    if (!turno) {
      return res.redirect("/admision/admision?error=turno");
    }
  } else if (motivo.nombre === "Derivado") {
    if (!derivado) {
      return res.render("admision/crearAdmision", {
        mensajeAlert:
          "Por favor ingrese el nombre del medico/hospital derivado",
        alertClass: "alert-danger",
        admision: {
          id_paciente,
          id_motivo,
          derivado,
        },
      });
    }
  }
  //creacion de la admision
  try {
    const admision = await Admision.create({
      id_paciente,
      id_motivo,
      derivado: derivado || null, // Si no se proporciona, se deja como NULL
      fecha_ingreso: new Date().toISOString().split("T")[0], // Fecha actual
    });
    res.redirect(`/admision/movientoCama?id_admision=${admision.id_admision}`);
  } catch (error) {
    console.error("Error al crear la admisión de post:", error);
    return res.redirect("/admision/inicio?error=admision");
  }
}
module.exports = {
  controlCrearPaciente,
  gcrearPaciente,
  pCheckPaciente,
  gcheckPaciente,
  inicio,
  emergencia,
  admision,
  padmision,
};
