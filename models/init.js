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
const Usuario = require("./Usuario");
const Rol = require("./Rol");
const Empleado = require("./Empleado");
const Enfermero = require("./Enfermero");
const EnfermeroEspecialidad = require("./enfermero_especialidad");
const HistorialMedico = require("./HistorialMedico");
const Alergia = require("./Alergia");
const Enfermedad = require("./Enfermedad");
const MedicacionActual = require("./MedicacionActual");
const CirugiaPrevia = require("./CirugiaPrevia");
const AntecedenteFamiliar = require("./AntecedenteFamiliar");
const EvaluacionMedica = require("./EvaluacionMedica");
const EvaluacionEnfermeria = require("./EvaluacionEnfermeria");
const SintomasIniciales = require("./SintomasIniciales");
// Relaciones Usuario
Usuario.belongsTo(Empleado, {
  foreignKey: "id_empleado",
  as: "empleado",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Usuario.belongsTo(Rol, {
  foreignKey: "id_rol",
  as: "rol",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

// Relaciones Rol
Rol.hasMany(Usuario, {
  foreignKey: "id_rol",
  as: "usuarios",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});
Rol.hasMany(Empleado, {
  foreignKey: "id_rol",
  as: "empleados",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

// Relaciones Empleado
Empleado.hasOne(Usuario, {
  foreignKey: "id_empleado",
  as: "usuario",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Relaciones Persona
Persona.hasOne(Paciente, { foreignKey: "id_persona", as: "paciente" });

Persona.hasOne(Empleado, {
  foreignKey: "id_persona",
  as: "empleado",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
// Relaciones Paciente
Paciente.belongsTo(Persona, { foreignKey: "id_persona", as: "persona" });
Paciente.belongsTo(ObraSocial, {
  foreignKey: "id_obra_social",
  as: "obraSocial",
});
Paciente.hasMany(Admision, { foreignKey: "id_paciente", as: "admisiones" });
Paciente.hasMany(Turno, { foreignKey: "id_paciente", as: "turnos" });

// Relaciones Medico
Medico.belongsTo(Empleado, { foreignKey: "id_empleado", as: "empleado" });
Empleado.hasOne(Medico, { foreignKey: "id_empleado", as: "medico" });
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

// Relaciones Empleado
Empleado.belongsTo(Persona, {
  foreignKey: "id_persona",
  as: "persona",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Empleado.belongsTo(Rol, {
  foreignKey: "id_rol",
  as: "rol",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

// Relaciones Enfermero
Enfermero.belongsTo(Empleado, { foreignKey: "id_empleado", as: "empleado" });
Empleado.hasOne(Enfermero, { foreignKey: "id_empleado", as: "enfermero" });

// Relaciones Enfermero-Especialidad (muchos a muchos)
Enfermero.belongsToMany(Especialidad, {
  through: EnfermeroEspecialidad,
  foreignKey: "id_enfermero",
  otherKey: "id_especialidad",
  as: "especialidades",
});
Especialidad.belongsToMany(Enfermero, {
  through: EnfermeroEspecialidad,
  foreignKey: "id_especialidad",
  otherKey: "id_enfermero",
  as: "enfermeros",
});

// Relación Paciente 1:1 HistorialMedico
Paciente.hasOne(HistorialMedico, {
  foreignKey: "id_paciente",
  as: "historialMedico",
});
HistorialMedico.belongsTo(Paciente, {
  foreignKey: "id_paciente",
  as: "paciente",
});

// Relaciones HistorialMedico 1:N con tablas hijas
HistorialMedico.hasMany(Alergia, {
  foreignKey: "id_historial",
  as: "alergias",
});
Alergia.belongsTo(HistorialMedico, {
  foreignKey: "id_historial",
  as: "historialMedico",
});

HistorialMedico.hasMany(Enfermedad, {
  foreignKey: "id_historial",
  as: "enfermedades",
});
Enfermedad.belongsTo(HistorialMedico, {
  foreignKey: "id_historial",
  as: "historialMedico",
});

HistorialMedico.hasMany(MedicacionActual, {
  foreignKey: "id_historial",
  as: "medicaciones",
});
MedicacionActual.belongsTo(HistorialMedico, {
  foreignKey: "id_historial",
  as: "historialMedico",
});

HistorialMedico.hasMany(CirugiaPrevia, {
  foreignKey: "id_historial",
  as: "cirugias",
});
CirugiaPrevia.belongsTo(HistorialMedico, {
  foreignKey: "id_historial",
  as: "historialMedico",
});

HistorialMedico.hasMany(AntecedenteFamiliar, {
  foreignKey: "id_historial",
  as: "antecedentesFamiliares",
});
AntecedenteFamiliar.belongsTo(HistorialMedico, {
  foreignKey: "id_historial",
  as: "historialMedico",
});

HistorialMedico.hasMany(EvaluacionMedica, {
  foreignKey: "id_historial",
  as: "evaluacionesMedicas",
});
EvaluacionMedica.belongsTo(HistorialMedico, {
  foreignKey: "id_historial",
  as: "historialMedico",
});

HistorialMedico.hasMany(EvaluacionEnfermeria, {
  foreignKey: "id_historial",
  as: "evaluacionesEnfermeria",
});
EvaluacionEnfermeria.belongsTo(HistorialMedico, {
  foreignKey: "id_historial",
  as: "historialMedico",
});

HistorialMedico.hasMany(SintomasIniciales, {
  foreignKey: "id_historial",
  as: "sintomasIniciales",
});
SintomasIniciales.belongsTo(HistorialMedico, {
  foreignKey: "id_historial",
  as: "historialMedico",
});

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
  Usuario,
  Rol,
  Empleado,
  Enfermero,
  EnfermeroEspecialidad,
  HistorialMedico,
  Alergia,
  Enfermedad,
  MedicacionActual,
  CirugiaPrevia,
  AntecedenteFamiliar,
  EvaluacionMedica,
  EvaluacionEnfermeria,
  SintomasIniciales,
};
