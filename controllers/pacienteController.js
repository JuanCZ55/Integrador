const {
  Paciente,
  ObraSocial,
  Persona,
  Admision,
  Turno,
} = require("../models/init");
const sequelize = require("../models/db");
const { Op } = require("sequelize");
//!nota hacer uso de ObS y poner trycatch
//+post para crear un paciente
async function controlCrearPaciente(req, res) {
  const {
    emergencia,
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
  } = { ...req.body };
  console.log("estoy en controlCrearPaciente: " + req.body);
  console.log("emergencia:", emergencia);

  let mensajeAlert = [];
  const regexName = /^[a-zA-Z\s]+$/;
  const regexDni = /^\d{7,8}$/;
  const regexTelefono = /^\d{10}$/;
  const regexEmail = /^([a-zA-Z0-9._-]+)@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  let arrObra = [];
  let dniEmergencia = null;
  try {
    arrObra = await ObS();
    const ultimaPersona = await Persona.findOne({
      order: [["id_persona", "DESC"]],
    });
    dniEmergencia = ultimaPersona ? ultimaPersona.id_persona + 1 : 1;
  } catch (error) {
    console.error("Error al obtener las obras sociales:", error);
    return res.redirect("/admision/inicio?error=obrasSociales");
  }
  // Validar campos obligatorios
  if (
    !dni ||
    !nombre ||
    !apellido ||
    !f_nacimiento ||
    !genero ||
    !direccion ||
    !id_obra_social
  ) {
    return res.render("admision/crearPaciente", {
      mensajeAlert: "Por favor llene todos los campos obligatorios(*)",
      paciente: req.body,
      arregloObraSociales: arrObra || [],
      alertClass: "alert-danger",
      dniEmergencia: dniEmergencia, // Para mostrar el DNI de emergencia
      modificar: false, // Indica que se quiere crear un nuevo paciente
    });
  }

  // Validaciones especificas
  //dni
  if (!emergencia) {
    if (!regexDni.test(dni)) {
      mensajeAlert.push("El DNI debe tener entre 7 y 8 dígitos");
    }
    //cod_os
    if (cod_os && cod_os.length < 3) {
      mensajeAlert.push(
        "El código de la obra social debe tener al menos 3 caracteres"
      );
    }
  }
  //nombre
  if (nombre.length < 3 || !regexName.test(nombre)) {
    mensajeAlert.push(
      "El nombre debe tener al menos 3 caracteres y solo puede contener letras y espacios"
    );
  }
  //apellido
  if (apellido.length < 3 || !regexName.test(apellido)) {
    mensajeAlert.push(
      "El apellido debe tener al menos 3 caracteres y solo puede contener letras y espacios"
    );
  }
  //f_nacimiento
  if (f_nacimiento >= new Date()) {
    mensajeAlert.push("La fecha de nacimiento no puede ser mayor a la actual");
  }
  //genero
  if (genero !== "femenino" && genero !== "masculino" && genero !== "otro") {
    mensajeAlert.push("El género debe ser 'femenino', 'masculino' u 'otro'");
  }
  //telefono
  if (telefono && !regexTelefono.test(telefono)) {
    mensajeAlert.push("El teléfono debe tener 10 dígitos");
  }
  //contacto
  if (contacto && !regexTelefono.test(contacto)) {
    mensajeAlert.push("El teléfono de contacto debe tener 10 dígitos");
  }
  //mail
  if (mail && !regexEmail.test(mail)) {
    mensajeAlert.push("El email debe ser válido");
  }
  //obra_social
  const obraSocialBuscada = await ObraSocial.findByPk(id_obra_social);
  if (!obraSocialBuscada) {
    mensajeAlert.push(
      "La obra social no existe, por favor seleccione una de la lista"
    );
  }

  //detalle
  if (detalle && detalle.length > 255) {
    mensajeAlert.push("El detalle no puede tener más de 255 caracteres");
  }
  //renderiza la vista con los errores

  if (mensajeAlert.length > 0) {
    return res.render("admision/crearPaciente", {
      mensajeAlert,
      paciente: req.body,
      arregloObraSociales: arrObra,
      alertClass: "alert-danger",
      dniEmergencia: dniEmergencia, // Para mostrar el DNI de emergencia
      modificar: false, // Indica que se quiere crear un nuevo paciente
    });
  }

  // Crear un nuevo paciente y persona en transacción
  const t = await sequelize.transaction();
  try {
    // 1. Buscar persona por DNI
    let persona = await Persona.findOne({ where: { dni }, transaction: t });
    let idPersona;
    if (persona) {
      idPersona = persona.id_persona;
      const pacienteExistente = await Paciente.findOne({
        where: { id_persona: idPersona },
        transaction: t,
      });
      if (pacienteExistente) {
        await t.rollback();
        mensajeAlert.push("Ya hay un paciente con ese DNI");
        return res.render("admision/crearPaciente", {
          mensajeAlert,
          paciente: req.body,
          arregloObraSociales: arrObra || [],
          alertClass: "alert-danger",
          dniEmergencia: dniEmergencia,
          modificar: true,
        });
      }
    } else {
      persona = await Persona.create(
        {
          dni,
          nombre,
          apellido,
          f_nacimiento: f_nacimiento,
          genero,
          telefono,
          mail,
        },
        { transaction: t }
      );
      idPersona = persona.id_persona;
    }
    await Paciente.create(
      {
        id_persona: idPersona,
        contacto,
        direccion,
        id_obra_social,
        cod_os,
        detalle,
      },
      { transaction: t }
    );
    await t.commit();
    return res.redirect("/admision/check?etapa=crear&navbar=gestionPaciente");
  } catch (error) {
    await t.rollback();
    console.error("Error al crear el paciente:", error);
    return res.redirect("/admision/inicio?error=crearPaciente");
  }
}
//+post para modificar un paciente
async function modificarPaciente(req, res) {
  const {
    id_persona,
    dni,
    nombre,
    apellido,
    f_nacimiento,
    genero,
    direccion,
    telefono,
    contacto,
    mail,
    id_obra_social,
    cod_os,
    detalle,
  } = req.body;
  let arrObra = [];
  console.log("estoy en modificarPaciente: " + req.body);

  try {
    arrObra = await ObS();
  } catch (error) {
    console.error("Error al obtener las obras sociales:", error);
    return res.redirect("/admision/inicio?error=obrasSociales");
  }
  let mensajeAlert = [];
  const regexName = /^[a-zA-Z\s]+$/;
  const regexDni = /^\d{7,8}$/;
  const regexTelefono = /^\d{10}$/;
  const regexEmail = /^([a-zA-Z0-9._-]+)@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Validar campos obligatorios
  if (
    !dni ||
    !nombre ||
    !apellido ||
    !f_nacimiento ||
    !genero ||
    !direccion ||
    !id_obra_social
  ) {
    return res.render("admision/crearPaciente", {
      mensajeAlert: "Por favor llene todos los campos obligatorios(*)",
      paciente: req.body,
      arregloObraSociales: arrObra || [],
      alertClass: "alert-danger",
    });
  }

  // Validaciones especificas
  //dni
  if (!regexDni.test(dni)) {
    mensajeAlert.push("El DNI debe tener entre 7 y 8 dígitos");
  }
  //nombre
  if (nombre.length < 3 || !regexName.test(nombre)) {
    mensajeAlert.push(
      "El nombre debe tener al menos 3 caracteres y solo puede contener letras y espacios"
    );
  }
  //apellido
  if (apellido.length < 3 || !regexName.test(apellido)) {
    mensajeAlert.push(
      "El apellido debe tener al menos 3 caracteres y solo puede contener letras y espacios"
    );
  }
  //f_nacimiento
  if (f_nacimiento >= new Date()) {
    mensajeAlert.push("La fecha de nacimiento no puede ser mayor a la actual");
  }
  //genero
  if (genero !== "femenino" && genero !== "masculino" && genero !== "otro") {
    mensajeAlert.push("El género debe ser 'femenino', 'masculino' u 'otro'");
  }
  //telefono
  if (telefono && !regexTelefono.test(telefono)) {
    mensajeAlert.push("El teléfono debe tener 10 dígitos");
  }
  //contacto
  if (contacto && !regexTelefono.test(contacto)) {
    mensajeAlert.push("El teléfono decontacto debe tener 10 dígitos");
  }
  //mail
  if (mail && !regexEmail.test(mail)) {
    mensajeAlert.push("El email debe ser válido");
  }
  //obra_social
  const obraSocialBuscada = await ObraSocial.findByPk(id_obra_social);
  if (!obraSocialBuscada) {
    mensajeAlert.push(
      "La obra social no existe, por favor seleccione una de la lista"
    );
  }
  //cod_os
  if (cod_os && cod_os.length < 3) {
    mensajeAlert.push(
      "El código de la obra social debe tener al menos 3 caracteres"
    );
  }

  //detalle
  if (detalle && detalle.length > 255) {
    mensajeAlert.push("El detalle no puede tener más de 255 caracteres");
  }
  //renderiza la vista con los errores
  if (mensajeAlert.length > 0) {
    return res.status(400).render("admision/crearPaciente", {
      mensajeAlert,
      paciente: req.body,
      arregloObraSociales: arrObra || [],
      alertClass: "alert-danger",
    });
  }
  // Modificar persona y paciente en transacción
  const t = await sequelize.transaction();
  try {
    const persona = await Persona.findOne({
      where: { id_persona },
      include: [
        {
          model: Paciente,
          as: "paciente",
          where: { estado: true },
          required: true,
        },
      ],
      transaction: t,
    });
    if (!persona || !persona.paciente) {
      await t.rollback();
      let mensajeAlert = [];
      mensajeAlert.push("El paciente no esta registrado, por favor creelo");
      return res.render("admision/crearPaciente", {
        dni: dni,
        mensajeAlert,
        arregloObraSociales: arrObra || [],
        alertClass: "alert-danger",
      });
    } else if (persona.paciente.estado === false) {
      await t.rollback();
      let mensajeAlert = [];
      mensajeAlert.push(
        "El paciente está inactivo, por favor informe al administrador para activarlo."
      );
      return res.render("admision/crearPaciente", {
        dni: dni,
        mensajeAlert,
        arregloObraSociales: arrObra || [],
        alertClass: "alert-danger",
      });
    }
    await persona.update(
      {
        nombre,
        apellido,
        f_nacimiento: f_nacimiento,
        genero,
        telefono,
        mail,
      },
      { transaction: t }
    );
    await persona.paciente.update(
      {
        direccion,
        contacto: contacto,
        id_obra_social: obraSocialBuscada.id_obra_social,
        cod_os: cod_os || null,
        detalle,
      },
      { transaction: t }
    );
    await t.commit();
    let mensajeAlert = [];
    mensajeAlert.push("Paciente modificado exitosamente");
    return res.render("admision/crearPaciente", {
      mensajeAlert,
      arregloObraSociales: arrObra || [],
      alertClass: "alert-success",
    });
  } catch (error) {
    await t.rollback();
    console.error("Error al modificar el paciente:", error);
    return res.redirect("/admision/inicio?error=modificar");
  }
}
//+get para renderizar la vista de crear paciente
async function gcrearPaciente(req, res) {
  const { dni } = req.query;
  console.log("estoy en gcrearPAciente" + dni);
  let dniEmergencia = null;
  let arrObra = [];
  try {
    arrObra = await ObS();
    const ultimaPersona = await Persona.findOne({
      order: [["id_persona", "DESC"]],
    });
    dniEmergencia = ultimaPersona ? ultimaPersona.id_persona : 0;
    dniEmergencia += 1;
  } catch (error) {
    console.error("Error al obtener las obras sociales:", error);
    return res.redirect("/admision/inicio?error=obrasSociales");
  }
  console.log("dniEmergencia:", dniEmergencia);

  try {
    const persona = await Persona.findOne({
      where: { dni },
      include: [
        {
          model: Paciente,
          as: "paciente",
        },
      ],
    });
    let paciente;
    if (persona != null) {
      paciente = {
        id_persona: persona.id_persona,
        dni: persona.dni,
        nombre: persona.nombre,
        apellido: persona.apellido,
        f_nacimiento: persona.f_nacimiento,
        genero: persona.genero,
        telefono: persona.telefono,
        mail: persona.mail,
        contacto: persona.paciente.contacto || "",
        direccion: persona.paciente.direccion,
        id_obra_social: persona.paciente.id_obra_social,
        cod_os: persona.paciente.cod_os,
        detalle: persona.paciente.detalle,
      };
      //si existe esa persona se rederiza con la idea de modifcarlo
      return res.render("admision/crearPaciente", {
        dni: paciente.dni,
        arregloObraSociales: arrObra || [],
        paciente: persona ? paciente : null,
        modificar: true, // Indica que se quiere modificar un paciente existente
        dniEmergencia: dniEmergencia, // Para mostrar el DNI de emergencia
      });
    } else {
      // Si no hay persona, renderiza el formulario vacío
      return res.render("admision/crearPaciente", {
        dni: req.query.dni,
        arregloObraSociales: arrObra || [],
        paciente: null,
        modificar: false, // Indica que se quiere crear un nuevo paciente
        dniEmergencia: dniEmergencia, // Para mostrar el DNI de emergencia
      });
    }
  } catch (error) {
    console.error("Error al get paciente:", error);
    return res.redirect("/admision/inicio?error=crearPaciente");
  }
}
//checkea si el paciente existe, si no existe lo crea
// si existe rederiza la vista corresponidente del navbar seleccionado
//+post para verificar el dni y redirigir a la vista correspondiente
async function pCheckPaciente(req, res) {
  const { dni, navbar } = req.body;
  console.log("Estoy en pCheckPaciente");

  try {
    const persona = await Persona.findOne({
      where: { dni },
      include: [
        {
          model: Paciente,
          as: "paciente",
        },
      ],
    });

    //si existe el paciente, redirige a la vista correspondiente
    switch (navbar) {
      //por si lo quiere modificar
      case "gestionPaciente":
        return res.redirect("/admision/crearPaciente?dni=" + dni);

      // no pertenece aca por que no es necesario checkear el dni
      // case "buscarPacientes":
      //   return res.render("buscarPacientes", { persona, navbar });

      //para crear la admision
      case "crearAdmision":
        return res.redirect("crearAdmision?dni=" + dni + "&emergencia=false");

      //para modificar la admision
      case "modificarAdmision":
        return res.render("admision/modificarAdmision", { dni, navbar });

      //para crear el turno
      case "crearTurno":
        return res.render("admision/crearTurno", { dni, navbar });

      //para modificar el turno
      case "modificarTurno":
        return res.render("admision/modificarTurno", { dni, navbar });

      //para ver los turnos de x pacientev
      case "verTurnos":
        return res.render("admision/verTurnos", { dni, navbar });

      default:
        console.log("Error en la redirección de checkPaciente");
        return res.redirect("/");
    }
  } catch (error) {
    console.error("Error al verificar el paciente:", error);

    return res.redirect("/admision/inicio?error=check");
  }
}
//+get para renderizar la vista de verficar dni
async function gcheckPaciente(req, res) {
  console.log("navbar recibido:", req.query.navbar);
  emergencia = false;
  if (req.query.navbar === "crearAdmision") {
    emergencia = true;
  }
  res.render("admision/verificardni", {
    navbar: req.query.navbar,
    emergencia,
    etapa: req.query.etapa,
  });
}
//+post para crear un paciente de emergencia
async function emergencia(req, res) {
  try {
    // 1. Crear persona con datos mínimos (DNI temporal: autoincremental)
    const persona = await Persona.create({
      dni: null, // Se asignará luego del autoincrement
      nombre: "Paciente",
      apellido: "Emergencia",
      f_nacimiento: "2000-01-01",
      genero: "O",
      telefono: null,
      mail: null,
    });

    // 2. Usar el id_persona como DNI temporal y actualizar
    persona.dni = persona.id_persona;
    await persona.save();

    // 3. Crear paciente asociado a esa persona
    const paciente = await Paciente.create({
      id_persona: persona.id_persona,
      contacto: null,
      direccion: "Desconocida",
      id_obra_social: null,
      cod_os: null,
      detalle: "Ingreso por emergencia",
    });

    // 4. Renderizar una vista mostrando el DNI temporal generado
    if (!persona || !paciente) {
      return res.render("admision/inicio", {
        mensajeAlert: "Error al crear paciente de emergencia",
        alertClass: "alert-danger",
      });
    }
    return res.render("admision/admision", {
      tempDni: persona.dni,
      mensajeAlert: `Paciente de emergencia creado. Escriba este DNI: ${persona.dni} en la pulsera/frente del paciente.`,
      alertClass: "alert-success",
      paciente: {
        dni: persona.dni,
        nombre: persona.nombre,
        apellido: persona.apellido,
        f_nacimiento: persona.f_nacimiento,
        genero: persona.genero,
        telefono: persona.telefono,
        mail: persona.mail,
        contacto: paciente.contacto,
        direccion: paciente.direccion,
        id_obra_social: paciente.id_obra_social,
        cod_os: paciente.cod_os,
        detalle: paciente.detalle,
      },
      emergencia: true,
      motivos: motivosArray,
    });
  } catch (error) {
    console.error("Error al crear paciente de emergencia:", error);
    return res.redirect("admision/inicio?error=emergencia");
  }
}

async function busqueda(req, res) {
  const { dni } = req.query;
  try {
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
        `El paciente con DNI ${dni} no está registrado, por favor ingreselo al sistema.`
      );
      //para crearlo
      return res.render("/admision/busqueda", {
        mensajeAlert,
        paciente: null, //para que muestre el boton crear paciente
        alertClass: "alert-danger",
      });
    } else {
      return res.render("admision/busqueda", {
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
      });
    }
  } catch (error) {
    console.error("Error al buscar el paciente:", error);
    return res.redirect("/admision/inicio?error=buscar");
  }
}
async function listarPacientes(req, res) {
  try {
    const personas = await Persona.findAll({
      attributes: [
        "dni",
        "nombre",
        "apellido",
        "f_nacimiento",
        "genero",
        "telefono",
        "mail",
      ],
      include: [
        {
          model: Paciente,
          as: "paciente",
          attributes: [
            "contacto",
            "direccion",
            "id_obra_social",
            "cod_os",
            "detalle",
          ],
        },
      ],
      where: {
        estado: true, // Solo obtener pacientes activos
      },
    });
    const pacientes = personas.map((persona) => ({
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
      estado: persona.paciente.estado,
    }));
  } catch (error) {}
}
//-Utilidades
async function ObS() {
  const obras = await ObraSocial.findAll({
    attributes: ["id_obra_social", "nombre"],
    where: { estado: 1 },
  });

  return obras.map((os) => ({
    id: os.id_obra_social,
    nombre: os.nombre,
  }));
}
module.exports = {
  controlCrearPaciente, //+post para crear un paciente-
  gcrearPaciente, //+get para renderizar la vista de crear paciente-
  pCheckPaciente, //+post para verificar el dni y redirigir a la vista correspondiente-
  gcheckPaciente, //+get para renderizar la vista de verficar dni-
  emergencia, //+post para crear un paciente de emergencia-
  modificarPaciente, //+post para modificar un paciente-
  busqueda, //+get para buscar un paciente por dni-
  listarPacientes, //+get para listar todos los pacientes activos
};
