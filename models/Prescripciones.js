const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db");

class Prescripciones extends Model {}

Prescripciones.init(
  {
    id_prescripcion: {
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
    medicamento: {
      type: DataTypes.TEXT,
    },
    dosis: {
      type: DataTypes.STRING,
    },
    frecuencia: {
      type: DataTypes.STRING,
    },
    via_administracion: {
      type: DataTypes.STRING,
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Prescripciones",
    tableName: "prescripciones",
    timestamps: false,
  }
);

module.exports = Prescripciones;
