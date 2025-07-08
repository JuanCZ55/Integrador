const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db");

class AntecedenteFamiliar extends Model {}

AntecedenteFamiliar.init(
  {
    id_antecedente: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_historial: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    familiar: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    enfermedad: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    observaciones: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: "AntecedenteFamiliar",
    tableName: "antecedente_familiar",
    timestamps: false,
  }
);

module.exports = AntecedenteFamiliar;
