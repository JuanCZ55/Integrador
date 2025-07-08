const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db");

class MedicacionActual extends Model {}

MedicacionActual.init(
  {
    id_medicacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_historial: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    dosis: {
      type: DataTypes.STRING(100),
    },
    frecuencia: {
      type: DataTypes.STRING(100),
    },
    observaciones: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: "MedicacionActual",
    tableName: "medicacion_actual",
    timestamps: false,
  }
);

module.exports = MedicacionActual;
