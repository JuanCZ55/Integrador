const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('personas', {
    id_persona: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    dni: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: "dni"
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    apellido: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    f_nacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    genero: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "f=femenino\r\nm=masculino\r\n0_otro\r\n"
    },
    telefono: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    mail: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'personas',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_persona" },
        ]
      },
      {
        name: "dni",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "dni" },
        ]
      },
    ]
  });
};
