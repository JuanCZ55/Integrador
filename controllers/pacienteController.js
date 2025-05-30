const {
  Paciente,
  ObraSocial,
  Persona,
  Motivos,
  Admision,
  Turno,
} = require("../models/init");
const sequelize = require("../models/db");
const { Op } = require("sequelize");

//+post para crear un paciente
async function controlCrearPaciente(req, res) {
  const {
    dni,
    nombre,
    apellido,
    fecha_nacimiento,
    genero,
    telefono,
    mail,
    telefono_contacto,
    direccion,
    id_obra_social,
    cod_os,
    detalle,
  } = { ...req.body };

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
    !fecha_nacimiento ||
    !genero ||
    !direccion ||
    !id_obra_social
  ) {
    return res.render("admision/crearPaciente", {
      mensajeAlert: "Por favor llene todos los campos obligatorios(*)",
      persona: req.body,
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
  //fecha_nacimiento
  if (fecha_nacimiento >= new Date()) {
    mensajeAlert.push("La fecha de nacimiento no puede ser mayor a la actual");
  }
  //genero
  if (genero !== "fememino" && genero !== "masculino" && genero !== "otro") {
    mensajeAlert.push("El género debe ser 'femenino', 'masculino' u 'otro'");
  }
  //telefono
  if (telefono && !regexTelefono.test(telefono)) {
    mensajeAlert.push("El teléfono debe tener 10 dígitos");
  }
  //telefono_contacto
  if (contacto && !regexTelefono.test(contacto)) {
    mensajeAlert.push("El teléfono detelefono_contacto debe tener 10 dígitos");
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
    });
  }

  // Crear un nuevo paciente
  try {
    // 1. Buscar persona por DNI
    const persona = await Persona.findOne({ where: { dni } });

    let idPersona;
    if (persona) {
      // 2. Si existe persona, buscar paciente
      idPersona = persona.id_persona;
      const pacienteExistente = await Paciente.findOne({
        where: { id_persona: idPersona },
      });
      if (pacienteExistente) {
        mensajeAlert.push("Ya hay un paciente con ese DNI");
        return res.render("admision/crearPaciente", {
          mensajeAlert,
          paciente: req.body,
        });
      }
    } else {
      // 3. Si no existe persona, crearla
      const nuevaPersona = await Persona.create({
        dni,
        nombre,
        apellido,
        f_nacimiento: fecha_nacimiento,
        genero,
        telefono,
        mail,
      });
      idPersona = nuevaPersona.id_persona;
    }

    // 4. Crear paciente con la FK de persona
    await Paciente.create({
      id_persona: idPersona,
      telefono_contacto,
      direccion,
      id_obra_social,
      cod_os,
      detalle,
    });

    mensajeAlert.push("Paciente creado exitosamente");
    return res.render("admision/crearPaciente", { mensajeAlert });
  } catch (error) {
    console.error("Error al crear el paciente:", error);
    return res.redirect("/admision/inicio?error=crearPaciente");
  }
}
//+get para renderizar la vista de crear paciente
async function gcrearPaciente(req, res) {
  const { dni } = req.query;
  try {
    const obraSocial = ObraSocial.findAll({
      attributes: ["id_obra_social", "nombre"],
      where: { estado: true },
    });
    const OSarray = obraSocial.map((os) => ({
      id: os.id_obra_social,
      nombre: os.nombre,
    }));
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
        dni: persona.dni,
        nombre: persona.nombre,
        apellido: persona.apellido,
        f_nacimiento: persona.f_nacimiento,
        genero: persona.genero,
        telefono: persona.telefono,
        mail: persona.mail,
        telefono_contacto: persona.paciente.contacto,
        direccion: persona.paciente.direccion,
        id_obra_social: persona.paciente.id_obra_social,
        cod_os: persona.paciente.cod_os,
        detalle: persona.paciente.detalle,
      };
      return res.render("admision/crearPaciente", {
        dni: req.query.dni,
        OSarray,
        paciente: persona ? paciente : null,
        modificar: true, // Indica que se quiere modificar un paciente existente
      });
    } else {
      // Si no hay persona, renderiza el formulario vacío
      return res.render("admision/crearPaciente", {
        dni: req.query.dni,
        OSarray,
        paciente: null,
        modificar: false, // Indica que se quiere crear un nuevo paciente
      });
    }
  } catch (error) {
    console.error("Error al obtener las obras sociales:", error);
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
    if (!persona || !persona.paciente) {
      let mensajeAlert = [];
      mensajeAlert.push(
        "El paciente no esta registrado, por favor carguelo al sistema"
      );
      //para crearlo
      return res.render("admision/crearPaciente", {
        dni: dni,
        navbar: "crearPaciente",
        mensajeAlert,
      });
    } else {
      //si existe el paciente, redirige a la vista correspondiente
      switch (navbar) {
        //por si lo quiere modificar
        case "gestionPaciente":
          return res.redirect("admision/crearPaciente?dni=" + dni);

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
      telefono_contacto: null,
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
        telefono_contacto: paciente.contacto,
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
//+post para modificar un paciente
async function modificarPaciente(req, res) {
  const {
    dni,
    nombre,
    apellido,
    fecha_nacimiento,
    genero,
    direccion,
    telefono,
    telefono_contacto,
    mail,
    obra_social,
    cod_os,
    detalle,
  } = req.body;

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
    !fecha_nacimiento ||
    !genero ||
    !direccion ||
    !id_obra_social
  ) {
    return res.render("admision/crearPaciente", {
      mensajeAlert: "Por favor llene todos los campos obligatorios(*)",
      persona: req.body,
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
  //fecha_nacimiento
  if (fecha_nacimiento >= new Date()) {
    mensajeAlert.push("La fecha de nacimiento no puede ser mayor a la actual");
  }
  //genero
  if (genero !== "fememino" && genero !== "masculino" && genero !== "otro") {
    mensajeAlert.push("El género debe ser 'femenino', 'masculino' u 'otro'");
  }
  //telefono
  if (telefono && !regexTelefono.test(telefono)) {
    mensajeAlert.push("El teléfono debe tener 10 dígitos");
  }
  //telefono_contacto
  if (contacto && !regexTelefono.test(contacto)) {
    mensajeAlert.push("El teléfono detelefono_contacto debe tener 10 dígitos");
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
    });
  }

  try {
    //-busco la persona por dni 1
    const persona = await Persona.findOne({
      where: { dni, estado: true },
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
        "El paciente no esta registrado, por favor complete el formulario"
      );
      //para crearlo
      return res.status().render("admision/crearPaciente", {
        dni: dni,
        mensajeAlert,
      });
    } else if (persona.paciente.estado === false) {
      let mensajeAlert = [];
      mensajeAlert.push(
        "El paciente está inactivo, por favor informe al administrador para activarlo."
      );
      //para crearlo
      return res.status().render("admision/crearPaciente", {
        dni: dni,
        mensajeAlert,
      });
    }
    //-actualizo los datos de la persona
    await persona.update({
      nombre,
      apellido,
      f_nacimiento: fecha_nacimiento,
      genero,
      telefono,
      mail,
    });

    //-actualizo datos de paciente
    await persona.paciente.update({
      direccion,
      telefono_contacto: telefono_contacto,
      id_obra_social: obraSocialBuscada.id_obra_social,
      cod_os,
      detalle,
    });
    let mensajeAlert = [];
    mensajeAlert.push("Paciente modificado exitosamente");
    return res.render("admision/crearPaciente", {
      mensajeAlert,
    });
  } catch (error) {
    console.error("Error al modificar el paciente:", error);
    return res.redirect("/admision/inicio?error=modificar");
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
          telefono_contacto: persona.paciente.contacto,
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
      telefono_contacto: persona.paciente.contacto,
      direccion: persona.paciente.direccion,
      id_obra_social: persona.paciente.id_obra_social,
      cod_os: persona.paciente.cod_os,
      detalle: persona.paciente.detalle,
      estado: persona.paciente.estado,
    }));
  } catch (error) {}
}
module.exports = {
  controlCrearPaciente, //+post para crear un paciente-
  gcrearPaciente, //+get para renderizar la vista de crear paciente-
  pCheckPaciente, //+post para verificar el dni y redirigir a la vista correspondiente-
  gcheckPaciente, //+get para renderizar la vista de verficar dni-
  inicio, //+get para renderizar la vista de admision-
  emergencia, //+post para crear un paciente de emergencia-
  modificarPaciente, //+post para modificar un paciente-
  busqueda, //+get para buscar un paciente por dni-
  listarPacientes, //+get para listar todos los pacientes activos
};
