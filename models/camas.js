const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('camas', {
    id_cama: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_habitacion: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'habitaciones',
        key: 'id_habitacion'
      }
    },
    n_cama: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "A-Cama 1\r\nB-Cama 2"
    },
    estado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "1-disponible\r\n2-ocupada\r\n3-matenimiento\/limpieza"
    }
  }, {
    sequelize,
    tableName: 'camas',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_cama" },
        ]
      },
      {
        name: "id_habitacion",
        using: "BTREE",
        fields: [
          { name: "id_habitacion" },
        ]
      },
    ]
  });
};
