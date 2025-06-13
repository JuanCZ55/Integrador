const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db");

class HorarioTurno extends Model {}

HorarioTurno.init(
  {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    hora: {
      type: DataTypes.TIME,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "HorarioTurno",
    tableName: "horario_turno",
    timestamps: false,
  }
);

module.exports = HorarioTurno;
