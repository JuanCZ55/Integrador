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
  const { error } = req.query;
  //admision,/emergencia/camas/modificar
  if (error) {
    let horror = "";
    if (admision) {
      horror = "Error al gestionar la admisión";
    } else if (emergencia) {
      horror = "Error al gestionar la emergencia";
    }
    if (camas) {
      horror = "Error al gestionar las camas";
    }
    if (modificar) {
      horror = "Error al modificar el paciente";
    }
    if (modificar) {
      horror = "Error al crear el paciente";
    }
    if (error) {
      horror = "Error desconocido";
    }
    return res.render("admision/inicio", {
      mensajeAlert: horror,
      alertClass: "alert-danger",
    });
  }
  return res.render("admision/inicio", {
    mensajeAlert: "",
    alertClass: "",
  });
}
//+post para crear un paciente de emergencia
async function emergencia(req, res) {
  try {
    const genero = req.body.genero;

    const persona = await Persona.create({
      dni: null, // Se asignará luego del autoincrement
      nombre: "Paciente",
      apellido: "Emergencia",
      f_nacimiento: "2000-01-01",
      genero: genero,
      telefono: null,
      mail: null,
    });

    persona.dni = persona.id_persona;
    await persona.save();

    const paciente = await Paciente.create({
      id_persona: persona.id_persona,
      contacto: null,
      direccion: "Desconocida",
      id_obra_social: 1,
      cod_os: null,
      detalle: "Ingreso por emergencia",
    });

    if (!persona || !paciente) {
      return res.render("admision/inicio", {
        mensajeAlert: "Error al crear paciente de emergencia",
        alertClass: "alert-danger",
      });
    }

    return res.redirect("/admision/gestionarAdmision?dni=" + persona.dni);
  } catch (error) {
    return res.redirect("/admision/inicio?error=emergencia");
  }
}
//-------------get para admision----------------
//*lo uso para rederizar la vista con un paciente ya creado(normal/emergencia) o sin paciente
async function admision(req, res) {
  const { dni, emergencia, estado } = req.query;
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
    return res.redirect("/admision/inicio?error=admision");
  }
}
//-------------post para crear admision----------------
async function pAdmision(req, res) {
  const { id_admision, id_paciente, id_motivo, derivado, id_cama, egreso } =
    req.body;
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
    const egresara = egreso && egreso !== "" && egreso !== undefined;

    if (
      !id_paciente ||
      !id_motivo ||
      (!egresara && (!id_cama || id_cama === "" || id_cama === undefined))
    ) {
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

    if (id_cama) {
      const movAnterior = await MovimientoCama.findOne({
        where: { id_admision: admision.id_admision, estado: 1 },
        transaction: t,
      });
      if (movAnterior) {
        movAnterior.estado = 2;
        await movAnterior.save({ transaction: t });

        await Cama.update(
          { estado: 3 },
          { where: { id_cama: movAnterior.id_cama }, transaction: t }
        );
      }

      await MovimientoCama.create(
        {
          id_admision: admision.id_admision,
          id_cama,
          estado: 1,
        },
        { transaction: t }
      );

      await Cama.update({ estado: 2 }, { where: { id_cama }, transaction: t });
    }
    if (egreso && id_cama) {
      await Cama.update({ estado: 3 }, { where: { id_cama }, transaction: t });
    }
    await t.commit();

    if (!id_admision || id_admision === "") {
      return res.redirect("/admision/gestionarAdmision?estado=creado");
    } else {
      return res.redirect("/admision/gestionarAdmision?estado=modificado");
    }
  } catch (error) {
    return res.redirect("/admision/inicio?error=admision");
  }
}

//+GET para listar todas las admisiones
async function listaAdmisiones(req, res) {
  try {
    const admisiones = await Admision.findAll({
      include: [
        {
          model: Paciente,
          as: "paciente",
          include: [
            {
              model: Persona,
              as: "persona",
            },
          ],
        },
        {
          model: Motivos,
          as: "motivo",
        },
      ],
      order: [["fecha_ingreso", "DESC"]],
    });

    const lista = admisiones.map((adm) => ({
      id_admision: adm.id_admision,
      paciente:
        adm.paciente && adm.paciente.persona
          ? {
              nombre: adm.paciente.persona.nombre,
              apellido: adm.paciente.persona.apellido,
              dni: adm.paciente.persona.dni,
            }
          : null,
      motivo: adm.motivo ? { nombre: adm.motivo.nombre } : null,
      fecha_ingreso: adm.fecha_ingreso,
      fecha_egreso: adm.fecha_egreso,
      estado: adm.estado,
    }));

    res.render("admision/listaAdmision", { admisiones: lista });
  } catch (error) {
    res.render("admision/listaAdmision", {
      admisiones: [],
      mensajeAlert: "Error al cargar las admisiones",
      alertClass: "alert-danger",
    });
  }
}
async function cancelarAdmision(req, res) {
  const { id_admision } = req.body;
  try {
    await Admision.update({ where: { id_admision } });

    const movi = await MovimientoCama.findOne({
      where: { id_admision, estado: 1 },
    });
    if (movi) {
      await MovimientoCama.update({
        where: { id_movimiento_camas: movi.id_movimiento_camas },
      });
      await Cama.update({ where: { id_cama: movi.id_cama } });
    }
    res.redirect("/admision/listaAdmision");
  } catch (error) {
    res.redirect("/admision/listaAdmision");
  }
}
async function gCambiarPacienteAdmisiones(req, res) {
  return res.render("admision/cambiarPacienteAdmisiones");
}

async function cambiarPacienteAdmisiones(req, res) {
  const { dni_antiguo, dni_nuevo, esEmergencia } = req.body;
  let mensajeAlert = "";
  let alertClass = "alert-danger";
  const regexDniEmergencia = /^[2-9][0-9]{0,7}$/;
  const regexDniReal = /^[0-9]{7,8}$/;

  if (esEmergencia) {
    if (!dni_antiguo || !regexDniEmergencia.test(dni_antiguo)) {
      mensajeAlert =
        "El DNI antiguo de emergencia debe ser numerico, de 1 a 8 digitos";
      return res.render("admision/cambiarPacienteAdmisiones", {
        mensajeAlert,
        alertClass,
      });
    }
  } else {
    if (!dni_antiguo || !regexDniReal.test(dni_antiguo)) {
      mensajeAlert = "El DNI antiguo debe ser numerico y tener 7 u 8 digitos.";
      return res.render("admision/cambiarPacienteAdmisiones", {
        mensajeAlert,
        alertClass,
      });
    }
  }

  if (!dni_nuevo || !regexDniReal.test(dni_nuevo)) {
    mensajeAlert = "El DNI nuevo debe ser numerico y tener 7 u 8 digitos.";
    return res.render("admision/cambiarPacienteAdmisiones", {
      mensajeAlert,
      alertClass,
    });
  }

  const t = await sequelize.transaction();
  try {
    const personaAntigua = await Persona.findOne({
      where: { dni: dni_antiguo },
      include: [{ model: Paciente, as: "paciente" }],
      transaction: t,
    });
    if (!personaAntigua || !personaAntigua.paciente) {
      await t.rollback();
      mensajeAlert = "No se encontro paciente con ese DNI para antiguo";
      return res.render("admision/cambiarPacienteAdmisiones", {
        mensajeAlert,
        alertClass,
      });
    }
    const pacienteAntiguo = personaAntigua.paciente;

    const admision = await Admision.findOne({
      where: { id_paciente: pacienteAntiguo.id_paciente, estado: 1 },
      transaction: t,
    });
    if (!admision) {
      await t.rollback();
      mensajeAlert = "No se encontro una admision activa para ese paciente";
      return res.render("admision/cambiarPacienteAdmisiones", {
        mensajeAlert,
        alertClass,
      });
    }

    const personaReal = await Persona.findOne({
      where: { dni: dni_nuevo },
      include: [{ model: Paciente, as: "paciente" }],
      transaction: t,
    });
    if (!personaReal || !personaReal.paciente) {
      await t.rollback();
      mensajeAlert = "No se encontro un paciente real con ese DNI para nuevo";
      return res.render("admision/cambiarPacienteAdmisiones", {
        mensajeAlert,
        alertClass,
      });
    }
    const pacienteReal = personaReal.paciente;

    await Admision.update(
      { id_paciente: pacienteReal.id_paciente },
      { where: { id_admision: admision.id_admision }, transaction: t }
    );

    if (esEmergencia) {
      await Paciente.update(
        { estado: 2 },
        { where: { id_paciente: pacienteAntiguo.id_paciente }, transaction: t }
      );
    }

    await t.commit();
    mensajeAlert =
      "La admisión fue actualizada correctamente y el paciente temporal fue deleteado";
    alertClass = "alert-success";
    return res.render("admision/cambiarPacienteAdmisiones", {
      mensajeAlert,
      alertClass,
    });
  } catch (error) {
    await t.rollback();

    mensajeAlert = "Error al actualizar la admisión.";
    return res.render("admision/cambiarPacienteAdmisiones", {
      mensajeAlert,
      alertClass,
    });
  }
}

module.exports = {
  inicio,
  admision,
  pAdmision,
  emergencia,
  listaAdmisiones,
  cancelarAdmision,
  cambiarPacienteAdmisiones,
  gCambiarPacienteAdmisiones,
};
