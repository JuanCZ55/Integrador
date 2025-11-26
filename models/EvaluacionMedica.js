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
    id_admision: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_medico: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fecha_eval: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    observaciones: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: "EvaluacionMedica",
    tableName: "evaluacion_medica",
    timestamps: true,
    paranoid: true,
  }
);

module.exports = EvaluacionMedica;
