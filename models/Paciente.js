const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db");

class Paciente extends Model {}

Paciente.init(
  {
    id_paciente: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    id_persona: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "personas",
        key: "id_persona",
      },
      unique: "pacientes_ibfk_2",
    },
    contacto: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    direccion: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    id_obra_social: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "obra_sociales",
        key: "id_obra_social",
      },
    },
    cod_os: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: "cod_os",
    },
    detalle: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    estado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "1:activo\r\n2:no activo",
    },
  },
  {
    sequelize,
    modelName: "Paciente",
    tableName: "pacientes",
    timestamps: true,
  }
);

module.exports = Paciente;
