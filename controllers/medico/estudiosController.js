const {
  SolicitudEstudios,
  Admision,
  Medico,
  Paciente,
  Persona,
  Empleado,
} = require("../../models/init.js");
const helper = require("../../helpers/roleHelper");

async function getEstudios(req, res) {
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
      return res.render("medico/estudios", {
        solicitudes: [],
        paciente: null,
        mensajeAlert: ["Admisión no encontrada"],
        alertClass: "alert-danger",
      });
    }

    const solicitudes = await SolicitudEstudios.findAll({
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
      order: [["createdAt", "DESC"]],
    });

    const paciente = {
      nombre: `${admision.paciente.persona.nombre} ${admision.paciente.persona.apellido}`,
      dni: admision.paciente.persona.dni,
      id_admision,
    };

    res.render("medico/estudios", {
      solicitudes,
      paciente,
      mensajeAlert: req.query.mensaje || [],
      alertClass: req.query.alertClass || "",
    });
  } catch (error) {
    console.error(error);
    res.render("medico/estudios", {
      solicitudes: [],
      paciente: null,
      mensajeAlert: ["Error al cargar las solicitudes de estudios"],
      alertClass: "alert-danger",
    });
  }
}

async function postEstudios(req, res) {
  const { id_solicitud, id_admision, estudio, justificacion } = req.body;
  try {
    const errores = validarDatos(["estudio", "justificacion"], {
      estudio,
      justificacion,
    });
    if (errores.length > 0) {
      return res.redirect(
        `/medico/estudios?id_admision=${id_admision}&mensaje=Complete todos los campos obligatorios (*)&alertClass=alert-danger`
      );
    }

    const id_medico = await helper.getRoleId(req);

    const data = {
      id_solicitud,
      id_admision,
      id_medico,
      estudio,
      justificacion,
    };

    await SolicitudEstudios.upsert(data);

    res.redirect(`/medico/estudios?id_admision=${id_admision}`);
  } catch (error) {
    console.error(error);
    res.redirect(
      `/medico/estudios?id_admision=${id_admision}&mensaje=Error al guardar la solicitud&alertClass=alert-danger`
    );
  }
}

async function postDeleteEstudios(req, res) {
  const { id_solicitud, id_admision } = req.body;
  try {
    await SolicitudEstudios.destroy({ where: { id_solicitud } });
    res.redirect(`/medico/estudios?id_admision=${id_admision}`);
  } catch (error) {
    console.error(error);
    res.redirect(
      `/medico/estudios?id_admision=${id_admision}&mensaje=Error al eliminar la solicitud&alertClass=alert-danger`
    );
  }
}

function validarDatos(camposObligatorios, datos) {
  const errores = [];
  for (const campo of camposObligatorios) {
    if (!datos[campo] || datos[campo].toString().trim() === "") {
      errores.push(`${campo} es obligatorio`);
    }
  }
  return errores;
}

module.exports = {
  getEstudios,
  postEstudios,
  postDeleteEstudios,
};
