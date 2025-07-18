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
    !medico.nro_licencia ||
    !especialidad ||
    !estado
  ) {
    errores.push("Completen los datos obligatorios(*)");
    return errores;
  }
  const regexDni = /^[0-9]{7,8}$/;
  const regexNombre = /^[a-zA-Z\s]+$/;
  const regexTelefono = /^\d{10}$/;
  const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const regexLicencia = /^\d{1,9}$/;

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

  if (
    persona.genero !== "Femenino" &&
    persona.genero !== "Masculino" &&
    persona.genero !== "Otro"
  ) {
    errores.push("Genero invalido");
  }
  if (persona.telefono && !regexTelefono.test(persona.telefono)) {
    errores.push("Telefono debe tener 10 digitos, solo numeros");
  }
  if (!regexEmail.test(persona.mail)) {
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

  if (empleado.id_rol != 3 && empleado.id_rol != 4) {
    errores.push("Rol inválido");
  } //-------------------------------------------------------------------------------
  //-------------------------------------------------------------------------------
  if (!regexLicencia.test(medico.nro_licencia)) {
    errores.push("Número de licencia inválido");
  }
  if (estado != 1 && estado != 2 && estado != 3) {
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
  console.log("renderME");

  console.log(especialidad, typeof especialidad);
  let valen = Array.isArray(especialidad)
    ? especialidad.map((e) => e.trim()).join(", ")
    : (especialidad ?? "").toString();

  res.render("admin/medico", {
    persona,
    empleado,
    medico,
    especialidad: valen,
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
    let profesional = null;
    if (persona.empleado.id_rol == 3) {
      profesional = await Medico.findOne({
        where: { id_empleado: persona.empleado.id_empleado },
        include: [
          {
            model: Especialidad,
            as: "especialidades",
            through: { attributes: [] },
          },
        ],
      });
    } else if (persona.empleado.id_rol == 4) {
      profesional = await Enfermero.findOne({
        where: { id_empleado: persona.empleado.id_empleado },
        include: [
          {
            model: Especialidad,
            as: "especialidades",
            through: { attributes: ["nombre"] },
          },
        ],
      });
    }

    return renderME(res, {
      persona,
      empleado: persona.empleado,
      medico: profesional,
      especialidad:
        profesional?.especialidades?.map((e) => e.nombre).join(", ") || "",
    });
  } catch (error) {
    console.error(error);
    return renderME(res, {
      mensajeAlert: "Ocurrió un error al buscar el médico/enfermero.",
      alertClass: "alert-danger",
    });
  }
}
async function postME(req, res) {
  const { accion } = req.body;
  if (accion === "crear") {
    return crearME(req, res);
  } else if (accion === "modificar") {
    return modificarME(req, res);
  } else {
    return await renderME(res, {
      mensajeAlert: "Acción no válida",
      alertClass: "alert-danger",
    });
  }
}
async function crearME(req, res) {
  const {
    dni,
    nombre,
    apellido,
    f_nacimiento,
    genero,
    telefono,
    mail,
    fecha_ingreso,
    id_rol,

    nro_licencia,
    estado,
  } = req.body;
  const especialidad = JSON.parse(req.body.especialidad);

  const persona = {
    dni,
    nombre,
    apellido,
    f_nacimiento,
    genero,
    telefono,
    mail,
  };
  const empleado = {
    fecha_ingreso,
    id_rol,
  };
  const medico = {
    nro_licencia,
    estado,
  };
  const errores = validator(persona, empleado, medico, especialidad, estado);
  if (errores.length > 0) {
    return renderME(res, {
      persona,
      empleado,
      medico,
      especialidad,
      mensajeAlert: errores,
      alertClass: "alert-danger",
    });
  }
  console.log("crear");

  console.log(especialidad, typeof especialidad);

  // No hay errores por ahora
  try {
    let personaCreada = await Persona.findOne({
      where: { dni: persona.dni },
    });
    if (!personaCreada) {
      // Si no se encontró la persona, se crea una nueva
      personaCreada = await Persona.create(persona);
    }

    const empleadoExiste = await Empleado.findOne({});
    if (empleadoExiste) {
      return renderME(res, {
        persona,
        empleado,
        medico,
        especialidad,
        mensajeAlert: "Ya existe un empleado con ese DNI",
        alertClass: "alert-danger",
      });
    }
    const empleadoCreado = await Empleado.create({
      id_persona: personaCreada.id_persona,
      id_rol: empleado.id_rol,
      fecha_ingreso: empleado.fecha_ingreso,
    });
    // Gestion de especialidades
    const idsEpec = await especialidadesME(especialidad);
    let profesional = null;
    if (id_rol == 3) {
      profesional = await Medico.create({
        id_empleado: empleadoCreado.id_empleado,
        nro_licencia: medico.nro_licencia,
        estado: medico.estado,
      });
    } else if (id_rol == 4) {
      profesional = await Enfermero.create({
        id_empleado: empleadoCreado.id_empleado,
        nro_licencia: medico.nro_licencia,
        estado: medico.estado,
      });
    }
    if (idsEpec && idsEpec.length > 0) {
      await profesional.addEspecialidades(idsEpec);
    }
    return renderME(res, {
      mensajeAlert: "Médico/enfermero creado exitosamente",
      alertClass: "alert-success",
    });
  } catch (error) {
    console.error(error);
    return renderME(res, {
      persona,
      empleado,
      medico,
      especialidad,
      mensajeAlert: "Ocurrió un error al crear el médico/enfermero.",
      alertClass: "alert-danger",
    });
  }
}
async function modificarME(req, res) {
  const {
    id,
    dni,
    nombre,
    apellido,
    f_nacimiento,
    genero,
    telefono,
    mail,
    fecha_ingreso,
    id_rol,
    especialidad,
    nro_licencia,
    estado,
  } = req.body;
}
async function especialidadesME(especialidad) {
  if (especialidad && especialidad.length > 0) {
    // 1. Traer todas las especialidades existentes
    const especialidadesBD = await Especialidad.findAll({
      attributes: ["id_especialidad", "nombre"],
    });
    const nombresExistentes = especialidadesBD.map((e) => e.nombre);

    // 2. Filtrar las nuevas (no existen en la BD)
    const nuevas = especialidad.filter((e) => !nombresExistentes.includes(e));

    // 3. Crear las nuevas especialidades
    for (const nombre of nuevas) {
      await Especialidad.create({ nombre });
    }

    // 4. Buscar todas las especialidades (viejas y nuevas) por nombre
    const todas = await Especialidad.findAll({
      where: { nombre: especialidad },
      attributes: ["id_especialidad", "nombre"],
    });

    // 5. Devolver solo los IDs
    return todas.map((e) => e.id_especialidad);
  }
  return [];
}
module.exports = { getME, crearME, modificarME, postME };
