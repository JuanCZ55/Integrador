const {
  Paciente,
  ObraSocial,
  Persona,
  Motivos,
  Admision,
  Turno,
  MovimientoCama,
  Cama,
  Sector,
  Habitacion,
} = require("../models/init");
const sequelize = require("../models/db");
const { Op } = require("sequelize");

async function inicio(req, res) {
  res.render("admision/inicio");
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
    // return res.render("admision/admision", {
    //   tempDni: persona.dni,
    //   mensajeAlert: `Paciente de emergencia creado. Escriba este DNI: ${persona.dni} en la pulsera/frente del paciente.`,
    //   alertClass: "alert-success",
    //   paciente: {
    //     dni: persona.dni,
    //     nombre: persona.nombre,
    //     apellido: persona.apellido,
    //     f_nacimiento: persona.f_nacimiento,
    //     genero: persona.genero,
    //     telefono: persona.telefono,
    //     mail: persona.mail,
    //     contacto: paciente.contacto,
    //     direccion: paciente.direccion,
    //     id_obra_social: paciente.id_obra_social,
    //     cod_os: paciente.cod_os,
    //     detalle: paciente.detalle,
    //   },
    //   emergencia: true,
    //   motivos: motivosArray,
    // });
    return res.redirect(
      "/gestionarAdmisiones?dni=" + persona.dni + "&emergencia=true"
    );
  } catch (error) {
    console.error("Error al crear paciente de emergencia:", error);
    return res.redirect("admision/inicio?error=emergencia");
  }
}
//-------------get para admision----------------
//*lo uso para rederizar la vista con un paciente ya creado(normal/emergencia) o sin paciente
async function admision(req, res) {
  console.log("Estoy en admision get");

  const { dni, emergencia } = req.query;
  try {
    //* #region  2. Buscar motivos de admisión activos y los ordena
    const motivos = await Motivos.findAll({
      attributes: ["id_motivo", "nombre"],
      where: { estado: true },
    });
    const motivosArray = motivos.map((m) => ({
      id: m.id_motivo,
      nombre: m.nombre,
    }));
    const camas = await camasDisponiblesPorPersona;
    // #endregion
    const admiNula = {
      id_admision: "",
      id_paciente: "",
      id_motivo: "",
      derivado: "",
      fecha_ingreso: "",
      fecha_egreso: "",
      estado: "",
    };
    let mensajeAlert = "";
    if (dni) {
      // 1. Buscar persona por DNI
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
        mensajeAlert = "El paciente no existe en el sistema";
        return res.render("admision/gestionarAdmision", {
          mensajeAlert: mensajeAlert,
          alertClass: "alert-danger",
          dni: dni,
        });
      }
      if (persona) {
        const admi = await Admision.findOne({
          where: {
            id_paciente: persona.paciente.id_paciente,
            estado: "true",
          },
        });

        if (emergencia == "true") {
          mensajeAlert = `Paciente de emergencia creado. Escriba este DNI: ${dni} en la pulsera/frente del paciente.`;
        }
        //*si se hizo un adminsion debe tener una cama asignada, entoces la busco
        if (admi) {
          const camaSelec = await MovimientoCama.findOne({
            where: {
              id_admision: admi.id_admision,
              estado: 1,
            },
          });
        } //*Si el paciente esta cargado, lo devuelve
        return res.render("admision/gestionarAdmision", {
          dni: persona.dni,
          mensajeAlert: mensajeAlert || "",
          alertClass: "alert-success",
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
          emergencia: emergencia || "false",
          motivos: motivosArray,
          admision: admi || admiNula,
          camas: camas || [],
          camaSeleccionada: camaSelec.id_cama || "",
        });
      }
    }

    return res.render("admision/gestionarAdmision", {
      emergencia: "false",
      motivos: motivosArray,
      camas: camas || [],
      admision: admiNula,
    });
  } catch (error) {
    console.error("Error al pedir la admision", error);
    return res.redirect("admision/inicio?error=admision");
  }
}
//-------------post para admision----------------
async function padmision(req, res) {
  console.log("Estoy en admision post");

  const { id_admision, id_paciente, id_motivo, derivado, id_cama } = req.body;
  try {
    const camas = await camasDisponiblesPorPersona();

    // #region  2. Buscar motivos de admisión activos y los ordena
    const motivos = await Motivos.findAll({
      attributes: ["id_motivo", "nombre"],
      where: { estado: true },
    });
    const motivosArray = motivos.map((m) => ({
      id: m.id_motivo,
      nombre: m.nombre,
    }));
    // #endregion
    // Validar campos obligatorios id_paciente, id_motivo
    if (!id_paciente || !id_motivo) {
      console.log("Faltan campos obligatorios");
      return res.render("admision/gestionarAdmision", {
        mensajeAlert: "Por favor llene todos los campos obligatorios(*)",
        alertClass: "alert-danger",
        admision: {
          id_admision,
          id_paciente,
          id_motivo,
          derivado,
        },
        motivosArray,
        camas: camas || [],
        camaSeleccionada: id_cama || "",
      });
    }
    const cama = await Cama.findByPk(id_cama);
    if (id_cama && !cama) {
      return res.render("admision/gestionarAdmision", {
        mensajeAlert: "La cama seleccionada no existe",
        alertClass: "alert-danger",
        admision: {
          id_admision,
          id_paciente,
          id_motivo,
          derivado,
        },
        motivosArray,
        camas: camas || [],
        camaSeleccionada: id_cama || "",
      });
    }
    //busco los motivos por id_motivo
    const motivo = await Motivos.findByPk(id_motivo);
    // Validar motivo de admisión turno o derivado, emergencia no ocupa
    if (motivo) {
      if (motivo.nombre === "Turno") {
        const turno = await Turno.findOne({
          where: {
            id_paciente: id_paciente,
            fecha: fecha_ingreso,
          },
        });
        if (!turno) {
          return res.render("admision/gestionarAdmision", {
            mensajeAlert:
              "No hay turnos asosiados de este paciente para la fecha de hoy",
            alertClass: "alert-danger",
            admision: {
              id_admision,
              id_paciente,
              id_motivo,
              derivado,
            },
            motivosArray,
            camas: camas || [],
            camaSeleccionada: id_cama || "",
          });
        }
      } else if (motivo.nombre === "Derivado") {
        if (!derivado || derivado === "") {
          return res.render("admision/gestionarAdmision", {
            mensajeAlert:
              "Por favor ingrese el nombre del medico/hospital derivado",
            alertClass: "alert-danger",
            admision: {
              id_admision,
              id_paciente,
              id_motivo,
              derivado,
            },
            motivosArray,
            camas: camas || [],
            camaSeleccionada: id_cama || "",
          });
        }
      }
    } else {
      return res.render("admision/gestionarAdmision", {
        mensajeAlert: "Ingrese un motivo de admisión válido",
        alertClass: "alert-danger",
        admision: {
          id_admision,
          id_paciente,
          id_motivo,
          derivado,
        },
        motivosArray,
        camas: camas || [],
        camaSeleccionada: id_cama || "",
      });
    }
    //creacion de la admision

    const admision = await Admision.create({
      id_paciente,
      id_motivo,
      derivado: derivado || null, // Si no se proporciona, se deja como NULL
      fecha_ingreso: new Date().toISOString().split("T")[0], // Fecha actual
    });
    const mCamas = await MovimientoCama.create({
      id_admision: admision.id_admision,
      id_cama: id_cama || null, // Si no se proporciona, se deja como NULL
    });

    return res.redirect("/admision/gestionarAdmisiones?etapa=crear");
  } catch (error) {
    console.error("Error al crear la admisión de post:", error);
    return res.redirect("/admision/inicio?error=admision");
  }
}
async function camasDisponiblesPorPersona(idPersona) {
  try {
    const persona = await Persona.findByPk(idPersona, {
      include: { model: Paciente, as: "paciente" },
    });
    if (!persona || !persona.paciente) {
      console.error(
        "Persona no encontrada estoy en camasDisponiblesPorPersona"
      );
      return [];
    }
    const genero = persona.genero;
    const camas = await Cama.findAll({
      where: { estado: 1 },
      include: [
        {
          model: Habitacion,
          include: [{ model: Sector }],
        },
        {
          model: MovimientoCama,
          required: false,
          where: { estado: 1 },
          include: {
            model: Admision,
            required: true,
            where: { estado: 1 },
            include: {
              model: Paciente,
              include: {
                model: Persona,
                attributes: ["genero"],
              },
            },
          },
        },
      ],
    });
    if (!camas || camas.length === 0) {
      console.error("No hay camas disponibles");
      return [];
    }
    const camasFiltradas = camas.filter((cama) => {
      const movimientos = cama.movimiento_camas || [];

      const generosEnHabitacion = movimientos
        .map((mov) => mov.admision?.paciente?.persona?.genero)
        .filter(Boolean);

      // si no hay pacientes en la habitación, es válida
      if (generosEnHabitacion.length === 0) return true;

      // si todos son del mismo género
      return generosEnHabitacion.every((g) => g === genero);
    });

    return camasFiltradas;
  } catch (error) {
    console.error("Error al buscasr camas disponibles por persona:", error);
    return [];
  }
}
async function camasDisponiblesPorPersona2Sql(idPersona) {
  // 1) Obtengo el genero de la persona solicitante
  const persona = await Persona.findByPk(idPersona, {
    include: { model: Paciente, as: "paciente" },
  });
  if (!persona || !persona.paciente) {
    console.error("Persona no encontrada en camasDisponiblesPorPersona");
    return [];
  }
  const genero = persona.genero; // 'm' o 'f'

  // 2) Uso un literal para replicar el NOT EXISTS del SQL original
  //    Filtramos solo las camas QUE no tengan mov. activo y cuyas habitaciones
  //    no contengan pacientes de distinto genero.
  const camas = await Cama.findAll({
    attributes: ["id_cama"],
    include: [
      {
        model: Habitacion,
        attributes: ["id_habitacion", "numero"],
        include: [{ model: Sector, attributes: ["nombre"] }],
      },
      // Aqui hago LEFT JOIN a MovimientoCama para ver si la propia cama está ocupada:
      {
        model: MovimientoCama,
        as: "movimientoActivo",
        attributes: ["id_movimiento_camas"],
        required: false,
        where: { estado: 1 },
      },
    ],
    where: {
      // 2.1) LA MISMA CAMA NO debe tener ningun movimiento activo:
      "$movimientoActivo.id_movimiento_camas$": null,

      // 2.2) Y ADEMAS en esa MISMA habitacion no debe haber ANY paciente de otro genero:
      [Op.not]: literal(`EXISTS (
        SELECT 1
        FROM camas AS c2
        INNER JOIN movimiento_camas AS mc2
          ON c2.id_cama = mc2.id_cama
          AND mc2.estado = 1
        INNER JOIN admisiones AS a2
          ON mc2.id_admision = a2.id_admision
        INNER JOIN pacientes AS p2
          ON a2.id_paciente = p2.id_paciente
        INNER JOIN personas AS per2
          ON p2.id_persona = per2.id_persona
        WHERE c2.id_habitacion = Cama.id_habitacion
          AND per2.genero <> '${genero}'
      )`),
    },
    order: [
      [{ model: Habitacion, include: [Sector] }, "nombre", "ASC"], // sector.nombre
      [{ model: Habitacion }, "numero", "ASC"], // habitacion.numero
      ["n_cama", "ASC"], // cama.n_cama
    ],
  });

  // 3) Mapeo para devolver exactamente lo que pedias en el SELECT original
  return camas.map((c) => ({
    id_cama: c.id_cama,
    id_habitacion: c.Habitacion.id_habitacion,
    numero_habitacion: c.Habitacion.numero,
    nombre_sector: c.Habitacion.Sector.nombre,
  }));
}

module.exports = {
  inicio,
  admision,
  padmision,
  emergencia,
};
