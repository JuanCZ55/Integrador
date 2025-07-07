const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db");
const Enfermero = require("./Enfermero");
const Especialidad = require("./Especialidad");

class EnfermeroEspecialidad extends Model {}

EnfermeroEspecialidad.init(
  {
    id_enfermero_especialidad: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    id_enfermero: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Enfermero,
        key: "id_enfermero",
      },
    },
    id_especialidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Especialidad,
        key: "id_especialidad",
      },
    },
  },
  {
    sequelize,
    modelName: "EnfermeroEspecialidad",
    tableName: "enfermero_especialidad",
    timestamps: false,
  }
);

module.exports = EnfermeroEspecialidad;
