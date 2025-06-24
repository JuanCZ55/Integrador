const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db");

class Motivos extends Model {}

Motivos.init(
  {
    id_motivo: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "Motivos",
    tableName: "motivos",
    timestamps: true,
  }
);

module.exports = Motivos;
