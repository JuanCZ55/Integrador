const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db");

class EvaluacionMedica extends Model {}

EvaluacionMedica.init(
  {
    id_evaluacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_historial: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fecha_eval: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    diagnostico: {
      type: DataTypes.TEXT,
    },
    indicaciones: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: "EvaluacionMedica",
    tableName: "evaluacion_medica",
    timestamps: false,
  }
);

module.exports = EvaluacionMedica;
