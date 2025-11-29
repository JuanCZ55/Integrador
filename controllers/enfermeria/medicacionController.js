const {
  Prescripciones,
  AdministracionMedicamentos,
  Enfermero,
  Empleado,
  Persona,
} = require("../../models/init");

async function getMedicacion(req, res) {
  try {
    const idAdmision = req.query.id_admision;
    const { mensajeAlert, alertClass } = req.query;
    if (!idAdmision) {
      return res.render("enfermeria/medicacion", {
        mensajeAlert: "ID de admisión requerido",
        alertClass: "alert-danger",
      });
    }

    const prescripciones = await Prescripciones.findAll({
      where: { id_admision: idAdmision, estado: 1 },
      include: [
        {
          model: AdministracionMedicamentos,
          as: "administraciones",
          include: [
            {
              model: Enfermero,
              as: "enfermero",
              include: [
                {
                  model: Empleado,
                  as: "empleado",
                  include: [{ model: Persona, as: "persona" }],
                },
              ],
            },
          ],
          order: [["fecha_hora", "DESC"]],
        },
      ],
    });

    const datos = prescripciones.map((p) => {
      const ultAdmin =
        p.administraciones && p.administraciones.length > 0
          ? p.administraciones[0]
          : null;
      const num = parseInt(p.frecuencia, 10);
      const msFrec = isNaN(num) ? null : num * 3600 * 1000;
      let proxDosis = null;
      if (ultAdmin && msFrec) {
        proxDosis = new Date(ultAdmin.fecha_hora.getTime() + msFrec);
      }
      return {
        id_prescripcion: p.id_prescripcion,
        medicamento: p.medicamento,
        dosis: p.dosis,
        frecuencia: p.frecuencia,
        via: p.via_administracion,
        ultAdminStr: ultAdmin ? ultAdmin.fecha_hora.toLocaleString() : "Nunca",
        proxDosisStr: proxDosis ? proxDosis.toLocaleString() : "N/D",
        administraciones: p.administraciones,
      };
    });

    // Historial
    const historial = [];
    prescripciones.forEach((p) => {
      p.administraciones.forEach((a) => {
        historial.push({
          id_administracion: a.id_administracion,
          medicamento: p.medicamento,
          dosis: p.dosis,
          fecha_hora: a.fecha_hora,
          enfermero: a.enfermero
            ? `${a.enfermero.empleado.persona.nombre} ${a.enfermero.empleado.persona.apellido}`
            : "Desconocido",
        });
      });
    });
    historial.sort((a, b) => b.fecha_hora - a.fecha_hora);

    const historialParaVista = historial.map((h) => ({
      ...h,
      fecha_hora: h.fecha_hora.toLocaleString(),
    }));

    res.render("enfermeria/medicacion", {
      prescripciones: datos,
      historial: historialParaVista,
      id_admision: idAdmision,
      mensajeAlert,
      alertClass,
    });
  } catch (err) {
    console.error("Error en getMedicacion:", err);
    res.render("enfermeria/medicacion", {
      mensajeAlert: "Error al cargar medicación",
      alertClass: "alert-danger",
    });
  }
}

async function postMedicacion(req, res) {
  try {
    const { id_prescripcion } = req.body;
    const idAdmision = req.query.id_admision;
    const idEmpleado = req.session.id_empleado;
    if (!id_prescripcion || !idEmpleado) {
      return res.redirect(
        `/enfermeria/medicacion?id_admision=${idAdmision}&mensajeAlert=Error&alertClass=alert-danger`
      );
    }

    const enfermero = await Enfermero.findOne({
      where: { id_empleado: idEmpleado },
    });
    if (!enfermero) {
      return res.redirect(
        `/enfermeria/medicacion?id_admision=${idAdmision}&mensajeAlert=No autorizado&alertClass=alert-danger`
      );
    }

    await AdministracionMedicamentos.create({
      id_prescripcion,
      id_enfermero: enfermero.id_enfermero,
      fecha_hora: new Date(),
      estado: 1,
    });

    res.redirect(
      `/enfermeria/medicacion?id_admision=${idAdmision}&mensajeAlert=Medicamento administrado&alertClass=alert-success`
    );
  } catch (err) {
    console.error("Error en postMedicacion:", err);
    res.redirect(
      `/enfermeria/medicacion?id_admision=${req.query.id_admision}&mensajeAlert=Error&alertClass=alert-danger`
    );
  }
}
async function deleteMedicacion(req, res) {
  try {
    const { id_administracion } = req.body;
    const idAdmision = req.query.id_admision;
    if (!id_administracion) {
      return res.redirect(
        `/enfermeria/medicacion?id_admision=${idAdmision}&mensajeAlert=Error&alertClass=alert-danger`
      );
    }

    await AdministracionMedicamentos.update(
      { estado: 0 },
      { where: { id_administracion } }
    );

    res.redirect(
      `/enfermeria/medicacion?id_admision=${idAdmision}&mensajeAlert=Eliminado&alertClass=alert-success`
    );
  } catch (err) {
    console.error("Error en deleteMedicacion:", err);
    res.redirect(
      `/enfermeria/medicacion?id_admision=${req.query.id_admision}&mensajeAlert=Error&alertClass=alert-danger`
    );
  }
}
module.exports = {
  deleteMedicacion,
  getMedicacion,
  postMedicacion,
};
