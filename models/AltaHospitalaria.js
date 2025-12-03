const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db");

class AltaHospitalaria extends Model {}

AltaHospitalaria.init(
  {
    id_alta: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_admision: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    id_medico: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    motivo_alta: {
      type: DataTypes.STRING,
    },
    instrucciones: {
      type: DataTypes.TEXT,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    medicacion: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "AltaHospitalaria",
    tableName: "alta_hospitalaria",
    timestamps: true,
    paranoid: true,
  }
);

module.exports = AltaHospitalaria;
