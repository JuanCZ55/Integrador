const { Enfermero, Medico, Admision } = require("../models/init");

async function getRoleId(req) {
  const { id_empleado, rol } = req.user;
  if (rol === "enfermero") {
    const enfermero = await Enfermero.findOne({ where: { id_empleado } });
    return enfermero ? enfermero.id_enfermero : null;
  } else if (rol === "medico") {
    const medico = await Medico.findOne({ where: { id_empleado } });
    return medico ? medico.id_medico : null;
  } else if (rol === "admision") {
    const admision = await Admision.findOne({ where: { id_empleado } });
    return admision ? admision.id_admision : null;
  }
  return null;
}

module.exports = {
  getRoleId,
};
