const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('habitaciones', {
    id_habitacion: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_sector: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'sectores',
        key: 'id_sector'
      }
    },
    numero: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    capacidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "cantidad max de camas\r\n"
    }
  }, {
    sequelize,
    tableName: 'habitaciones',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_habitacion" },
        ]
      },
      {
        name: "id_sector",
        using: "BTREE",
        fields: [
          { name: "id_sector" },
        ]
      },
    ]
  });
};
