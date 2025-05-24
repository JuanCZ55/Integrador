const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('turnos', {
    id_turnos: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_paciente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'pacientes',
        key: 'id_paciente'
      }
    },
    id_medico: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'medicos',
        key: 'id_medico'
      }
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    hora: {
      type: DataTypes.TIME,
      allowNull: true
    },
    estado: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "1-pendiente\r\n2-finalizado\r\n3-cancelado"
    }
  }, {
    sequelize,
    tableName: 'turnos',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_turnos" },
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
        name: "id_paciente",
        using: "BTREE",
        fields: [
          { name: "id_paciente" },
        ]
      },
    ]
  });
};
