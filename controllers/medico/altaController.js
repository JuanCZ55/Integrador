const {
  AltaHospitalaria,
  Admision,
  Medico,
  Paciente,
  Persona,
  Empleado,
} = require("../../models/init.js");
const helper = require("../../helpers/roleHelper");

async function getAlta(req, res) {
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
      return res.render("medico/alta", {
        alta: null,
        paciente: null,
        mensajeAlert: ["Admisión no encontrada"],
        alertClass: "alert-danger",
      });
    }

    const alta = await AltaHospitalaria.findOne({
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
    });

    const paciente = {
      nombre: `${admision.paciente.persona.nombre} ${admision.paciente.persona.apellido}`,
      dni: admision.paciente.persona.dni,
      id_admision,
    };

    res.render("medico/alta", {
      alta,
      paciente,
      mensajeAlert: req.query.mensaje || [],
      alertClass: req.query.alertClass || "",
    });
  } catch (error) {
    console.error(error);
    res.render("medico/alta", {
      alta: null,
      paciente: null,
      mensajeAlert: ["Error al cargar el alta"],
      alertClass: "alert-danger",
    });
  }
}

async function postAlta(req, res) {
  const { id_admision, motivo_alta, instrucciones, medicacion } = req.body;
  try {
    const id_medico = await helper.getRoleId(req);

    const existingAlta = await AltaHospitalaria.findOne({
      where: { id_admision },
    });

    const data = {
      id_admision,
      id_medico,
      motivo_alta,
      instrucciones,
      medicacion,
      fecha: new Date(),
    };

    if (existingAlta) {
      data.id_alta = existingAlta.id_alta;
    }

    await AltaHospitalaria.upsert(data);

    res.redirect(`/medico/alta?id_admision=${id_admision}`);
  } catch (error) {
    console.error(error);
    res.redirect(
      `/medico/alta?id_admision=${id_admision}&mensaje=Error al guardar el alta&alertClass=alert-danger`
    );
  }
}

module.exports = {
  getAlta,
  postAlta,
};
