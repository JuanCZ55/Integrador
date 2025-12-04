const {
  EvaluacionEnfermeria,
  Admision,
  Enfermero,
  Paciente,
  Persona,
  Empleado,
} = require("../../models/init.js");
const helper = require("../../helpers/roleHelper");

async function getEvaluacionEnfermeria(req, res) {
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
        {
          model: EvaluacionEnfermeria,
          as: "evolucionesEnfermeria",
          include: [
            {
              model: Enfermero,
              as: "enfermero",
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
        },
      ],
    });

    if (!admision) {
      return res
        .status(404)
        .render("notfound", { message: "Admisión no encontrada" });
    }

    const role = await helper.getRole(req);
    res.render("medico/evaluacion-enfermeria", {
      admision,
      paciente: admision.paciente,
      evaluaciones: admision.evolucionesEnfermeria,
      mensajeAlert: req.query.mensajeAlert || "",
      alertClass: req.query.alertClass || "",
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("notfound", {
      message: "Error al cargar las evaluaciones de enfermería",
    });
  }
}

module.exports = {
  getEvaluacionEnfermeria,
};
