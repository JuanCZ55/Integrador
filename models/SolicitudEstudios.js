const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db");

class SolicitudEstudios extends Model {}

SolicitudEstudios.init(
  {
    id_solicitud: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_admision: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_medico: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    estudio: {
      type: DataTypes.TEXT,
    },
    justificacion: {
      type: DataTypes.TEXT,
    },
    estado: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "SolicitudEstudios",
    tableName: "solicitud_estudios",
    timestamps: true,
    paranoid: true,
  }
);

module.exports = SolicitudEstudios;
