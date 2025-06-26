// models/Rol.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../db");

class Rol extends Model {}

Rol.init(
  {
    id_rol: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },

  {
    sequelize,
    modelName: "Rol",
    tableName: "roles",
    timestamps: false,
  }
);

module.exports = Rol;
