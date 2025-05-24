const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('medico_especialidad', {
    id_medico_especialidad: {
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
    id_especialidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'especialidades',
        key: 'id_especialidad'
      }
    }
  }, {
    sequelize,
    tableName: 'medico_especialidad',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_medico_especialidad" },
        ]
      },
      {
        name: "id_medico",
        using: "BTREE",
        fields: [
          { name: "id_medico" },
        ]
      },
      {
        name: "id_especialidad",
        using: "BTREE",
        fields: [
          { name: "id_especialidad" },
        ]
      },
    ]
  });
};
