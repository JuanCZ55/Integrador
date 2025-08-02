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
async function renderAdA(
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
    return renderAdA(res, {});
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
      return await renderAdA(res, {
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
      return await renderAdA(res, {
        datos: {},
        mensajeAlert: [
          `Ese empleado es de tipo ${
            datos.id_rol === 3 ? "Medico" : "Enfermero"
          }, deberias usar la de Gestion Profesional`,
        ],
        alertClass: "alert-warning",
      });
    }
    return await renderAdA(res, {
      datos: datos,
    });
  } catch (error) {
    console.error("Error al obtener los empleados:", error);
    return await renderAdA(res, {
      datos: {},
      mensajeAlert: ["Error al obtener los empleados"],
      alertClass: "alert-danger",
    });
  }
}
async function postAdA(req, res) {
  const datos = req.body;
  const errores = validarDatos(datos);
  try {
    if (errores.length > 0) {
      return await renderAdA(res, {
        datos,
        mensajeAlert: errores,
        alertClass: "alert-danger",
      });
    }
    if (datos.accion === "crear") {
      return await crearAdA(req, res);
    } else if (datos.accion === "modificar") {
      return await modificarAdA(req, res);
    } else {
      return await renderAdA(res, {
        datos: {},
        mensajeAlert: ["Acción no válida"],
        alertClass: "alert-danger",
      });
    }
  } catch (error) {
    console.error("Error al postear el empleado:", error);
    return await renderAdA(res, {
      datos: {},
      mensajeAlert: ["Error al postear el empleado"],
      alertClass: "alert-danger",
    });
  }
}
async function crearAdA(req, res) {
  const datos = req.body;
  const t = await sequelize.transaction();
  try {
    const [persona, personaCreada] = await Persona.findOrCreate({
      where: { dni: datos.dni },
      defaults: {
        dni: datos.dni,
        nombre: datos.nombre,
        apellido: datos.apellido,
        f_nacimiento: datos.f_nacimiento,
        genero: datos.genero,
        telefono: datos.telefono,
        mail: datos.mail,
      },
      transaction: t,
    });
    // Si la persona ya existe, no creamos una nueva, pero actualizamos sus datos
    if (personaCreada) {
      personaCreada.dni = datos.dni;
      personaCreada.nombre = datos.nombre;
      personaCreada.apellido = datos.apellido;
      personaCreada.f_nacimiento = datos.f_nacimiento;
      personaCreada.genero = datos.genero;
      personaCreada.telefono = datos.telefono;
      personaCreada.mail = datos.mail;
      await persona.save();
    }
    const [empleado, empleadoCreado] = await Empleado.findOrCreate({
      where: { id_persona: persona.id_persona },
      defaults: {
        id_persona: persona.id_persona,
        id_rol: datos.id_rol,
        fecha_ingreso: datos.fecha_ingreso,
        estado: datos.estado ?? 1,
      },
      transaction: t,
    });

    if (!empleadoCreado) {
      await t.rollback();
      return await renderAdA(res, {
        datos,
        mensajeAlert: ["Ya existe un empleado con ese DNI"],
        alertClass: "alert-warning",
      });
    }

    await t.commit();
    return await renderAdA(res, {
      datos: {},
      mensajeAlert: ["Empleado creado exitosamente"],
      alertClass: "alert-success",
    });
  } catch (error) {
    await t.rollback();
    console.error("Error al crear persona/empleado:", error);
    return await renderAdA(res, {
      datos,
      mensajeAlert: ["Error al crear persona/empleado"],
      alertClass: "alert-danger",
    });
  }
}
async function modificarAdA(req, res) {}

module.exports = {
  getAA,
  postAdA,
};
