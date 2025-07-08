const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db");

class Enfermedad extends Model {}

Enfermedad.init(
  {
    id_enfermedad: {
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
    cronica: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    fecha_diagnostico: {
      type: DataTypes.DATE,
    },
    observaciones: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: "Enfermedad",
    tableName: "enfermedad",
    timestamps: false,
  }
);

module.exports = Enfermedad;
