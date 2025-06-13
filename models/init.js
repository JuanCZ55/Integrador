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
const HorarioTurno = require("./HorarioTurno");

// Relaciones Persona
Persona.hasOne(Paciente, { foreignKey: "id_persona", as: "paciente" });
Persona.hasOne(Medico, { foreignKey: "id_persona", as: "medico" });

// Relaciones Paciente
Paciente.belongsTo(Persona, { foreignKey: "id_persona", as: "persona" });
Paciente.belongsTo(ObraSocial, {
  foreignKey: "id_obra_social",
  as: "obraSocial",
});
Paciente.hasMany(Admision, { foreignKey: "id_paciente", as: "admisiones" });
Paciente.hasMany(Turno, { foreignKey: "id_paciente", as: "turnos" });

// Relaciones Medico
Medico.belongsTo(Persona, { foreignKey: "id_persona", as: "persona" });
Medico.hasMany(Turno, { foreignKey: "id_medico", as: "turnos" });
Medico.hasMany(Horario, { foreignKey: "id_medico", as: "horarios" });
Medico.belongsToMany(Especialidad, {
  through: MedicoEspecialidad,
  foreignKey: "id_medico",
  otherKey: "id_especialidad",
  as: "especialidades",
});

// Relaciones Especialidad
Especialidad.belongsToMany(Medico, {
  through: MedicoEspecialidad,
  foreignKey: "id_especialidad",
  otherKey: "id_medico",
  as: "medicos",
});

// Relaciones MedicoEspecialidad
MedicoEspecialidad.belongsTo(Medico, { foreignKey: "id_medico", as: "medico" });
MedicoEspecialidad.belongsTo(Especialidad, {
  foreignKey: "id_especialidad",
  as: "especialidad",
});

// Relaciones Turno
Turno.belongsTo(Paciente, { foreignKey: "id_paciente", as: "paciente" });
Turno.belongsTo(Medico, { foreignKey: "id_medico", as: "medico" });
Turno.belongsTo(HorarioTurno, {
  foreignKey: "id_horario_turno",
  as: "horarioTurno",
});

HorarioTurno.hasMany(Turno, { foreignKey: "id_horario_turno", as: "turnos" });
// Relaciones Horario
Horario.belongsTo(Medico, { foreignKey: "id_medico", as: "medico" });

// Relaciones Admision
Admision.belongsTo(Paciente, { foreignKey: "id_paciente", as: "paciente" });
Admision.belongsTo(Motivos, { foreignKey: "id_motivo", as: "motivo" });
Admision.hasMany(MovimientoCama, {
  foreignKey: "id_admision",
  as: "movimientosCama",
});

// Relaciones Motivos
Motivos.hasMany(Admision, { foreignKey: "id_motivo", as: "admisiones" });

// Relaciones ObraSocial
ObraSocial.hasMany(Paciente, { foreignKey: "id_obra_social", as: "pacientes" });

// Relaciones MovimientoCama
MovimientoCama.belongsTo(Admision, {
  foreignKey: "id_admision",
  as: "admision",
});
MovimientoCama.belongsTo(Cama, { foreignKey: "id_cama", as: "cama" });

// Relaciones Cama
Cama.belongsTo(Habitacion, { foreignKey: "id_habitacion", as: "habitacion" });
Cama.hasMany(MovimientoCama, { foreignKey: "id_cama", as: "movimientosCama" });

// Relaciones Habitacion
Habitacion.belongsTo(Sector, { foreignKey: "id_sector", as: "sector" });
Habitacion.hasMany(Cama, { foreignKey: "id_habitacion", as: "camas" });

// Relaciones Sector
Sector.hasMany(Habitacion, { foreignKey: "id_sector", as: "habitaciones" });

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
  HorarioTurno,
};
