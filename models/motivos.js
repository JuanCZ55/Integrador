const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db');

class Motivos extends Model { }

Motivos.init(
  {
    id_motivo: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    }
  },
  {
    sequelize,
    modelName: 'Motivos',
    tableName: 'motivos',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_motivo" },
        ]
      },
    ]
  }
);

module.exports = Motivos;
