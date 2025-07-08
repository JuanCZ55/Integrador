const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db");

class HistorialMedico extends Model {}

HistorialMedico.init(
  {
    id_historial: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    id_paciente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // Relación 1:1 con Paciente
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    fecha_actualizacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "HistorialMedico",
    tableName: "historial_medico",
    timestamps: false,
  }
);

module.exports = HistorialMedico;
