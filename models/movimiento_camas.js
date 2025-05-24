const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('movimiento_camas', {
    id_movimiento_camas: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_admision: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'admisiones',
        key: 'id_admision'
      }
    },
    id_cama: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'camas',
        key: 'id_cama'
      }
    },
    estado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "1: activa\r\n2: finalizada"
    }
  }, {
    sequelize,
    tableName: 'movimiento_camas',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_movimiento_camas" },
        ]
      },
      {
        name: "id_admision",
        using: "BTREE",
        fields: [
          { name: "id_admision" },
        ]
      },
      {
        name: "id_cama",
        using: "BTREE",
        fields: [
          { name: "id_cama" },
        ]
      },
    ]
  });
};
