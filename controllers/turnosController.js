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
  Especialidad,
  Horario,
} = require("../models/init");
const sequelize = require("../models/db");

function validarDatos(nombre, id_medico, estado, fecha, hora, medicos) {
  data = typeof data === "object" && data !== null ? data : {};

  const errores = [];
  const { dni, id_medico, fecha, hora, estado } = data;
  const regexDni = /^\d{7,8}$/;
  const horaRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  const obligatorios = {
    nombre,
    id_medico,
    fecha,
    hora,
    estado,
  };
  const nombresVisibles = {
    dni: "DNI",
    id_medico: "Medico",
    fecha: "Fecha",
    hora: "Hora",
    estado: "Estado",
  };

  for (let obli in obligatorios) {
    if (!obligatorios[obli]) {
      errores.push(`${nombresVisibles[obli]} es obligatorio`);
    }
  }
  if (id_medico && !medicos.some((medico) => medico.id_medico === id_medico)) {
    errores.push("Eliga un medico existente");
  }
  if (dni && !regexDni.test(dni)) {
    errores.push("Dni debe tener 7 u 8 digitos");
  }

  const fechaN = new Date(fecha);
  if (fechaN <= new Date()) {
    errores.push("La fecha debe ser posterior a la actual");
  }
  if (hora && !horaRegex.test(hora)) {
    errores.push("Hora debe tener el formato HH:MM");
  }
  if ((estado && estado < 1) || estado > 3) {
    errores.push("El estado debe ser 1, 2 o 3");
  }

  return errores;
}
async function renderForm(res, vari) {
  vari = typeof vari === "object" && vari !== null ? vari : {};

  const especialidades = await Especialidad.findAll({});
  const datos = {
    dni: vari.dni || "",
    id_medico: vari.id_medico || "",
    fecha: vari.fecha || "",
    hora: vari.hora || "",
    estado: vari.estado || "",
    medicos: vari.medicos || [],
    especialidades: especialidades || [],
    mensajeAlert: vari.mensajeAlert || [],
    alertClass: vari.alertClass || "alert-danger",
  };
  return res.render("admision/gestionTurno", datos);
}
async function postTurnos(req, res) {
  const { dni, id_medico, estado, fecha_hora } = req.body;
  const [fecha, hora] = fecha_hora.split("T");

  const mensajeAlert = validarDatos({ dni, id_medico, estado, fecha, hora });
  try {
    const medicos = await Medicos.findAll({
      include: [
        {
          model: Horario,
          as: "horario",
        },
      ],
    });
  } catch (error) {}
  if (mensajeAlert.length > 0) {
    return renderForm(res, {
      mensajeAlert,
      alertClass: "alert-danger",
      dni,
      id_medico,
      fecha,
      hora,
      estado,
    });
  }
}
