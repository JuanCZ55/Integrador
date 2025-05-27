const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db");

class MedicoEspecialidad extends Model {}

MedicoEspecialidad.init(
  {
    id_medico_especialidad: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    id_medico: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "medicos",
        key: "id_medico",
      },
    },
    id_especialidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "especialidades",
        key: "id_especialidad",
      },
    },
  },
  {
    sequelize,
    modelName: "MedicoEspecialidad",
    tableName: "medico_especialidad",
    timestamps: true,
  }
);

module.exports = MedicoEspecialidad;
