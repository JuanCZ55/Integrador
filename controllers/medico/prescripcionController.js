const {
  Paciente,
  Admision,
  Persona,
  Prescripciones,
} = require("../../models/init");
const { getRoleId } = require("../../helpers/roleHelper");

const getPrescripcion = async (req, res) => {
  try {
    const id_admision = parseInt(req.query.id_admision);
    const admision = await Admision.findOne({
      where: { id_admision },
      include: [
        {
          model: Paciente,
          as: "paciente",
          include: [{ model: Persona, as: "persona" }],
        },
      ],
    });

    if (!admision) {
      return res.redirect(
        "/medico/misPacientes?mensaje=Admisión no encontrada&alertClass=alert-danger"
      );
    }

    const prescripciones = await Prescripciones.findAll({
      where: { id_admision, estado: 1 },
      order: [["id_prescripcion", "DESC"]],
    });

    const paciente = {
      nombre: `${admision.paciente.persona.nombre} ${admision.paciente.persona.apellido}`,
      dni: admision.paciente.persona.dni,
      id_admision: admision.id_admision,
    };

    res.render("medico/prescripcion", {
      paciente,
      prescripciones,
      mensajeAlert: req.query.mensaje || [],
      alertClass: req.query.alertClass || "",
    });
  } catch (error) {
    console.error(error);
    res.redirect(
      `/medico/prescripcion?id_admision=${req.query.id_admision}&mensaje=Error al cargar prescripción&alertClass=alert-danger`
    );
  }
};

const guardarPrescripcion = async (req, res) => {
  try {
    let { prescripciones, id_admision } = req.body;

    const id_medico = await getRoleId(req);

    if (
      !prescripciones ||
      !Array.isArray(prescripciones) ||
      prescripciones.length === 0
    ) {
      return res.redirect(
        `/medico/prescripcion?id_admision=${id_admision}&mensaje=Debe agregar al menos una prescripción&alertClass=alert-danger`
      );
    }

    const prescripcionesData = [];
    for (let p of prescripciones) {
      if (p.medicamento && p.dosis && p.frecuencia && p.via_administracion) {
        prescripcionesData.push({
          id_admision: parseInt(id_admision),
          id_medico,
          medicamento: p.medicamento,
          dosis: p.dosis,
          frecuencia: p.frecuencia,
          via_administracion: p.via_administracion,
          estado: 1,
        });
      }
    }

    await Prescripciones.bulkCreate(prescripcionesData);

    res.redirect(
      `/medico/prescripcion?id_admision=${id_admision}&mensaje=Prescripciones guardadas exitosamente&alertClass=alert-success`
    );
  } catch (error) {
    console.error(error);
    res.redirect(
      `/medico/prescripcion?id_admision=${req.body.id_admision}&mensaje=Error al guardar prescripciones&alertClass=alert-danger`
    );
  }
};

const modificarPrescripcion = async (req, res) => {
  try {
    const {
      id_prescripcion,
      medicamento,
      dosis,
      frecuencia,
      via_administracion,
      id_admision,
    } = req.body;
    await Prescripciones.update(
      { medicamento, dosis, frecuencia, via_administracion },
      { where: { id_prescripcion } }
    );
    res.redirect(
      `/medico/prescripcion?id_admision=${id_admision}&mensaje=Prescripción modificada exitosamente&alertClass=alert-success`
    );
  } catch (error) {
    console.error(error);
    res.redirect(
      `/medico/prescripcion?id_admision=${req.body.id_admision}&mensaje=Error al modificar prescripción&alertClass=alert-danger`
    );
  }
};

const eliminarPrescripcion = async (req, res) => {
  try {
    const { id, id_admision } = req.body;
    await Prescripciones.update(
      { estado: 2 },
      { where: { id_prescripcion: id } }
    );
    res.redirect(
      `/medico/prescripcion?id_admision=${id_admision}&mensaje=Prescripción eliminada exitosamente&alertClass=alert-success`
    );
  } catch (error) {
    console.error(error);
    res.redirect(
      `/medico/prescripcion?id_admision=${req.body.id_admision}&mensaje=Error al eliminar prescripción&alertClass=alert-danger`
    );
  }
};

module.exports = {
  getPrescripcion,
  guardarPrescripcion,
  modificarPrescripcion,
  eliminarPrescripcion,
};
