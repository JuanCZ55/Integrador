const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db");

class Horario extends Model {}

Horario.init(
  {
    id_horarios: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    id_medico: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dia: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    hora_inicio: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    hora_fin: {
      type: DataTypes.TIME,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Horario",
    tableName: "horarios",
    timestamps: true,
  }
);

module.exports = Horario;
