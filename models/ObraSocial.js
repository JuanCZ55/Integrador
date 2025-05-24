const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db');

class ObraSocial extends Model { }

ObraSocial.init(
  {
    id_obra_social: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    cuit: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    estado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "1:activo\r\n2:inactivo"
    }
  },
  {
    sequelize,
    modelName: 'ObraSocial',
    tableName: 'obra_sociales',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_obra_social" },
        ]
      },
    ]
  }
);

module.exports = ObraSocial;
