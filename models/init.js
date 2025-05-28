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
const MedicoEspecialidad = require("./medico_especialidad");
// Relaciones Persona
Persona.hasOne(Paciente, { foreignKey: "id_persona", as: "paciente" });
Persona.hasOne(Medico, { foreignKey: "id_persona", as: "medico" });

// Relaciones Paciente
Paciente.belongsTo(Persona, { foreignKey: "id_persona" });
Paciente.belongsTo(ObraSocial, { foreignKey: "id_obra_social" });
Paciente.hasMany(Admision, { foreignKey: "id_paciente" });
Paciente.hasMany(Turno, { foreignKey: "id_paciente" });

// Relaciones Medico
Medico.belongsTo(Persona, { foreignKey: "id_persona" });
Medico.hasMany(Turno, { foreignKey: "id_medico" });
Medico.hasMany(Horario, { foreignKey: "id_medico" });
Medico.belongsToMany(Especialidad, {
  through: MedicoEspecialidad,
  foreignKey: "id_medico",
  otherKey: "id_especialidad",
});

// Relaciones Especialidad
Especialidad.belongsToMany(Medico, {
  through: MedicoEspecialidad,
  foreignKey: "id_especialidad",
  otherKey: "id_medico",
});

// Relaciones MedicoEspecialidad
MedicoEspecialidad.belongsTo(Medico, { foreignKey: "id_medico" });
MedicoEspecialidad.belongsTo(Especialidad, { foreignKey: "id_especialidad" });

// Relaciones Turno
Turno.belongsTo(Paciente, { foreignKey: "id_paciente" });
Turno.belongsTo(Medico, { foreignKey: "id_medico" });

// Relaciones Horario
Horario.belongsTo(Medico, { foreignKey: "id_medico" });

// Relaciones Admision
Admision.belongsTo(Paciente, { foreignKey: "id_paciente" });
Admision.belongsTo(Motivos, { foreignKey: "id_motivo" });
Admision.hasMany(MovimientoCama, { foreignKey: "id_admision" });

// Relaciones Motivos
Motivos.hasMany(Admision, { foreignKey: "id_motivo" });

// Relaciones ObraSocial
ObraSocial.hasMany(Paciente, { foreignKey: "id_obra_social" });

// Relaciones MovimientoCama
MovimientoCama.belongsTo(Admision, { foreignKey: "id_admision" });
MovimientoCama.belongsTo(Cama, { foreignKey: "id_cama" });

// Relaciones Cama
Cama.belongsTo(Habitacion, { foreignKey: "id_habitacion" });
Cama.hasMany(MovimientoCama, { foreignKey: "id_cama" });

// Relaciones Habitacion
Habitacion.belongsTo(Sector, { foreignKey: "id_sector" });
Habitacion.hasMany(Cama, { foreignKey: "id_habitacion" });

// Relaciones Sector
Sector.hasMany(Habitacion, { foreignKey: "id_sector" });

module.exports = {
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
  MedicoEspecialidad,
};
