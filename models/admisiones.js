const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('admisiones', {
    id_admision: {
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
    id_motivo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'motivos',
        key: 'id_motivo'
      }
    },
    derivado: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    fecha_ingreso: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    fecha_egreso: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    estado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: "1:activa\r\n2:cancelada\r\n3:finalizada"
    }
  }, {
    sequelize,
    tableName: 'admisiones',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_admision" },
        ]
      },
      {
        name: "id_paciente",
        using: "BTREE",
        fields: [
          { name: "id_paciente" },
        ]
      },
      {
        name: "id_motivo",
        using: "BTREE",
        fields: [
          { name: "id_motivo" },
        ]
      },
    ]
  });
};
