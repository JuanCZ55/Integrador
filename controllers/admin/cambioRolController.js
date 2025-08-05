const { Persona, Empleado, Enfermero, Medico } = require("../../models/init");
const sequelize = require("../../models/db"); // transacciones
function validator(dni, nuevoRol, metodo) {
  const errores = [];

  if (!dni || dni.trim().length === 0) {
    errores.push("El campo DNI es obligatorio.");
  }

  const regexDni = /^[0-9]{7,8}$/;
  if (dni && !regexDni.test(dni)) {
    errores.push("El campo DNI debe contener entre 7 y 8 dígitos.");
  }

  if (metodo === "POST") {
    if (!nuevoRol || nuevoRol.trim().length === 0) {
      errores.push("El campo Nuevo Rol es obligatorio.");
    } else if (
      nuevoRol != 1 &&
      nuevoRol != 2 &&
      nuevoRol != 3 &&
      nuevoRol != 4
    ) {
      errores.push("Rol invalido, seleccione uno.");
    }
  }

  return errores;
}

function renderCambioRol(
  res,
  { dni, nombre, rolActual, nuevoRol, mensajeAlert = [], alertClass = "" }
) {
  return res.render("admin/cambioRol", {
    dni,
    nombre,
    rolActual,
    nuevoRol,
    mensajeAlert,
    alertClass,
  });
}

async function getCR(req, res) {
  const dni = req.query.dni;
  const errores = validator(dni, null, "GET");
  if (errores.length > 0) {
    return renderCambioRol(res, {
      dni,
      mensajeAlert: errores,
      alertClass: "alert-danger",
    });
  }
  if (dni === undefined) {
    return renderCambioRol(res, {});
  }
  try {
    const person = await Persona.findOne({
      where: { dni },
      include: {
        model: Empleado,
        as: "empleado",
      },
    });
    if (!person) {
      return renderCambioRol(res, {
        dni,
        mensajeAlert: ["Empleado no encontrado"],
        alertClass: "alert-warning",
      });
    }
    return renderCambioRol(res, {
      dni: dni,
      nombre: person.nombre + " " + person.apellido,
      rolActual: person.empleado.id_rol,
      nuevoRol: "0",
    });
  } catch (error) {
    console.error("Error al obtener el empleado:", error);
    return renderCambioRol(res, {
      dni,
      mensajeAlert: ["Error al obtener el empleado"],
      alertClass: "alert-danger",
    });
  }
}
async function postCR(req, res) {
  const { dni, nuevoRol } = req.body;
  const errores = validator(dni, nuevoRol, "POST");
  if (errores.length > 0) {
    return renderCambioRol(res, {
      dni,
      nuevoRol,
      mensajeAlert: errores,
      alertClass: "alert-danger",
    });
  }
  try {
    const person = await Persona.findOne({
      where: { dni },
      include: {
        model: Empleado,
        as: "empleado",
      },
    });
    if (!person) {
      return renderCambioRol(res, {
        dni,
        nuevoRol,
        mensajeAlert: ["Empleado no encontrado"],
        alertClass: "alert-warning",
      });
    }
    const rolito = person.empleado.id_rol;
    if (rolito == nuevoRol) {
      return renderCambioRol(res, {
        dni,
        nombre: person.nombre + " " + person.apellido,
        rolActual: person.empleado.id_rol,
        nuevoRol,
        mensajeAlert: ["El empleado ya tiene ese rol"],
        alertClass: "alert-warning",
      });
    }
    if (rolito == 3 || rolito == 4) {
      const profesional = rolito === 3 ? Medico : Enfermero;
      const existeProfesional = await profesional.findOne({
        where: { id_empleado: person.empleado.id_empleado },
      });
      if (existeProfesional) {
        existeProfesional.estado = 2;
        await existeProfesional.save();
      }
    }
    const t = await sequelize.transaction();
  } catch (error) {
    console.error("Error al cambiar el rol del empleado:", error);
    return renderCambioRol(res, {
      dni,
      nuevoRol,
      mensajeAlert: ["Error al cambiar el rol del empleado"],
      alertClass: "alert-danger",
    });
  }
}
module.exports = {
  getCR,
};
