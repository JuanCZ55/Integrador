const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db");

class Habitacion extends Model {}

Habitacion.init(
  {
    id_habitacion: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    id_sector: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "sectores",
        key: "id_sector",
      },
    },
    numero: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    capacidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "cantidad max de camas\r\n",
    },
    genero: {
      type: DataTypes.STRING(150),
      allowNull: true,
      comment: "Masculino\r\nFemenino\r\nOtro",
    },
  },
  {
    sequelize,
    modelName: "Habitacion",
    tableName: "habitaciones",
    timestamps: true,
  }
);

module.exports = Habitacion;
