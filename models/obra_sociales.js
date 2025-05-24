const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('obra_sociales', {
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
  }, {
    sequelize,
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
  });
};
