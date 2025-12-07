const {
  DiagnosticosEpisodio,
  Admision,
  Medico,
  Paciente,
  Persona,
  Empleado,
} = require("../../models/init.js");
const helper = require("../../helpers/roleHelper");

async function getDiagnostico(req, res) {
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
      return res.render("medico/diagnostico", {
        diagnosticos: [],
        paciente: null,
        mensajeAlert: ["Admisión no encontrada"],
        alertClass: "alert-danger",
      });
    }

    const diagnosticos = await DiagnosticosEpisodio.findAll({
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
      order: [["fecha_hora", "DESC"]],
    });

    const paciente = {
      nombre: `${admision.paciente.persona.nombre} ${admision.paciente.persona.apellido}`,
      dni: admision.paciente.persona.dni,
      id_admision,
    };

    res.render("medico/diagnostico", {
      diagnosticos,
      paciente,
      mensajeAlert: req.query.mensaje || [],
      alertClass: req.query.alertClass || "",
    });
  } catch (error) {
    console.error(error);
    res.render("medico/diagnostico", {
      diagnosticos: [],
      paciente: null,
      mensajeAlert: ["Error al cargar los diagnósticos"],
      alertClass: "alert-danger",
    });
  }
}

async function postDiagnostico(req, res) {
  const { id_diag_episodio, id_admision, diagnostico, tipo } = req.body;
  try {
    const errores = validarDatos(["diagnostico", "tipo"], {
      diagnostico,
      tipo,
    });
    if (errores.length > 0) {
      return res.redirect(
        `/medico/diagnostico?id_admision=${id_admision}&mensaje=Complete todos los campos obligatorios (*)&alertClass=alert-danger`
      );
    }

    const id_medico = await helper.getRoleId(req);

    const data = {
      id_diag_episodio,
      id_admision,
      id_medico,
      diagnostico,
      tipo,
      fecha_hora: new Date(),
    };

    await DiagnosticosEpisodio.upsert(data);

    res.redirect(`/medico/diagnostico?id_admision=${id_admision}`);
  } catch (error) {
    console.error(error);
    res.redirect(
      `/medico/diagnostico?id_admision=${id_admision}&mensaje=Error al guardar el diagnóstico&alertClass=alert-danger`
    );
  }
}

async function postDeleteDiagnostico(req, res) {
  const { id_diag_episodio, id_admision } = req.body;
  try {
    await DiagnosticosEpisodio.destroy({ where: { id_diag_episodio } });
    res.redirect(`/medico/diagnostico?id_admision=${id_admision}`);
  } catch (error) {
    console.error(error);
    res.redirect(
      `/medico/diagnostico?id_admision=${id_admision}&mensaje=Error al eliminar el diagnóstico&alertClass=alert-danger`
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
  getDiagnostico,
  postDiagnostico,
  postDeleteDiagnostico,
};
