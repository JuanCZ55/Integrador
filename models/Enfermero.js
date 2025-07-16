const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db");
const Empleado = require("./Empleado");

class Enfermero extends Model {}

Enfermero.init(
  {
    id_enfermero: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    id_empleado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Empleado,
        key: "id_empleado",
      },
      unique: true,
    },
    nro_licencia: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "Enfermero",
    tableName: "enfermeros",
    timestamps: true,
  }
);

module.exports = Enfermero;
