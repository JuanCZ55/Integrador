const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db");

class Turno extends Model {}

Turno.init(
  {
    id_turnos: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    id_paciente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "pacientes",
        key: "id_paciente",
      },
    },
    id_medico: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "medicos",
        key: "id_medico",
      },
    },
    id_horario_turno: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "horario_turno",
        key: "id",
      },
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    estado: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "1-pendiente 2-finalizado 3-cancelado",
    },
  },
  {
    sequelize,
    modelName: "Turno",
    tableName: "turnos",
    timestamps: true,
  }
);

module.exports = Turno;
