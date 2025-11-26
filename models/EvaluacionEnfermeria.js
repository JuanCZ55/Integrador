const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db");

class EvaluacionEnfermeria extends Model {}

EvaluacionEnfermeria.init(
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
    id_enfermero: {
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
    modelName: "EvaluacionEnfermeria",
    tableName: "evaluacion_enfermeria",
    timestamps: true,
    paranoid: true,
  }
);

module.exports = EvaluacionEnfermeria;
