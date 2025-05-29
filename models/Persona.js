const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db");

class Persona extends Model {}

Persona.init(
  {
    id_persona: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    dni: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: "dni",
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    apellido: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    f_nacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    genero: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "f=femenino\r\nm=masculino\r\n0_otro\r\n",
    },
    telefono: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    mail: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Persona",
    tableName: "personas",
    timestamps: true,
  }
);

module.exports = Persona;
