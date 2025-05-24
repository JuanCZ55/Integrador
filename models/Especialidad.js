const { Model, DataTypes } = require('sequelize');
const sequelize = require('./db');

class Especialidad extends Model { }

Especialidad.init(
  {
    id_especialidad: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'Especialidad',
    tableName: 'especialidades',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_especialidad" },
        ]
      },
    ]
  }
);

module.exports = Especialidad;
