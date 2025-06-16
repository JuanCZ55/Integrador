const {
  Paciente,
  Persona,
  Turno,
  Medico,
  HorarioTurno,
} = require("../models/init");
const sequelize = require("../models/db");
const { Op } = require("sequelize");

function validarDatos({ dni, id_medico, fecha, hora, medicos }) {
  const errores = [];
  const regexDni = /^\d{7,8}$/;
  const obligatorios = {
    dni,
    id_medico,
    fecha,
    hora,
  };
  console.log(id_medico);

  const nombresVisibles = {
    dni: "DNI",
    id_medico: "Medico",
    fecha: "Fecha",
    hora: "Hora",
  };

  for (let obli in obligatorios) {
    if (!obligatorios[obli]) {
      errores.push(`${nombresVisibles[obli]} es obligatorio`);
    }
  }
  if (id_medico && !medicos.some((medico) => medico.id === Number(id_medico))) {
    errores.push("Elija un medico existente");
  }
  if (dni && !regexDni.test(dni)) {
    errores.push("DNI debe tener 7 u 8 digitos");
  }
  const hoyStr = new Date().toISOString().split("T")[0];
  if (fecha < hoyStr) {
    errores.push("La fecha debe ser posterior o igual a la actual");
  }
  if (!hora || isNaN(Number(hora))) {
    errores.push("Elija un horario valido");
  }
  return errores;
}

async function renderForm(res, vari) {
  vari = typeof vari === "object" && vari !== null ? vari : {};

  const medicosB = await Medico.findAll({
    include: [{ model: Persona, as: "persona" }],
  });
  const medicos = medicosB.map((medico) => ({
    id: medico.id_medico,
    nombre: `${medico.persona.nombre} ${medico.persona.apellido}`,
  }));

  const datos = {
    dni: vari.dni || "",
    id_medico: vari.id_medico || "",
    fecha: vari.fecha || "",
    hora: vari.hora || "",
    medicos: medicos || [],
    mensajeAlert: vari.mensajeAlert || [],
    alertClass: vari.alertClass || "alert-danger",
    turnosPaciente: vari.turnosPaciente || [],
  };
  return res.render("admision/turno", datos);
}

//+ POST para crear un turno
async function postTurnos(req, res) {
  const { dni, id_medico, fecha, hora } = req.body;

  try {
    const medicosB = await Medico.findAll({
      include: [{ model: Persona, as: "persona" }],
    });
    const medicos = medicosB.map((medico) => ({
      id: medico.id_medico,
      nombre: `${medico.persona.nombre} ${medico.persona.apellido}`,
    }));
    const mensajeAlert = validarDatos({
      dni,
      id_medico,
      fecha,
      hora,
      medicos,
    });
    if (mensajeAlert.length > 0) {
      return renderForm(res, {
        mensajeAlert,
        alertClass: "alert-danger",
        dni,
        id_medico,
        fecha,
        hora,
      });
    }
    const persona = await Persona.findOne({
      where: { dni },
      include: [{ model: Paciente, as: "paciente" }],
    });
    if (!persona || !persona.paciente) {
      return renderForm(res, {
        mensajeAlert: ["No se encontro el paciente con ese DNI, registrelo"],
        alertClass: "alert-danger",
        dni,
        id_medico,
        fecha,
        hora,
      });
    }
    const id_paciente = persona.paciente.id_paciente;
    const turno = await Turno.create({
      id_paciente,
      id_medico,
      id_horario_turno: hora,
      fecha,
    });
    if (turno) {
      return renderForm(res, {
        mensajeAlert: ["Turno creado exitosamente"],
        alertClass: "alert-success",
      });
    }
    return renderForm(res, {
      mensajeAlert: ["Error al crear el turno"],
      alertClass: "alert-danger",
    });
  } catch (error) {
    return renderForm(res, {
      mensajeAlert: ["Error al crear el turno: " + error.message],
      alertClass: "alert-danger",
    });
  }
}

//- POST para modificar un turno
async function postModificarTurno(req, res) {
  const { id_turno, dni, id_medico, fecha, hora, estado } = req.body;
  try {
    const medicosB = await Medico.findAll({
      include: [{ model: Persona, as: "persona" }],
    });
    const medicos = medicosB.map((medico) => ({
      id: medico.id_medico,
      nombre: `${medico.persona.nombre} ${medico.persona.apellido}`,
    }));
    const mensajeAlert = validarDatos({
      dni,
      id_medico,
      fecha,
      hora,
      medicos,
    });
    if (mensajeAlert.length > 0) {
      return renderForm(res, {
        mensajeAlert,
        alertClass: "alert-danger",
        id_turno,
        dni,
        id_medico,
        fecha,
        hora,
        estado,
      });
    }
    const turno = await Turno.findByPk(id_turno);
    if (!turno) {
      return renderForm(res, {
        mensajeAlert: ["Turno no encontrado"],
        alertClass: "alert-danger",
      });
    }
    const persona = await Persona.findOne({
      where: { dni },
      include: [{ model: Paciente, as: "paciente" }],
    });
    if (!persona || !persona.paciente) {
      return renderForm(res, {
        mensajeAlert: ["No se encontro el paciente con ese DNI, registrelo"],
        alertClass: "alert-danger",
        dni,
        id_medico,
        fecha,
        hora,
      });
    }
    turno.id_paciente = persona.paciente.id_paciente;
    turno.id_medico = id_medico;
    turno.id_horario_turno = hora;
    turno.fecha = fecha;
    turno.estado = estado;
    await turno.save();
    return renderForm(res, {
      mensajeAlert: ["Turno modificado exitosamente"],
      alertClass: "alert-success",
    });
  } catch (error) {
    return renderForm(res, {
      mensajeAlert: ["Error al modificar el turno: " + error.message],
      alertClass: "alert-danger",
    });
  }
}
//- GET para obtener turnos por DNI|
async function getTurnos(req, res) {
  const { dni } = req.query;
  console.log("GET Turnos por DNI:", dni);

  const regexDni = /^\d{7,8}$/;
  try {
    if (dni === undefined) {
      return renderForm(res, {});
    }
    if (!dni) {
      return renderForm(res, {
        mensajeAlert: ["Falta el DNI del paciente"],
        alertClass: "alert-danger",
      });
    }
    if (!regexDni.test(dni)) {
      return renderForm(res, {
        mensajeAlert: ["El DNI debe tener 7 u 8 digitos"],
        alertClass: "alert-danger",
      });
    }

    const persona = await Persona.findOne({
      where: { dni },
      include: [{ model: Paciente, as: "paciente" }],
    });
    if (!persona || !persona.paciente) {
      return renderForm(res, {
        mensajeAlert: ["No se encontro el paciente con ese DNI, registrelo"],
        alertClass: "alert-danger",
      });
    }

    const turnos = await Turno.findAll({
      where: { id_paciente: persona.paciente.id_paciente },
      include: [
        {
          model: Medico,
          as: "medico",
          include: [{ model: Persona, as: "persona" }],
        },
        { model: HorarioTurno, as: "horarioTurno" },
      ],
      order: [["fecha", "DESC"]],
    });

    const turnosPaciente = (turnos || []).map((turno) => ({
      id_turno: turno.id_turno,
      fecha: turno.fecha,
      hora: turno.horarioTurno ? turno.horarioTurno.hora : "",
      id_horario: turno.horarioTurno ? turno.horarioTurno.id_horario_turno : "",
      medico:
        turno.medico && turno.medico.persona
          ? `${turno.medico.persona.nombre} ${turno.medico.persona.apellido}`
          : "",
      id_medico: turno.medico ? turno.medico.id_medico : "",
      estado:
        turno.estado === 1
          ? "Pendiente"
          : turno.estado === 2
          ? "Finalizado"
          : turno.estado === 3
          ? "Cancelado"
          : "",
      estado_val: turno.estado || 1,
    }));

    return renderForm(res, {
      dni: dni,
      mensajeAlert: [],
      alertClass: "alert-success",
      turnosPaciente,
    });
  } catch (error) {
    return renderForm(res, {
      mensajeAlert: ["Error al buscar el paciente: " + error.message],
      alertClass: "alert-danger",
    });
  }
}

// GET api para tener horarios por fecha
async function apiHorarios(req, res) {
  const { fecha } = req.query;
  if (!fecha) return res.status(400).json({ error: "Faltan las fechas" });

  try {
    const horarios = await HorarioTurno.findAll({ order: [["hora", "ASC"]] });
    if (horarios.length === 0) {
      return res.status(404).json({ error: "No hay horarios definidos" });
    }

    const conteos = await Promise.all(
      horarios.map((h) =>
        Turno.count({
          where: {
            id_horario_turno: h.id_horario_turno,
            fecha,
            estado: 1,
          },
        })
      )
    );

    const disponibles = horarios
      .map((h, i) => ({
        id: h.id_horario_turno,
        hora: h.hora,
        usados: conteos[i],
      }))
      .filter((h) => h.usados < 5);

    return res.json(disponibles);
  } catch (error) {
    console.error("Error al obtener los horarios:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
async function finalizarTurno(req, res) {
  const { id_turno } = req.body;
  try {
    const turno = await Turno.findByPk(id_turno);
    if (!turno) {
      return renderForm(res, {
        mensajeAlert: ["Turno no encontrado"],
        alertClass: "alert-danger",
      });
    }
    turno.estado = 2;
    await turno.save();
    return renderForm(res, {
      mensajeAlert: ["Turno finalizado correctamente"],
      alertClass: "alert-success",
    });
  } catch (error) {
    return renderForm(res, {
      mensajeAlert: ["Error al finalizar el turno"],
      alertClass: "alert-danger",
    });
  }
}

//- POST para cancelar un turno
async function cancelarTurno(req, res) {
  const { id_turno } = req.body;
  try {
    const turno = await Turno.findByPk(id_turno);
    if (!turno) {
      return renderForm(res, {
        mensajeAlert: ["Turno no encontrado"],
        alertClass: "alert-danger",
      });
    }
    turno.estado = 3;
    await turno.save();
    return renderForm(res, {
      mensajeAlert: ["Turno cancelado correctamente"],
      alertClass: "alert-success",
    });
  } catch (error) {
    return renderForm(res, {
      mensajeAlert: ["Error al cancelar el turno"],
      alertClass: "alert-danger",
    });
  }
}
module.exports = {
  postTurnos,
  postModificarTurno,
  getTurnos,
  apiHorarios,
  finalizarTurno,
  cancelarTurno,
};
