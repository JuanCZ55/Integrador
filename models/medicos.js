const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('medicos', {
    id_medico: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_persona: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'personas',
        key: 'id_persona'
      },
      unique: "medicos_ibfk_1"
    },
    nro_licencia: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    estado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "1:activo\r\n2:suspendido\r\n3:no activo\r\n"
    }
  }, {
    sequelize,
    tableName: 'medicos',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_medico" },
        ]
      },
      {
        name: "id_persona",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_persona" },
        ]
      },
    ]
  });
};
