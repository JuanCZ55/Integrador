const { Paciente, ObraSocial, Persona } = require("../models/init");
const sequelize = require("../models/db");
const { Op } = require("sequelize");
async function controlCrearPaciente(req, res) {
  const {
    dni,
    nombre,
    apellido,
    fecha_nacimiento,
    genero,
    telefono,
    mail,
    contacto,
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
      contacto,
      direccion,
      id_obra_social,
      cod_os,
      detalle,
    });

    mensajeAlert.push("Paciente creado exitosamente");
    return res.render("admision/crearPaciente", { mensajeAlert });
  } catch (error) {
    mensajeAlert.push("Error al crear el paciente");
    return res.render("admision/crearPaciente", {
      mensajeAlert,
      paciente: req.body,
    });
  }
}
//get para renderizar la vista de crear paciente
async function gcrearPaciente(req, res) {
  res.render("admision/crearPaciente", { dni: req.query.dni });
}
//capaz ni lo use
// async function verificarPaciente(req, res) {
//   const pacienteExiste = await Paciente.findOne({});
//   let claseB;
//   if (!paciente) {
//     claseB = "btn-outline-danger";
//   } else {
//     claseB = "btn-outline-success";
//   }
//   return res.render("crearPaciente", { paciente, claseB });
// }
//checkea si el paciente existe, si no existe lo crea
// si existe rederiza la vista corresponidente del navbar seleccionado
//post para verificar el dni y redirigir a la vista correspondiente
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
        "El paciente no esta registrado, por favor complete el formulario"
      );
      //para crearlo
      return res.render("admision/crearPaciente", {
        dni: dni,
        navbar: "crarPaciente",
        mensajeAlert,
      });
    } else {
      //si existe el paciente, redirige a la vista correspondiente
      switch (navbar) {
        //por si lo quiere modificar
        case "gestionPaciente":
          return res.render("admision/crearPaciente", { persona, navbar });

        // no pertenece aca por que no es necesario checkear el dni
        // case "buscarPacientes":
        //   return res.render("buscarPacientes", { persona, navbar });

        //para crear la admision
        case "crearAdmision":
          return res.render("admision/crearAdmision", {
            dni,
            navbar,
            emergencia: true,
          });

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
    let mensajeAlert = [];
    mensajeAlert.push("Error al verificar el paciente");
    return res.render("admision/inicio", { mensajeAlert });
  }
}
//get para renderizar la vista de verficar dni
async function gcheckPaciente(req, res) {
  console.log("navbar recibido:", req.query.navbar);
  emergencia = false;
  if (req.query.navbar === "admision") {
    emergencia = true;
  }
  res.render("admision/verificardni", {
    navbar: req.query.navbar,
    emergencia: emergencia,
  });
}
async function inicio(req, res) {
  res.render("admision/inicio");
}
async function emergencia(req, res) {
  const { navbar } = req.body;
  console.log("Estoy en emergencia");
  try {
    const pacientes = await Paciente.findAll({
      include: [
        {
          model: Persona,
          as: "persona",
          attributes: ["dni", "nombre", "apellido"],
        },
      ],
      where: {
        [Op.or]: [
          { contacto: { [Op.ne]: null } },
          { telefono: { [Op.ne]: null } },
        ],
      },
    });

    if (pacientes.length === 0) {
      return res.render("admision/emergencia", {
        mensajeAlert: "No hay pacientes con contacto o teléfono registrado",
        navbar,
      });
    }

    return res.render("admision/emergencia", { pacientes, navbar });
  } catch (error) {
    console.error("Error al obtener pacientes:", error);
    return res.render("admision/emergencia", {
      mensajeAlert: "Error al obtener pacientes",
      navbar,
    });
  }
}

module.exports = {
  controlCrearPaciente,
  gcrearPaciente,
  pCheckPaciente,
  gcheckPaciente,
  inicio,
  emergencia,
};
