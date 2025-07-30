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
const { Op } = require("sequelize");
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
    nro_licencia: datos.nro_licencia,
    especialidades: Array.isArray(datos.especialidad) ? datos.especialidad : [],
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
  const regexLicencia = /^\d{1,9}$/;

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
  } //-------------------------------------------------------------------------------
  //-------------------------------------------------------------------------------
  if (!regexLicencia.test(datos.nro_licencia)) {
    errores.push("Número de licencia inválido");
  }
  if (datos.estado != 1 && datos.estado != 2 && datos.estado != 3) {
    errores.push("Estado inválido, debe ser 1 (Activo) - 2 (Inactivo) - ");
  }

  return errores;
}

async function renderME(
  res,
  { datos = {}, mensajeAlert = [], alertClass = "alert-danger" }
) {
  const espec = await Especialidad.findAll({
    attributes: ["nombre"],
  });
  const especialidades = espec.map((e) => e.nombre);

  //cuando la cadena esta vacia, se convierte en un array vacio
  if (Array.isArray(datos.especialidad)) {
    datos.especialidad = datos.especialidad.length
      ? datos.especialidad.join(", ")
      : "";
  }

  res.render("admin/medico", {
    datos,
    especialidades,
    mensajeAlert,
    alertClass,
  });
}

async function getME(req, res) {
  const dni = req.query.dni;

  if (dni === undefined) {
    return renderME(res, { datos: {} });
  }
  if (dni === "") {
    return renderME(res, {
      datos: {},
      mensajeAlert: ["DNI no puede estar vacío"],
      alertClass: "alert-danger",
    });
  }
  const regexDni = /^[0-9]{7,8}$/;
  if (!regexDni.test(dni)) {
    return renderME(res, {
      datos: { dni },
      mensajeAlert: ["DNI inválido, debe tener 7 u 8 dígitos"],
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
        datos: {},
        mensajeAlert: ["No se encontró un médico/enfermero con ese DNI"],
        alertClass: "alert-warning",
      });
    }
    if (
      !persona.empleado ||
      (persona.empleado.id_rol !== 3 && persona.empleado.id_rol !== 4)
    ) {
      return renderME(res, {
        datos: {},
        mensajeAlert: [
          "El DNI ingresado no corresponde a un médico o enfermero",
        ],
        alertClass: "alert-warning",
      });
    }
    const Model = persona.empleado.id_rol === 3 ? Medico : Enfermero;
    const profesional = await Model.findOne({
      where: { id_empleado: persona.empleado.id_empleado },
      include: [
        {
          model: Especialidad,
          as: "especialidades",
          attributes: ["nombre"],
          through: { attributes: [] },
        },
      ],
    });
    const especialidad =
      profesional?.especialidades?.map((e) => e.nombre).join(", ") || "";

    const datos = {
      id_persona: persona.id_persona,
      dni: persona.dni,
      nombre: persona.nombre,
      apellido: persona.apellido,
      f_nacimiento: persona.f_nacimiento,
      genero: persona.genero,
      telefono: persona.telefono,
      mail: persona.mail,
      fecha_ingreso: persona.empleado.fecha_ingreso,
      id_rol: persona.empleado.id_rol,
      estado: persona.empleado.estado,
      nro_licencia: profesional?.nro_licencia || "",
      especialidad,
    };
    return renderME(res, { datos });
  } catch (error) {
    console.error(error);
    return await renderME(res, {
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
      datos: {},
      mensajeAlert: ["Acción no válida"],
      alertClass: "alert-danger",
    });
  }
}
async function crearME(req, res) {
  const datos = req.body;
  datos.especialidad = JSON.parse(req.body.especialidad);
  const errores = validator(datos);
  if (errores.length > 0) {
    return await renderME(res, {
      datos,
      mensajeAlert: errores,
      alertClass: "alert-danger",
    });
  }
  // No hay errores por ahora
  const t = await sequelize.transaction();
  try {
    let personaCreada = await Persona.findOne({
      where: { dni: datos.dni },
      transaction: t,
    });
    if (!personaCreada) {
      // Si no se encontró la persona, se crea una nueva
      personaCreada = await Persona.create(
        {
          dni: datos.dni,
          nombre: datos.nombre,
          apellido: datos.apellido,
          f_nacimiento: datos.f_nacimiento,
          genero: datos.genero,
          telefono: datos.telefono,
          mail: datos.mail,
        },
        { transaction: t }
      );
    }
    const empleadoExiste = await Empleado.findOne({
      where: { id_persona: personaCreada.id_persona },
      transaction: t,
    });
    if (empleadoExiste) {
      await t.rollback();
      return await renderME(res, {
        datos,
        mensajeAlert: "Ya existe un empleado con ese DNI",
        alertClass: "alert-danger",
      });
    }
    const empleadoCreado = await Empleado.create(
      {
        id_persona: personaCreada.id_persona,
        id_rol: datos.id_rol,
        fecha_ingreso: datos.fecha_ingreso,
        estado: datos.estado,
      },
      { transaction: t }
    );
    // Gestion de especialidades
    const idsEpec = await especialidadesME(datos.especialidad);
    const Modele = datos.id_rol === 3 ? Medico : Enfermero;
    const profesional = await Modele.create(
      {
        id_empleado: empleadoCreado.id_empleado,
        nro_licencia: datos.nro_licencia,
        estado: datos.estado,
      },
      { transaction: t }
    );
    if (idsEpec && idsEpec.length > 0) {
      await profesional.addEspecialidades(idsEpec, { transaction: t });
    }
    await t.commit();
    return await renderME(res, {
      mensajeAlert: "Médico/enfermero creado exitosamente",
      alertClass: "alert-success",
    });
  } catch (error) {
    await t.rollback();
    console.error(error);
    return await renderME(res, {
      datos,
      mensajeAlert: "Ocurrió un error al crear el médico/enfermero.",
      alertClass: "alert-danger",
    });
  }
}
async function modificarME(req, res) {
  const datos = req.body;
  datos.especialidad = JSON.parse(req.body.especialidad);
  const errores = validator(datos);
  if (errores.length > 0) {
    return await renderME(res, {
      datos,
      mensajeAlert: errores,
      alertClass: "alert-danger",
    });
  }
  const t = await sequelize.transaction();
  try {
    const persona = await Persona.findOne({
      where: { dni: datos.dni },
      transaction: t,
    });
    if (!persona) {
      await t.rollback();
      return await renderME(res, {
        datos,
        mensajeAlert: ["No se encontró una persona con ese DNI."],
        alertClass: "alert-danger",
      });
    }
    const empleado = await Empleado.findOne({
      where: { id_persona: persona.id_persona },
      transaction: t,
    });
    if (!empleado) {
      await t.rollback();
      return await renderME(res, {
        datos,
        mensajeAlert: ["No se encontró un empleado asociado a esa persona."],
        alertClass: "alert-danger",
      });
    }
    const Model = datos.id_rol == 3 ? Medico : Enfermero;
    const profesional = await Model.findOne({
      where: { id_empleado: empleado.id_empleado },
      transaction: t,
    });
    if (!profesional) {
      await t.rollback();
      return await renderME(res, {
        datos,
        mensajeAlert: [
          "No se encontró el registro profesional (médico/enfermero).",
        ],
        alertClass: "alert-danger",
      });
    }
    // Asociar especialidades
    const idsEpec = await especialidadesME(datos.especialidad);
    await profesional.setEspecialidades(idsEpec, { transaction: t });
    // Actualizar datos
    persona.dni = datos.dni;
    persona.nombre = datos.nombre;
    persona.apellido = datos.apellido;
    persona.f_nacimiento = datos.f_nacimiento;
    persona.genero = datos.genero;
    persona.telefono = datos.telefono;
    persona.mail = datos.mail;
    empleado.fecha_ingreso = datos.fecha_ingreso;
    empleado.id_rol = datos.id_rol;
    empleado.estado = datos.estado;
    profesional.nro_licencia = datos.nro_licencia;
    profesional.estado = datos.estado;
    await persona.save({ transaction: t });
    await empleado.save({ transaction: t });
    await profesional.save({ transaction: t });
    await t.commit();
    return await renderME(res, {
      mensajeAlert: "Médico/enfermero modificado exitosamente",
      alertClass: "alert-success",
    });
  } catch (error) {
    console.error(error);
    await t.rollback();
    return await renderME(res, {
      datos,
      mensajeAlert: "Ocurrió un error al modificar el médico/enfermero.",
      alertClass: "alert-danger",
    });
  }
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
