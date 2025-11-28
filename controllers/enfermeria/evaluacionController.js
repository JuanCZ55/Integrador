const { EvaluacionEnfermeria } = require("../../models/init");
const { Admision, Paciente, Persona } = require("../../models/init");
const { getRoleId } = require("../../helpers/roleHelper");

function validator(
  sistolica,
  diastolica,
  frecuenciaCardiaca,
  frecuenciaRespiratoria,
  temperatura
) {
  const errors = [];

  // presión sistólica
  const sist = parseInt(sistolica);
  if (!sistolica || isNaN(sist)) {
    errors.push("La presión sistólica debe ser un número.");
  } else if (sist < 80 || sist > 250) {
    errors.push("La presión sistólica debe estar entre 80 y 250.");
  }

  // presión diastólica
  const diast = parseInt(diastolica);
  if (!diastolica || isNaN(diast)) {
    errors.push("La presión diastólica debe ser un número.");
  } else if (diast < 40 || diast > 150) {
    errors.push("La presión diastólica debe estar entre 40 y 150.");
  }

  // frecuencia cardíaca
  const fc = parseInt(frecuenciaCardiaca);
  if (!frecuenciaCardiaca || isNaN(fc)) {
    errors.push("La frecuencia cardíaca debe ser un número.");
  } else if (fc < 40 || fc > 220) {
    errors.push("La frecuencia cardíaca debe estar entre 40 y 220.");
  }

  // frecuencia respiratoria
  const fr = parseInt(frecuenciaRespiratoria);
  if (!frecuenciaRespiratoria || isNaN(fr)) {
    errors.push("La frecuencia respiratoria debe ser un número.");
  } else if (fr < 5 || fr > 50) {
    errors.push("La frecuencia respiratoria debe estar entre 5 y 50 .");
  }

  // temperatura
  const temp = parseFloat(temperatura);
  if (!temperatura || isNaN(temp)) {
    errors.push("La temperatura debe ser un número.");
  } else if (temp < 20 || temp > 50) {
    errors.push("La temperatura debe estar entre 20 y 50.");
  }

  return errors;
}

async function renderEva(
  res,
  mensajeAlert = null,
  alertClass = null,
  reqBody = {},
  evaluacion = null,
  id_admision
) {
  try {
    const evaluaciones = await EvaluacionEnfermeria.findAll({
      where: { id_admision: id_admision },
      order: [["fecha_eval", "DESC"]],
    });

    // Obtener la admisión con paciente y persona
    const admision = await Admision.findByPk(id_admision, {
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

    const paciente = admision ? admision.paciente : null;

    const data = {
      evaluacion,
      evaluaciones,
      id_admision,
      paciente,
      ...reqBody,
    };
    if (mensajeAlert) {
      data.mensajeAlert = mensajeAlert;
      data.alertClass = alertClass;
    }

    res.render("enfermeria/evaluacion", data);
  } catch (error) {
    console.error("Error al renderizar evaluación:", error);
    res.status(500).send("Error interno del servidor");
  }
}

async function getEvaluacion(req, res) {
  try {
    const { id_evaluacion, id_admision } = req.query;

    let evaluacion = null;

    if (id_evaluacion) {
      evaluacion = await EvaluacionEnfermeria.findByPk(id_evaluacion);
      if (!evaluacion) {
        return renderEva(
          res,
          ["Evaluación no encontrada"],
          "alert-warning",
          {},
          null,
          id_admision
        );
      }
    } else {
      if (!id_admision) {
        return renderEva(
          res,
          ["ID de admisión requerido"],
          "alert-danger",
          {},
          null,
          null
        );
      }
    }
    renderEva(
      res,
      null,
      null,
      {},
      evaluacion,
      id_admision || evaluacion.id_admision
    );
  } catch (error) {
    console.error("Error al obtener evaluación:", error);
    res.status(500).send("Error interno del servidor");
  }
}

async function postEvaluacion(req, res) {
  const {
    id_evaluacion,
    id_admision,
    sistolica,
    diastolica,
    frecuenciaCardiaca,
    frecuenciaRespiratoria,
    temperatura,
    observaciones,
  } = req.body;

  const id_enfermero = await getRoleId(req);

  if (!id_enfermero) {
    return renderEva(
      res,
      ["Usuario no autorizado o enfermero no encontrado"],
      "alert-danger",
      req.body,
      null,
      id_admision
    );
  }

  try {
    const errores = validator(
      sistolica,
      diastolica,
      frecuenciaCardiaca,
      frecuenciaRespiratoria,
      temperatura
    );
    if (errores.length > 0) {
      return renderEva(
        res,
        errores,
        "alert-danger",
        req.body,
        null,
        id_admision
      );
    }

    const data = {
      id_admision,
      id_enfermero,
      sistolica,
      diastolica,
      frecuenciaCardiaca,
      frecuenciaRespiratoria,
      temperatura,
      observaciones,
    };

    if (id_evaluacion && id_evaluacion !== 0) {
      data.id_evaluacion = id_evaluacion;
    }

    await EvaluacionEnfermeria.upsert(data);

    return renderEva(
      res,
      ["Evaluación guardada exitosamente"],
      "alert-success",
      req.body,
      null,
      id_admision
    );
  } catch (error) {
    console.error("Error al guardar evaluación:", error);
    return renderEva(
      res,
      ["Error al guardar la evaluación"],
      "alert-danger",
      req.body,
      null,
      id_admision
    );
  }
}

module.exports = {
  getEvaluacion,
  postEvaluacion,
};
