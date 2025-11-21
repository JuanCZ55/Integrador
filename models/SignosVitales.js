const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db");

class SignosVitales extends Model {}

SignosVitales.init(
  {
    id_signos_vitales: {
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
    fecha_hora: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    ta_sistolica: {
      type: DataTypes.INTEGER,
    },
    ta_diastolica: {
      type: DataTypes.INTEGER,
    },
    pulso: {
      type: DataTypes.INTEGER,
    },
    temperatura: {
      type: DataTypes.DECIMAL,
    },
    saturacion: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    modelName: "SignosVitales",
    tableName: "signos_vitales",
    timestamps: false,
  }
);

module.exports = SignosVitales;
