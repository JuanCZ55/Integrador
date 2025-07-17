const {
  Persona,
  Medico,
  Enfermero,
  Horario,
  Empleado,
  Especialidad,
  Rol,
  MedicoEspecialidad,
  Usuario,
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
    errores.push("Completen los datos obligatorios(*)");
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
  const fechaIngreso = new Date(empleado.fecha_ingreso);
  if (isNaN(fechaIngreso.getTime())) {
    errores.push("Fecha de ingreso no valida");
  } else if (fechaIngreso > new Date()) {
    errores.push(
      "Cambia la fecha de ingreso, ¿como entraste a trabajar en el futuro?"
    );
  }

  if (empleado.id_rol !== 3 && empleado.id_rol !== 4) {
    errores.push("Rol inválido");
  }
  //-------------------------------------------------------------------------------
  if (!regexDni.test(medico.matricula)) {
    errores.push("Matrícula inválida");
  }
  if (estado !== 1 && estado !== 2) {
    errores.push("Estado inválido, debe ser 1 (Activo) o 2 (Inactivo)");
  }
  return errores;
}
async function renderME(
  res,
  { persona, empleado, medico, especialidad, mensajeAlert, alertClass }
) {
  const espec = await Especialidad.findAll({
    attributes: ["nombre"],
  });
  const especialidades = espec.map((e) => e.nombre);

  res.render("admin/medico", {
    persona,
    empleado,
    medico,
    especialidad,
    especialidades,
    mensajeAlert,
    alertClass,
  });
}

async function getME(req, res) {
  const dni = req.query.dni;

  if (dni === undefined) {
    return renderME(res, {});
  } else if (dni === "") {
    return renderME(res, {
      mensajeAlert: "DNI no puede estar vacío",
      alertClass: "alert-danger",
    });
  }
  const regexDni = /^[0-9]{7,8}$/;
  if (!regexDni.test(dni)) {
    return renderME(res, {
      mensajeAlert: "DNI inválido, debe tener 7 u 8 dígitos",
      alertClass: "alert-danger",
    });
  }
  try {
    const persona = await Persona.findOne({
      where: { dni: dni },
      include: [
        {
          model: Empleado,
          as: "empleado",
        },
      ],
    });

    if (!persona) {
      return renderME(res, {
        mensajeAlert: "No se encontró un médico/enfermero con ese DNI",
        alertClass: "alert-danger",
      });
    }
    if (
      !persona.empleado ||
      (persona.empleado.id_rol !== 3 && persona.empleado.id_rol !== 4)
    ) {
      return renderME(res, {
        mensajeAlert: "El DNI ingresado no corresponde a un médico o enfermero",
        alertClass: "alert-danger",
      });
    }
    let empleado = null;
    if (persona.empleado.id_rol === 3) {
      empleado = await Medico.findOne({
        where: { id_empleado: persona.empleado.id_empleado },
        include: [
          {
            model: Especialidad,
            as: "especialidades",
            through: { attributes: [] },
          },
        ],
      });
    } else if (persona.empleado.id_rol === 4) {
      empleado = await Enfermero.findOne({
        where: { id_empleado: persona.empleado.id_empleado },
        include: [
          {
            model: Especialidad,
            as: "especialidades",
            through: { attributes: [] },
          },
        ],
      });
    }
    console.log(empleado, persona);

    return renderME(res, {
      persona,
      empleado: persona.empleado,
      medico: empleado,
      especialidad:
        empleado?.especialidades?.map((e) => e.nombre).join(", ") || "",
    });
  } catch (error) {
    console.error(error);
    return renderME(res, {
      mensajeAlert: "Ocurrió un error al buscar el médico/enfermero.",
      alertClass: "alert-danger",
    });
  }
}
async function crearME(req, res) {}
async function modificarME(req, res) {}

module.exports = { getME, crearME, modificarME };
