const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db");

class AdministracionMedicamentos extends Model {}

AdministracionMedicamentos.init(
  {
    id_administracion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_prescripcion: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_enfermero: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fecha_hora: {
      type: DataTypes.DATE,
    },
    estado: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "AdministracionMedicamentos",
    tableName: "administracion_medicamentos",
    timestamps: false,
  }
);

module.exports = AdministracionMedicamentos;
