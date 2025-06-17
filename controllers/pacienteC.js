const {
  Paciente,
  ObraSocial,
  Persona,
  Admision,
  Turno,
  Medico,
  HorarioTurno,
} = require("../models/init");
const sequelize = require("../models/db");
const { Op } = require("sequelize");
async function ObS() {
  const obras = await ObraSocial.findAll({
    attributes: ["id_obra_social", "nombre"],
    where: { estado: 1 },
  });
  return obras.map((os) => ({ id: os.id_obra_social, nombre: os.nombre }));
}

function validarDatos(data, esEmergencia = false) {
  data = typeof data === "object" && data !== null ? data : {};

  const errores = [];
  const {
    dni,
    nombre,
    apellido,
    f_nacimiento,
    genero,
    telefono,
    mail,
    contacto,
    direccion,
    id_obra_social,
    cod_os,
    detalle,
  } = data;
  const regexName = /^[a-zA-Z\s]+$/;
  const regexDni = /^\d{7,8}$/;
  const regexTelefono = /^\d{10}$/;
  const regexEmail = /^([a-zA-Z0-9._-]+)@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const regexCodOs = /^\d{6}$/;

  const obligatorios = {
    nombre,
    apellido,
    f_nacimiento,
    genero,
    direccion,
    id_obra_social,
  };
  const nombresVisibles = {
    nombre: "Nombre",
    apellido: "Apellido",
    f_nacimiento: "Fecha de nacimiento",
    genero: "Género",
    direccion: "Dirección",
    id_obra_social: "Obra social",
  };
  if (!esEmergencia && !dni) {
    errores.push("Dni es obligatorio");
  }
  for (let obli in obligatorios) {
    if (!obligatorios[obli]) {
      errores.push(`${nombresVisibles[obli]} es obligatorio`);
    }
  }

  if (!esEmergencia && dni && !regexDni.test(dni)) {
    errores.push("Dni debe tener 7 u 8 digitos");
  }

  if (nombre && (nombre.length < 2 || !regexName.test(nombre))) {
    errores.push(
      "Nombre invalido, pon mas de 3 caracteres y tu nombre no debe tener numeros"
    );
  }
  if (apellido && (apellido.length < 2 || !regexName.test(apellido))) {
    errores.push(
      "Apellido invalido, pon mas de 3 caracteres y tu apellido no debe tener numeros"
    );
  }

  const fechaN = new Date(f_nacimiento);
  if (isNaN(fechaN.getTime())) {
    errores.push("Fecha nacimiento no valida");
  } else if (fechaN >= new Date()) {
    errores.push("Cambia la fecha de nacimiento,¿Como naciste en el futuro?");
  }

  if (genero !== "Femenino" && genero !== "Masculino" && genero !== "Otro") {
    errores.push("Genero invalido");
  }

  if (telefono && !regexTelefono.test(telefono)) {
    errores.push("Telefono debe tener 10 digitos, solo numeros");
  }
  if (contacto && !regexTelefono.test(contacto)) {
    errores.push("El telefono de contacto debe tener 10 digitos, solo numeros");
  }
  if (mail && !regexEmail.test(mail)) {
    errores.push("Email invalido, asi deberia ser jorgepower@gmail.com");
  }
  if (id_obra_social && id_obra_social !== 1) {
    if (cod_os && !regexCodOs.test(cod_os)) {
      errores.push(
        "El numero de obra social debe tener 6 digitos,solo numeros"
      );
    }
  }
  if (detalle && detalle.length > 255) {
    errores.push("Detalle muy largo(mucho texto)");
  }

  return errores;
}

// renderiza formulario crear/modificar
async function renderForm(res, vari) {
  vari = typeof vari === "object" && vari !== null ? vari : {};

  const obras = await ObS();
  const datos = {
    arregloObraSociales: obras,
    mensajeAlert: vari.mensajeAlert || [],
    alertClass: vari.alertClass || "alert-danger",
    paciente: vari.paciente || {},
    dniEmergencia: vari.dniEmergencia || null,
    modificar: vari.modificar || false,
  };
  return res.render("admision/crearPaciente", datos);
}

// GET crearPacientwe
async function gCrearPaciente(req, res) {
  try {
    const dni = req.query.dni || "";
    const ultima = await Persona.findOne({ order: [["id_persona", "DESC"]] });
    const dniEmergencia = ultima ? ultima.id_persona + 1 : 1;

    if (dni) {
      const persona = await Persona.findOne({
        where: { dni },
        include: [{ model: Paciente, as: "paciente" }],
      });
      if (persona) {
        const paciente = {
          id_persona: persona.id_persona,
          dni: persona.dni !== null ? persona.dni : null,
          nombre: persona.nombre,
          apellido: persona.apellido,
          f_nacimiento: persona.f_nacimiento,
          genero: persona.genero,
          telefono: persona.telefono !== null ? persona.telefono : null,
          mail: persona.mail !== null ? persona.mail : null,
          contacto:
            persona.paciente.contacto !== null
              ? persona.paciente.contacto
              : null,
          direccion: persona.paciente.direccion,
          id_obra_social: persona.paciente.id_obra_social,
          cod_os:
            persona.paciente.cod_os !== null ? persona.paciente.cod_os : null,
          detalle:
            persona.paciente.detalle !== null ? persona.paciente.detalle : null,
        };
        return renderForm(res, {
          paciente,
          modificar: true,
          dniEmergencia,
        });
      }
    }

    return renderForm(res, {
      paciente: { dni },
      modificar: false,
      dniEmergencia,
    });
  } catch (e) {
    return res.redirect("/admision/inicio?error=crear");
  }
}

// POST crearPaciente
async function pCrearPaciente(req, res) {
  const data = req.body;
  const esEmergencia = data.emergencia === "on";
  const errores = validarDatos(data, esEmergencia);
  if (errores.length) {
    return renderForm(res, {
      mensajeAlert: errores,
      paciente: data,
      modificar: false,
    });
  }

  const t = await sequelize.transaction();
  try {
    let persona = await Persona.findOne({
      where: { dni: data.dni },
      transaction: t,
    });
    if (!persona) {
      persona = await Persona.create(
        {
          dni: data.dni,
          nombre: data.nombre,
          apellido: data.apellido,
          f_nacimiento: data.f_nacimiento,
          genero: data.genero,
          telefono: data.telefono || null,
          mail: data.mail || null,
        },
        { transaction: t }
      );
    } else {
      const existePaciente = await Paciente.findOne({
        where: { id_persona: persona.id_persona },
        transaction: t,
      });
      if (existePaciente) {
        await t.rollback();
        return renderForm(res, {
          mensajeAlert: ["Ya Existe Paciente"],
          paciente: data,
          modificar: true,
        });
      }
    }

    await Paciente.create(
      {
        id_persona: persona.id_persona,
        direccion: data.direccion,
        contacto: data.contacto || null,
        id_obra_social: data.id_obra_social,
        cod_os: data.cod_os || null,
        detalle: data.detalle || null,
      },
      { transaction: t }
    );

    await t.commit();
    return res.redirect("/admision/check?etapa=crear&navbar=gestionPaciente");
  } catch (e) {
    await t.rollback();

    return res.redirect("/admision/inicio?error=crear");
  }
}

// POST modificarPaciente
async function pModificarPaciente(req, res) {
  const data = req.body;
  const errores = validarDatos(data, false);
  if (errores.length) {
    return renderForm(res, {
      mensajeAlert: errores,
      paciente: data,
      modificar: true,
    });
  }

  const t = await sequelize.transaction();
  try {
    const persona = await Persona.findOne({
      where: { id_persona: data.id_persona },
      include: [{ model: Paciente, as: "paciente" }],
      transaction: t,
    });
    if (!persona || !persona.paciente) {
      await t.rollback();
      return renderForm(res, {
        mensajeAlert: ["Paciente No Existe"],
        paciente: data,
        modificar: true,
      });
    }

    await persona.update(
      {
        dni: data.dni,
        nombre: data.nombre,
        apellido: data.apellido,
        f_nacimiento: data.f_nacimiento,
        genero: data.genero,
        telefono: data.telefono || null,
        mail: data.mail || null,
      },
      { transaction: t }
    );

    await persona.paciente.update(
      {
        direccion: data.direccion,
        contacto: data.contacto || null,
        id_obra_social: data.id_obra_social,
        cod_os: data.cod_os || null,
        detalle: data.detalle || null,
      },
      { transaction: t }
    );

    await t.commit();
    return renderForm(res, {
      mensajeAlert: ["Modificacion Exitosa"],
      alertClass: "alert-success",
      paciente: data,
      modificar: true,
    });
  } catch (e) {
    await t.rollback();

    return res.redirect("/admision/inicio?error=modificar");
  }
}
//+GET para listar todos los pacientes activos
async function listarPacientes(req, res) {
  try {
    const personas = await Persona.findAll({
      include: [
        {
          model: Paciente,
          as: "paciente",
          required: true,
          include: [
            {
              model: ObraSocial,
              as: "obraSocial",
              required: false,
            },
          ],
        },
      ],
      order: [["apellido", "ASC"]],
    });

    const pacientes = personas.map((persona) => ({
      id_persona: persona.id_persona,
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
      obra_social: persona.paciente.obraSocial
        ? persona.paciente.obraSocial.nombre
        : "",
      cod_os: persona.paciente.cod_os,
      detalle: persona.paciente.detalle,
    }));

    res.render("admision/listaPaciente", { pacientes });
  } catch (error) {
    res.render("admision/listaPaciente", {
      pacientes: [],
      mensajeAlert: "Error al cargar los pacientes",
      alertClass: "alert-danger",
    });
  }
}
async function busquedaApi(req, res) {
  const dni = req.query.dni;

  if (!dni) {
    return res.status(400).json({ error: "Falta el parámetro dni" });
  }

  try {
    const personaConPaciente = await Persona.findOne({
      where: { dni: dni },
      include: [{ model: Paciente, as: "paciente" }],
    });

    if (!personaConPaciente) {
      return res.status(404).json({ mensaje: "Paciente no encontrado" });
    }

    const paciente = {
      id_persona: personaConPaciente.id_persona,
      dni: personaConPaciente.dni,
      nombre: personaConPaciente.nombre,
      apellido: personaConPaciente.apellido,
      f_nacimiento: personaConPaciente.f_nacimiento,
      genero: personaConPaciente.genero,
      telefono: personaConPaciente.telefono || "",
      mail: personaConPaciente.mail || "",
      contacto: personaConPaciente.paciente?.contacto || "",
      direccion: personaConPaciente.paciente?.direccion || "",
      id_obra_social: personaConPaciente.paciente?.id_obra_social || "",
      cod_os: personaConPaciente.paciente?.cod_os || "",
      detalle: personaConPaciente.paciente?.detalle || "",
      estado: personaConPaciente.paciente?.estado ?? true,
    };

    return res.json({ paciente });
  } catch (error) {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
//* GET para listar turnos
async function listaTurnos(req, res) {
  try {
    const turnos = await Turno.findAll({
      attributes: [
        "id_turno",
        "id_paciente",
        "id_medico",
        "id_horario_turno",
        "fecha",
        "estado",
      ],
      include: [
        {
          model: Paciente,
          as: "paciente",
          attributes: ["id_persona"],

          include: [
            {
              model: Persona,
              as: "persona",
              attributes: ["nombre", "apellido", "dni"],
            },
          ],
        },
        {
          model: Medico,
          as: "medico",
          attributes: ["id_persona"],
          include: [
            {
              model: Persona,
              as: "persona",
              attributes: ["nombre", "apellido"],
            },
          ],
        },
        {
          model: HorarioTurno,
          as: "horarioTurno",
          attributes: ["hora"],
        },
      ],
    });

    return res.render("admision/listaTurnos", { turnos });
  } catch (error) {
    return res.render("admision/listaTurnos", {
      turnos: [],
      mensajeAlert: "Error al cargar los turnos",
      alertClass: "alert-danger",
    });
  }
}

module.exports = {
  gCrearPaciente,
  pCrearPaciente,
  pModificarPaciente,
  listarPacientes,
  busquedaApi,
  listaTurnos,
};
