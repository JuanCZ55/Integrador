const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db");

class Medico extends Model {}

Medico.init(
  {
    id_medico: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    id_persona: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "personas",
        key: "id_persona",
      },
      unique: "medicos_ibfk_1",
    },
    nro_licencia: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    estado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "1:activo\r\n2:suspendido\r\n3:no activo\r\n",
    },
  },
  {
    sequelize,
    modelName: "Medico",
    tableName: "medicos",
    timestamps: true,
  }
);

module.exports = Medico;
