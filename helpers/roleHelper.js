const { Enfermero, Medico, Admision } = require("../models/init");

async function getRoleId(req) {
  const { id_empleado, id_rol } = req.user;
  if (id_rol === 4) {
    const enfermero = await Enfermero.findOne({ where: { id_empleado } });
    return enfermero ? enfermero.id_enfermero : null;
  } else if (id_rol === 3) {
    const medico = await Medico.findOne({ where: { id_empleado } });
    return medico ? medico.id_medico : null;
  } else if (id_rol === 2) {
    const admision = await Admision.findOne({ where: { id_empleado } });
    return admision ? admision.id_admision : null;
  }
  return null;
}

async function getRole(req) {
  const { id_rol } = req.user;
  if (id_rol === 3) return "medico";
  if (id_rol === 4) return "enfermera";
  return null;
}

module.exports = {
  getRoleId,
  getRole,
};
