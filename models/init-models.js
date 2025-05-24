var DataTypes = require("sequelize").DataTypes;
var _admisiones = require("./admisiones");
var _camas = require("./camas");
var _especialidades = require("./especialidades");
var _habitaciones = require("./habitaciones");
var _horarios = require("./horarios");
var _medico_especialidad = require("./medico_especialidad");
var _medicos = require("./medicos");
var _motivos = require("./motivos");
var _movimiento_camas = require("./movimiento_camas");
var _obra_sociales = require("./obra_sociales");
var _pacientes = require("./pacientes");
var _personas = require("./personas");
var _sectores = require("./sectores");
var _turnos = require("./turnos");

function initModels(sequelize) {
  var admisiones = _admisiones(sequelize, DataTypes);
  var camas = _camas(sequelize, DataTypes);
  var especialidades = _especialidades(sequelize, DataTypes);
  var habitaciones = _habitaciones(sequelize, DataTypes);
  var horarios = _horarios(sequelize, DataTypes);
  var medico_especialidad = _medico_especialidad(sequelize, DataTypes);
  var medicos = _medicos(sequelize, DataTypes);
  var motivos = _motivos(sequelize, DataTypes);
  var movimiento_camas = _movimiento_camas(sequelize, DataTypes);
  var obra_sociales = _obra_sociales(sequelize, DataTypes);
  var pacientes = _pacientes(sequelize, DataTypes);
  var personas = _personas(sequelize, DataTypes);
  var sectores = _sectores(sequelize, DataTypes);
  var turnos = _turnos(sequelize, DataTypes);

  movimiento_camas.belongsTo(admisiones, { as: "id_admision_admisione", foreignKey: "id_admision"});
  admisiones.hasMany(movimiento_camas, { as: "movimiento_camas", foreignKey: "id_admision"});
  movimiento_camas.belongsTo(camas, { as: "id_cama_cama", foreignKey: "id_cama"});
  camas.hasMany(movimiento_camas, { as: "movimiento_camas", foreignKey: "id_cama"});
  medico_especialidad.belongsTo(especialidades, { as: "id_especialidad_especialidade", foreignKey: "id_especialidad"});
  especialidades.hasMany(medico_especialidad, { as: "medico_especialidads", foreignKey: "id_especialidad"});
  camas.belongsTo(habitaciones, { as: "id_habitacion_habitacione", foreignKey: "id_habitacion"});
  habitaciones.hasMany(camas, { as: "camas", foreignKey: "id_habitacion"});
  horarios.belongsTo(medicos, { as: "id_medico_medico", foreignKey: "id_medico"});
  medicos.hasMany(horarios, { as: "horarios", foreignKey: "id_medico"});
  medico_especialidad.belongsTo(medicos, { as: "id_medico_medico", foreignKey: "id_medico"});
  medicos.hasMany(medico_especialidad, { as: "medico_especialidads", foreignKey: "id_medico"});
  turnos.belongsTo(medicos, { as: "id_medico_medico", foreignKey: "id_medico"});
  medicos.hasMany(turnos, { as: "turnos", foreignKey: "id_medico"});
  admisiones.belongsTo(motivos, { as: "id_motivo_motivo", foreignKey: "id_motivo"});
  motivos.hasMany(admisiones, { as: "admisiones", foreignKey: "id_motivo"});
  pacientes.belongsTo(obra_sociales, { as: "id_obra_social_obra_sociale", foreignKey: "id_obra_social"});
  obra_sociales.hasMany(pacientes, { as: "pacientes", foreignKey: "id_obra_social"});
  admisiones.belongsTo(pacientes, { as: "id_paciente_paciente", foreignKey: "id_paciente"});
  pacientes.hasMany(admisiones, { as: "admisiones", foreignKey: "id_paciente"});
  turnos.belongsTo(pacientes, { as: "id_paciente_paciente", foreignKey: "id_paciente"});
  pacientes.hasMany(turnos, { as: "turnos", foreignKey: "id_paciente"});
  medicos.belongsTo(personas, { as: "id_persona_persona", foreignKey: "id_persona"});
  personas.hasOne(medicos, { as: "medico", foreignKey: "id_persona"});
  pacientes.belongsTo(personas, { as: "id_persona_persona", foreignKey: "id_persona"});
  personas.hasOne(pacientes, { as: "paciente", foreignKey: "id_persona"});
  habitaciones.belongsTo(sectores, { as: "id_sector_sectore", foreignKey: "id_sector"});
  sectores.hasMany(habitaciones, { as: "habitaciones", foreignKey: "id_sector"});

  return {
    admisiones,
    camas,
    especialidades,
    habitaciones,
    horarios,
    medico_especialidad,
    medicos,
    motivos,
    movimiento_camas,
    obra_sociales,
    pacientes,
    personas,
    sectores,
    turnos,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
