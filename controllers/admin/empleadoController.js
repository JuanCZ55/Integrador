const {
  Persona,
  Medico,
  Enfermero,
  Horario,
  Empleado,
  Especialidad,
  Rol,
  Usuario,
} = require("../../models/init");
const sequelize = require("../../models/db"); // transacciones
function validator(datos) {
  const errores = [];
  const camposObligatorios = {
    dni: datos.dni,
    nombre: datos.nombre,
    apellido: datos.apellido,
    f_nacimiento: datos.f_nacimiento,
    genero: datos.genero,
    telefono: datos.telefono,
    mail: datos.mail,
    fecha_ingreso: datos.fecha_ingreso,
    id_rol: datos.id_rol,
    estado: datos.estado,
  };

  for (const campo in camposObligatorios) {
    if (!camposObligatorios[campo] || camposObligatorios[campo].length === 0) {
      errores.push(`El campo ${campo.replace("_", " ")} es obligatorio.`);
    }
  }
  if (errores.length > 0) {
    return errores;
  }
  const regexDni = /^[0-9]{7,8}$/;
  const regexNombre = /^[a-zA-Z\s]+$/;
  const regexTelefono = /^\d{10}$/;
  const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!regexDni.test(datos.dni)) {
    errores.push("DNI inválido, debe tener 7 u 8 dígitos");
  }
  if (!regexNombre.test(datos.nombre)) {
    errores.push("Nombre inválido, solo se permiten letras");
  }
  if (!regexNombre.test(datos.apellido)) {
    errores.push("Apellido inválido, solo se permiten letras");
  }
  const fechaN = new Date(datos.f_nacimiento);
  if (isNaN(fechaN.getTime())) {
    errores.push("Fecha nacimiento no valida");
  } else if (fechaN >= new Date()) {
    errores.push("Cambia la fecha de nacimiento,¿Como naciste en el futuro?");
  }

  if (
    datos.genero !== "Femenino" &&
    datos.genero !== "Masculino" &&
    datos.genero !== "Otro"
  ) {
    errores.push("Genero invalido");
  }
  if (datos.telefono && !regexTelefono.test(datos.telefono)) {
    errores.push("Telefono debe tener 10 digitos, solo numeros");
  }
  if (!regexEmail.test(datos.mail)) {
    errores.push("Email invalido, asi deberia ser jorgepower@gmail.com");
  }
  //-------------------------------------------------------------------------------
  const fechaIngreso = new Date(datos.fecha_ingreso);
  if (isNaN(fechaIngreso.getTime())) {
    errores.push("Fecha de ingreso no valida");
  } else if (fechaIngreso > new Date()) {
    errores.push(
      "Cambia la fecha de ingreso, ¿como entraste a trabajar en el futuro?"
    );
  }

  if (datos.id_rol != 3 && datos.id_rol != 4) {
    errores.push("Rol inválido");
  }
  if (datos.estado != 1 && datos.estado != 2 && datos.estado != 3) {
    errores.push("Estado inválido, debe ser 1 (Activo) - 2 (Inactivo) - ");
  }
  return errores;
}
async function renderME(
  res,
  { datos = {}, mensajeAlert = [], alertClass = "" }
) {
  return res.render("admin/empleado", {
    datos,
    mensajeAlert,
    alertClass,
  });
}
async function getAA(req, res) {
  const dni = req.query.dni;
  if (dni === undefined) {
    return renderME(res, {});
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
      return await renderME(res, {
        datos: { dni },
        mensajeAlert: ["Empleado no encontrado"],
        alertClass: "alert-warning",
      });
    }

    const datos = {
      dni: person.dni,
      nombre: person.nombre,
      apellido: person.apellido,
      f_nacimiento: person.f_nacimiento,
      genero: person.genero,
      telefono: person.telefono,
      mail: person.mail,
      fecha_ingreso: person.empleado.fecha_ingreso,
      id_rol: person.empleado.id_rol,
      estado: person.estado,
    };
    if (datos.id_rol == 3 || datos.id_rol == 4) {
      return await renderME(res, {
        datos: {},
        mensajeAlert: [
          `Ese empleado es de tipo ${
            datos.id_rol === 3 ? "Medico" : "Enfermero"
          }, deberias usar la de Gestion Profesional`,
        ],
        alertClass: "alert-warning",
      });
    }
    return await renderME(res, {
      datos: datos,
    });
  } catch (error) {
    console.error("Error al obtener los empleados:", error);
    return await renderME(res, {
      datos: {},
      mensajeAlert: ["Error al obtener los empleados"],
      alertClass: "alert-danger",
    });
  }
}
module.exports = {
  getAA,
};
