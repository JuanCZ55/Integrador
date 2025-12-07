const {
  HistorialMedico,
  Admision,
  Persona,
  Paciente,
  Alergia,
  Enfermedad,
  MedicacionActual,
  CirugiaPrevia,
  AntecedenteFamiliar,
} = require("../models/init");

const sequelize = require("../models/db");

const helper = require("../helpers/roleHelper");

async function getHistoria(req, res) {
  try {
    const { id_admision } = req.query;
    const admision = await Admision.findByPk(id_admision, {
      include: [
        {
          model: Paciente,
          as: "paciente",
          include: [{ model: Persona, as: "persona" }],
        },
      ],
    });
    if (!admision) {
      return res
        .status(404)
        .render("notfound", { message: "Admisión no encontrada" });
    }
    const id_paciente = admision.id_paciente;
    let id_historial = await upsertHistorial(id_paciente);

    // Cargar datos existentes
    const historial = await HistorialMedico.findByPk(id_historial, {
      include: [
        { model: Alergia, as: "alergias" },
        { model: Enfermedad, as: "enfermedades" },
        { model: MedicacionActual, as: "medicaciones" },
        { model: CirugiaPrevia, as: "cirugias" },
        { model: AntecedenteFamiliar, as: "antecedentesFamiliares" },
      ],
    });

    const role = await helper.getRole(req);
    const view = role === "medico" ? "medico/historia" : "enfermeria/historial";

    res.render(view, {
      historial,
      paciente: admision.paciente,
      id_admision,
      mensajeAlert: req.query.mensajeAlert || "",
      alertClass: req.query.alertClass || "",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .render("notfound", { message: "Error al cargar el historial" });
  }
}

async function postHistoria(req, res) {
  try {
    const { id_admision } = req.query;
    const admision = await Admision.findByPk(id_admision);
    if (!admision) {
      return res
        .status(404)
        .render("notfound", { message: "Admisión no encontrada" });
    }
    const id_paciente = admision.id_paciente;
    const id_historial = await upsertHistorial(id_paciente);

    // Validación de datos
    if (validarHistorial(req.body)) {
      const role = await helper.getRole(req);
      const redirectUrl =
        role === "medico" ? "/medico/historia" : "/enfermeria/historial";
      return res.redirect(
        `${redirectUrl}?id_admision=${id_admision}&mensajeAlert=Complete todos los campos obligatorios (*)&alertClass=alert-danger`
      );
    }

    // Procesar alergias
    await sequelize.transaction(async (t) => {
      await Alergia.destroy({ where: { id_historial }, transaction: t });
      if (req.body.alergias) {
        const alergiasData = req.body.alergias.map((a) => ({
          id_historial,
          tipo: a.tipo,
          gravedad: a.gravedad,
          observaciones: a.observaciones,
        }));
        for (const alergia of alergiasData) {
          if (!alergia || !alergia.tipo || alergia.tipo.trim() === "") continue;
          await Alergia.create(alergia, { transaction: t });
        }
      }
    });

    // Procesar enfermedades
    await sequelize.transaction(async (t) => {
      await Enfermedad.destroy({ where: { id_historial }, transaction: t });
      if (req.body.enfermedades) {
        const enfermedadesData = req.body.enfermedades.map((e) => ({
          id_historial,
          nombre: e.nombre,
          cronica: e.cronica === "true" || e.cronica === true,
          fecha_diagnostico: e.fecha_diagnostico
            ? new Date(e.fecha_diagnostico)
            : null,
          observaciones: e.observaciones,
        }));
        for (const enfermedad of enfermedadesData) {
          if (
            !enfermedad ||
            !enfermedad.nombre ||
            enfermedad.nombre.trim() === ""
          )
            continue;
          await Enfermedad.create(enfermedad, { transaction: t });
        }
      }
    });

    // Procesar medicación
    await sequelize.transaction(async (t) => {
      await MedicacionActual.destroy({
        where: { id_historial },
        transaction: t,
      });
      if (req.body.medicacion) {
        const medicacionData = req.body.medicacion.map((m) => ({
          id_historial,
          nombre: m.nombre,
          dosis: m.dosis,
          frecuencia: m.frecuencia,
          observaciones: m.observaciones,
        }));
        for (const med of medicacionData) {
          if (!med || !med.nombre || med.nombre.trim() === "") continue;
          await MedicacionActual.create(med, { transaction: t });
        }
      }
    });

    // Procesar cirugías
    await sequelize.transaction(async (t) => {
      await CirugiaPrevia.destroy({
        where: { id_historial },
        transaction: t,
      });
      if (req.body.cirugias) {
        const cirugiasData = req.body.cirugias.map((c) => ({
          id_historial,
          nombre: c.nombre,
          fecha: c.fecha ? new Date(c.fecha) : null,
          observaciones: c.observaciones,
        }));
        for (const cirugia of cirugiasData) {
          if (!cirugia || !cirugia.nombre || cirugia.nombre.trim() === "")
            continue;
          await CirugiaPrevia.create(cirugia, { transaction: t });
        }
      }
    });

    // Procesar antecedentes
    await sequelize.transaction(async (t) => {
      await AntecedenteFamiliar.destroy({
        where: { id_historial },
        transaction: t,
      });
      if (req.body.antecedentes) {
        const antecedentesData = req.body.antecedentes.map((a) => ({
          id_historial,
          familiar: a.familiar,
          enfermedad: a.enfermedad,
          observaciones: a.observaciones,
        }));
        for (const antecedente of antecedentesData) {
          if (
            !antecedente ||
            !antecedente.familiar ||
            antecedente.familiar.trim() === "" ||
            !antecedente.enfermedad ||
            antecedente.enfermedad.trim() === ""
          )
            continue;
          await AntecedenteFamiliar.create(antecedente, { transaction: t });
        }
      }
    });

    const role = await helper.getRole(req);
    const redirectUrl =
      role === "medico" ? "/medico/historia" : "/enfermeria/historial";

    res.redirect(
      `${redirectUrl}?id_admision=${id_admision}&mensajeAlert=Historial actualizado&alertClass=alert-success`
    );
  } catch (error) {
    console.error(error);
    const role = await helper.getRole(req);
    const redirectUrl =
      role === "medico" ? "/medico/misPacientes" : "/enfermeria/pacientes";

    res.redirect(
      `${redirectUrl}?mensajeAlert=Error al guardar el historial&alertClass=alert-danger`
    );
  }
}

async function upsertHistorial(id_paciente) {
  let historial = await HistorialMedico.findOne({
    where: { id_paciente },
  });
  if (!historial) {
    historial = await HistorialMedico.create({ id_paciente });
  }
  return historial.id_historial;
}

function validarHistorial(body) {
  // Validar alergias
  if (body.alergias) {
    for (const a of body.alergias) {
      if (a.tipo && String(a.tipo).trim() === "") {
        return true; // error
      }
    }
  }
  // Validar enfermedades
  if (body.enfermedades) {
    for (const e of body.enfermedades) {
      if (
        (e.nombre && String(e.nombre).trim() === "") ||
        (e.fecha_diagnostico && String(e.fecha_diagnostico).trim() === "")
      ) {
        return true;
      }
    }
  }
  // Validar medicación
  if (body.medicacion) {
    for (const m of body.medicacion) {
      if (
        (m.nombre && String(m.nombre).trim() === "") ||
        (m.dosis && String(m.dosis).trim() === "") ||
        (m.frecuencia && String(m.frecuencia).trim() === "")
      ) {
        return true;
      }
    }
  }
  // Validar cirugías
  if (body.cirugias) {
    for (const c of body.cirugias) {
      if (
        (c.nombre && String(c.nombre).trim() === "") ||
        (c.fecha && String(c.fecha).trim() === "")
      ) {
        return true;
      }
    }
  }
  // Validar antecedentes
  if (body.antecedentes) {
    for (const ant of body.antecedentes) {
      if (
        (ant.familiar && String(ant.familiar).trim() === "") ||
        (ant.enfermedad && String(ant.enfermedad).trim() === "")
      ) {
        return true;
      }
    }
  }
  return false;
}

module.exports = {
  getHistoria,
  postHistoria,
};
