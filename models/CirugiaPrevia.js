const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db");

class CirugiaPrevia extends Model {}

CirugiaPrevia.init(
  {
    id_cirugia: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_historial: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATE,
    },
    observaciones: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: "CirugiaPrevia",
    tableName: "cirugia_previa",
    timestamps: false,
  }
);

module.exports = CirugiaPrevia;
