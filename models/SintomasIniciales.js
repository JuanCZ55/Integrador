const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db");

class SintomasIniciales extends Model {}

SintomasIniciales.init(
  {
    id_sintoma: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_historial: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    severidad: {
      type: DataTypes.STRING(50),
    },
  },
  {
    sequelize,
    modelName: "SintomasIniciales",
    tableName: "sintomas_iniciales",
    timestamps: false,
  }
);

module.exports = SintomasIniciales;
