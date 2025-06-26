// models/Usuario.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../db");
const Persona = require("./Persona");
const Rol = require("./Rol");
const bcrypt = require("bcrypt");

class Usuario extends Model {
  async validarPassword(password) {
    return await bcrypt.compare(password, this.password);
  }

  esAdmin() {
    return this.id_rol === 1; // Asumiendo que el rol de administrador tiene id_rol = 1
  }
}

Usuario.init(
  {
    id_usuario: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    id_persona: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Persona,
        key: "id_persona",
      },
    },
    usuario: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    id_rol: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Rol,
        key: "id_rol",
      },
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Usuario",
    tableName: "usuarios",
    timestamps: true,
  }
);

module.exports = Usuario;
