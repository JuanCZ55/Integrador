const {
  EvaluacionMedica,
  Admision,
  Medico,
  Paciente,
  Persona,
  Empleado,
} = require("../../models/init.js");
const helper = require("../../helpers/roleHelper");

async function getEvaluacion(req, res) {
  const { id_admision } = req.query;
  try {
    const admision = await Admision.findOne({
      where: { id_admision, estado: 1 },
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
      ],
    });

    if (!admision) {
      return res.render("medico/evaluacion", {
        evaluaciones: [],
        paciente: null,
        mensajeAlert: ["Admisión no encontrada"],
        alertClass: "alert-danger",
      });
    }

    const evaluaciones = await EvaluacionMedica.findAll({
      where: { id_admision },
      include: [
        {
          model: Medico,
          as: "medico",
          include: [
            {
              model: Empleado,
              as: "empleado",
              include: [
                {
                  model: Persona,
                  as: "persona",
                },
              ],
            },
          ],
        },
      ],
      order: [["fecha_eval", "DESC"]],
    });

    const paciente = {
      nombre: `${admision.paciente.persona.nombre} ${admision.paciente.persona.apellido}`,
      dni: admision.paciente.persona.dni,
      id_admision,
    };

    res.render("medico/evaluacion", {
      evaluaciones,
      paciente,
      mensajeAlert: req.query.mensaje || [],
      alertClass: req.query.alertClass || "",
    });
  } catch (error) {
    console.error(error);
    res.render("medico/evaluacion", {
      evaluaciones: [],
      paciente: null,
      mensajeAlert: ["Error al cargar las evaluaciones"],
      alertClass: "alert-danger",
    });
  }
}

async function postEvaluacion(req, res) {
  const { id_evaluacion, id_admision, observaciones } = req.body;
  try {
    const id_medico = await helper.getRoleId(req);

    const data = {
      id_evaluacion,
      id_admision,
      id_medico,
      fecha_eval: new Date(),
      observaciones,
    };

    await EvaluacionMedica.upsert(data);

    res.redirect(`/medico/evaluacion?id_admision=${id_admision}`);
  } catch (error) {
    console.error(error);
    res.redirect(
      `/medico/evaluacion?id_admision=${id_admision}&mensaje=Error al guardar la evaluación&alertClass=alert-danger`
    );
  }
}

async function postDeleteEvaluacion(req, res) {
  const { id_evaluacion, id_admision } = req.body;
  try {
    await EvaluacionMedica.destroy({ where: { id_evaluacion } });
    res.redirect(`/medico/evaluacion?id_admision=${id_admision}`);
  } catch (error) {
    console.error(error);
    res.redirect(
      `/medico/evaluacion?id_admision=${id_admision}&mensaje=Error al eliminar la evaluación&alertClass=alert-danger`
    );
  }
}

module.exports = {
  getEvaluacion,
  postEvaluacion,
  postDeleteEvaluacion,
};
