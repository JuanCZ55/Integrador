const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db');

class Sector extends Model { }

Sector.init(
  {
    id_sector: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Sector',
    tableName: 'sectores',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_sector" },
        ]
      },
    ]
  }
);

module.exports = Sector;
