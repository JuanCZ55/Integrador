const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db");

class Alergia extends Model {}

Alergia.init(
  {
    id_alergia: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_historial: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    gravedad: {
      type: DataTypes.STRING(50),
    },
    observaciones: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: "Alergia",
    tableName: "alergia",
    timestamps: false,
  }
);

module.exports = Alergia;
