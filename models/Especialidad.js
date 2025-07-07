const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db");

class Especialidad extends Model {}

Especialidad.init(
  {
    id_especialidad: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    tipo_profesional: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1, // 1 = médico, 2 = enfermero, 3 = ambos
      comment: "1: médico, 2: enfermero, 3: ambos",
    },
  },
  {
    sequelize,
    modelName: "Especialidad",
    tableName: "especialidades",
    timestamps: true,
  }
);

module.exports = Especialidad;
