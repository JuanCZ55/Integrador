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
const { Sequelize } = require("sequelize");

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
      "/gestionarAdmision?dni=" + persona.dni + "&emergencia=true"
    );
  } catch (error) {
    console.error("Error al crear paciente de emergencia:", error);
    return res.redirect("/admision/inicio?error=emergencia");
  }
}
//-------------get para admision----------------
//*lo uso para rederizar la vista con un paciente ya creado(normal/emergencia) o sin paciente
async function admision(req, res) {
  console.log("Estoy en admision get");

  const { dni, emergencia, estado } = req.query;
  try {
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
    let secArray;
    const sectores = await Sector.findAll({});

    if (sectores.length === 0) {
      console.error("No hay sectores disponibles");
    } else {
      secArray = sectores.map((a) => ({
        id_sector: a.id_sector,
        nombre: a.nombre,
      }));
    }

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
    const pacienteNulo = {
      dni: "",
      nombre: "",
      apellido: "",
      f_nacimiento: "",
      genero: "",
      telefono: "",
      mail: "",
      contacto: "",
      direccion: "",
      obra_social: "",
      cod_os: "",
      detalle: "",
    };
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
          paciente: pacienteNulo,
          admision: admiNula,
          sectores: secArray,
          camaSeleccionada: {},
        });
      }
      if (persona) {
        const turno = await Turno.findOne({
          where: {
            id_paciente: persona.paciente.id_paciente,
          },
        });
        const admi = await Admision.findOne({
          where: {
            id_paciente: persona.paciente.id_paciente,
            estado: "1",
          },
        });
        const obraS = await ObraSocial.findOne({
          where: {
            id_obra_social: persona.paciente.id_obra_social,
          },
        });
        const nombreOS = obraS.nombre;
        if (emergencia == "true") {
          mensajeAlert = `Paciente de emergencia creado. Escriba este DNI: ${dni} en la pulsera/frente del paciente.`;
        }
        //*si se hizo un adminsion debe tener una cama asignada, entoces la busco
        let camaSelec = null;
        if (admi) {
          camaSelec = await MovimientoCama.findOne({
            where: {
              id_admision: admi.id_admision,
              estado: 1,
            },
            include: [
              {
                model: Cama,
                as: "cama",
                include: [
                  {
                    model: Habitacion,
                    as: "habitacion",
                    include: [
                      {
                        model: Sector,
                        as: "sector",
                      },
                    ],
                  },
                ],
              },
            ],
          });
        }
        console.log(2);
        //*Si el paciente esta cargado, lo devuelve
        return res.render("admision/gestionarAdmision", {
          dni: dni,
          mensajeAlert: mensajeAlert || "",
          alertClass: "alert-success",
          paciente: {
            id: persona.paciente.id_paciente,
            dni: persona.dni,
            nombre: persona.nombre,
            apellido: persona.apellido,
            f_nacimiento: persona.f_nacimiento,
            genero: persona.genero,
            telefono: persona.telefono,
            mail: persona.mail,
            contacto: persona.paciente.contacto,
            direccion: persona.paciente.direccion,
            obra_social: nombreOS,
            cod_os: persona.paciente.cod_os,
            detalle: persona.paciente.detalle,
          },
          emergencia: emergencia || "false",
          motivos: motivosArray,
          admision: admi || admiNula,
          camaSeleccionada: camaSelec ? camaSelec : {},
          f_turno: turno ? turno.fecha : "",
          sectores: secArray,
        });
      }
    }
    console.log(1);

    //este carga cuando se busca al paciente o no
    return res.render("admision/gestionarAdmision", {
      emergencia: "false",
      motivos: motivosArray,
      admision: admiNula,
      paciente: pacienteNulo,
      dni: dni,
      sectores: secArray,
      camaSeleccionada: {},
      estado: estado || "",
    });
  } catch (error) {
    console.error("Error al pedir la admision", error);
    return res.redirect("/admision/inicio?error=admision");
  }
}
//-------------post para crear admision----------------
async function pAdmision(req, res) {
  console.log("Estoy en admision post");

  const { id_admision, id_paciente, id_motivo, derivado, id_cama, egreso } =
    req.body;
  console.log(id_admision, id_paciente, id_motivo, derivado, id_cama, egreso);
  const t = await sequelize.transaction();

  try {
    const motivos = await Motivos.findAll({
      attributes: ["id_motivo", "nombre"],
      where: { estado: true },
    });
    const motivosArray = motivos.map((m) => ({
      id: m.id_motivo,
      nombre: m.nombre,
    }));
    let secArray;
    const sectores = await Sector.findAll({});

    if (sectores.length === 0) {
      console.error("No hay sectores disponibles");
    } else {
      secArray = sectores.map((a) => ({
        id_sector: a.id_sector,
        nombre: a.nombre,
      }));
    }
    const admiNula = {
      id_admision: "",
      id_paciente: "",
      id_motivo: "",
      derivado: "",
      fecha_ingreso: "",
      fecha_egreso: "",
      estado: "",
    };
    const pacienteNulo = {
      id_paciente: "",
      dni: "",
      nombre: "",
      apellido: "",
      f_nacimiento: "",
      genero: "",
      telefono: "",
      mail: "",
      contacto: "",
      direccion: "",
      obra_social: "",
      cod_os: "",
      detalle: "",
    };
    let persona = null;
    if (id_paciente) {
      persona = await Persona.findOne({
        include: [
          {
            model: Paciente,
            as: "paciente",
            where: { id_paciente: id_paciente },
          },
        ],
      });
    }
    let paciente = pacienteNulo;
    if (persona && persona.paciente) {
      const obra = await ObraSocial.findByPk(persona.paciente.id_obra_social);
      paciente = {
        id_paciente: persona.paciente.id_paciente,
        dni: persona.dni,
        nombre: persona.nombre,
        apellido: persona.apellido,
        f_nacimiento: persona.f_nacimiento,
        genero: persona.genero,
        telefono: persona.telefono,
        mail: persona.mail,
        contacto: persona.paciente.contacto,
        direccion: persona.paciente.direccion,
        obra_social: obra ? obra.nombre : "",
        cod_os: persona.paciente.cod_os,
        detalle: persona.paciente.detalle,
      };
    }
    if (!persona || !persona.paciente) {
      return res.render("admision/gestionarAdmision", {
        mensajeAlert: "Paciente no existe",
        alertClass: "alert-danger",
        admision: { id_admision, id_paciente, id_motivo, derivado },
        motivos: motivosArray,
        sectores: secArray,
        camaSeleccionada: {},
        paciente: pacienteNulo,
        f_turno: "",
      });
    }
    const turno = await Turno.findOne({
      where: { id_paciente, fecha: new Date().toISOString().split("T")[0] },
    });
    const admAct = await Admision.findOne({
      where: { id_paciente, estado: 1 },
    });
    let camaSeleccionada = {};
    if (admAct) {
      const mov = await MovimientoCama.findOne({
        where: { id_admision: admAct.id_admision, estado: 1 },
        include: [{ model: Cama, as: "cama" }],
      });
      camaSeleccionada = mov || {};
    }
    // Validar campos obligatorios id_paciente, id_motivo
    if (
      !id_paciente ||
      !id_motivo ||
      !id_cama ||
      id_cama === "" ||
      id_cama === undefined
    ) {
      console.log("Faltan campos obligatorios");
      return res.render("admision/gestionarAdmision", {
        mensajeAlert:
          "Por favor llene/seleccione todos los campos obligatorios(*)",
        alertClass: "alert-danger",
        admision: {
          id_admision,
          id_paciente,
          id_motivo,
          derivado,
        },
        sectores: secArray,
        motivos: motivosArray,
        camaSeleccionada,
        paciente,
        f_turno: turno ? turno.fecha : "",
      });
    }

    if (id_cama) {
      const cama = await Cama.findByPk(id_cama);
      if (!cama) {
        return res.render("admision/gestionarAdmision", {
          mensajeAlert: "La cama seleccionada no existe",
          alertClass: "alert-danger",
          admision: { id_admision, id_paciente, id_motivo, derivado },
          motivos: motivosArray,
          sectores: secArray,
          camaSeleccionada,
          paciente,
          f_turno: turno ? turno.fecha : "",
        });
      }
    }
    //busco los motivos por id_motivo
    const motivo = await Motivos.findByPk(id_motivo);
    if (!motivo) {
      return res.render("admision/gestionarAdmision", {
        mensajeAlert: "Ingrese un motivo de admision valido",
        alertClass: "alert-danger",
        admision: { id_admision, id_paciente, id_motivo, derivado },
        motivos: motivosArray,
        sectores: secArray,
        camaSeleccionada,
        paciente,
        f_turno: turno ? turno.fecha : "",
      });
    }
    if (motivo.nombre === "Turno" && !turno) {
      return res.render("admision/gestionarAdmision", {
        mensajeAlert: "No hay turno para hoy",
        alertClass: "alert-danger",
        admision: { id_admision, id_paciente, id_motivo, derivado },
        motivos: motivosArray,
        sectores: secArray,
        camaSeleccionada,
        paciente,
        f_turno: "",
      });
    }
    if (motivo.nombre === "Derivado" && (!derivado || derivado === "")) {
      return res.render("admision/gestionarAdmision", {
        mensajeAlert: "Indique derivado",
        alertClass: "alert-danger",
        admision: { id_admision, id_paciente, id_motivo, derivado },
        motivos: motivosArray,
        sectores: secArray,
        camaSeleccionada,
        paciente,
        f_turno: turno ? turno.fecha : "",
      });
    }
    let admision;
    if (id_admision) {
      admision = await Admision.findByPk(id_admision, { transaction: t });
      if (!admision) {
        admision = await Admision.create(
          {
            id_paciente,
            id_motivo,
            derivado: derivado || null,
            fecha_ingreso: new Date().toISOString().split("T")[0],
          },
          { transaction: t }
        );
      } else {
        admision.id_motivo = id_motivo;
        admision.derivado = derivado || null;
        if (egreso != "") {
          admision.fecha_egreso = egreso;
          admision.estado = 3;
        }
        await admision.save({ transaction: t });
      }
      if (!admision) throw new Error("admision no encontrada");
      admision.id_motivo = id_motivo;
      admision.derivado = derivado || null;
      if (egreso) {
        admision.fecha_egreso = egreso;
        admision.estado = 3; // finalizada
      }
      await admision.save({ transaction: t });
    } else {
      admision = await Admision.create(
        {
          id_paciente,
          id_motivo,
          derivado: derivado || null,
          fecha_ingreso: new Date().toISOString().split("T")[0],
        },
        { transaction: t }
      );
    }

    // Crear movimiento de cama si corresponde
    if (id_cama) {
      // Finalizar movimiento anterior
      const movAnterior = await MovimientoCama.findOne({
        where: { id_admision: admision.id_admision, estado: 1 },
        transaction: t,
      });
      if (movAnterior) {
        movAnterior.estado = 2;
        await movAnterior.save({ transaction: t });
        // Poner la cama anterior en mantenimiento/limpieza
        await Cama.update(
          { estado: 3 },
          { where: { id_cama: movAnterior.id_cama }, transaction: t }
        );
      }
      // Crear nuevo movimiento de cama
      await MovimientoCama.create(
        {
          id_admision: admision.id_admision,
          id_cama,
          estado: 1,
        },
        { transaction: t }
      );
      // Setear la nueva cama como ocupada
      await Cama.update({ estado: 2 }, { where: { id_cama }, transaction: t });
    }
    if (egreso && id_cama) {
      await Cama.update({ estado: 3 }, { where: { id_cama }, transaction: t });
    }
    await t.commit();

    // Redirigir al GET con query de estado
    if (!id_admision || id_admision === "") {
      return res.redirect("/admision/gestionarAdmision?estado=creado");
    } else {
      return res.redirect("/admision/gestionarAdmision?estado=modificado");
    }
  } catch (error) {
    console.error("Error al crear la admisión de post:", error);
    return res.redirect("/admision/inicio?error=admision");
  }
}

module.exports = {
  inicio,
  admision,
  pAdmision,
  emergencia,
};
