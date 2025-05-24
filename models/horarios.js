const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('horarios', {
    id_horarios: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_medico: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'medicos',
        key: 'id_medico'
      }
    },
    dia: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    hora_inicio: {
      type: DataTypes.TIME,
      allowNull: false
    },
    hora_fin: {
      type: DataTypes.TIME,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'horarios',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_horarios" },
        ]
      },
      {
        name: "id_medico",
        using: "BTREE",
        fields: [
          { name: "id_medico" },
        ]
      },
    ]
  });
};
