const Admision = require("./Admision");
const Cama = require("./Cama");
const Especialidad = require("./Especialidad");
const Habitacion = require("./Habitacion");
const Horario = require("./Horario");
const Medico = require("./Medico");
const Motivos = require("./Motivos");
const MovimientoCama = require("./MovimientoCama");
const ObraSocial = require("./ObraSocial");
const Paciente = require("./Paciente");
const Persona = require("./Persona");
const Sector = require("./Sector");
const Turno = require("./Turno");

function initModels() {
  Medico.belongsToMany(Especialidad, { through: 'medico_especialidad', foreignKey: 'id_medico', otherKey: 'id_especialidad' });
  Especialidad.belongsToMany(Medico, { through: 'medico_especialidad', foreignKey: 'id_especialidad', otherKey: 'id_medico' });

  MovimientoCama.belongsTo(Admision, { as: "admision", foreignKey: "id_admision" });
  Admision.hasMany(MovimientoCama, { as: "movimientosCama", foreignKey: "id_admision" });

  MovimientoCama.belongsTo(Cama, { as: "cama", foreignKey: "id_cama" });
  Cama.hasMany(MovimientoCama, { as: "movimientosCama", foreignKey: "id_cama" });

  Cama.belongsTo(Habitacion, { as: "habitacion", foreignKey: "id_habitacion" });
  Habitacion.hasMany(Cama, { as: "camas", foreignKey: "id_habitacion" });

  Horario.belongsTo(Medico, { as: "medico", foreignKey: "id_medico" });
  Medico.hasMany(Horario, { as: "horarios", foreignKey: "id_medico" });

  Turno.belongsTo(Medico, { as: "medico", foreignKey: "id_medico" });
  Medico.hasMany(Turno, { as: "turnos", foreignKey: "id_medico" });

  Admision.belongsTo(Motivos, { as: "motivo", foreignKey: "id_motivo" });
  Motivos.hasMany(Admision, { as: "admisiones", foreignKey: "id_motivo" });

  Paciente.belongsTo(ObraSocial, { as: "obraSocial", foreignKey: "id_obra_social" });
  ObraSocial.hasMany(Paciente, { as: "pacientes", foreignKey: "id_obra_social" });

  Admision.belongsTo(Paciente, { as: "paciente", foreignKey: "id_paciente" });
  Paciente.hasMany(Admision, { as: "admisiones", foreignKey: "id_paciente" });

  Turno.belongsTo(Paciente, { as: "paciente", foreignKey: "id_paciente" });
  Paciente.hasMany(Turno, { as: "turnos", foreignKey: "id_paciente" });

  Medico.belongsTo(Persona, { as: "persona", foreignKey: "id_persona" });
  Persona.hasOne(Medico, { as: "medico", foreignKey: "id_persona" });

  Paciente.belongsTo(Persona, { as: "persona", foreignKey: "id_persona" });
  Persona.hasOne(Paciente, { as: "paciente", foreignKey: "id_persona" });

  Habitacion.belongsTo(Sector, { as: "sector", foreignKey: "id_sector" });
  Sector.hasMany(Habitacion, { as: "habitaciones", foreignKey: "id_sector" });

  return {
    Admision,
    Cama,
    Especialidad,
    Habitacion,
    Horario,
    Medico,
    Motivos,
    MovimientoCama,
    ObraSocial,
    Paciente,
    Persona,
    Sector,
    Turno,
  };
}

module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
